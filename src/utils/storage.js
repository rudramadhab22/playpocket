const STORAGE_KEY = 'playpocket_data';

const getStorageData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse localStorage data', e);
      return {};
    }
  }
  return {
    scores: {},
    gamesPlayed: 0,
    dailyCompleted: {} // Format: { "YYYY-MM-DD": ["game-id"] }
  };
};

const saveStorageData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const saveScore = (gameId, score, isHigherBetter = true) => {
  const data = getStorageData();
  const timestamp = new Date().toISOString();

  if (!data.scores[gameId]) {
    // Note: Converting old history to object array if needed could be done here,
    // but for simplicity we assume history gets a timestamp going forward.
    data.scores[gameId] = { best: score, history: [{ score, timestamp }] };
  } else {
    const currentBest = data.scores[gameId].best;
    let isNewBest = false;

    if (isHigherBetter) {
      isNewBest = score > currentBest;
    } else {
      isNewBest = score < currentBest;
    }

    if (isNewBest) {
      data.scores[gameId].best = score;
    }

    // Support legacy arrays that just had numbers
    if (typeof data.scores[gameId].history[0] === 'number') {
      data.scores[gameId].history = data.scores[gameId].history.map(s => ({score: s, timestamp: new Date(0).toISOString()}));
    }

    data.scores[gameId].history.push({ score, timestamp });
  }

  // Track daily completion
  const today = new Date().toISOString().split('T')[0];
  if (!data.dailyCompleted) data.dailyCompleted = {};
  data.dailyCompleted[today] = data.dailyCompleted[today] || [];
  if (!data.dailyCompleted[today].includes(gameId)) {
    data.dailyCompleted[today].push(gameId);
  }

  data.gamesPlayed = (data.gamesPlayed || 0) + 1;
  saveStorageData(data);
  return data.scores[gameId].best;
};

export const getBestScore = (gameId) => {
  const data = getStorageData();
  return data.scores[gameId]?.best || null;
};

export const getStats = () => {
  const data = getStorageData();
  return {
    gamesPlayed: data.gamesPlayed || 0,
    scores: data.scores || {}
  };
};

export const getHistory = (gameId) => {
  const data = getStorageData();
  const history = data.scores[gameId]?.history || [];
  // Normalize legacy data
  return history.map(item => typeof item === 'number' ? {score: item, timestamp: new Date(0).toISOString()} : item);
};

export const hasCompletedToday = (gameId) => {
  const data = getStorageData();
  const today = new Date().toISOString().split('T')[0];
  if (!data.dailyCompleted || !data.dailyCompleted[today]) return false;
  return data.dailyCompleted[today].includes(gameId);
};
