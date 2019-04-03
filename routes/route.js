const router = require('express').Router();
const apiRoutes = require('../controllers/index');

router.use('/api', apiRoutes);


module.exports = router;