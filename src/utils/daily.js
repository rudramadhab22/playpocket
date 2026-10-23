// Helper to consistently map a date to one of our games.

const AVAILABLE_GAMES = [
  'memory-match',
  'reaction-test',
  'word-guess',
  'number-puzzle',
  'sudoku'
];

export const getDailyChallengeGame = () => {
  const today = new Date();

  // Use Year + Month + Date as a deterministic seed.
  // E.g., 20231023
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  const index = seed % AVAILABLE_GAMES.length;

  return AVAILABLE_GAMES[index];
};
