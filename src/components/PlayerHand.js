import React from "react";
import {isQuestioner} from "../logic/gamelogic"
import {getUserName} from "../logic/userlogic"

const QuestionerHand = props => {
    let gameState = props.gameState;
    let userState = props.userState;

    return (
        <div>Questioner</div>
    );
}

const AnswererHand = props => {
    let gameState = props.gameState;
    let userState = props.userState;

    return (
        <div>Answerer</div>
    );
}

const PlayerHand = props => {
    let gameState = props.gameState;
    let userState = props.userState;

    if (isQuestioner(gameState, userState)) {
        return ( <QuestionerHand gameState={gameState} userState={userState} /> )
    } else {
        return ( <AnswererHand gameState={gameState} userState={userState} /> )
    }
};

export default PlayerHand;
