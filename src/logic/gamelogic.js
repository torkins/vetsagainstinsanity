import {getUserName} from "./userlogic"
import { v4 as uuidv4 } from 'uuid';

export function isQuestioner(gameState, userState) {
    let playerName = getUserName(userState);
    console.debug("isQuestioner(gameState, ${playerName}");
    return getCurrentQuestioner(gameState) == playerName;
}

export function getPlayerState(gameState, userState) {
    let playerName = getUserName(userState);
    return gameState.players.filter( playerObj => playerObj.userId == playerName )[0];
}

export function getAnswerCards(gameState, userState) {
    console.info("getAnswerCards");
    console.info("playerName: " + getUserName(userState));
    console.debug(gameState);
    console.debug(userState);
    let playerState = getPlayerState(gameState, userState);
    console.info("playerState: " + JSON.stringify(playerState));
    return playerState.cardIds.map( cardId => getCard(cardId, gameState) );
}

export function getSelectedAnswer(gameState, userState) {
    let playerState = getPlayerState(gameState, userState);
    return playerState.selectedAnswer == null ? null : getCardFromDeck(playerState.selectedAnswer, gameState);
}

function cardMatches(card1, card2) {
    return card1 != null && card2 != null && card1.id == card2.id && card1.text == card2.text;
}

export function answerCardMatches(card1, card2) {
    return cardMatches(card1, card2);
}

export function getPlayerNames(gameState) {
    return (gameState.players || []).map(getPlayerName);
}

class Card {
    constructor(id, text) {
        this.id = id;
        this.text = text;
    }
}

function getCardFromDeck(cardId, deck) {
    let matches = deck.cards.filter( c => c.id == cardId );
    return matches.length == 0 ? null : matches[0];
}

function getCard(cardId, gameState) {
    let answerCard = getCardFromDeck(cardId, gameState.answerDeck);
    return answerCard == null ? getCardFromDeck(cardId, gameState.questionDeck) : answerCard;
}

class Deck {
    constructor(name, cards, autorecycle = true) {
        this.name = name;
        //clean copy
        this.cards = cards.map(card => new Card(card.id, card.text));
        this.undealt = cards.map(card => new Card(card.id, card.text));
        this.discard = [];
        this.autorecycle = autorecycle;
        shuffle(this);
    }
}

let recycle = (deck) => {
        deck.undealt = deck.undealt.concat(deck.discard);
    },
    shuffle = (deck) => {
        //Fisher-Yates
        let undealt = deck.undealt;
        for (let i = undealt.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [undealt[i], undealt[j]] = [undealt[j], undealt[i]];
        }
    },
    deal = (deck, num) => {
        console.info(`deal ${num} from deck`);
        console.debug(deck);
        var dealtCards = [];
        for (let i = 0; i < num; i++) {
            if (deck.undealt.length == 0) {
                if (deck.autorecycle) {
                    recycle(deck);
                } else {
                    throw "Ran out of cards!";
                }
            }
            dealtCards.push(deck.undealt.pop());
        }
        return dealtCards;
    },
    getCardById = (deck, id) => {
        return deck.cards.find(c => c.id === id);
    },
    discard = (deck, cards) => {
        deck.discard = deck.discard.concat(cards);
    },
    discardById = (deck, cardIds) => {
        let cards = cardIds.map(id => getCardById(id));
        deck.discard = deck.discard.concat(cards);
    };

export class GameState {
    constructor(name, creatorId, answerDeck, questionDeck) {
        this.ref = null;
        this.gameId = uuidv4();
        this.gameName = name;
        this.gameType = answerDeck.gameType;
        this.players = [new PlayerState(creatorId)];
        this.started = null;
        this.hasStarted = false;
        this.answerDeck = answerDeck;
        this.currentQuestion = this.currentQuestioner = null;
        this.questionDeck = questionDeck;
    }
}

