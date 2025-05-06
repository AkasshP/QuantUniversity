const moduleService = require('../services/module.service');
// const Course = require('../models/Course');
// const Module = require('../models/Module');

// exports.getOne = async (req, res) => {
//   const prog = req.user.moduleProgress.find(
//     p => p.moduleId.toString() === req.params.moduleId
//   );
//   if (!prog?.unlocked) return res.json({ locked: true });
//   const mod = await moduleService.getById(req.params.moduleId);
//   res.json(mod);
// };

// File: src/controllers/module.controller.js

const Course = require('../models/Course');
const Module = require('../models/Module');

exports.getModule = async (req, res, next) => {
  try {
    const { courseId, moduleId } = req.params;

    // 1) Fetch the course so we know the order of modules
    const course = await Course.findById(courseId).lean();
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // 2) Fetch the module itself
    const module = await Module.findById(moduleId).lean();
    if (!module) return res.status(404).json({ error: 'Module not found' });

    // 3) Determine the "first" module ID from the course
    const firstModuleId = String(course.modules[0]);

    // 4) See if the user has explicitly unlocked this module
    const progEntry = req.user.moduleProgress.find(
      p => String(p.moduleId) === moduleId
    );

    // 5) Unlocked if:
    //    • they’ve bought it (progEntry.unlocked === true)
    //    • OR it's the very first module in this course
    const unlocked = progEntry?.unlocked === true || moduleId === firstModuleId;

    if (!unlocked) {
      return res.json({ locked: true });
    }

    // 6) If unlocked, return the module data + total module count
    const totalModules = await Module.countDocuments({ courseId });

    return res.json({
      ...module,
      totalModules,
      locked: false
    });

  } catch (err) {
    next(err);
  }
};


exports.complete = async (req, res, next) => {
    try {
      const { courseId, moduleId } = req.params
      const { score } = req.body
  
      // 1) Find this module in the user’s progress
      const prog = req.user.moduleProgress.find(p =>
        p.moduleId.toString() === moduleId
      )
      if (!prog || !prog.unlocked) {
        return res.status(403).json({ error: 'Module not unlocked' })
      }
  
      // 2) Record completion and their quiz score
      prog.completed   = true
      prog.quizScore   = score
  
      await req.user.save()
  
      return res.json({ success: true })
    } catch (err) {
      next(err)
    }
  }


  exports.purchaseModule = async (req, res, next) => {
    try {
      const { courseId, moduleId } = req.params
  
      // Only add progress entry if not already present
      const exists = req.user.moduleProgress.some(p =>
        p.moduleId.toString() === moduleId
      )
      if (!exists) {
        req.user.moduleProgress.push({
          courseId,
          moduleId,
          unlocked: true,
          completed: false,
          quizScore: 0
        })
        await req.user.save()
      }
  
      res.json({ success: true })
    } catch (err) {
      next(err)
    }
  }

// Add this to the top alongside getOne & complete:
exports.getQuiz = async (req, res, next) => {
    try {
      const { courseId, moduleId } = req.params;
  
      // 1) Check that course exists (optional here, but good to validate)
      const course = await Course.findById(courseId).lean();
      if (!course) return res.status(404).json({ error: 'Course not found' });
  
      // 2) See if user has an explicit unlock
      const progEntry = req.user.moduleProgress.find(
        p => String(p.moduleId) === moduleId
      );
  
      // 3) Fetch the module
      const mod = await Module.findById(moduleId).lean();
      if (!mod) return res.status(404).json({ error: 'Module not found' });
  
      // 4) Unlocked if they bought it OR it's the very first module
      const unlocked = progEntry?.unlocked === true || mod.index === 0;
      if (!unlocked) {
        return res.status(403).json({ error: 'Module locked' });
      }
  
      // 5) Finally, return up to 10 questions
      return res.json({
        questions: (mod.quiz?.questions || []).slice(0, 10),
        passingScore: mod.quiz?.passingScore ?? 0
      });
    } catch (err) {
      next(err);
    }
  };
  
  


