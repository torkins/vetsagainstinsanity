import {getUserName} from "./userlogic"
import { v4 as uuidv4 } from 'uuid';

export function isQuestioner(gameState, userState) {
    let playerName = getUserName(userState);
    console.debug("isQuestioner(gameState, ${playerName}");
    return getCurrentQuestioner(gameState) == playerName;
}

export function getCurrentQuestioner(gameState) {
    return gameState.currentQuestioner;
}

export function getCurrentQuestion(gameState) {
    return gameState.currentQuestion;
}

export function getPlayerState(gameState, userState) {
    let playerName = getUserName(userState);
    return gameState.players.filter( playerObj => playerObj.userId == playerName )[0];
}

export function getAnswerCards(gameState, userState) {
    let playerState = getPlayerState(gameState, userState);
    return playerState.hand.map( cardId => getCard(cardId, gameState) );
}

export function getSelectedAnswer(gameState, userState) {
    let playerState = getPlayerState(gameState, userState);
    return playerState.selectedAnswer == null ? null : getCardFromDeck(playerState.selectedAnswer, gameState);
}

function cardMatches(card1, card2) {
    return card1.id == card2.id && card1.text == card2.text;
}

export function answerCardMatches(card1, card2) {
    return cardMatches(card1, card2);
}

export function getPlayerNames(gameState) {
    return (gameState.players || []).map(player => {
        return player.userId;
    });
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
        this.shuffle();
    }

    recycle() {
        this.undealt = this.undealt.concat(this.discard);
    }

    shuffle() {
        //Fisher-Yates
        let undealt = this.undealt;
        for (let i = undealt.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [undealt[i], undealt[j]] = [undealt[j], undealt[i]];
        }
    }

    deal(num) {
        var dealtCards = [];
        for (let i = 0; i < num; i++) {
            if (this.cards.length == 0 && this.autorecycle) {
                this.recycle();
            } else {
                throw "Ran out of cards!";
            }
            dealtCards.append(this.cards.pop());
        }
        return dealtCards;
    }

    discard(cards) {
        this.discard = this.discard.concat(cards);
    }
}

export class GameState {
    constructor(name, creatorId, answerDeck, questionDeck) {
        this.gameId = uuidv4();
        this.gameName = name;
        this.players = [new PlayerState(creatorId)];
        this.started = null;
        this.answerDeck = answerDeck;
        this.currentQuestion = this.currentQuestioner = null;
        this.questionDeck = questionDeck;
    }

    hasStarted() {
        return this.started != null;
    }

    start() {
        if (this.hasStarted()) {
            throw `Already started at ${this.started}!!` 
        }

        if (this.players.length == 1) {
            throw "Need more than 1 player to start a game";
        }

        this.started = new Date();
    }

    isPlayer(userId) {
        let match = this.players.filter( p => p.userId == userId);
        return match.length == 0 ? false : true;
    }

    addPlayer(userId) {
        if (this.isPlaying(userId)) {
            throw `${userId} already playing!`
        } else {
            this.players.add(new PlayerState(userId));
        }
    }
}

export class PlayerState {
    constructor(userId) {
        this.userId = userId;
        this.cardIds = [];
        this.selectedAnswer = null;
        this.points = 0;
    }

    receiveNewHand(cardIds) {
        this.selectedAnswer = null;
        this.cardIds = cardIds;
    }

    selectedCard(cardId) {
        this.selectedAnswer = cardId;
    }

    addPoint() {
        this.points += 1;
    }
}

function fetchAnswerDeck(gameType) {
    return fetch(`https://fervent-ardinghelli-aa4089.netlify.com/.netlify/functions/get_answer_deck?gameType=${gameType}`)
        .then(res => res.json());
}

function fetchQuestionDeck(gameType) {
    return fetch(`https://fervent-ardinghelli-aa4089.netlify.com/.netlify/functions/get_question_deck?gameType=${gameType}`)
        .then(res => res.json());
}

function insertNewGame(gameState) {
    return fetch(`https://fervent-ardinghelli-aa4089.netlify.com/.netlify/functions/create_game`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameState)
    })
    .then(res => res.json());
}

function fetchGameState(gameId) {
    return fetch(`https://fervent-ardinghelli-aa4089.netlify.com/.netlify/functions/get_game_by_id`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({gameId: gameId})
    })
    .then(res => res.json());
}

export function createNewGame(gameName, creatorId, gameType) {
    return Promise.all([
        fetchAnswerDeck("vetsagainstinsanity"),
        fetchQuestionDeck("vetsagainstinsanity")
    ]).then(decks => {
        const answerDeck = decks[0],
              questionDeck = decks[1],
              newGame = new GameState(name, userId, answerDeck, questionDeck);
        return insertGameState(newGame);
    });
}
