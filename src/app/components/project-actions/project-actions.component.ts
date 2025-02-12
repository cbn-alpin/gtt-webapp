import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ActionComponent } from '../action/action.component';
import { MatDialog } from '@angular/material/dialog';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ProjectActionsService } from 'src/app/services/projectActions/project-actions.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserActionService } from 'src/app/services/UserAction/user-action.service';
import { Action } from 'src/app/models/Action';

@Component({
  selector: 'app-project-actions',
  templateUrl: './project-actions.component.html',
  styleUrls: ['./project-actions.component.scss']
})
export class ProjectActionsComponent implements OnInit {
  displayedColumns: string[] = ['numAction','name', 'description', 'actions'];
  dataSource = new MatTableDataSource<Action>([]);
  selection = new SelectionModel<Action>(true, []);
  isAdmin: boolean = false;

  constructor(private readonly dialog: MatDialog, 
  private projectService: ProjectsService,
  private readonly snackBar: MatSnackBar,
  private readonly projectActionsService: ProjectActionsService,
  private readonly userActionService: UserActionService){
    this.isAdmin = localStorage.getItem('is_admin') === 'true';
  }


  @Input() id_project!: number;
  private _list_action: Action[] = [];

  @Input()
  set list_action(actions: Action[]) {
    this._list_action = actions || []; 
    this.dataSource.data = this._list_action;
  }

  ngOnInit(): void {
    this.fetchProjectActions(); 
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      // Désélectionner toutes les actions sélectionnées
      const selectedActions = this.selection.selected.map(action => action.id_action);
      this.selection.clear();
      this.bulkDeleteUserActions(selectedActions);
    } else {
      // Sélectionner toutes les actions et envoyer uniquement celles non encore sélectionnées
      const alreadySelected = new Set(this.selection.selected.map(a => a.id_action));
      const newlySelected = this.dataSource.data.filter(action => !alreadySelected.has(action.id_action));
  
      this.selection.select(...this.dataSource.data);
      this.bulkCreateUserActions(newlySelected.map(action => action.id_action));
    }
  }
  
  bulkCreateUserActions(actionIds: number[]) {
    const userId = Number(localStorage.getItem('id_user'));
  
    actionIds.forEach(actionId => {
      this.userActionService.createUserAction(userId, actionId).subscribe({
        next: () => console.log(`Action ${actionId} enregistrée`),
        error: (error) => console.error(`Erreur enregistrement action ${actionId}`, error)
      });
    });
  }
  
  bulkDeleteUserActions(actionIds: number[]) {
    const userId = Number(localStorage.getItem('id_user'));
  
    actionIds.forEach(actionId => {
      this.userActionService.deleteUserAction(userId, actionId).subscribe({
        next: () => console.log(`Action ${actionId} supprimée`),
        error: (error) => console.error(`Erreur suppression action ${actionId}`, error)
      });
    });
  }
  

  toggleSelection(action: Action) {
    this.selection.toggle(action);
    const userId = Number(localStorage.getItem('id_user')); // Récupération de l’ID utilisateur
  
    if (this.selection.isSelected(action)) {
      // Ajout de l'action utilisateur
      this.userActionService.createUserAction(userId, action.id_action).subscribe({
        next: (response) => console.log(`Action ${action.id_action} enregistrée`, response),
        error: (error) => console.error(' Erreur lors de l’enregistrement', error)
      });
    } else {
      // Suppression de l'action utilisateur
      this.userActionService.deleteUserAction(userId, action.id_action).subscribe({
        next: () => console.log(`Action ${action.id_action} supprimée`),
        error: (error) => console.error(' Erreur lors de la suppression', error)
      });
    }
  }
  

  checkboxLabel(row?: Action): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id_action + 1}`;
  }

  createAction(action?: Action) {
    const dialogRef = this.dialog.open(ActionComponent, {
      data: { id_project: this.id_project, action } 
    });
  
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.fetchProjectActions(); 
      }
    });
  }
  
  editAction(action: Action) {
    this.createAction(action); 
  }

  deleteActionById(action: string, idAaction: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: `${action}?` }
    });
  
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.projectActionsService.deleteActionById(idAaction).subscribe({
          next: () => {
            this.showToast(`Projet supprimé avec succès ✅`);
            this.fetchProjectActions(); 
          },
          error: (error) => {
            console.error('Erreur lors de la suppression du projet', error);
            this.showToast(`Erreur : ${error.message || 'Suppression impossible'} ❌`, true);
          }
        });
      }
    });
  }

  fetchProjectActions(): void {
    this.projectService.getProjectById(this.id_project).subscribe({
      next: (project) => {
        this._list_action = Array.isArray(project.list_action) ? project.list_action : [];
        this.dataSource.data = [...this._list_action];
  
        const userId = Number(localStorage.getItem('id_user'));
  
        // Récupérer tous les projets où l'utilisateur a sélectionné des actions
        this.projectActionsService.getUserProjects(userId).subscribe({
          next: (projects: { id_project: number; list_action: Action[] }[]) => {
            const selectedActions = new Set<number>();
  
            // Chercher si le projet actuel est dans la liste des projets du user
            const userProject = projects.find(p  => p.id_project === this.id_project);
            if (userProject && Array.isArray(userProject.list_action)) {
              userProject.list_action.forEach(action => selectedActions.add(action.id_action));
            }
  
            // Sélectionner seulement les actions correspondant au projet
            this.selection.clear();
            this.selection.select(...this.dataSource.data.filter(a => selectedActions.has(a.id_action)));
          },
          error: (error) => console.error('Erreur récupération des projets de l’utilisateur', error)
        });
      },
      error: (error) => { 
        console.error("Erreur lors de la récupération des actions du projet :", error);
        this._list_action = [];
        this.dataSource.data = [];
      }
    });
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
