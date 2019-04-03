let multer = require('multer'),
    path = require('path');
const router = require('express').Router();




const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function (req, file, cb) {
        console.log("THROUGH CALL BACK");
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});

module.exports = {
    candidateUploads: upload.fields([
        {
            name: "myImage1",
            maxCount: 1
        },
        {
            name: "myImage2",
            maxCount: 1
        }
    ])
}
