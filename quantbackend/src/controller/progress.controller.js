// File: src/controller/progress.controller.js

const User = require('../models/User');

exports.submitModuleQuiz = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const userId       = req.user._id;
    const { score }    = req.body;  // front-end has already summed the points

    // 1) Persist this module’s quizScore and mark it completed
    await User.updateOne(
      { _id: userId, 'moduleProgress.moduleId': moduleId },
      {
        $set: {
          'moduleProgress.$.quizScore': score,
          'moduleProgress.$.completed': true
        }
      }
    );

    // 2) Recompute the user's totalScore across all modules
    const user = await User.findById(userId).select('moduleProgress');
    const totalScore = user.moduleProgress.reduce(
      (sum, entry) => sum + (entry.quizScore || 0),
      0
    );

    // 3) Persist the new totalScore
    user.totalScore = totalScore;
    await user.save();

    // 4) Return both scores
    return res.json({
      quizScore: score,
      totalScore
    });
  } catch (err) {
    return next(err);
  }
};
