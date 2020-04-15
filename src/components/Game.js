
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
    render() {
        let userState = new UserState("vanessa"); 
        let gameState = {
            gameId: "gecko",
            currentQuestioner: "vanessa"
        }
        
        return (
            <div className="game">
                <PlayerList />
                <PlayerHand gameState={gameState} userState={userState} />
            </div>
        );
    }
}

export default Game;
