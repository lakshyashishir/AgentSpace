const express = require('express');
const workflowsRouter = require('./workflows');
const agentsRouter = require('./agents');
const marketplaceRouter = require('./marketplace');
const usersRouter = require('./users');

const router = express.Router();

router.use('/workflows', workflowsRouter);
router.use('/agents', agentsRouter);
router.use('/marketplace', marketplaceRouter);
router.use('/users', usersRouter);

module.exports = router;