// Calculate similarity between two code strings
const calculateSimilarity = (code1, code2) => {
  // Normalize code - remove whitespace, comments, variable names
  const normalize = (code) => {
    return code
      .replace(/\/\/.*$/gm, '') // remove single line comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // remove multi-line comments
      .replace(/\s+/g, ' ') // normalize whitespace
      .replace(/["'`].*?["'`]/g, 'STR') // replace strings
      .replace(/\b\d+\b/g, 'NUM') // replace numbers
      .trim()
      .toLowerCase();
  };

  const normalized1 = normalize(code1);
  const normalized2 = normalize(code2);

  // Jaccard similarity on token level
  const tokens1 = new Set(normalized1.split(' '));
  const tokens2 = new Set(normalized2.split(' '));

  const intersection = new Set([...tokens1].filter(t => tokens2.has(t)));
  const union = new Set([...tokens1, ...tokens2]);

  const jaccardScore = intersection.size / union.size;

  // LCS (Longest Common Substring) based similarity
  const lcsLength = longestCommonSubstring(normalized1, normalized2);
  const lcsScore = (2 * lcsLength) / (normalized1.length + normalized2.length);

  // Combined score
  const similarity = Math.round(((jaccardScore * 0.4) + (lcsScore * 0.6)) * 100);

  return Math.min(similarity, 100);
};

// Longest Common Substring algorithm
const longestCommonSubstring = (str1, str2) => {
  const m = Math.min(str1.length, 500); // limit for performance
  const n = Math.min(str2.length, 500);
  let maxLen = 0;

  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        maxLen = Math.max(maxLen, dp[i][j]);
      }
    }
  }
  return maxLen;
};

// Check plagiarism level
const getPlagiarismLevel = (similarity) => {
  if (similarity >= 80) return { level: 'High', color: 'red' };
  if (similarity >= 50) return { level: 'Medium', color: 'yellow' };
  return { level: 'Low', color: 'green' };
};

module.exports = { calculateSimilarity, getPlagiarismLevel };