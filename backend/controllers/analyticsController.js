const Submission = require('../models/Submission');
const Interview = require('../models/Interview');
const PeerInterview = require('../models/PeerInterview');

const getMyAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all submissions
    const submissions = await Submission.find({ user: userId })
      .populate('problem', 'title difficulty topic');

    // Get all mock interviews
    const mockInterviews = await Interview.find({ user: userId });

    // Get all peer interviews
    const peerInterviews = await PeerInterview.find({
      $or: [{ initiator: userId }, { participant: userId }]
    });

    // Total submissions
    const totalSubmissions = submissions.length;

    // Accepted submissions
    const acceptedSubmissions = submissions.filter(
      (s) => s.status === 'Accepted'
    ).length;

    // Accuracy rate
    const accuracy = totalSubmissions > 0
      ? Math.round((acceptedSubmissions / totalSubmissions) * 100)
      : 0;

    // Problems solved by difficulty
    const easySolved = submissions.filter(
      (s) => s.status === 'Accepted' && s.problem?.difficulty === 'Easy'
    ).length;
    const mediumSolved = submissions.filter(
      (s) => s.status === 'Accepted' && s.problem?.difficulty === 'Medium'
    ).length;
    const hardSolved = submissions.filter(
      (s) => s.status === 'Accepted' && s.problem?.difficulty === 'Hard'
    ).length;

    // Weak topics
    const topicStats = {};
    submissions.forEach((s) => {
      const topic = s.problem?.topic;
      if (!topic) return;
      if (!topicStats[topic]) topicStats[topic] = { total: 0, accepted: 0 };
      topicStats[topic].total++;
      if (s.status === 'Accepted') topicStats[topic].accepted++;
    });

    const weakTopics = Object.entries(topicStats)
      .filter(([, stats]) => stats.total > 0)
      .map(([topic, stats]) => ({
        topic,
        accuracy: Math.round((stats.accepted / stats.total) * 100),
        total: stats.total
      }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3);

    // Topic distribution for pie chart
    const topicDistribution = Object.entries(topicStats).map(([topic, stats]) => ({
      name: topic,
      value: stats.total
    }));

    // Daily activity for last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
      const daySubmissions = submissions.filter(s => {
        const subDate = new Date(s.createdAt);
        return subDate.toDateString() === date.toDateString();
      }).length;
      last7Days.push({ day: dateStr, submissions: daySubmissions });
    }

    // Mock interview performance trend
    const mockInterviewTrend = mockInterviews
      .slice(-7)
      .map((interview, i) => ({
        name: `#${i + 1}`,
        score: interview.percentage,
        topic: interview.topic
      }));

    // Recent submissions
    const recentSubmissions = await Submission.find({ user: userId })
      .populate('problem', 'title difficulty topic')
      .sort({ createdAt: -1 })
      .limit(10);

    // Suggestions
    const suggestions = [];
    if (accuracy < 50) suggestions.push('Focus on understanding problem patterns before coding');
    if (easySolved < 5) suggestions.push('Solve more Easy problems to build confidence');
    if (mediumSolved < 3) suggestions.push('Try Medium difficulty problems to level up');
    if (mockInterviews.length < 3) suggestions.push('Take more AI Mock Interviews to improve');
    if (weakTopics.length > 0) suggestions.push(`Focus on ${weakTopics[0]?.topic} — your weakest topic`);
    if (suggestions.length === 0) suggestions.push('Great work! Keep practicing daily to maintain your skills!');

    res.status(200).json({
      totalSubmissions,
      acceptedSubmissions,
      accuracy,
      easySolved,
      mediumSolved,
      hardSolved,
      weakTopics,
      topicDistribution,
      last7Days,
      mockInterviewTrend,
      totalMockInterviews: mockInterviews.length,
      totalPeerInterviews: peerInterviews.length,
      avgMockScore: mockInterviews.length > 0
        ? Math.round(mockInterviews.reduce((sum, i) => sum + i.percentage, 0) / mockInterviews.length)
        : 0,
      recentSubmissions,
      suggestions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getMyAnalytics };