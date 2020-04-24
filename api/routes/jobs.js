var express = require('express');
var router = express.Router();
var jobController = require('../controllers/jobController');


/* GET single job */
router.get('/:jobId', jobController.getJob);

/* Get all jobs listings*/
router.get('/', jobController.getAllJobs);

/* Post a job */
//
// {
//	"title":"Need some help with my land",
//	"employer":"5ea33f2bef8dad2e2859d906", 
//	"location":[24, 40], 
//	"numberOfPeople": 4, 
//	"description": "Job to cultivate my land"
//   }
//
//
router.post('/createJob', jobController.createJob);

/*Apply for a job */
// 
// {
//	"jobId":"5ea35ef3c58a5f4054a6ec0c",
//  "userId":"5ea337cecab858691060aa45",
// }
//
//
router.patch('/apply', jobController.applyJob);

module.exports = router;