// File: backend/controllers/certificateController.js

const PDFDocument = require('pdfkit');
const User        = require('../models/User');

exports.getCertificate = async (req, res, next) => {
  try {
    // 1) Eligibility check
    const user = await User.findById(req.user._id)
      .select('name totalScore moduleProgress')
      .lean();
    if (!user) {
      return res.status(404).json({ 
        eligible: false, 
        message: 'User not found',
        totalScore: 0 
      });
    }

    const requiredModules = 8;
    const userScore       = user.totalScore || 0;

    if (userScore < requiredModules) {
      return res.status(403).json({
        eligible: false,
        message: `Complete all ${requiredModules} modules first`,
        totalScore: userScore
      });
    }

    // 2) If eligible, respond with flag + no downloadUrl needed
    return res.json({
      eligible: true,
      message: 'You’ve earned your certificate!',
      totalScore: userScore
    });

  } catch (err) {
    next(err);
  }
};

exports.downloadCertificate = async (req, res, next) => {
  try {
    // 1) Re‑check eligibility
    const user = await User.findById(req.user._id)
      .select('name email totalScore moduleProgress')
      .lean();
    if (!user) return res.status(404).send('User not found');

    const requiredModules = user.moduleProgress.length || 8;
    if ((user.totalScore || 0) < requiredModules) {
      return res.status(403).send('Not eligible for certificate');
    }

    // 2) Prepare response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${req.user._id}-certificate.pdf"`
    );

    // 3) Create PDF
    const doc = new PDFDocument({ size: 'A4', margin: 60 });
    doc.pipe(res);

    const { width } = doc.page;

    // Helper to center text
    function center(text, y, opts = {}) {
      const textWidth = doc.widthOfString(text, opts);
      doc.text(text, (width - textWidth) / 2, y, opts);
    }

    // 4) Draw title
    doc.fontSize(32).fillColor('#333');
    center('Certificate of Completion', 80, { underline: true });

    // 5) Subtitle
    doc.moveDown(2)
       .fontSize(16)
       .fillColor('#555');
    center('This certifies that', 150);

    // 6) Learner name
    doc.moveDown(2)
       .fontSize(24)
       .fillColor('#000')
       .font('Helvetica-Bold');
    center(user.name || 'Learner', 190, { underline: true });

    // 7) Learner email
    doc.moveDown(1)
       .fontSize(12)
       .fillColor('#777')
       .font('Helvetica-Oblique');
    center(user.email, 230);

    // 8) Achievement text
    doc.moveDown(2)
       .fontSize(14)
       .fillColor('#333')
       .font('Helvetica');
    center(
      `has successfully completed all modules`,
      270
    );
    center(
      `with a score of ${user.totalScore}`,
      295
    );

    // 9) Date & footer
    const today = new Date().toLocaleDateString();
    doc.fontSize(10).fillColor('#555');
    center(`Date: ${today}`, 340);

    doc.fontSize(12).fillColor('#999');
    center('AI Academy', 380);

    // 10) Finalize
    doc.end();
  } catch (err) {
    next(err);
  }
};