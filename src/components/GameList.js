import React from "react";
import {getPlayerNames} from "../logic/gamelogic"
import { useIdentityContext } from 'react-netlify-identity';

const CreateNewGame: React.FunctionComponent<Props> = (props: Props) => {
    const { user } = useIdentityContext();
    let onClick = () => { props.onCreateGame(props.newGameName, user.email) };

    return (<button className="createNewButton" onClick={onClick}>Create {props.newGameName}</button>);
};

class GameList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            gameList: []
        }
    }
    
    componentDidMount() {
      fetch("https://fervent-ardinghelli-aa4089.netlify.app/.netlify/functions/get_pending_games")
        .then(res => {
            console.debug(res);
            let txt = res.text();
            console.debug(txt);
            let json = res.json();
            console.debug(json);
            return json;
        })
        .then(res => {
            console.debug(res);
            if (res.errorMessage) throw res.errorMessage;
            return res;
        })
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
                console.info("ERROR");
                console.debug(error);
                if (JSON.stringify(error).indexOf("NotFound") == -1) {
                    console.error("OH SHIT: " + error);
                    this.setState({
                        isLoaded: false,
                        error
                    });
                } else {
                    this.setState({
                        isLoaded: true,
                        error: null
                    });
                }

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
            let games = gameList.map( (game, index) => {
                let onClick = () => this.props.onChooseGame(game);
                return (<li key={index}>
                    <button className="gameListButton" onClick={onClick}>{game.gameId}</button>
                </li>);
            });
            let onNewGameNameChange = (event) => {
                this.setState({newGameName: event.target.value});
            };
            return (
                <>
                <div className="gamelist">
                    {games}
                </div>
                <input onChange={onNewGameNameChange} /><CreateNewGame newGameName={this.state.newGameName} onCreateGame={this.props.onCreateGame}/>
                </>
            );
        }
    }
}

export default GameList;