let forEachGamePlayer = (gameState, fn) => {
        gameState.players.forEach(fn);
    },
    hasStarted = (gameState) => {
        return gameState.started != null;
    },
    discardQuestionCard = (gameState) => {
        gameState.questionDeck.discard([getCurrentQuestion(gameState)]);
        setCurrentQuestion(gameState, null);
    },
    discardAnswerCards = (gameState) => {
        forEachGamePlayer(gameState, playerState => {
            let chosenAnswerCardIds = discardChosenAnswerIds(playerState);
            gameState.answerDeck.discardById(chosenAnswerCardIds);
        });
    },
    dealAnswerCards = (gameState) => {
        //loop through players, deal however many needed to get to ten
        forEachGamePlayer(gameState, playerState => {
            console.info("Dealing answer cards to: " + getPlayerName(playerState));
            let cardCount = playerState.cardIds.length;
            let needed = 10 - cardCount;
            console.info("needed: " + needed);
            if (needed > 0) {
                addCards(playerState, deal(gameState.answerDeck, needed));
            }
        });
    },
    dealQuestionCard = (gameState) => {
        setCurrentQuestion(gameState, deal(gameState.questionDeck, 1)[0]);
    },
    chooseNewQuestioner = (gameState) => {
        let qIdx = Math.floor(Math.random()*Math.floor(gameState.players.length))
        setCurrentQuestioner(gameState, gameState.players[qIdx]);
    },
    setCurrentQuestioner = (gameState, playerState) => {
        console.info("setCurrentQuestion to " + playerState.userId);
        gameState.currentQuestioner = playerState.userId;
    },
    getCurrentQuestioner = (gameState) => {
        return gameState.currentQuestioner;
    },
    setCurrentQuestion = (gameState, card) => {
        gameState.currentQuestion = card;
    },
    isPlayer = (gameState, userId) => {
        let match = gameState.players.filter( p => p.userId == userId);
        return match.length == 0 ? false : true;
    };

export function isPlaying(gameState, userId) {
    return gameState.players.filter(p => p.userId == userId).length > 0;
}

export function joinGame(gameState, userId) {
    if (isPlaying(gameState, userId)) {
        throw `${userId} already playing!`
    } else {
        gameState.players = gameState.players.concat(new PlayerState(userId));
    }
    return gameState;
}

export function getCurrentQuestion(gameState) {
    return gameState.currentQuestion;
}

export function startGame(gameState) {
    if (hasStarted(gameState)) {
        throw `Already started at ${gameState.started}!!` 
    }

    if (gameState.players.length == 1) {
        throw "Need more than 1 player to start a game";
    }

    gameState.started = new Date();
    gameState.hasStarted = true;
    startNewTurn(gameState);
    console.info("starting game!");
    return gameState;
};

export function startNewTurn(gameState) {
    chooseNewQuestioner(gameState);
    dealQuestionCard(gameState);
    dealAnswerCards(gameState);
    return gameState;
};

export function endTurn(gameState) {
    discardQuestionCard(gameState);
    discardAnswerCards(gameState);
    return gameState;
};

export function removeUserFromGame(gameState, userId) {
    console.info(`removing ${userId} from game with ${gameState.players.length} players`);
    gameState.players = gameState.players.filter(p => p.userId != userId);
    console.info(`now has ${gameState.players.length} players`);
    return gameState;
}

export class PlayerState {
    constructor(userId) {
        this.userId = userId;
        this.cardIds = [];
        this.selectedAnswers = [];
        this.points = 0;
    }
}

export function getPlayerName(playerState) { return playerState.userId; }

let selectCards = (playerState, cardIds) => {
        playerState.selectedAnswers = cardIds;
    },
    addPoint = (playerState) => {
        playerState.points += 1;
    },
    discardChosenAnswerIds = (playerState) => {
        let ids = playerState.selectedAnswers;
        playerState.selectedAnswers = [];
        playerState.cardIds = playerState.cardIds.filter(id => id in ids);
        return ids;
    },
    addCards = (playerState, cards) => {
        console.info("adding cards to " + getPlayerName(playerState));
        playerState.cardIds = playerState.cardIds.concat(cards.map(c => c.id));
        console.info("card id len: " + playerState.cardIds.length);
    };


