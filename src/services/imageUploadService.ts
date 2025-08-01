// Service for handling image uploads
class ImageUploadService {
  private cloudinaryUploadUrl = 'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload';
  private uploadPreset = 'YOUR_UPLOAD_PRESET'; // Create this in Cloudinary dashboard

  async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);
      formData.append('folder', 'venturesroom/products'); // Optional: organize images in folders

      const response = await fetch(this.cloudinaryUploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.secure_url; // Return the secure URL of the uploaded image
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Failed to upload image');
    }
  }

  async uploadMultipleImages(files: File[]): Promise<string[]> {
    try {
      const uploadPromises = files.map(file => this.uploadImage(file));
      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error('Multiple image upload error:', error);
      throw new Error('Failed to upload images');
    }
  }

  // Alternative: Upload to your Railway backend
  async uploadToBackend(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error('Backend image upload error:', error);
      throw new Error('Failed to upload image to server');
    }
  }
}

export const imageUploadService = new ImageUploadService();
