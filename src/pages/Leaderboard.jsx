import { useState, useEffect } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { getHistory } from '../utils/storage';
import { GAMES } from './Home';
import './Leaderboard.css';

const SCORE_RULES = {
  'memory-match': { label: 'Moves', higherIsBetter: false },
  'reaction-test': { label: 'ms', higherIsBetter: false },
  'word-guess': { label: 'Attempts', higherIsBetter: false },
  'number-puzzle': { label: 'Moves', higherIsBetter: false },
  'sudoku-easy': { label: 'Time', higherIsBetter: false, format: (val) => `${Math.floor(val / 60)}:${(val % 60).toString().padStart(2, '0')}` }
};

// We manually add sudoku variants to the list if needed, or just use easy for now.
const LEADERBOARD_GAMES = [
  ...GAMES.filter(g => g.id !== 'sudoku'),
  { id: 'sudoku-easy', title: 'Sudoku' }
];

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState(LEADERBOARD_GAMES[0].id);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const rawHistory = getHistory(activeTab);
    const rules = SCORE_RULES[activeTab];

    // Sort logic
    const sorted = [...rawHistory].sort((a, b) => {
      if (rules.higherIsBetter) return b.score - a.score;
      return a.score - b.score;
    });

    // Take top 5
    setHistory(sorted.slice(0, 5));
  }, [activeTab]);

  const rules = SCORE_RULES[activeTab];

  const getRankIcon = (index) => {
    switch(index) {
      case 0: return <Trophy size={20} color="#FFD700" />; // Gold
      case 1: return <Medal size={20} color="#C0C0C0" />;   // Silver
      case 2: return <Award size={20} color="#CD7F32" />;   // Bronze
      default: return <span className="rank-num">{index + 1}</span>;
    }
  };

  return (
    <div className="leaderboard-container animate-fade-in">
      <div className="text-center mb-4">
        <h1 className="hero-title">
          <Trophy className="inline-icon" size={32} /> Local Leaderboards
        </h1>
        <p className="hero-subtitle">Your top 5 personal bests across all games.</p>
      </div>

      <div className="tabs-container mb-4">
        {LEADERBOARD_GAMES.map(game => (
          <button
            key={game.id}
            className={`tab-btn ${activeTab === game.id ? 'active' : ''}`}
            onClick={() => setActiveTab(game.id)}
          >
            {game.title}
          </button>
        ))}
      </div>

      <div className="card leaderboard-card">
        {history.length > 0 ? (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Score</th>
                <th>Date Achieved</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, idx) => (
                <tr key={idx} className={idx === 0 ? 'first-place' : ''}>
                  <td className="rank-cell">{getRankIcon(idx)}</td>
                  <td className="score-cell">
                    {rules.format ? rules.format(entry.score) : entry.score} <span className="score-label">{rules.label}</span>
                  </td>
                  <td className="date-cell">
                    {new Date(entry.timestamp).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state text-center">
            <p>No scores recorded yet. Play a game to get on the board!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
