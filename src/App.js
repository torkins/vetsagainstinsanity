import React from 'react';
import logo from './logo.svg';
import './App.css';
import { IdentityContextProvider } from 'react-netlify-identity';
import Game from './components/Game';

const url = "https://fervent-ardinghelli-aa4089.netlify.com/";



function App() {
  return (
      <IdentityContextProvider url={url}>
          <Game />
      </IdentityContextProvider>
  );
}

export default App;
