import {getUserName} from "./userlogic"

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

export function getAnswerOptions(gameState, userState) {
    let playerState = getPlayerState(gameState, userState);
    return playerState.hand;
}

export function getPlayerNames(gameState) {
    return (gameState.players || []).map(player => {
        return player.userId;
    });
}
