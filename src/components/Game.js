
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
            isLoaded: false,
            gameState: null,
            userState: new UserState("vanessa")
        };
    }

    componentDidMount() {
      fetch("https://fervent-ardinghelli-aa4089.netlify.com/.netlify/functions/create_game")
        .then(res => res.json())
        .then(
            (result) => {
                console.info("result");
                this.setState({
                    isLoaded: true,
                    gameState: result.data
                });
                console.info("set");
            },
            (error) => {
                console.error("OH SHIT: " + error);
                this.setState({
                    isLoaded: false,
                    error
                });
                console.info("set");
            }
        );
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
        } else if (!isLoaded) {
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
                    <PlayerHand gameState={gameState} userState={userState} onAnswerChoose={onAnswerChoose}/>
                </div>
            );
        }
    }
}

export default Game;
