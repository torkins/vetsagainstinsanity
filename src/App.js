import React from 'react';
import logo from './logo.svg';
import './App.css';
import { IdentityContextProvider, useIdentityContext } from 'react-netlify-identity';
import Game from './components/Game';
import GameList from './components/GameList';
import { Login, Logout, useLoggedIn, useLoggedInUsername } from './Auth';
import { createNewGame } from './logic/gamelogic'
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
                        <Game gameState={props.selectedGame} userState={userState}/>
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
        let gameProps = {
            onChooseGame: (game) => {
                this.setState({
                    selectedGame: game,
                    creatingGame: false,
                    error: null
                });
            },
            onCreateGame: (name, userId) => {
                this.setState({
                    selectedGame: null,
                    creatingGame: true
                });

                createNewGame(name, userId, "vetsagainstinsanity")
                    .then(
                        (gameState => {
                            console.info("created");
                            this.setState({
                                creatingGame: false,
                                selectedGame: gameState
                            });
                        }),
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
            onLeaveGame: () => {
                this.setState({
                    selectedGame: null,
                    creatingGame: false,
                    error: null
                });
            },
            onStartGame: () => {
                this.setState({ selectedGame: startGame(this.state.selectedGame) });
            },
            onLeaveGame: (username) => {
                this.setState({ selectedGame: removeUserFromGame(this.state.selectedGame, username) });
            },
        }


      return (
          <IdentityContextProvider url={url}>
            <ProtectedGame selectedGame={this.state.selectedGame} {...gameProps} /> 
          </IdentityContextProvider>
      );
    }
}

export default App;
