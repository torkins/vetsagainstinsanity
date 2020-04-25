import React from "react";
import {isQuestioner, getCurrentQuestion, getAnswerCards, answerCardMatches, getSelectedAnswer} from "../logic/gamelogic"
import {getUserName} from "../logic/userlogic"

const QuestionCard = props => {
    return (
        <div>{props.question.text}</div>
    );
}

const QuestionerHand = props => {
    console.info("QuestionerHand render");
    let gameState = props.gameState;
    let userState = props.userState;

    let currentQuestion = getCurrentQuestion(gameState);
    console.debug(currentQuestion);

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
            unconfirmedAnswerIds: []
        };
    }

    addUnconfirmedAnswer(cardId) {
        this.setState({
            unconfirmedAnswerIds: this.state.unconfirmedAnswerIds.concat(cardId)
        });
    }

    removeUnconfirmedAnswer(cardId) {
        if (cardId == null) {
            this.setState({
                unconfirmedAnswerIds: []
            });
        } else {
            this.setState({
                unconfirmedAnswerIds: this.state.unconfirmedAnswerIds.filter(id => id != cardId)
            });
        }
    }

    render() {
        console.info("AnswererHand render");
        let props = this.props;
        let gameState = props.gameState;
        let userState = props.userState;
        let isUnconfirmedAnswer = (card) => answerCardMatches(this.state.unconfirmedAnswer, card);
        let isConfirmedAnswer = (card) => answerCardMatches(getSelectedAnswer(gameState, userState), card);
        let onChooseAnswer = () => {
            props.onChooseAnswer(userState, this.state.unconfirmedAnswerIds);
            this.removeUnconfirmedAnswer();
        }

        let cards = getAnswerCards(gameState, userState).map( (card, index) => {
            let onClick, buttonClass;
            if (isConfirmedAnswer(card)) {
                onClick = () => this.removeUnconfirmedAnswer(card.id);
                buttonClass = "answerCard button-primary";
            } else {
                onClick = () => this.addUnconfirmedAnswer(card.id);
                buttonClass = "answerCard button-primary";
            }
            buttonClass = buttonClass + " four columns";
            return (
                <button className={buttonClass} onClick={onClick} >{card.text}</button>
            );
        });


        let confirmBtn = !!this.state.unconfirmedAnswerIds.length ? undefined : (
            <button className="button-primary choiceConfirm" onClick={onChooseAnswer}>Confirm Answer</button>
        );

        return (
            <>
            <div>Answerer</div>
            {confirmBtn}
            {cards}
            </>
        );
    }
}

const PlayerHand = props => {
    console.info("PlayerHand render");
    let gameState = props.gameState;
    let userState = props.userState;

    if (isQuestioner(gameState, userState)) {
        return ( <QuestionerHand gameState={gameState} userState={userState} /> )
    } else {
        return ( <AnswererHand gameState={gameState} userState={userState} /> )
    }
};

export default PlayerHand;
