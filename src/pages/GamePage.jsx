import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MemoryMatch from '../games/MemoryMatch';
import ReactionTest from '../games/ReactionTest';
import WordGuess from '../games/WordGuess';
import './GamePage.css';

const GAME_COMPONENTS = {
  'memory-match': MemoryMatch,
  'reaction-test': ReactionTest,
  'word-guess': WordGuess,
};

const GamePage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const GameComponent = GAME_COMPONENTS[gameId];

  if (!GameComponent) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="game-page animate-fade-in">
      <button className="back-button" onClick={() => navigate('/')}>
        <ArrowLeft size={20} /> Back to Hub
      </button>

      <div className="game-wrapper">
        <GameComponent />
      </div>
    </div>
  );
};

export default GamePage;
