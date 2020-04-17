import React from 'react';
import logo from './logo.svg';
import './App.css';
import { IdentityContextProvider, useIdentityContext } from 'react-netlify-identity';
import Game from './components/Game';
import GameList from './components/GameList';
import { Login, Logout, useLoggedIn, useLoggedInUsername } from './Auth';
import { createNewGame, joinGame, fetchGameState, updateGameState, startGame, removeUserFromGame } from './logic/gamelogic'
import { UserState } from './logic/userlogic'

const url = "https://fervent-ardinghelli-aa4089.netlify.app/";


let ProtectedGame = (props) => {
    let onLogin = (user) => { console.info("Welcome " + user); }
    let username = useLoggedInUsername();
    let userState = useLoggedIn() ? new UserState(username) : null;
    return useLoggedIn() ?
            (
                <>
                    <Logout/>
                    {props.selectedGame != null ? (
                        <Game gameState={props.selectedGame} userState={userState} {...props}/>
                    ) : (
                        <GameList {...props}/>
                    )}
                </>
            ) : (
                <Login onLogin={onLogin}/>
            );
}


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedGame: null,
            creatingGame: false,
        };
    }

    render() {
        let updateSelectedGame = gameState => this.setState({selectedGame: gameState, creatingGame: false, error: null}),
            applyGameState = gameState => updateGameState(gameState).then(updateSelectedGame);

        let gameProps = {
            onChooseGame: gameId => fetchGameState(gameId).then(updateSelectedGame),
            onCreateGame: (name, userId) => {
                this.setState({
                    selectedGame: null,
                    creatingGame: true
                });

                createNewGame(name, userId, "vetsagainstinsanity")
                    .then(updateSelectedGame, 
                        (error => {
                            console.info("error: " + JSON.stringify(error));
                            this.setState({
                                creatingGame: false,
                                selectedGame: null,
                                error
                            });
                        })
                    );
            },
            onLeaveGame: () => updateSelectedGame(null),
            onStartGame: () => applyGameState(startGame(this.state.selectedGame)),
            onLeaveGame: (username) => applyGameState(removeUserFromGame(this.state.selectedGame, username)),
            onJoinGame: (gameId, userId) => applyGameState(fetchGameState(gameId).then(game => joinGame(game, userId))),
            applyGameState
        }


      return (
          <IdentityContextProvider url={url}>
            <ProtectedGame selectedGame={this.state.selectedGame} {...gameProps} /> 
          </IdentityContextProvider>
      );
    }
}

export default App;
