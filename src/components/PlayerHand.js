import React from "react";
import {isQuestioner, getCurrentQuestion, getAnswerOptions} from "../logic/gamelogic"
import {getUserName} from "../logic/userlogic"

const QuestionCard = props => {
    return (
        <div>{this.props.question}</div>
    );
}

const QuestionerHand = props => {
    let gameState = props.gameState;
    let userState = props.userState;

    let currentQuestion = getCurrentQuestion(gameState);

    return (
        <>
        <div>Questioner</div>
        <QuestionCard question={currentQuestion} />
        </>
    );
}

const AnswerCard = props => {
    return (
        <div>{this.props.answer}</div>
    );
}

const AnswererHand = props => {
    let gameState = props.gameState;
    let userState = props.userState;

    let cards = getAnswerOptions(gameState, userState).map( (answer, index) => {
        return (
            <div>Card {answer}</div>
        );
    });

    return (
        <>
        <div>Answerer</div>
        {cards}
        </>
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
