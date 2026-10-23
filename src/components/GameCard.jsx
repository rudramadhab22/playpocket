import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import './GameCard.css';

const GameCard = ({ id, title, description, icon: Icon, tag }) => {
  return (
    <div className="game-card card animate-fade-in">
      <div className="game-card-header">
        <div className="game-icon-wrapper">
          <Icon size={32} color="var(--color-secondary)" />
        </div>
        {tag && <span className="game-tag">{tag}</span>}
      </div>
      <h3 className="game-title">{title}</h3>
      <p className="game-desc">{description}</p>
      <Link to={`/game/${id}`} className="play-button btn-primary">
        <Play size={18} fill="currentColor" /> Play Now
      </Link>
    </div>
  );
};

export default GameCard;
