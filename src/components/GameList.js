import React from "react";
import {getPlayerNames} from "../logic/gamelogic"

class GameList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            gameList: null
        }
    }
    
    componentDidMount() {
      fetch("https://fervent-ardinghelli-aa4089.netlify.com/.netlify/functions/list_pending_games")
        .then(res => res.json())
        .then(
            (result) => {
                console.info("result");
                this.setState({
                    isLoaded: true,
                    gameList: result.data
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
        const { error, gameList, isLoaded } = this.state; 
        if (error) {
            return (<div>Shit dog, there was an error: {error.message}</div>);
        } else if (!isLoaded) {
            return (<div>Loading...</div>);
        } else {
            var games = gameList.map( (game) => {
                let onClick = () => this.props.onChooseGame(game);
                return (<li key={index}>
                    <button className="gameListButton" onClick={onClick}>{game.gameId}</button>
                </li>);
            });
            return (
                <div className="gamelist">
                    {games}
                </div>
            );
        }
    }
}

export default PlayerList;
