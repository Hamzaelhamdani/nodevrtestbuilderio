import { BackupService } from "./BackupService";

/**
 * Creates an initial backup of the landing page
 * Call this function after the app has fully loaded
 */
export function createInitialBackup() {
  // Check if we already have any backups for the home route
  const existingBackups = BackupService.getBackupsForRoute("home");
  
  // If we already have backups, don't create another initial one
  if (existingBackups.length > 0) {
    return;
  }
  
  // Wait for the DOM to be fully loaded
  setTimeout(() => {
    const mainElement = document.querySelector("main");
    
    if (mainElement && mainElement.innerHTML) {
      // Create a backup of the initial landing page
      BackupService.saveBackup({
        name: "Initial Version",
        description: "Automatically created backup of the initial landing page",
        route: "home",
        content: mainElement.innerHTML,
        thumbnailData: BackupService.createThumbnail(mainElement.innerHTML),
      });
      
      console.log("Initial landing page backup created");
    }
  }, 2000); // Wait 2 seconds for everything to render
}