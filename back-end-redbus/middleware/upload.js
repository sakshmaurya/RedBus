const multer = require("multer");


// Store file in memory for Cloudinary upload
const storage = multer.memoryStorage();


const upload = multer({

    storage: storage,

    limits:{
        fileSize: 5 * 1024 * 1024 // 5MB
    }

});


// Add logging middleware
const uploadWithLogging = (fieldName, maxCount) => {
  return (req, res, next) => {
    console.log("=== Upload Middleware ===");
    console.log("Content-Type:", req.get('content-type'));
    console.log("Body keys:", Object.keys(req.body));
    console.log("Expected field name:", fieldName);
    console.log("Max count:", maxCount);

    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err) {
        console.log("Multer error:", err);
        return res.status(400).json({
          success: false,
          message: "File upload error: " + err.message
        });
      }

      console.log("Files processed by multer:", req.files ? req.files.length : 0);
      if (req.files) {
        req.files.forEach((file, index) => {
          console.log(`File ${index + 1}:`, {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            buffer: file.buffer ? `Buffer length: ${file.buffer.length}` : "No buffer"
          });
        });
      }

      next();
    });
  };
};


module.exports = uploadWithLogging;