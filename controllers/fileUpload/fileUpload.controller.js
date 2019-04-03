const CandidateData = require('../../models/candidate.model')
const multer=require('multer')
const path=require('path')
// require('../../')
module.exports = {

    setFileUpload: (req, res) => {

        console.log('req.file is:',req.file);
        console.log('req.files is:',req.files);
        console.log('req.params.id:',req.params)


       console.log('resume:',req.files.myImage1[0].filename)
       console.log('video',req.files.myImage2[0].filename)

        console.log('here in fileupload')
        console.log('req.body is:',JSON.stringify(req.body))
        // AssignInterviewerData.findOneAndUpdate({ jobId: req.params.jobId, candidate_id: req.params.candidateId }, {
        //     $set: {
        //       active: req.body.active
        //     }
        //   }, { new: true }, (err, assigninterviewerdata1) => {
      
        //     console.log('assigninterviewerdata1 is:', assigninterviewerdata1);
        //     console.log(assigninterviewerdata1);
        //   });

        CandidateData.findOneAndUpdate({_id:req.params.id},{
            $set:{
                'PersonalInfo.resume':req.files.myImage1[0].filename,
                'PersonalInfo.video':req.files.myImage2[0].filename
            } 
        },{new:true},(err,res)=>{
            console.log('result is:',res)
        } );
        //console.log('req.body.obj',req.body.obj)
        res.json('test');
        
    },

    getFileUpload:(req,res)=>{
        console.log('**********');
        res.sendFile(path.resolve(`${__dirname}/../../public/uploads/${req.params.filename}`))

    }
    
}