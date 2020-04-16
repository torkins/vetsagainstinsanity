import React from 'react';
import logo from './logo.svg';
import './App.css';
import { IdentityContextProvider, useIdentityContext } from 'react-netlify-identity';
import Game from './components/Game';
import GameList from './components/GameList';
import { Login, Logout, useLoggedIn, useLoggedInUsername } from './Auth';
import { createNewGame } from './logic/gamelogic'

const url = "https://fervent-ardinghelli-aa4089.netlify.app/";


let ProtectedGame = (props) => {
    let onLogin = (user) => { console.info("Welcome " + user); }
    return useLoggedIn() ?
            (
                <>
                    <Logout/>
                    {props.selectedGame != null ? (
                        <Game gameState={props.selectedGame}/>
                    ) : (
                        <GameList onChooseGame={props.onChooseGame} onCreateGame={props.onCreateGame}/>
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
        let getGameId = () => this.state.selectedGame.gameId,
            onChooseGame = (game) => {
                this.setState({
                    selectedGame: game,
                    creatingGame: false,
                    error: null
                });
            },
            onCreateGame = (name, userId) => {
                this.setState({
                    selectedGame: null,
                    creatingGame: true
                });

                createNewGame(name, userId, "vetsagainstinsanity")
                    .then(
                        (gameState => {
                            this.setState({
                                creatingGame: false,
                                selectedGame: gameState
                            });
                        }),
                        (error => {
                            this.setState({
                                creatingGame: false,
                                selectedGame: null,
                                error
                            });
                        })
                    );
            };

      return (
          <IdentityContextProvider url={url}>
            <ProtectedGame selectedGame={this.state.selectedGame} onChooseGame={onChooseGame} onCreateGame={onCreateGame}/>
          </IdentityContextProvider>
      );
    }
}

export default App;
