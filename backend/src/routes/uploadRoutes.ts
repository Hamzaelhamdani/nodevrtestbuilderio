import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();

// Compatible __dirname for ESM or CommonJS
let __localDir;
try {
  __localDir = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));
} catch (e) {
  __localDir = process.cwd();
}

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use __dirname to get absolute path relative to this file
    const uploadDir = path.join(__localDir, '..', '..', '..', 'uploads', 'images');
    
    console.log('📁 Upload destination:', uploadDir);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('📁 Created upload directory:', uploadDir);
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Single image upload endpoint
router.post('/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Generate URL for the uploaded image
    const imageUrl = `/api/uploads/images/${req.file.filename}`;
    
    console.log('✅ Image uploaded successfully:', req.file.filename);
    
    res.json({
      success: true,
      imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('❌ Image upload error:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

// Multiple images upload endpoint
router.post('/upload-images', upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ error: 'No image files provided' });
    }

    const files = req.files as Express.Multer.File[];
    const imageUrls = files.map(file => `/api/uploads/images/${file.filename}`);
    
    console.log('✅ Multiple images uploaded successfully:', files.map(f => f.filename));
    
    res.json({
      success: true,
      imageUrls,
      files: files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        url: `/api/uploads/images/${file.filename}`
      }))
    });
  } catch (error) {
    console.error('❌ Multiple images upload error:', error);
    res.status(500).json({ error: 'Images upload failed' });
  }
});

// Test route to serve images directly
router.get('/test-image/:filename', (req, res) => {
  const { filename } = req.params;
  const imagePath = path.join(process.cwd(), 'uploads', 'images', filename);
  
  console.log('🖼️ Test image request for:', filename);
  console.log('🔍 Looking for file at:', imagePath);
  
  if (fs.existsSync(imagePath)) {
    console.log('✅ File found, serving image');
    res.sendFile(imagePath);
  } else {
    console.log('❌ File not found');
    res.status(404).json({ error: 'Image not found' });
  }
});

// Debug route to check database
router.get('/debug-products', async (req, res) => {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        price: true,
        inventory: true
      }
    });
    
    console.log('🔍 Debug - Products in database:', products);
    res.json({ products });
  } catch (error) {
    console.error('❌ Debug error:', error);
    res.status(500).json({ error: 'Debug failed' });
  }
});

export default router;
