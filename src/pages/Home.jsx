import { useEffect, useState } from 'react';
import { Brain, Zap, Type, Hash, Grid3X3, Calendar, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { getStats, hasCompletedToday } from '../utils/storage';
import { getDailyChallengeGame } from '../utils/daily';
import './Home.css';

export const GAMES = [
  {
    id: 'memory-match',
    title: 'Memory Match',
    description: 'Match pairs of cards in the fewest moves possible.',
    icon: Brain,
    tag: 'Phase 1'
  },
  {
    id: 'reaction-test',
    title: 'Reaction Test',
    description: 'Test how quickly you respond to the changing colors.',
    icon: Zap,
    tag: 'Phase 1'
  },
  {
    id: 'word-guess',
    title: 'Word Guess',
    description: 'Guess the hidden word within limited attempts.',
    icon: Type,
    tag: 'Phase 1'
  },
  {
    id: 'number-puzzle',
    title: 'Number Puzzle',
    description: 'Slide tiles to arrange numbers 1-15 in order.',
    icon: Hash,
    tag: 'Phase 2'
  },
  {
    id: 'sudoku',
    title: 'Sudoku',
    description: 'Fill the grid so every row, column, and 3x3 box contains 1-9.',
    icon: Grid3X3,
    tag: 'Phase 2'
  }
];

const Home = () => {
  const [stats, setStats] = useState({ gamesPlayed: 0, scores: {} });
  const [dailyGameId, setDailyGameId] = useState('');
  const [isDailyCompleted, setIsDailyCompleted] = useState(false);

  useEffect(() => {
    setStats(getStats());
    const dailyId = getDailyChallengeGame();
    setDailyGameId(dailyId);
    setIsDailyCompleted(hasCompletedToday(dailyId));
  }, []);

  const dailyGame = GAMES.find(g => g.id === dailyGameId);

  return (
    <div className="home-container">
      <section className="hero text-center mb-4 animate-fade-in">
        <h1 className="hero-title">Your next favorite game<br/><span className="text-highlight">is one click away.</span></h1>
        <p className="hero-subtitle">Play short, engaging mini-games. Track your best scores.</p>
      </section>

      <section className="stats-section mb-4">
        <div className="card stats-card">
          <div className="stat-item">
            <span className="stat-label">Games Played</span>
            <span className="stat-value">{stats.gamesPlayed}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-label">Best Reaction</span>
            <span className="stat-value">
              {stats.scores['reaction-test']?.best ? `${stats.scores['reaction-test'].best}ms` : '-'}
            </span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-label">Memory Record</span>
            <span className="stat-value">
              {stats.scores['memory-match']?.best ? `${stats.scores['memory-match'].best} moves` : '-'}
            </span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-label">Sudoku Best</span>
            <span className="stat-value">
              {stats.scores['sudoku-easy']?.best ? `${Math.floor(stats.scores['sudoku-easy'].best / 60)}:${(stats.scores['sudoku-easy'].best % 60).toString().padStart(2, '0')}` : '-'}
            </span>
          </div>
        </div>
      </section>

      {dailyGame && (
        <section className="daily-challenge mb-4">
          <h2 className="section-title mb-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={24} /> Daily Challenge
          </h2>
          <div className={`card daily-card ${isDailyCompleted ? 'completed' : ''}`}>
            <div className="daily-info">
              <h3>{dailyGame.title}</h3>
              <p>{dailyGame.description}</p>
            </div>
            <div className="daily-action">
              {isDailyCompleted ? (
                <div className="completed-badge">
                  <CheckCircle size={20} /> Completed
                </div>
              ) : (
                <Link to={`/game/${dailyGame.id}`} className="btn-primary">
                  Play Challenge
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="game-library">
        <h2 className="section-title mb-2">Game Library</h2>
        <div className="game-grid">
          {GAMES.map(game => (
            <GameCard key={game.id} {...game} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
