import axios from 'axios';

// Fetch LeetCode public stats using GraphQL
export const fetchLeetCodeStats = async (username) => {
  try {
    const query = `query getUserProfile($username: String!) {\n  matchedUser(username: $username) {\n    username\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n    profile {\n      ranking\n    }\n  }\n}`;

    const res = await axios.post('https://leetcode.com/graphql', {
      query,
      variables: { username },
    }, {
      headers: { 'Content-Type': 'application/json' },
    });

    const data = res.data?.data?.matchedUser;
    if (!data) return { error: 'User not found or profile private' };

    const ac = data.submitStats?.acSubmissionNum || [];
    const result = { username: data.username, ranking: data.profile?.ranking || null };
    ac.forEach((item) => {
      const key = item.difficulty?.toLowerCase() || 'total';
      result[`${key}Count`] = item.count || 0;
    });
    return result;
  } catch (error) {
    console.error('LeetCode fetch error:', error.message || error);
    return { error: 'Failed to fetch LeetCode data' };
  }
};

// Fetch GitHub public stats via REST API
export const fetchGitHubStats = async (username) => {
  try {
    const res = await axios.get(`https://api.github.com/users/${encodeURIComponent(username)}`);
    const user = res.data;
    // Fetch repos to sum stars (may be paginated; we'll fetch first page up to 100)
    const reposRes = await axios.get(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100`);
    const repos = reposRes.data || [];
    const stars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
    return {
      username: user.login,
      name: user.name,
      repos: user.public_repos,
      followers: user.followers,
      following: user.following,
      stars,
      topLanguages: [],
    };
  } catch (error) {
    console.error('GitHub fetch error:', error.message || error);
    return { error: 'Failed to fetch GitHub data' };
  }
};

// Controller wrappers for express
export const getLeetCode = async (req, res) => {
  try {
    const { username } = req.params;
    const data = await fetchLeetCodeStats(username);
    if (data.error) return res.status(404).json({ message: data.error });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching LeetCode data' });
  }
};

export const getGitHub = async (req, res) => {
  try {
    const { username } = req.params;
    const data = await fetchGitHubStats(username);
    if (data.error) return res.status(404).json({ message: data.error });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching GitHub data' });
  }
};
