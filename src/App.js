import React from 'react';
import logo from './logo.svg';
import './App.css';
import { IdentityContextProvider, useIdentityContext } from 'react-netlify-identity';
import Game from './components/Game';
import GameList from './components/GameList';
import { Login, Logout, useLoggedIn, useLoggedInUsername } from './Auth';
import { createNewGame, joinGame, fetchGameState, updateGameState, startGame, removeUserFromGame } from './logic/gamelogic'
import { UserState } from './logic/userlogic'
import { withCookies, Cookies } from 'react-cookie'
import { instanceOf } from 'prop-types';

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
                        <GameList userState={userState} {...props}/>
                    )}
                </>
            ) : (
                <Login onLogin={onLogin}/>
            );
}


class App extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);

        const { cookies } = this.props;

        this.state = {
            selectedGame: null,
            creatingGame: false,
        };

        this.onChooseGame(cookies.get('selectedGameId'));
    }

    updateSelectedGame(gameState) {
        console.info("updateSelectedGame");
        this.setState({selectedGame: gameState, creatingGame: false, error: null});
    }

    onChooseGame(gameId) {
        console.info("onChooseGame(" + gameId + ")");
        if (gameId != null) {
            const { cookies } = this.props;

            cookies.set('selectedGameId', gameId, { path: '/' });
            fetchGameState(gameId).then(this.updateSelectedGame);
        }
    }



    render() {
        console.info("app render");
        let applyGameState = gameState => updateGameState(gameState).then(this.updateSelectedGame);

        let gameProps = {
            onChooseGame: this.onChooseGame,
            onCreateGame: (name, userId) => {
                this.setState({
                    selectedGame: null,
                    creatingGame: true
                });

                createNewGame(name, userId, "vetsagainstinsanity")
                    .then(this.updateSelectedGame, 
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
            onStartGame: () => applyGameState(startGame(this.state.selectedGame)),
            onLeaveGame: (username) => {
                updateGameState(removeUserFromGame(this.state.selectedGame, username));
                this.updateSelectedGame(null);
            },
            onJoinGame: (gameId, userId) => fetchGameState(gameId).then(game => joinGame(game, userId)).then(applyGameState),
            applyGameState
        }


      return (
          <IdentityContextProvider url={url}>
            <div class="container">
              <ProtectedGame selectedGame={this.state.selectedGame} {...gameProps} /> 
            </div>
          </IdentityContextProvider>
      );
    }
}

export default withCookies(App);
