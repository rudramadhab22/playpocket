import { useEffect, useState } from 'react';
import { Brain, Zap, Type } from 'lucide-react';
import GameCard from '../components/GameCard';
import { getStats } from '../utils/storage';
import './Home.css';

const GAMES = [
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
  }
];

const Home = () => {
  const [stats, setStats] = useState({ gamesPlayed: 0, scores: {} });

  useEffect(() => {
    setStats(getStats());
  }, []);

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
        </div>
      </section>

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
