const Course = require('../models/Course');

exports.getAll = () =>
  Course.find();

exports.getDetail = (courseId) =>
  Course.findById(courseId).populate('modules');
