import React from "react";
import {getPlayerNames} from "../logic/gamelogic"

const PlayerList = props => {
    const playerNames = getPlayerNames(props.gameState);
    const playerElems = playerNames.map( (pname,index) => {
        const onClick = () => props.onPlayerClick(pname);
        return (
            <li key={index}>
                <button className="playerButton" onClick={onClick}>{pname}</button>
            </li>
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
