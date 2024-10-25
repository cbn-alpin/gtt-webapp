export interface TimeEntry {
  id?: number;
  projectId: number;
  actionId: number;
  userId: number;
  date: Date;
  duration: number;
}
