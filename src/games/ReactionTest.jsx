import { useState, useRef, useEffect } from 'react';
import { saveScore, getBestScore } from '../utils/storage';
import './ReactionTest.css';

const ReactionTest = () => {
  const [gameState, setGameState] = useState('idle'); // idle, waiting, click, result, early
  const [resultTime, setResultTime] = useState(null);
  const [bestScore, setBestScore] = useState(null);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    setBestScore(getBestScore('reaction-test'));
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleClick = () => {
    if (gameState === 'idle' || gameState === 'result' || gameState === 'early') {
      startWait();
    } else if (gameState === 'waiting') {
      clearTimeout(timerRef.current);
      setGameState('early');
    } else if (gameState === 'click') {
      const endTime = Date.now();
      const reactionTime = endTime - startTimeRef.current;
      setResultTime(reactionTime);
      setGameState('result');

      const newBest = saveScore('reaction-test', reactionTime, false);
      setBestScore(newBest);
    }
  };

  const startWait = () => {
    setGameState('waiting');
    setResultTime(null);

    // Random wait between 2 and 5 seconds
    const waitTime = Math.floor(Math.random() * 3000) + 2000;

    timerRef.current = setTimeout(() => {
      setGameState('click');
      startTimeRef.current = Date.now();
    }, waitTime);
  };

  return (
    <div className="reaction-container">
      <div className="game-header text-center mb-4">
        <h2>Reaction Test</h2>
        {bestScore && <p className="mt-2" style={{color: 'var(--color-secondary)'}}>Best: {bestScore}ms</p>}
      </div>

      <div
        className={`reaction-area card ${gameState}`}
        onClick={handleClick}
      >
        <div className="reaction-content">
          {gameState === 'idle' && (
            <>
              <h3>Click to Start</h3>
              <p>Wait for green, then click as fast as you can!</p>
            </>
          )}

          {gameState === 'waiting' && (
            <>
              <h3>Wait for Green...</h3>
              <p>Don't click yet!</p>
            </>
          )}

          {gameState === 'click' && (
            <>
              <h3>CLICK!</h3>
            </>
          )}

          {gameState === 'result' && (
            <>
              <h3>{resultTime} ms</h3>
              <p>Click to try again</p>
            </>
          )}

          {gameState === 'early' && (
            <>
              <h3>Too Early!</h3>
              <p>You clicked before it turned green. Click to try again.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReactionTest;
