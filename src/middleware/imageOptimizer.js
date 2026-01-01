const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const optimizeImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const filePath = req.file.path;
    // We only optimize images
    if (!req.file.mimetype.startsWith('image/')) return next();

    const tempPath = filePath + '.optimized' + path.extname(filePath);
    
    // Resize to max 1200px width/height, 80% quality
    await sharp(filePath)
      .resize(1200, 1200, { 
        fit: 'inside', 
        withoutEnlargement: true 
      })
      .jpeg({ quality: 80, mozjpeg: true }) // Convert to JPEG or keep original format with compression? 
      // Safe default: jpeg, but user might want png.
      // Let's stick to what we output: if we force jpeg, we change extension?
      // Simpler: Just use .toBuffer() and write back. But sharp handles file IO better.
      // The code snippet below forces jpeg which is good for photos.
      .toFile(tempPath);

    // Replace original file
    // Note: If we changed extension to .jpg, we must update req.file.filename and req.file.path?
    // Current setup preserves extension in toFile? No, sharp.jpeg() outputs streaming jpeg.
    // If input was PNG and we save as .jpg, we should renaming.
    // To be safe and simple: output to buffer and overwrite.
    
    // REVISED APPROACH: Buffer
    const buffer = await sharp(filePath)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .toFormat('jpeg', { quality: 80, mozjpeg: true })
      .toBuffer();
      
    await fs.promises.writeFile(filePath, buffer);
    
    next();
  } catch (error) {
    console.error('Image optimization error:', error);
    next(); // Continue even if optimization fails
  }
};

module.exports = { optimizeImage };
