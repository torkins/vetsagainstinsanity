import React from 'react';
import logo from './logo.svg';
import './App.css';
import { IdentityContextProvider, useIdentityContext } from 'react-netlify-identity';
import Game from './components/Game';
import GameList from './components/GameList';
import { Login, Logout, useLoggedIn, useLoggedInUsername } from './Auth';
import { selectWinner, createNewGame, joinGame, chooseUserAnswers, deleteGame, fetchGameState, fetchGameStateIfNewer, updateGameState, startGame, removeUserFromGame } from './logic/gamelogic'
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
        this.pollTimer = setInterval( () => this.pollGame(), 2000);
        this.pollLock = false;
    }

    componentWillUnmount() {
        this.pollTimer = null;
    }

    pollGame() {
        if (!this.pollLock && this.state.selectedGame != null) {
            fetchGameStateIfNewer(this.state.selectedGame).then( result => {
                if (result === false) {
                    console.info("not updated");
                } else {
                    this.updateSelectedGame(result)
                }
            }, err => {
                this.clearSelectedGame();
            });
        }
    }

    clearSelectedGame() {
        const { cookies } = this.props;
        cookies.set('selectedGameId', null, { path: '/' });
        this.setState({selectedGame: null, creatingGame: false, error: null});
    }

    updateSelectedGame(gameState) {
        console.info("updateSelectedGame");
        this.setState({selectedGame: gameState, creatingGame: false, error: null});
    }

    onChooseGame(gameId) {
        console.info("onChooseGame(" + gameId + ")");
        const { cookies } = this.props;
        cookies.set('selectedGameId', gameId, { path: '/' });
        if (gameId != null) {
            fetchGameState(gameId).then(
                this.updateSelectedGame.bind(this),
                err => this.clearSelectedGame()
            );
        }
    }



    render() {
        console.info("app render");
        let updateSelectedGame = this.updateSelectedGame.bind(this);
        let applyGameState = gameState => updateGameState(gameState).then(updateSelectedGame);

        let gameProps = {
            onChooseWinner: playerName => applyGameState(selectWinner(this.state.selectedGame, playerName)),
            onChooseAnswer: (userState, answerIds) => applyGameState(chooseUserAnswers(this.state.selectedGame, userState, answerIds)),
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
                this.clearSelectedGame();
            },
            onDeleteGame: (gameId) => {
                deleteGame(gameId).then( () => this.clearSelectedGame() );
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
