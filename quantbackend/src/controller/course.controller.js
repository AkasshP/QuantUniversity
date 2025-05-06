// File: backend/src/controllers/course.controller.js

const Course = require('../models/Course');

/**
 * List all courses
 */
exports.getAll = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};

/**
 * Get a single course along with the user's progress map
 */
exports.getDetail = async (req, res) => {
  const course = await Course.findById(req.params.courseId).lean();
  const progressMap = {};
  req.user.moduleProgress
    .filter(p => p.courseId.toString() === course._id.toString())
    .forEach(p => {
      progressMap[p.moduleId] = p;
    });
  res.json({ course, progress: progressMap });
};

/**
 * Unlock a single module — and if the user was 'free', promote to 'subscriber'
 */
exports.subscribeModule = async (req, res) => {
  const { courseId, moduleId } = req.params;

  // If they're still free, promote them to subscriber
  if (req.user.role === 'free') {
    req.user.role = 'subscriber';
  }

  // Only push if we haven't already unlocked it
  const already = req.user.moduleProgress.some(p =>
    p.moduleId.equals(moduleId)
  );
  if (!already) {
    req.user.moduleProgress.push({
      courseId,
      moduleId,
      unlocked: true,
      completed: false,
      quizScore: 0
    });
  }

  await req.user.save();
  res.json({ success: true, role: req.user.role });
};

/**
 * Upgrade the user to premium and unlock every module in every course
 */
exports.upgradePremium = async (req, res) => {
  req.user.role = 'premium';

  // Fetch all courses + their modules
  const courses = await Course.find().populate('modules');
  for (const course of courses) {
    for (const mod of course.modules) {
      const exists = req.user.moduleProgress.some(p =>
        p.moduleId.equals(mod._id)
      );
      if (!exists) {
        req.user.moduleProgress.push({
          courseId: course._id,
          moduleId: mod._id,
          unlocked: true,
          completed: false,
          quizScore: 0
        });
      }
    }
  }

  await req.user.save();
  res.json({ success: true, role: req.user.role });
};

const User = require('../models/User');
const PDFDocument = require('pdfkit'); // or whatever PDF lib you prefer
const fs = require('fs');
const path = require('path');

exports.getCertificate = async (req, res) => {
  const { courseId } = req.params;
  const user = req.user;

  // Check completion: ensure all modules in that course are completed
  const course = await Course.findById(courseId).populate('modules');
  const incompletes = course.modules.filter(m =>
    !user.moduleProgress.some(p =>
      p.moduleId.equals(m._id) && p.completed
    )
  );
  if (incompletes.length) {
    return res.status(403).json({ error: 'Complete all modules first' });
  }

  // Generate a simple PDF certificate (or deliver a pre­made one)
  const doc = new PDFDocument();
  const filename = `certificate-${user._id}-${courseId}.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  doc.fontSize(24).text('Certificate of Completion', { align: 'center' });
  doc.moveDown();
  doc.fontSize(16).text(`This certifies that ${user.email}`, { align: 'center' });
  doc.text(`has completed the course "${course.title}".`, { align: 'center' });
  doc.moveDown();
  doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });
  doc.end();

  // Pipe PDF back to client
  doc.pipe(res);
};

