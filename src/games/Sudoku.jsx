import { useState, useEffect, useCallback } from 'react';
import { saveScore, getBestScore } from '../utils/storage';
import './Sudoku.css';

// A simple predefined set of puzzles for client-side demo
// 0 represents empty cells
const PUZZLES = {
  easy: [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]
  ]
};

const SOLVED = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9]
];

const Sudoku = () => {
  const [grid, setGrid] = useState([]);
  const [initialGrid, setInitialGrid] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null); // {row, col}
  const [gameState, setGameState] = useState('idle'); // idle, playing, won
  const [startTime, setStartTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [bestScore, setBestScore] = useState(null);

  useEffect(() => {
    setBestScore(getBestScore('sudoku-easy')); // Hardcoded to easy for now
  }, []);

  // Timer
  useEffect(() => {
    let interval;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, startTime]);

  const startGame = () => {
    // Deep copy the puzzle
    const newGrid = PUZZLES.easy.map(row => [...row]);
    setGrid(newGrid);
    setInitialGrid(PUZZLES.easy.map(row => [...row]));
    setSelectedCell(null);
    setStartTime(Date.now());
    setTimeElapsed(0);
    setGameState('playing');
  };

  const checkWin = (currentGrid) => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (currentGrid[r][c] !== SOLVED[r][c]) {
          return false;
        }
      }
    }
    return true;
  };

  const handleInput = useCallback((num) => {
    if (gameState !== 'playing' || !selectedCell) return;
    const { row, col } = selectedCell;

    // Don't allow editing initial numbers
    if (initialGrid[row][col] !== 0) return;

    const newGrid = [...grid];
    newGrid[row] = [...newGrid[row]];
    newGrid[row][col] = num;
    setGrid(newGrid);

    if (num !== 0 && checkWin(newGrid)) {
      setGameState('won');
      const newBest = saveScore('sudoku-easy', timeElapsed, false); // lower time is better
      setBestScore(newBest);
    }
  }, [gameState, selectedCell, initialGrid, grid, timeElapsed]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing' || !selectedCell) return;

      const key = e.key;
      if (key >= '1' && key <= '9') {
        handleInput(parseInt(key));
      } else if (key === 'Backspace' || key === 'Delete' || key === '0') {
        handleInput(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput, gameState, selectedCell]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="sudoku-container">
      <div className="game-header text-center mb-2">
        <h2>Sudoku</h2>
        <div className="stats-row">
          <span>Time: {formatTime(timeElapsed)}</span>
          {bestScore && <span className="best-score">Best: {formatTime(bestScore)}</span>}
        </div>
      </div>

      <div className="sudoku-board-wrapper">
        {gameState === 'idle' && (
          <div className="game-overlay card text-center">
            <p className="mb-2">Fill the grid so every row, column, and 3x3 box contains 1-9.</p>
            <button className="btn-primary" onClick={startGame}>Start Game</button>
          </div>
        )}

        {gameState === 'won' && (
          <div className="game-overlay card text-center win-screen">
            <h3 className="mb-2" style={{ color: 'var(--color-success)' }}>Puzzle Solved!</h3>
            <p className="mb-2">Time: {formatTime(timeElapsed)}</p>
            <button className="btn-primary" onClick={startGame}>Play Again</button>
          </div>
        )}

        <div className={`sudoku-grid ${gameState !== 'playing' ? 'blurred' : ''}`}>
          {grid.map((row, rIndex) => (
            row.map((cell, cIndex) => {
              const isInitial = initialGrid[rIndex]?.[cIndex] !== 0;
              const isSelected = selectedCell?.row === rIndex && selectedCell?.col === cIndex;
              const isError = cell !== 0 && cell !== SOLVED[rIndex][cIndex];

              let classNames = 'sudoku-cell';
              if (isSelected) classNames += ' selected';
              if (isInitial) classNames += ' initial';
              else if (cell !== 0) classNames += ' user-input';
              if (!isInitial && isError && gameState === 'playing') classNames += ' error'; // Highlight wrong guesses

              // Borders for 3x3 boxes
              if (cIndex % 3 === 2 && cIndex !== 8) classNames += ' border-right';
              if (rIndex % 3 === 2 && rIndex !== 8) classNames += ' border-bottom';

              return (
                <div
                  key={`${rIndex}-${cIndex}`}
                  className={classNames}
                  onClick={() => setSelectedCell({ row: rIndex, col: cIndex })}
                >
                  {cell !== 0 ? cell : ''}
                </div>
              );
            })
          ))}
        </div>
      </div>

      {gameState === 'playing' && (
        <div className="numpad">
          {[1,2,3,4,5,6,7,8,9].map(num => (
            <button key={num} className="numpad-btn" onClick={() => handleInput(num)}>
              {num}
            </button>
          ))}
          <button className="numpad-btn erase" onClick={() => handleInput(0)}>
            ⌫
          </button>
        </div>
      )}
    </div>
  );
};

export default Sudoku;
