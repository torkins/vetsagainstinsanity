
import React from "react";
import PlayerList from "./PlayerList"
import PlayerHand from "./PlayerHand"
import {UserState} from "../logic/userlogic"
import {gameHasStarted, isAdmin, turnIsOver, isPlaying} from "../logic/gamelogic"
/*
  fetch("https://fervent-ardinghelli-aa4089.netlify.com/.netlify/functions/create_game")
    .then(res => res.json())
    .then(result => {
        console.log("     HEY : " + JSON.stringify(result));
    });
    */

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            userState: this.props.userState,
        };
    }

    render() {
        console.info("Game render");
        const { error, userState, isLoaded } = this.state; 
        const gameState = this.props.gameState;
        console.debug(gameState);
        /*
        let gameState = {
            gameId: "gecko",
            currentQuestioner: "vanessa"
        }
        */
        if (error) {
            return (<div>Shit dog, there was an error: {error.message}</div>);
        } else if (gameState == null) {
            return (<div>Loading...</div>);
        } else {
            let changeToUser = (username) => { 
                console.info(`changeToUser: ${username}`);
                this.setState({ userState: new UserState(username) });
            };
            let onJoinGame = () => {
                    this.props.onJoinGame(gameState.gameId, userState.username);
                },
                onLeaveGame = () => this.props.onLeaveGame(userState.username);
            let lastWinnerName = getCurrentWinner(gameState),
                youWon = getCurrentWinner(gameState) == userState.username;

            return (
                <div className="game">
                    { isPlaying(gameState, userState.username) ?
                        <>
                        {isAdmin(gameState, userState) ? <StartGame onStartGame={this.props.onStartGame}/> : <></>}
                        <LeaveGame onLeaveGame={onLeaveGame} />
                        {gameHasStarted(gameState) && turnIsOver(gameState) ? 
                            (isAdmin(gameState, userState) ? <NextTurn onNextTurn={onNextTurn}/> : <WaitingForNextTurn lastWinner={lastWinnerName} youWon={youWon}/>)
                            :
                            <></>
                        }
                        <PlayerHand gameState={gameState} userState={userState} onChooseAnswer={this.props.onChooseAnswer} onChooseWinner={this.props.onChooseWinner}/>
                        </>
                        :
                        <>
                        <JoinGame onJoinGame={onJoinGame} />
                        <BackToGameList onClick={onLeaveGame} />
                        </>
                    }
                    <PlayerList gameState={gameState} userState={userState} onPlayerClick={changeToUser}/>
                </div>
            );
        }
    }
}

const NextTurn = props => {
    return (
        <button className="button button-primary" onClick={props.onNextTurn}>Next Turn</button>
    );
}

const WaitingForNextTurn = props => {
    if (props.youWon) {
        return (
            <div>Congratulations, you won this round! Waiting for creator to start next turn...</div>
        );
    } else {
        return (
            <div>{props.lastWinner} won this round, waiting for creator to start next turn...</div>
        );
    }
}

const BackToGameList = props => {
    return (
        <button className="button" onClick={props.onLeaveGame}>Leave Game</button>
    );
}

const LeaveGame = props => {
    return (
        <button className="button" onClick={props.onLeaveGame}>Leave Game</button>
    );
}

const StartGame = props => {
    return (
        <button className="button-primary" onClick={props.onStartGame}>Start Game</button>
    );
}

const JoinGame = props => {
    return (
        <button className="button-primary" onClick={props.onJoinGame}>Join Game</button>
    );
}

export default Game;
