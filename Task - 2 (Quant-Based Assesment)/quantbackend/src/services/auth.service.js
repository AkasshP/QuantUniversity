const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

exports.register = async ({ email, password, role }) => {
  const hash = await bcrypt.hash(password, 10);
  return User.create({ email, passwordHash: hash, role });
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.passwordHash)) {
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return { token };
};
