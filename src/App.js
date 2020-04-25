import React from 'react';
import logo from './logo.svg';
import './App.css';
import { IdentityContextProvider, useIdentityContext } from 'react-netlify-identity';
import Game from './components/Game';
import GameList from './components/GameList';
import { Login, Logout, useLoggedIn, useLoggedInUsername } from './Auth';
import { createNewGame, joinGame, deleteGame, fetchGameState, fetchGameStateIfNewer, updateGameState, startGame, removeUserFromGame } from './logic/gamelogic'
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
            error: null
        };

        this.onChooseGame(cookies.get('selectedGameId'));
        this.pollTimer = setInterval( () => this.pollGame(), 1000);
        this.pollLock = false;
    }

    componentWillUnmount() {
        this.pollTimer = null;
    }

    pollGame() {
        if (!this.pollLock && this.state.selectedGame != null) {
            fetchGameStateIfNewer(this.selectedGame).then( (gameState, updated) => {
                if (updated) this.updateSelectedGame(gameState)
            });
        }
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
            fetchGameState(gameId).then(this.updateSelectedGame.bind(this));
        }
    }



    render() {
        console.info("app render");
        let updateSelectedGame = this.updateSelectedGame.bind(this);
        let applyGameState = gameState => updateGameState(gameState).then(updateSelectedGame);

        let gameProps = {
            onChooseGame: this.onChooseGame.bind(this),
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
            onStartGame: () => applyGameState(startGame(this.state.selectedGame)),
            onLeaveGame: (username) => {
                updateGameState(removeUserFromGame(this.state.selectedGame, username));
                updateSelectedGame(null);
            },
            onDeleteGame: (gameId) => {
                deleteGame(gameId).then( () => updateSelectedGame(null) );
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
