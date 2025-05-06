// src/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Course   = require('./models/Course');
const Module   = require('./models/Module');
const User     = require('./models/User');

async function main() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB');

  // 1. Clear existing data (comment out if you don’t want this)
  await Promise.all([
    Course.deleteMany({}),
    Module.deleteMany({}),
    User.deleteMany({}),
  ]);
  console.log('Cleared old data');

  // 2. Create modules
  const moduleDocs = [];
  for (let i = 1; i <= 8; i++) {
    const mod = await Module.create({
      courseId: null,        // fill in after course creation
      index: i,
      title: `Module ${i}`,
      slideUrl: `https://example.com/slides/module${i}.pdf`,
      videoUrl: `https://example.com/videos/module${i}.mp4`,
      text: `This is the content for module ${i}.`,
      quiz: {
        passingScore: 1,
        questions: [
          {
            prompt: `What is 2 + ${i}?`,
            options: ['1', `${i}`, `${i+2}`, '42'],
            correctAnswer: `${i+2}`
          }
        ]
      }
    });
    moduleDocs.push(mod);
  }
  console.log('Created modules');

  // 3. Create course, referencing those modules
  const course = await Course.create({
    title: 'Example Course',
    description: 'A demo course with 8 modules.',
    modules: moduleDocs.map(m => m._id)
  });
  console.log('Created course:', course._id);

  // 4. Patch each module’s courseId
  await Promise.all(
    moduleDocs.map(m => 
      Module.findByIdAndUpdate(m._id, { courseId: course._id })
    )
  );
  console.log('Linked modules to course');

  // 5. Create a demo user
  await User.create({
    email: 'free@example.com',
    passwordHash: await require('bcrypt').hash('password', 10),
    role: 'free',
    enrolledCourses: [],   // free users get only first module unlocked upon enroll
    moduleProgress: []
  });
  console.log('Created demo user: free@example.com / password');

  console.log('Seeding complete.');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
