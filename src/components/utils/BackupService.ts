/**
 * BackupService - Handles the saving and restoration of page content backups
 * Uses localStorage for persistence across sessions
 */

export interface PageBackup {
  id: string;
  timestamp: number;
  name: string;
  description?: string;
  route: string;
  content: string;
  thumbnailData?: string;
}

const STORAGE_KEY = 'venturesroom_page_backups';
const MAX_BACKUPS = 20; // Maximum number of backups to keep

export const BackupService = {
  /**
   * Save a new backup of the current page content
   */
  saveBackup: (backup: Omit<PageBackup, 'id' | 'timestamp'>): PageBackup => {
    const backups = BackupService.getBackups();
    
    // Create new backup with ID and timestamp
    const newBackup: PageBackup = {
      ...backup,
      id: `backup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    
    // Add to the beginning of the array (newest first)
    backups.unshift(newBackup);
    
    // Limit the number of backups
    if (backups.length > MAX_BACKUPS) {
      backups.length = MAX_BACKUPS;
    }
    
    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(backups));
    
    return newBackup;
  },
  
  /**
   * Get all saved backups
   */
  getBackups: (): PageBackup[] => {
    try {
      const backupsJson = localStorage.getItem(STORAGE_KEY);
      return backupsJson ? JSON.parse(backupsJson) : [];
    } catch (error) {
      console.error('Error loading backups:', error);
      return [];
    }
  },
  
  /**
   * Get backups for a specific route
   */
  getBackupsForRoute: (route: string): PageBackup[] => {
    const backups = BackupService.getBackups();
    return backups.filter(backup => backup.route === route);
  },
  
  /**
   * Get a specific backup by ID
   */
  getBackupById: (id: string): PageBackup | undefined => {
    const backups = BackupService.getBackups();
    return backups.find(backup => backup.id === id);
  },
  
  /**
   * Delete a backup by ID
   */
  deleteBackup: (id: string): boolean => {
    const backups = BackupService.getBackups();
    const filteredBackups = backups.filter(backup => backup.id !== id);
    
    if (filteredBackups.length !== backups.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredBackups));
      return true;
    }
    
    return false;
  },
  
  /**
   * Create a thumbnail from content
   * This is a simple implementation - in a real app, you might want to use 
   * a library to create an actual visual thumbnail
   */
  createThumbnail: (content: string): string => {
    // For now, we'll just take the first few characters
    return content.slice(0, 150) + (content.length > 150 ? '...' : '');
  },
  
  /**
   * Clear all backups
   */
  clearBackups: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  }
};