import React from "react";
import {getPoints, getPlayerNames} from "../logic/gamelogic"

const PlayerList = props => {
    const playerNames = getPlayerNames(props.gameState);
    console.debug("playerNames: " + JSON.stringify(playerNames));
    const playerElems = playerNames.map( (pname,index) => {
        const points = getPoints(props.gameState, pname);
        const onClick = () => props.onPlayerClick(pname);
        return (
            <li key={index}>{pname}: {points}</li>
        );
    });

    return (
        <div className="playerList">
            Player List
            {playerElems}
        </div>
    );
}

export default PlayerList;
