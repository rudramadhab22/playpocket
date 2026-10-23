import { useState, useEffect, useCallback } from 'react';
import { saveScore, getBestScore } from '../utils/storage';
import './WordGuess.css';

const WORDS = [
  'GAMES', 'REACT', 'CODE', 'PLAY', 'PIXEL',
  'SCORE', 'LEVEL', 'RETRO', 'SPACE', 'ALIEN'
];
const MAX_ATTEMPTS = 6;

const WordGuess = () => {
  const [word, setWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState('playing'); // playing, won, lost
  const [bestScore, setBestScore] = useState(null);

  useEffect(() => {
    startNewGame();
    setBestScore(getBestScore('word-guess'));
  }, []);

  const startNewGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(randomWord);
    setGuesses([]);
    setCurrentGuess('');
    setGameState('playing');
  };

  const handleKeyPress = useCallback((key) => {
    if (gameState !== 'playing') return;

    if (key === 'Enter') {
      if (currentGuess.length !== word.length) return;

      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      setCurrentGuess('');

      if (currentGuess === word) {
        setGameState('won');
        const newBest = saveScore('word-guess', newGuesses.length, false);
        setBestScore(newBest);
      } else if (newGuesses.length >= MAX_ATTEMPTS) {
        setGameState('lost');
      }
    } else if (key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < word.length) {
      setCurrentGuess(prev => prev + key);
    }
  }, [currentGuess, gameState, guesses, word]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();
      if (key === 'ENTER') handleKeyPress('Enter');
      else if (key === 'BACKSPACE') handleKeyPress('Backspace');
      else if (/^[A-Z]$/.test(key)) handleKeyPress(key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  const Keyboard = () => {
    const rows = [
      ['Q','W','E','R','T','Y','U','I','O','P'],
      ['A','S','D','F','G','H','J','K','L'],
      ['Enter','Z','X','C','V','B','N','M','Backspace']
    ];

    const getKeyStatus = (key) => {
      if (key === 'Enter' || key === 'Backspace') return '';
      let status = '';
      for (const guess of guesses) {
        for (let i = 0; i < guess.length; i++) {
          if (guess[i] === key) {
            if (word[i] === key) return 'correct';
            if (word.includes(key)) status = 'present';
            else if (!status) status = 'absent';
          }
        }
      }
      return status;
    };

    return (
      <div className="keyboard">
        {rows.map((row, i) => (
          <div key={i} className="keyboard-row">
            {row.map(key => (
              <button
                key={key}
                className={`key ${key.length > 1 ? 'key-wide' : ''} ${getKeyStatus(key)}`}
                onClick={() => handleKeyPress(key)}
              >
                {key === 'Backspace' ? '⌫' : key}
              </button>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="word-guess-container">
      <div className="game-header text-center mb-4">
        <h2>Word Guess</h2>
        {bestScore && <p className="mt-2" style={{color: 'var(--color-secondary)'}}>Best: {bestScore} attempts</p>}
      </div>

      <div className="grid-container mb-4">
        {[...Array(MAX_ATTEMPTS)].map((_, rowIndex) => {
          const guess = guesses[rowIndex];
          const isCurrentRow = rowIndex === guesses.length;
          const rowText = guess || (isCurrentRow ? currentGuess : '');

          return (
            <div key={rowIndex} className="guess-row">
              {[...Array(word.length || 5)].map((_, colIndex) => {
                const letter = rowText[colIndex] || '';
                let status = '';

                if (guess) {
                  if (guess[colIndex] === word[colIndex]) {
                    status = 'correct';
                  } else if (word.includes(guess[colIndex])) {
                    status = 'present';
                  } else {
                    status = 'absent';
                  }
                }

                return (
                  <div key={colIndex} className={`guess-cell ${status} ${letter && !guess ? 'filled' : ''}`}>
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {gameState !== 'playing' ? (
        <div className="game-over card text-center mb-4 animate-fade-in">
          <h3 className="mb-2" style={{color: gameState === 'won' ? 'var(--color-success)' : 'var(--color-error)'}}>
            {gameState === 'won' ? 'You Won!' : 'Game Over'}
          </h3>
          <p className="mb-2">The word was: <strong>{word}</strong></p>
          <button className="btn-primary mt-2" onClick={startNewGame}>Play Again</button>
        </div>
      ) : (
        <Keyboard />
      )}
    </div>
  );
};

export default WordGuess;
