const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Helper to ensure directory exists
function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let type = req.uploadType;
    let id = req.uploadId;
    const uploadPath = path.join(__dirname, '../../uploads', type, id);
    ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Middleware to set upload type/id
function setUploadTypeId(typeField, idField) {
  return (req, res, next) => {
    req.uploadType = typeField;
    req.uploadId = req.body[idField] || req.params[idField];
    if (!req.uploadId) {
      return res.status(400).json({ success: false, message: 'Missing ID' });
    }
    next();
  };
}

// Avatar upload
router.post('/avatar', setUploadTypeId('avatar', 'userId'), upload.single('file'), (req, res) => {
  const fileUrl = `/uploads/avatar/${req.uploadId}/${req.file.originalname}`;
  res.json({ url: fileUrl, path: req.file.path, fullPath: fileUrl });
});

// Startup logo upload
router.post('/startup-logo', setUploadTypeId('startup-logo', 'startupId'), upload.single('file'), (req, res) => {
  const fileUrl = `/uploads/startup-logo/${req.uploadId}/${req.file.originalname}`;
  res.json({ url: fileUrl, path: req.file.path, fullPath: fileUrl });
});

// Structure logo upload
router.post('/structure-logo', setUploadTypeId('structure-logo', 'structureId'), upload.single('file'), (req, res) => {
  const fileUrl = `/uploads/structure-logo/${req.uploadId}/${req.file.originalname}`;
  res.json({ url: fileUrl, path: req.file.path, fullPath: fileUrl });
});

// Product image upload
router.post('/product-image', setUploadTypeId('product-image', 'productId'), upload.single('file'), (req, res) => {
  const fileUrl = `/uploads/product-image/${req.uploadId}/${req.file.originalname}`;
  res.json({ url: fileUrl, path: req.file.path, fullPath: fileUrl });
});

// Delete file
router.delete('/:type/:id/:fileName', (req, res) => {
  const { type, id, fileName } = req.params;
  const filePath = path.join(__dirname, '../../uploads', type, id, fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: 'File not found' });
  }
});

module.exports = router; 