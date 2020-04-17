
import React from "react";
import PlayerList from "./PlayerList"
import PlayerHand from "./PlayerHand"
import {UserState} from "../logic/userlogic"
import {isPlaying} from "../logic/gamelogic"
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
            gameState: this.props.gameState,
            userState: this.props.userState,
        };
    }

    render() {
        const { error, userState, gameState, isLoaded } = this.state; 
        console.info("render3");
        /*
        let gameState = {
            gameId: "gecko",
            currentQuestioner: "vanessa"
        }
        */
        if (error) {
            return (<div>Shit dog, there was an error: {error.message}</div>);
        } else if (this.state.gameState == null) {
            return (<div>Loading...</div>);
        } else {
            let changeToUser = (username) => { 
                console.info(`changeToUser: ${username}`);
                this.setState({ userState: new UserState(username) });
            };
            let onAnswerChoose = () => { };
            let onJoinGame = () => {
                    this.props.onJoinGame(gameState.gameId, userState.username);
                },
                onLeaveGame = () => this.props.onLeaveGame(userState.username);

            return (
                <div className="game">
                    <PlayerList gameState={gameState} userState={userState} onPlayerClick={changeToUser}/>
                    { isPlaying(gameState, userState.username) ?
                        <>
                        <StartGame onStartGame={this.props.onStartGame} />
                        <LeaveGame onLeaveGame={onLeaveGame} />
                        <PlayerHand gameState={gameState} userState={userState} onAnswerChoose={onAnswerChoose}/>
                        </>
                        :
                        <JoinGame onJoinGame={onJoinGame} />
                    }
                </div>
            );
        }
    }
}

const LeaveGame = props => {
    return (
        <button className="leaveGame" onClick={props.onLeaveGame}>Leave Game</button>
    );
}

const StartGame = props => {
    return (
        <button className="startGame" onClick={props.onStartGame}>Start Game</button>
    );
}

const JoinGame = props => {
    return (
        <button className="joinGame" onClick={props.onJoinGame}>Join Game</button>
    );
}

export default Game;
