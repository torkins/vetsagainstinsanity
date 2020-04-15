import {getUserName} from "./userlogic"

export function isQuestioner(gameState, userState) {
    let playerName = getUserName(userState);
    console.debug("isQuestioner(gameState, ${playerName}");
    return getCurrentQuestioner(gameState) == playerName;
}

export function getCurrentQuestion(gameState) {
    return gameState.currentQuestioner;
}
