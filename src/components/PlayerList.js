import React from "react";

class PlayerList extends React.Component {
    render() {
        const playerNames = this.props.players || ["Josie","Janie"];
        const playerElems = playerNames.map( (pname,index) => {
            return (
                <li key={index}>
                    <button className="playerButton">{pname}</button>
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
}

export default PlayerList;
