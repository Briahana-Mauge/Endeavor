const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');


const s3 = new AWS.S3({
    accessKeyId: process.env.KEY_ID,
    secretAccessKey: process.env.SECRET_KEY,
    region: 'us-east-2',
})

const storage = multerS3({
    s3: s3,
    bucket: 'pursuit-volunteer-management',
    acl: 'public-read',
    metadata: function (request, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (request, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname)
    }
})


const fileFilter = (request, file, cb) => {
    if (file.mimetype.slice(0, 6) === 'image/') {
        cb(null, true)
    } else {
        console.log('File is NOT an image')
        cb(null, false)
        // cb(new Error('Only image files are accepted'))
    }
}

const upload = multer({
    storage, 
    fileFilter,
    limits: { fileSize: 3000000 }, // In bytes: 3000000 bytes = 3 MB
})

const deleteFile = (fileLink) => {
    // ####### REMINDER: CHANGE THE LENGTH IF BUCKET NAME CHANGES
    const fileName = fileLink.slice(64); // https://pursuit-volunteer-management.s3.us-east-2.amazonaws.com/ BASE LINK LENGTH IS 54
    const params = {
        Bucket: 'pursuit-volunteer-management',
        Key: fileName
    };
    
    s3.deleteObject(params, function (err, data) {
        if (data) {
            console.log("File deleted successfully", data);
        }
        else {
            console.log(`Check if you have sufficient permissions : ${err}`);
        }
    });
}

module.exports = {
    upload,
    deleteFile,
}