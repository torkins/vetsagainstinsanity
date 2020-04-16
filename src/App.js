import React from 'react';
import logo from './logo.svg';
import './App.css';
import { IdentityContextProvider } from 'react-netlify-identity';
import Game from './components/Game';
import GameList from './components/GameList';
import { Login, Logout, isLoggedIn, getLoggedInUsername } from './Auth';

const url = "https://fervent-ardinghelli-aa4089.netlify.com/";



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
            gameSelected = () => getGameId() != null,
            onChooseGame = (game) => {
                this.setState({
                    selectedGame: game,
                    creatingGame: false,
                    error: null
                });
            },
            onCreateGame = (name) => {
                let userId = getLoggedInUsername();

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
            {isLoggedIn() ? (
                <>
                    <Logout/>
                    {gameSelected() ? (
                        <Game gameId={getGameId()}/>
                    ) : (
                        <GameList onChooseGame={onChooseGame} onCreateGame={onCreateGame}/>
                    )}
                </>
            ) : (
                <Login />
            )}
              <Game />
          </IdentityContextProvider>
      );
    }
}

export default App;
