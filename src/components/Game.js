
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
            gameState: null
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
        console.info("render1");
        let userState = new UserState("vanessa"); 
        console.info("render2");
        const { error, gameState, isLoaded } = this.state; 
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
