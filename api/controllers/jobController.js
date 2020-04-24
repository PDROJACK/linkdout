var User = require('../models/userModel');
var _ = require('lodash');
const Job = require('../models/jobsModel');

const getJob = async function(req,res,next){
    try {
        const jobId = req.params.jobId;
        const job = await Job.findById(jobId).select('title location description');

        if(!job){
            return res.status(400).json({
                message: 'Job not found'
            });
        }

        res.status(200).send(job);
    } catch (error) {
        res.status(500).json(error);
    }
};

const createJob = async function(req,res,next) {
    try {
        const employerId = req.body.employer;
        const user = await User.findById(employerId);
        if(!user || !user.isEmployer){
            return res.status(401).json({
                message : 'Only employer can create jobs'
            });
        }
        
        const job = new Job(_.pick(req.body,['title', 'employer', 'location', 'numberOfPeople', 'description']))
        
        await job.save();
        res.status(200).json({
            message: "Job created"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getAllJobs = async function(req,res,next){
    try {
        const jobs = await Job.find().select('title location description');
        if(jobs.length===0){
            return res.status(400).json({
                message: "No job at the moment"
            })
        }
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json(error);
    }
}

const applyJob = async function(req,res,next){
    try {
        const userId = req.body.userId;
        const jobId = req.body.jobId;
        const user = await User.findById(userId);
        
        if(user.isEmployer === true){
            return res.status(400).json({
                message: "Employer can't apply for jobs"
            });
        }

        const job = await Job.findById(jobId);

        if(!job){
            return res.status(400).json({
                message: "Job not found"
            });
        }

        await Job.updateOne({_id: jobId}, {
            $addToSet: {
                employees: userId
            }
        });

        res.status(200).send({
            message: "Successfully applied for job"
        });
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = {
    getJob,
    createJob,
    getAllJobs,
    applyJob
}