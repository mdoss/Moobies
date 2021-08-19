import React, {useState} from 'react';
import Menu from './Game/Menu';
import Game from './Game/Game';
import End from './Game/End';
import './App.css';
import HighScore from './Game/HighScore';
import axios from 'axios';

const apiCloud = 'https://nameless-gorge-59165.herokuapp.com'
const apiLocal = 'http://localhost:5001'
export const api = apiCloud;

function App() {

  const [showMenu, setShowMenu] = useState<boolean>(true);
  const [showGame, setShowGame] = useState<boolean>(false);
  const [showEnd, setShowEnd] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [difficulty, setDifficulty] = React.useState('Easy');
  const [mode, setMode] = React.useState('averageRating');

  React.useEffect(() => {
    axios.get(`${api}/users/`)
  }, [])

  function scoreInc() {
    setScore(score => score + 1)
  }

  const handleMode = (event: any) => {
    setMode(event.target.value);
  };
  
  const handleDifficulty = (event: any) => {
    setDifficulty(event.target.value);
  };

  function handlePlay() {
    setScore(0);
    setShowMenu(false);
    setShowGame(true);
    setShowEnd(false);
  }

  function handleEnd() {
    setShowMenu(false);
    setShowGame(false);
    setShowEnd(true);
  }

  return (
    <div className="App">
      <div className="game">
        {showMenu && <Menu handlePlay={handlePlay} handleDifficulty={handleDifficulty} handleMode={handleMode} mode={mode} difficulty={difficulty}/>}
        {showGame && <Game handleEnd={handleEnd} scoreInc={scoreInc} mode={mode} difficulty={difficulty}/>}
        {showEnd && <End handlePlay={handlePlay} handleDifficulty={handleDifficulty} handleMode={handleMode} mode={mode} difficulty={difficulty} score={score}/>}
      </div>
      <HighScore mode={mode} difficulty={difficulty} score={score}/>
    </div>
    
  );
}

export default App;
