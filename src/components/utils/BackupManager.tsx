import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { HistoryIcon, SaveIcon, TrashIcon, RefreshCwIcon, CheckIcon, XIcon } from "lucide-react";
import { BackupService, PageBackup } from "./BackupService";
import { toast } from "sonner";

interface BackupManagerProps {
  currentRoute: string;
  contentRef?: React.RefObject<HTMLElement>;
  onRestore?: (content: string) => void;
}

export function BackupManager({ currentRoute, contentRef, onRestore }: BackupManagerProps) {
  const [backups, setBackups] = useState<PageBackup[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<PageBackup | null>(null);
  const [newBackupName, setNewBackupName] = useState("");
  const [newBackupDescription, setNewBackupDescription] = useState("");

  // Load backups for the current route
  useEffect(() => {
    if (isOpen) {
      refreshBackups();
    }
  }, [isOpen, currentRoute]);

  const refreshBackups = () => {
    const routeBackups = BackupService.getBackupsForRoute(currentRoute);
    setBackups(routeBackups);
  };

  // Create a new backup
  const createBackup = () => {
    if (!contentRef?.current) {
      toast.error("Content reference not found");
      return;
    }
    
    if (!newBackupName.trim()) {
      toast.error("Please provide a name for the backup");
      return;
    }
    
    const content = contentRef.current.innerHTML;
    const thumbnail = BackupService.createThumbnail(content);
    
    try {
      const newBackup = BackupService.saveBackup({
        name: newBackupName,
        description: newBackupDescription,
        route: currentRoute,
        content,
        thumbnailData: thumbnail,
      });
      
      toast.success("Backup created successfully");
      setNewBackupName("");
      setNewBackupDescription("");
      setIsCreateOpen(false);
      refreshBackups();
    } catch (error) {
      toast.error("Failed to create backup");
      console.error(error);
    }
  };

  // Delete a backup
  const deleteBackup = (id: string) => {
    if (BackupService.deleteBackup(id)) {
      toast.success("Backup deleted successfully");
      refreshBackups();
    } else {
      toast.error("Failed to delete backup");
    }
  };

  // Prepare to restore a backup
  const prepareRestore = (backup: PageBackup) => {
    setSelectedBackup(backup);
    setIsRestoreOpen(true);
  };

  // Actually restore the backup
  const confirmRestore = () => {
    if (!selectedBackup) return;
    
    if (onRestore) {
      onRestore(selectedBackup.content);
      toast.success("Backup restored successfully");
    } else if (contentRef?.current) {
      contentRef.current.innerHTML = selectedBackup.content;
      toast.success("Backup restored successfully");
    } else {
      toast.error("Cannot restore backup - no restore handler or content reference");
    }
    
    setIsRestoreOpen(false);
  };

  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <>
      {/* Backup Manager Button */}
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <HistoryIcon className="h-4 w-4" />
        Backups
      </Button>
      
      {/* Main Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Landing Page Backups</DialogTitle>
            <DialogDescription>
              Manage and restore previous versions of your landing page
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
                onClick={() => refreshBackups()}
              >
                <RefreshCwIcon className="h-3 w-3" />
                Refresh
              </Button>
              
              <Button 
                variant="default" 
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setIsCreateOpen(true)}
              >
                <SaveIcon className="h-3 w-3" />
                Create Backup
              </Button>
            </div>
            
            {backups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <HistoryIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No backups found for this page</p>
                <p className="text-sm mt-2">
                  Create a backup to save the current state of your landing page
                </p>
              </div>
            ) : (
              <Tabs defaultValue="grid">
                <TabsList className="mb-4">
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>
                
                <TabsContent value="grid">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {backups.map((backup) => (
                      <Card key={backup.id} className="overflow-hidden">
                        <CardHeader className="p-3 pb-2">
                          <CardTitle className="text-base">{backup.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {formatDate(backup.timestamp)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          {backup.description && (
                            <p className="text-xs text-muted-foreground mb-2">{backup.description}</p>
                          )}
                          <div className="text-xs bg-muted/30 p-2 rounded h-[80px] overflow-hidden">
                            {backup.thumbnailData}
                          </div>
                        </CardContent>
                        <CardFooter className="p-3 pt-1 flex justify-between">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => deleteBackup(backup.id)}
                          >
                            <TrashIcon className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => prepareRestore(backup)}
                          >
                            <HistoryIcon className="h-3 w-3 mr-1" />
                            Restore
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="list">
                  <div className="space-y-2">
                    {backups.map((backup) => (
                      <div 
                        key={backup.id} 
                        className="flex justify-between items-center p-3 border border-border rounded-md hover:bg-muted/10"
                      >
                        <div>
                          <div className="font-medium">{backup.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(backup.timestamp)}
                            {backup.description && ` - ${backup.description.slice(0, 50)}${backup.description.length > 50 ? '...' : ''}`}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => deleteBackup(backup.id)}
                          >
                            <TrashIcon className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => prepareRestore(backup)}
                          >
                            <HistoryIcon className="h-3 w-3 mr-1" />
                            Restore
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Backup Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Backup</DialogTitle>
            <DialogDescription>
              Save the current state of your landing page
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="backup-name">Backup Name</Label>
              <Input 
                id="backup-name"
                placeholder="E.g. Pre-launch version"
                value={newBackupName}
                onChange={(e) => setNewBackupName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="backup-description">Description (Optional)</Label>
              <Textarea 
                id="backup-description"
                placeholder="Describe what's unique about this version"
                value={newBackupDescription}
                onChange={(e) => setNewBackupDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createBackup}>
              <SaveIcon className="h-4 w-4 mr-2" />
              Save Backup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Restore Confirmation Dialog */}
      <Dialog open={isRestoreOpen} onOpenChange={setIsRestoreOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Backup</DialogTitle>
            <DialogDescription>
              Are you sure you want to restore this backup? This will replace the current content of your landing page.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBackup && (
            <div className="py-4">
              <div className="mb-2">
                <span className="font-medium">Backup:</span> {selectedBackup.name}
              </div>
              <div className="mb-2">
                <span className="font-medium">Created:</span> {formatDate(selectedBackup.timestamp)}
              </div>
              {selectedBackup.description && (
                <div className="mb-2">
                  <span className="font-medium">Description:</span> {selectedBackup.description}
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestoreOpen(false)}>
              <XIcon className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={confirmRestore}>
              <CheckIcon className="h-4 w-4 mr-2" />
              Yes, Restore
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}