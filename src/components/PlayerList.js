import React from "react";
import {getPoints, getPlayerNames} from "../logic/gamelogic"

const PlayerList = props => {
    const playerNames = getPlayerNames(props.gameState);
    console.debug("playerNames: " + JSON.stringify(playerNames));
    const playerElems = playerNames.map( (pname,index) => {
        const points = getPoints(props.gameState, pname);
        const onClick = () => props.onPlayerClick(pname);
        return (
            <div className="playerName ten columns" key={index}>{pname}: <b>{points}</b></div>
        );
    });

    return (
        <div className="playerList twelve columns">
            Player List
            {playerElems}
        </div>
    );
}

export default PlayerList;
