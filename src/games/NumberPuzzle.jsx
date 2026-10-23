import { useState, useEffect } from 'react';
import { saveScore, getBestScore } from '../utils/storage';
import './NumberPuzzle.css';

const GRID_SIZE = 4;
const NUM_TILES = GRID_SIZE * GRID_SIZE;

const NumberPuzzle = () => {
  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState('idle'); // idle, playing, won
  const [bestScore, setBestScore] = useState(null);

  useEffect(() => {
    setBestScore(getBestScore('number-puzzle'));
  }, []);

  const isSolvable = (arr) => {
    let inversions = 0;
    const blankRow = Math.floor(arr.indexOf(NUM_TILES - 1) / GRID_SIZE);

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] !== NUM_TILES - 1 && arr[j] !== NUM_TILES - 1 && arr[i] > arr[j]) {
          inversions++;
        }
      }
    }

    if (GRID_SIZE % 2 !== 0) {
      return inversions % 2 === 0;
    } else {
      return (inversions + blankRow) % 2 !== 0;
    }
  };

  const shuffleTiles = () => {
    let newTiles = Array.from({ length: NUM_TILES }, (_, i) => i);
    do {
      for (let i = newTiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
      }
    } while (!isSolvable(newTiles) || isSolved(newTiles));

    return newTiles;
  };

  const isSolved = (currentTiles) => {
    for (let i = 0; i < NUM_TILES - 1; i++) {
      if (currentTiles[i] !== i) return false;
    }
    return currentTiles[NUM_TILES - 1] === NUM_TILES - 1;
  };

  const startGame = () => {
    setTiles(shuffleTiles());
    setMoves(0);
    setGameState('playing');
  };

  const handleTileClick = (index) => {
    if (gameState !== 'playing') return;

    const blankIndex = tiles.indexOf(NUM_TILES - 1);

    // Check if tile is adjacent to blank
    const isAdjacent =
      (index === blankIndex - 1 && blankIndex % GRID_SIZE !== 0) || // Left
      (index === blankIndex + 1 && index % GRID_SIZE !== 0) ||      // Right
      (index === blankIndex - GRID_SIZE) ||                         // Top
      (index === blankIndex + GRID_SIZE);                           // Bottom

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[blankIndex]] = [newTiles[blankIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(m => m + 1);

      if (isSolved(newTiles)) {
        setGameState('won');
        const newBest = saveScore('number-puzzle', moves + 1, false);
        setBestScore(newBest);
      }
    }
  };

  return (
    <div className="number-puzzle-container">
      <div className="game-header text-center mb-4">
        <h2>Number Puzzle</h2>
        <div className="stats-row">
          <span>Moves: {moves}</span>
          {bestScore && <span className="best-score">Best: {bestScore}</span>}
        </div>
      </div>

      <div className="puzzle-board-wrapper">
        {gameState === 'idle' && (
          <div className="game-overlay card text-center">
            <p className="mb-2">Arrange numbers 1-15 in order.</p>
            <button className="btn-primary" onClick={startGame}>Start Game</button>
          </div>
        )}

        {gameState === 'won' && (
          <div className="game-overlay card text-center win-screen">
            <h3 className="mb-2" style={{ color: 'var(--color-success)' }}>Solved!</h3>
            <p className="mb-2">Total Moves: {moves}</p>
            <button className="btn-primary" onClick={startGame}>Play Again</button>
          </div>
        )}

        <div className={`puzzle-grid ${gameState !== 'playing' ? 'blurred' : ''}`}>
          {tiles.map((tileValue, index) => {
            const isBlank = tileValue === NUM_TILES - 1;
            // Calculate correct position to determine if it's in the right spot
            const isCorrect = tileValue === index;

            return (
              <div
                key={tileValue} // Use tileValue as key for animation/identity (optional sliding animations later)
                className={`puzzle-tile ${isBlank ? 'blank' : ''} ${isCorrect && !isBlank ? 'correct-pos' : ''}`}
                onClick={() => handleTileClick(index)}
              >
                {!isBlank && (tileValue + 1)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NumberPuzzle;
