const router = require('express').Router();
const candidateController = require('./candidate.controller');

router.get('/',candidateController.getCandidates);
router.get('/job/:loginId',candidateController.getCandidateJobs)
router.post('/appliedformorejobs',candidateController.setCandidates2)

router.get('/:loginId',candidateController.getCandidateById)
router.post('/:loginId',candidateController.updateCandidateById)
//router.post('/',candidateController.setCandidates)
router.post('/',candidateController.setCandidates);


module.exports = router;

