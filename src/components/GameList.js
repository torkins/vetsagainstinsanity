import React from "react";
import {getPlayerNames, fetchPendingGames, fetchMyUnfinishedGames} from "../logic/gamelogic"
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
            pendingGamesLoaded: false,
            pendingGameList: [],
            myGamesLoaded: false,
            myGameList: []
        }
    }
    
    componentDidMount() {
        fetchPendingGames().then(
            gameList => this.setState({pendingGamesLoaded: true, pendingGameList: gameList}),
            error => this.setState({pendingGamesLoaded: false, error})
        );

        fetchMyUnfinishedGames(this.props.userState.username).then(
            gameList => this.setState({myGamesLoaded: true, myGameList: gameList}),
            error => this.setState({myGamesLoaded: false, error})
        );
    }

    render() {
        console.info("GameList render");
        let { error, pendingGameList, myGameList, isLoaded } = this.state; 
        if (error) {
            return (<div>Shit dog, there was an error: {error.message}</div>);
        } else if (!isLoaded) {
            return (<div>Loading...</div>);
        } else {
            console.info("PendingGameList: " + pendingGameList);
            let cleanList = list => {
                if (list == null) return [];
                if (list.map == null) return [list];
                return list;
            }
            let gameListToButtons = gameList => gameList.map( (gameInfo, index) => {
                let gameId = gameInfo[0];
                let gameName = gameInfo[1];
                let onClick = () => this.props.onChooseGame(gameId);
                return (<li key={index}>
                    <button className="gameListButton" onClick={onClick}>{gameName}</button>
                </li>);
            });

            let pendingGames = gameListToButtons(cleanList(pendingGameList)); 
            let myGames = gameListToButtons(cleanList(myGameList));

            let onNewGameNameChange = (event) => {
                this.setState({newGameName: event.target.value});
            };
            return (
                <>
                <div className="pendingGames">
                    {pendingGames.length > 0 ? <p>Pending Games</p> : <div /> }
                    {pendingGames}
                </div>
                <div className="myGames">
                    {myGames.length > 0 ? <p>Started Games</p> : <div /> }
                    {myGames}
                </div>
                <input onChange={onNewGameNameChange} /><CreateNewGame newGameName={this.state.newGameName} onCreateGame={this.props.onCreateGame}/>
                </>
            );
        }
    }
}

export default GameList;
