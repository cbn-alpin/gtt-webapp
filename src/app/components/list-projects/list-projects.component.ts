import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ProjectComponent } from '../project/project.component';
import { Project } from 'src/app/models/Project';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-projects',
  templateUrl: './list-projects.component.html',
  styleUrls: ['./list-projects.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ListProjectsComponent implements OnInit {
  isAdmin: boolean = false;
  displayedColumns: string[] = ['code', 'name', 'startDate', 'endDate'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'actions']
  dataSource = new MatTableDataSource<Project>([]);
  expandedElement: Project | null = null;
  isLoadingResults = false;
  isError = false;
  showArchived: boolean = false;

  constructor(private readonly dialog: MatDialog, 
  private projectService: ProjectsService,
  private readonly snackBar: MatSnackBar){
    this.isAdmin = localStorage.getItem('is_admin') === 'true';
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.fetchProjects();
    console.error('utilisateur courant', this.isAdmin);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fetchProjects(): void {
    this.isLoadingResults = true; 
    this.isError = false;
    
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        setTimeout(() => { 
          const filteredProjects = projects
            .filter((p: Project) => p.is_archived === this.showArchived)
            .sort((a: Project, b: Project) => Number(b.code) - Number(a.code));
  
          this.dataSource.data = filteredProjects;
          this.isLoadingResults = false;
  
          setTimeout(() => { 
            this.dataSource.paginator = this.paginator;   
            this.dataSource.sort = this.sort;
          }, 100);
        }, 1000); 
      },
      error: (error) => {
        this.isLoadingResults = false; 
        this.isError = true; 
      }
    });

    this.dataSource.sortingDataAccessor = (item: Project, property: string) => {
      switch (property) {
        case 'code':
          return Number(item.code) || 0;
        case 'name': 
          return item.name?.toLowerCase().trim() || ''; 
        case 'startDate':
          return new Date(item.start_date).getTime();
        case 'endDate':
          return new Date(item.end_date).getTime();
        default:
          return (item as any)[property];
      }
    };    
  }

  deleteProjectById(action: string, projectId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: `${action}?` }
    });
  
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.projectService.deleteProjectById(projectId).subscribe({
          next: () => {
            this.showToast(`Projet supprimé avec succès ✅`);
            this.fetchProjects(); 
          },
          error: (error) => {
            console.error('Erreur lors de la suppression du projet', error);
            this.showToast(`Erreur : ${error.message || 'Suppression impossible'} ❌`, true);
          }
        });
      }
    });
  }

  createProject() {
    const dialogRef = this.dialog.open(ProjectComponent);
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.fetchProjects(); 
      }
    });
  }

  archiveProject(action: string, project: Project): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: `${action}?` }
    });
  
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const { list_action, ...projectData } = project;

        const updatedProject = { 
          ...projectData, 
          is_archived: true 
        };
  
        this.projectService.updateProjectById(project.id_project, updatedProject).subscribe({
          next: () => {
            this.showToast(`Projet "${project.name}" archivé avec succès 🎉`);
            this.fetchProjects(); 
          },
          error: (error) => {
            console.error('Erreur lors de l\'archivage du projet', error);
            this.showToast(`Erreur : ${error.message || 'Archivage impossible'} ❌`, true);
          }
        });
      }
    });
  }

  toggleArchived(): void {
    this.showArchived = !this.showArchived;
    this.fetchProjects();
  }

  showToast(message: string, isError: boolean = false) {
    this.snackBar.open(message, '', {
      duration: 5000,
      panelClass: isError ? 'error-toast' : 'success-toast',
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}

