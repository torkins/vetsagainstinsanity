
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
    componentDidMount() {
      fetch("https://fervent-ardinghelli-aa4089.netlify.com/.netlify/functions/create_game")
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    gameState: result
                });
            },
            (error) => {
                console.error("OH SHIT: " + error);
                this.setState({
                    isLoaded: false,
                    error
                });
            }
        );
    };

    render() {
        let userState = new UserState("vanessa"); 
        const { error, gameState, isLoaded } = this.state; 
        /*
        let gameState = {
            gameId: "gecko",
            currentQuestioner: "vanessa"
        }
        */
        if (error) {
            return <div>Shit dog, there was an error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div className="game">
                    <PlayerList />
                    <PlayerHand gameState={gameState} userState={userState} />
                </div>
            );
        }
    }
}

export default Game;
