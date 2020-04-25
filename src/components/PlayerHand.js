import React from "react";
import {turnIsActive, getRequiredAnswerCount, isQuestioner, allUsersReady, getCurrentQuestion, getAllUserAnswers, getAnswerCards, getAnswerCardFromId, answerCardMatches, getSelectedAnswerIdsForUser} from "../logic/gamelogic"
import {getUserName} from "../logic/userlogic"

const QuestionCard = props => {
    return (
        <div className="questionCard twelve columns"><h3 className="questionCard">{!!props.question ? props.question.text : "No Question yet"}</h3></div>
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
            let cardText = card.text;
            console.info("cardText: " + cardText);

            if (isLast) {
                return (
                    <>{cardText}</>
                );
            } else {
                return (
                    <>{cardText},</>
                );
            }
        })

        return (!!selectedCards.length) ?
            (
                <>
                <button class="chooseAnswerer twelve columns button-primary disabled={disabled}" onClick={onClick}>{selectedCards}</button>
                </>
            ) 
            :
            ( <> <div class="waitingForAnswers twelve columns">Waiting for answers...</div>  </> );
    })

};

const QuestionerHand = props => {
    console.info("QuestionerHand render");
    let gameState = props.gameState;
    let userState = props.userState;

    let userAnswers = createAnswerersDisplay(gameState, getAllUserAnswers(gameState), props.onChooseWinner);
    

    return (
        g>
        <h3>You're the Questioner!</h3>
        <h3>Submitted Answers</h3>
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
        let isUnconfirmedAnswer = card => (this.state.unconfirmedAnswerIds || []).includes(card.id);
        let isConfirmedAnswer = card => getSelectedAnswerIdsForUser(gameState, userState).includes(card.id);
        let requiredAnswers = turnIsActive(gameState) ? getRequiredAnswerCount(gameState) : 0;
        let onChooseAnswer = () => {
            props.onChooseAnswer(userState, this.state.unconfirmedAnswerIds);
            this.removeUnconfirmedAnswer();
        };
        let confirmedAnswers = getSelectedAnswerIdsForUser(gameState, userState) || [];
        let sufficientAnswers = this.state.unconfirmedAnswerIds.length >= requiredAnswers || confirmedAnswers.length > 0; 

        let unselectedCards = getAnswerCards(gameState, userState).map( (card, index) => {
            let onClick, buttonClass, disabled;
            if (isUnconfirmedAnswer(card)) {
                return ( <></> );
            } else {
                if (sufficientAnswers) { 
                    onClick = () => {};
                    buttonClass = "answerCard button-primary twelve columns";
                    disabled = true;
                } else {
                    onClick = () => this.addUnconfirmedAnswer(card.id);
                    buttonClass = "answerCard button-primary twelve columns";
                    disabled = false;
                }

                return (
                    <button className={buttonClass} onClick={onClick} disabled={disabled}>{card.text}</button>
                );
            }
        });

        console.info("turnIsActive: " + turnIsActive(gameState));

        let confirmArea;
        if (turnIsActive(gameState)) {
            if (!confirmedAnswers.length) {
                confirmArea = (!sufficientAnswers) ? ( 
                    <div className="please choose twelve columns">Please choose {requiredAnswers - this.state.unconfirmedAnswerIds.length} answers</div>
                ) : (
                    <button className="button-primary choiceConfirm twelve columns" onClick={onChooseAnswer}>Confirm Answer</button>
                );
            } else {
                confirmArea = (<div className="twelve columns answerSubmitted">Answer Submitted!</div>);
            }
        } else {
            confirmArea = undefined;
        }

        let selectedCards = this.state.unconfirmedAnswerIds.map(id => {
            let card = getAnswerCardFromId(gameState, id);
            let unSelectAnswer = () => this.removeUnconfirmedAnswer(id); 
            return (
                <button className="button-primary twelve columns" onClick={unSelectAnswer}>{card.text}</button>
            );
        });

        let selectedAnswers = this.state.unconfirmedAnswerIds.length > 0 ? (
            <div className="twelve columns">
                <div className="twelve columns">Selected Answers</div>
                {selectedCards}
            </div>
        ) : (<></>);

        return (
            <>
            {confirmArea}
            {selectedAnswers}
            <div className="twelve columns">Available Cards</div>
            <div className="possibleAnswers twelve columns">{unselectedCards}</div>
            </>
        );
    }
}

const PlayerHand = props => {
    console.info("PlayerHand render");
    let gameState = props.gameState;
    let userState = props.userState;
    let currentQuestion = getCurrentQuestion(gameState);
    console.debug(currentQuestion);

    if (isQuestioner(gameState, userState)) {
        return ( 
            <>
            <QuestionCard question={currentQuestion} />
            <QuestionerHand gameState={gameState} userState={userState} onChooseWinner={props.onChooseWinner}/> 
            </>
        )
    } else {
        return ( 
            <>
            <QuestionCard question={currentQuestion} />
            <AnswererHand gameState={gameState} userState={userState} onChooseAnswer={props.onChooseAnswer}/> 
            </>
        )
    }
};

export default PlayerHand;
