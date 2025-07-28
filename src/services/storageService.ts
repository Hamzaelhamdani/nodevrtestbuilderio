import { apiClient } from "../utils/apiClient";
import { authService } from "./authService";
import { FileUploadResponse } from "../types/database";

export const storageService = {
  // Upload avatar
  async uploadAvatar(file: File, userId?: string): Promise<FileUploadResponse | null> {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        console.error("User not authenticated");
        return null;
      }
      const formData = new FormData();
      formData.append("file", file);
      if (userId) formData.append("userId", userId);
      const response = await apiClient.post("/api/storage/avatar", formData);
      return response.data;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      return null;
    }
  },

  // Upload startup logo
  async uploadStartupLogo(file: File, startupId: string): Promise<FileUploadResponse | null> {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        console.error("User not authenticated");
        return null;
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("startupId", startupId);
      const response = await apiClient.post("/api/storage/startup-logo", formData);
      return response.data;
    } catch (error) {
      console.error("Error uploading startup logo:", error);
      return null;
    }
  },

  // Upload structure logo
  async uploadStructureLogo(file: File, structureId: string): Promise<FileUploadResponse | null> {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        console.error("User not authenticated");
        return null;
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("structureId", structureId);
      const response = await apiClient.post("/api/storage/structure-logo", formData);
      return response.data;
    } catch (error) {
      console.error("Error uploading structure logo:", error);
      return null;
    }
  },

  // Upload product image
  async uploadProductImage(file: File, productId: string): Promise<FileUploadResponse | null> {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        console.error("User not authenticated");
        return null;
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("productId", productId);
      const response = await apiClient.post("/api/storage/product-image", formData);
      return response.data;
    } catch (error) {
      console.error("Error uploading product image:", error);
      return null;
    }
  },

  // Delete file
  async deleteFile(type: string, id: string, fileName: string): Promise<boolean> {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        console.error("User not authenticated");
        return false;
      }
      const response = await apiClient.delete(`/api/storage/${type}/${id}/${fileName}`);
      return response.data.success;
    } catch (error) {
      console.error("Error deleting file:", error);
      return false;
    }
  },

  // Get file URL
  getFileUrl(type: string, id: string, fileName: string): string {
    // This assumes your backend serves files at /uploads/{type}/{id}/{fileName}
    return `/uploads/${type}/${id}/${fileName}`;
  },

  // Validate file (unchanged)
  validateFile(
    file: File,
    maxSize: number = 5 * 1024 * 1024, // 5MB default
    allowedTypes: string[] = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
  ): { valid: boolean; error?: string } {
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size must be less than ${maxSize / (1024 * 1024)}MB`,
      };
    }
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type must be one of: ${allowedTypes.join(", ")}`,
      };
    }
    return { valid: true };
  },

  // Generate thumbnail (unchanged)
  async generateThumbnail(
    file: File,
    maxWidth: number = 200,
    maxHeight: number = 200,
  ): Promise<File | null> {
    try {
      return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const thumbnailFile = new File([blob], `thumb_${file.name}`, {
                  type: file.type,
                  lastModified: Date.now(),
                });
                resolve(thumbnailFile);
              } else {
                resolve(null);
              }
            },
            file.type,
            0.8,
          );
        };
        img.onerror = () => resolve(null);
        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      return null;
    }
  },
};
