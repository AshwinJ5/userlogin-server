const multer = require("multer");
const fs = require("fs");

const ensureDirExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        let uploadDir = "./Uploads"; 

        if (req.originalUrl.includes("brands")) {
            uploadDir = "./Uploads/brands";
        }

        ensureDirExists(uploadDir); 
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        const filename = `IMG${Date.now()}-${file.originalname}`;
        callback(null, filename);
    }
});

const fileFilter = (req, file, callback) => {
    if (["image/png", "image/jpeg", "image/jpg"].includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(null, false);
        return callback(new Error("Please upload jpeg/jpg/png format "));
    }
};

const multerConfig = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = multerConfig;
