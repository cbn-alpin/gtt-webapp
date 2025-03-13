import {SelectionModel} from '@angular/cdk/collections';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
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
  selectedProjectId: any = null;
  isLoadingResults = false;
  isError = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private projectService: ProjectsService, private downloadServivce : DownloadService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchProjects();
  }
   
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
 
  toggleSelection(row: Project): void {
    if (this.selection.isSelected(row)) {
      this.selection.clear();
      this.selectedProjectId = null;
      this.selectionState.next(false); 
    } else {
      this.selection.clear();
      this.selection.select(row);
      this.selectedProjectId = row.id_project;
      this.selectionState.next(true); 
    }
  }

  fetchProjects(): void {
    this.isLoadingResults = true;
    this.isError = false;

    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        setTimeout(() => {
          const filteredProjects = projects
          .filter((p: Project) => 
            p.id_project !== 0
          )
          .sort((a: Project, b: Project) => {
            const codeA = Number(a.code) || 0;
            const codeB = Number(b.code) || 0;
            return codeB - codeA;
          });

          this.dataSource.data = filteredProjects;
          this.isLoadingResults = false;

          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
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

  exportProjectData(exportFileName : string): void {
    this.projectService.getProjectActionsAndUsersTimesById(this.selectedProjectId).subscribe({
      next: (data) => {
        if (data.time_entries.length == 0 ) {
          this.showToast(`Aucune saisie de temps trouvée sur ce projet.`);
          return;
        }
        const formattedData = this.formatProjectActionsForCSV(data.time_entries);  
        this.downloadServivce.downloadCSV(formattedData, exportFileName);
      },
      error: () => {
        console.error('Erreur lors du chargement des détails du projet');
      }
    });
    
  }

  formatProjectActionsForCSV(data: any[]): any[] {
    if(!data){
      this.showToast(`Aucune saisie de temps sur ce project.`);
      return [];
    }else{
      return data.map(row => ({
        'PRENOM': row.first_name, 
        'NOM': row.last_name, 
        'Date': row.date, 
        'Actions': `${row.numero_action}——${row.name_action}`, 
        'Nombre d’heures réalisés': row.duration.toFixed(2) 
      }));
    }
    
  }

  showToast(message: string, isError: boolean = false) {
    this.snackBar.open(message, '', {
      duration: 5000, 
      panelClass: [isError ? 'error-toast' : 'success-toast'], 
      verticalPosition: 'top', 
      horizontalPosition: 'center', 
    });
  }
}