function jsonToDeck(json) {
    let cards = json.cards.map( (txt, idx) => new Card(idx, txt) );
    return new Deck(json.deckType, cards, true);
}
function jsonToAnswerDeck(json) {
    return jsonToDeck(json);
}
function jsonToQuestionDeck(json) {
    return jsonToDeck(json);
}

function fetchAnswerDeck(gameType) {
    console.info("fetchAnswerDeck");
    return fetch(`https://fervent-ardinghelli-aa4089.netlify.app/.netlify/functions/get_answer_deck?gameType=${gameType}`)
        .then(res => res.json())
        .then(res => jsonToAnswerDeck(res.data));
}

function fetchQuestionDeck(gameType) {
    console.info("fetchQuestionDeck");
    return fetch(`https://fervent-ardinghelli-aa4089.netlify.app/.netlify/functions/get_question_deck?gameType=${gameType}`)
        .then(res => res.json())
        .then(res => jsonToQuestionDeck(res.data));
}

function insertNewGame(gameState) {
    console.info("insertNewGame");
    return fetch(`https://fervent-ardinghelli-aa4089.netlify.app/.netlify/functions/create_game`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameState)
    })
    .then(res => res.json())
    .then(res => gameResponseToGameState(res)); 
}

export function fetchGameState(gameId) {
    return fetch(`https://fervent-ardinghelli-aa4089.netlify.app/.netlify/functions/get_game_by_id?id=${gameId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },

    })
    .then(res => res.json())
    .then(res => gameResponseToGameState(res)); 
}

let gameResponseToGameState = (response) => {
    console.debug(response);
    if (response.errorMessage) { console.trace(); throw response.errorMessage; }
    let state = response.data;
    state.ref = response.ref["@ref"].id;
    console.debug(state);
    return state;
}

export function createNewGame(gameName, creatorId, gameType) {
    console.info("createNewGame");
    return Promise.all([
        fetchAnswerDeck(gameType),
        fetchQuestionDeck(gameType)
    ]).then(decks => {
        const answerDeck = decks[0],
              questionDeck = decks[1],
              newGame = new GameState(gameName, creatorId, answerDeck, questionDeck);
        return insertNewGame(newGame);
    },
     zz =>  {
         console.info("uhhh: " + zz);
     });
}

export function updateGameState(gameState) {
    console.info("updateGameState");
    console.debug(gameState);
    return fetch(`https://fervent-ardinghelli-aa4089.netlify.app/.netlify/functions/update_game`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameState)
    })
    .then(res => res.json())
    .then(res => gameResponseToGameState(res));
}

export function fetchPendingGames() {
  return fetch("https://fervent-ardinghelli-aa4089.netlify.app/.netlify/functions/get_pending_games")
    .then(res => res.json()) 
    .then(
        (result) => {
            console.info("pending games");
            console.debug(result);
            return result;
        },
        (error) => {
            console.info("ERROR");
            console.debug(error);
            if (JSON.stringify(error).indexOf("NotFound") == -1) {
                console.error("OH SHIT: " + error);
                throw error;
            } else {
                console.info("pending games not found");
                return [];
            }
        }
    );
}

export function fetchMyUnfinishedGames(userId) {
  return fetch("https://fervent-ardinghelli-aa4089.netlify.app/.netlify/functions/get_started_games")
    .then(res => res.json()) 
    .then(
        (result) => {
            console.info("my games");
            console.debug(result);
            return result;
        },
        (error) => {
            console.info("ERROR");
            console.debug(error);
            if (JSON.stringify(error).indexOf("NotFound") == -1) {
                console.error("OH SHIT: " + error);
                throw error;
            } else {
                console.info("pending games not found");
                return [];
            }
        }
    );
}

