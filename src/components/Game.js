
import React from "react";
import PlayerList from "./PlayerList"
import PlayerHand from "./PlayerHand"
import {UserState} from "../logic/userlogic"
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
            return (
                <div className="game">
                    <PlayerList gameState={gameState} userState={userState} onPlayerClick={changeToUser}/>
                    <StartGame onStartGame={this.props.onStartGame} />
                    <LeaveGame onLeaveGame={this.props.onLeaveGame} />
                    <PlayerHand gameState={gameState} userState={userState} onAnswerChoose={onAnswerChoose}/>
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

export default Game;
