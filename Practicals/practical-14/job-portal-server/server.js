const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3001;

// Serve static files from public directory
app.use(express.static('public'));

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // 2MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('resume');

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /pdf/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Only PDF files are allowed!');
  }
}

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).send('File too large. Maximum size is 2MB.');
      } else {
        res.status(400).send(err);
      }
    } else {
      if (req.file == undefined) {
        res.status(400).send('No file selected!');
      } else {
        res.send('Resume uploaded successfully!');
      }
    }
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
