import React from 'react';
import logo from './logo.svg';
import './App.css';
import { IdentityContextProvider } from 'react-netlify-identity';
import Game from './components/Game';
import GameList from './components/GameList';
import { Login, Logout, isLoggedIn, getLoggedInUsername } from './Auth';
import { useIdentityContext } from 'react-netlify-identity';
import { createNewGame } from './logic/gamelogic'

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
            identityContext = useIdentityContext(),
            gameSelected = () => getGameId() != null,
            onChooseGame = (game) => {
                this.setState({
                    selectedGame: game,
                    creatingGame: false,
                    error: null
                });
            },
            onCreateGame = (name) => {
                let userId = getLoggedInUsername(identityContext);

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
            {isLoggedIn(useIdentityContext()) ? (
                <>
                    <Logout/>
                    {gameSelected() ? (
                        <Game gameState={this.selectedGame}/>
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
