import {SelectionModel} from '@angular/cdk/collections';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { Project } from 'src/app/models/Project';
import { DownloadService } from 'src/app/services/Download/download.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';

@Component({
  selector: 'app-download-projects',
  templateUrl: './download-projects.component.html',
  styleUrls: ['./download-projects.component.scss']
})
export class DownloadProjectsComponent implements OnInit, AfterViewInit {
  private selectionState = new BehaviorSubject<boolean>(false);
  isButtonDisabled$ = this.selectionState.asObservable();

  displayedColumns: string[] = ['selection', 'code', 'name'];
  dataSource = new MatTableDataSource<Project>([]);
  selection = new SelectionModel<Project>(false, []);
  selectedProjectData: any = null ;
  isLoadingResults = false;
  isError = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private projectService: ProjectsService, private downloadServivce : DownloadService) {}

  ngOnInit(): void {
    this.fetchProjects();
  }
   
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
 
  toggleSelection(row: Project): void {
    if (this.selection.isSelected(row)) {
      this.selection.clear();
      this.selectedProjectData = null;
      this.selectionState.next(false); 
    } else {
      this.selection.clear();
      this.selection.select(row);
      this.loadProjectDetails(row.id_project);
      this.selectionState.next(true); 
    }
  }

  fetchProjects(): void {
    this.isLoadingResults = true;
    this.isError = false;

    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        setTimeout(() => { 
          const filteredProjects = projects;  
          this.dataSource.data = filteredProjects;
          this.isLoadingResults = false;
  
          setTimeout(() => { 
            this.dataSource.paginator = this.paginator;   
          }, 100);
        }, 1000);
      },
      error: () => {
        this.isLoadingResults = false;
        this.isError = true;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  loadProjectDetails(projectId: number): void {
    this.projectService.getProjectActionsAndUsersTimesById(projectId).subscribe({
      next: (data) => {
        this.selectedProjectData = data;
        console.error('Détails du projet sélectionné:', data);
      },
      error: () => {
        console.error('Erreur lors du chargement des détails du projet');
      }
    });
  }

  exportProjectData(exportFileName : string): void {
    if (!this.selectedProjectData) {
      console.error('Aucun projet sélectionné');
      return;
    }
    const formattedData = this.formatProjectActionsForCSV(this.selectedProjectData.actions);  
    this.downloadServivce.downloadCSV(formattedData, exportFileName);
  }

  formatProjectActionsForCSV(data: any[]): any[] {
    return data.map(row => ({
      'PRENOM NOM': row.user_name, 
      'Date de début': row.date_start, 
      'Date de fin': row.date_end, 
      'Actions': `${row.numero_action}———${row.name_action}`, 
      'Nombre d’heures réalisés': row.total_hours.toFixed(2) 
    }));
  }
}
