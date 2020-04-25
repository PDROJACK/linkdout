var User = require('../models/userModel');
var _ = require('lodash');
const Job = require('../models/jobsModel');
const Application = require('../models/applicationModel');

const twilio = require('twilio')(process.env.SID,process.env.AUTH);

const getJob = async function(req,res,next){
    try {
        const jobId = req.params.jobId;
        const job = await Job.findById(jobId).select('title location description employer employees budget');

        if(!job){
            return res.status(400).json({
                message: 'Job not found'
            });
        }

        res.status(200).send(job);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const createJob = async function(req,res,next) {
    try {
        const employerId = req.me._id;
        const user = await User.findById({_id:employerId});

        if(!user || user.isEmployer === false){
            return res.status(401).json({
                message : 'Only employer can create jobs'
            });
        }
        
        let job = new Job(_.pick(req.body,['title', 'numberOfPeople', 'description', 'budget']))
        job.employer = employerId;
        if(req.body.location){
            job.location = req.body.location
        }

        if(req.files){
            let images=[]
            if(req.files.length>0){
                req.files.forEach(file => {
                    images.push(file.path)
                });
            }
            job.images = images
        }

        const users = await User.find({isEmployer: false});
        
        job = await job.save();

        Promise.all(users.map(async (user)=>{
            await twilio.messages.create({
                body: `Hey ${user.username}, a job is for you is available Job Id is ${job._id}`,
                from: process.env.PHONE,
                to: user.phone
            });
        }));
        
        res.status(200).json({_id: job._id})
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
                employees: userId,
            }
        });

        const application = new Application({
            job: jobId,
            employee: userId         
        });
        
        if(req.body.comment){
            application.comment = comment
        }
        
        await application.save();

        res.status(200).send({
            message: "Successfully applied for job"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

module.exports = {
    getJob,
    createJob,
    getAllJobs,
    applyJob
}