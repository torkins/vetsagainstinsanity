import React from "react";
import {isQuestioner, getCurrentQuestion, getAnswerCards} from "../logic/gamelogic"
import {getUserName} from "../logic/userlogic"

const QuestionCard = props => {
    return (
        <div>{props.question}</div>
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
        <div>{props.answer}</div>
    );
}

class AnswererHand extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            unconfirmedAnswer: null
        };
    }

    render() {
        let gameState = props.gameState;
        let userState = props.userState;
        let isUnconfirmedAnswer = (card) => answerCardMatches(this.state.unconfirmedAnswer, card);
        let isConfirmedAnswer = (card) => answerCardMatches(getSelectedAnswer(gameState, userState), card);

        let cards = getAnswerCards(gameState, userState).map( (card, index) => {
            let onClick = () => {
                this.setState({
                    unconfirmedAnswer: card
                });
            };
            let buttonClass = isConfirmedAnswer(card) ? "confirmedAnswerCard" : (isUnconfirmedAnswer(card) ? "unconfirmedAnswerCard" : "answerCard");
            return (
                <button className={buttonClass} onClick={onClick} >Card {answer}</button>
            );
        });

        return (
            <>
            <div>Answerer</div>
            {cards}
            </>
        );
    }
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
