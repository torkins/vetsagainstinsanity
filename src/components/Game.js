
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
            userState: this.props.userState,
        };
    }

    render() {
        console.info("Game render");
        const { error, userState, isLoaded } = this.state; 
        const gameState = this.props.gameState;
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
                        <>
                        <JoinGame onJoinGame={onJoinGame} />
                        <BackToGameList onClick={onLeaveGame} />
                        </>
                    }
                </div>
            );
        }
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
