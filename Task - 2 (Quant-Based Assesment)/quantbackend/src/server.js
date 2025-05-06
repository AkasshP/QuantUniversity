require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const connectDB    = require('./config/db');
const authRoutes   = require('./routes/auth.routes');
const courseRoutes = require('./routes/course.routes');
const moduleRoutes = require('./routes/module.routes');


const app = express();
connectDB(process.env.MONGO_URI);

app.use(cors());
app.use(express.json());

app.use('/api/auth',               authRoutes);
app.use('/api/courses',            courseRoutes);
app.use('/api/courses/:courseId/modules', moduleRoutes);
app.use('/api/certificate', require('./routes/certficate.routes'));
app.get('/api/health', (req, res) => res.send('OK'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
