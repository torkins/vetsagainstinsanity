import React from "react";
import {getPoints, getPlayerNames} from "../logic/gamelogic"

const PlayerList = props => {
    const playerNames = getPlayerNames(props.gameState);
    console.debug("playerNames: " + JSON.stringify(playerNames));
    const playerElems = playerNames.map( (pname,index) => {
        const points = getPoints(props.gameState, pname);
        const onClick = () => props.onPlayerClick(pname);
        return (
            <tr>
                <td className="playerName">{pname}</td><td className="playerPoints">{points}</td>
            </tr>
        );
    });

    return (
        <>
        <h4>Players</h4>
        <div className="playerList">
            <table className="playerList twelve columns">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                {playerElems}
                </tbody>
            </table>
        </div>
        </>
    );
}

export default PlayerList;
