const Module = require('../models/Module');

exports.getById = (moduleId) =>
  Module.findById(moduleId).lean();
