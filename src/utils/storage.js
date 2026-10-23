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
    gamesPlayed: 0
  };
};

const saveStorageData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const saveScore = (gameId, score, isHigherBetter = true) => {
  const data = getStorageData();

  if (!data.scores[gameId]) {
    data.scores[gameId] = { best: score, history: [score] };
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
    data.scores[gameId].history.push(score);
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
