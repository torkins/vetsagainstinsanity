import React from "react";
import {turnIsActive, getRequiredAnswerCount, isQuestioner, allUsersReady, getCurrentQuestion, getAllUserAnswers, getAnswerCards, getAnswerCardFromId, answerCardMatches, getSelectedAnswerIdsForUser} from "../logic/gamelogic"
import {getUserName} from "../logic/userlogic"

const QuestionCard = props => {
    return (
        <div>{props.question.text}</div>
    );
}

let createAnswerersDisplay = (gameState, allUserAnswers, onChooseWinner) => {
    for (const entry of allUserAnswers.entries()) {
        let [username, selectedIds] = entry;
        console.info(username + " selected " + selectedIds);
    }

    let disabled = !allUsersReady(gameState);

    return Array.from(allUserAnswers.entries(), entry => {
        let [username, selectedIds] = entry;
        const onClick = () => onChooseWinner(username);
        const selectedCards = selectedIds.map((selectedId,idx) => {
            let card = getAnswerCardFromId(gameState, selectedId);
            let isLast = idx === selectedIds.length - 1;

            if (isLast) {
                return (
                    <span class="playerAnswer">{card.text}</span>
                );
            } else {
                return (
                    <>
                    <span class="playerAnswer">{card.text}</span><span>,</span>
                    </>
                );
            }
        })
        return (
            <>
            <button class="chooseAnswerer button-primary disabled={disabled}" onClick={onClick}>{username}:</button>
            {selectedCards}
            </>
        );
    })

};

const QuestionerHand = props => {
    console.info("QuestionerHand render");
    let gameState = props.gameState;
    let userState = props.userState;

    let currentQuestion = getCurrentQuestion(gameState);
    console.debug(currentQuestion);

    let userAnswers = createAnswerersDisplay(gameState, getAllUserAnswers(gameState), props.onChooseWinner);
    

    return (
        <>
        <div>You're the Questioner, here's the question:</div>
        <QuestionCard question={currentQuestion} />
        <div>User Answers</div>
        {userAnswers}
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
        let isConfirmedAnswer = (card) => card.id in getSelectedAnswerIdsForUser(gameState, userState);
        let requiredAnswers = turnIsActive(gameState) ? getRequiredAnswerCount(gameState) : 0;
        let onChooseAnswer = () => {
            props.onChooseAnswer(userState, this.state.unconfirmedAnswerIds);
            this.removeUnconfirmedAnswer();
        };
        let sufficientAnswers = this.state.unconfirmedAnswerIds.length >= requiredAnswers;

        let unselectedCards = getAnswerCards(gameState, userState).map( (card, index) => {
            let onClick, buttonClass;
            if (isUnconfirmedAnswer(card)) {
                return ( <></> );
            } else {
                if (sufficientAnswers) { 
                    onClick = () => {};
                    buttonClass = "answerCard button-primary four columns";
                    disabled = true;
                } else {
                    onClick = () => this.addUnconfirmedAnswer(card.id);
                    buttonClass = "answerCard button-primary four columns";
                    disabled = false;
                }

                return (
                    <button className={buttonClass} onClick={onClick} disabled={disabled}>{card.text}</button>
                );
            }
        });

        let confirmArea = turnIsActive(gameState) ?
            (this.state.unconfirmedAnswerIds.length < requiredAnswers ? (
                <div>Please choose {requiredAnswers - this.state.unconfirmedAnswerIds.length} answers</div>
                ) : (
                    <button className="button-primary choiceConfirm" onClick={onChooseAnswer}>Confirm Answer</button>
                )
            ) : undefined;

        let selectedAnswers = this.state.unconfirmedAnswerIds.map(id => {
            let card = getAnswerCardFromId(gameState, id);
            let unSelectAnswer = () => this.removeUnconfirmedAnswer(id); 
            return (
                <button className="button-primary" onClick={unSelectAnswer}>{card.text}</button>
            );
        });

        return (
            <>
            {confirmArea}
            <div>Available Cards</div>
            {unselectedCards}
            </>
        );
    }
}

const PlayerHand = props => {
    console.info("PlayerHand render");
    let gameState = props.gameState;
    let userState = props.userState;

    if (isQuestioner(gameState, userState)) {
        return ( <QuestionerHand gameState={gameState} userState={userState} onChooseWinner={props.onChooseWinner}/> )
    } else {
        return ( <AnswererHand gameState={gameState} userState={userState} onChooseAnswer={props.onChooseAnswer}/> )
    }
};

export default PlayerHand;
