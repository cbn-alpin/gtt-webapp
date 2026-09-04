import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Action } from 'src/app/core/models/action.model';
import { ProjectActionsService } from 'src/app/core/services/project-actions/project-actions.service';
import { ProjectsService } from 'src/app/core/services/projects/projects.service';
import { UserActionService } from 'src/app/core/services/user-action/user-action.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ActionComponent } from './action/action.component';

@Component({
  selector: 'app-project-actions',
  standalone: true,
  templateUrl: './project-actions.component.html',
  styleUrls: ['./project-actions.component.scss'],
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTableModule,
  ],
})
export class ProjectActionsComponent implements OnInit {
  @Input() id_project!: number;

  private _list_action: Action[] = [];

  displayedColumns: string[] = ['numAction', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<Action>([]);
  selection = new SelectionModel<Action>(true, []);
  isAdmin = false;

  private readonly dialog = inject(MatDialog);
  private readonly projectService = inject(ProjectsService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly projectActionsService = inject(ProjectActionsService);
  private readonly userActionService = inject(UserActionService);

  @Input()
  set list_action(actions: Action[]) {
    this._list_action = actions || [];
    this.dataSource.data = this._list_action;
  }

  constructor() {
    this.isAdmin = localStorage.getItem('is_admin') === 'true';
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
      // Deselect all selected actions
      const selectedActions = this.selection.selected.map((action) => action.id_action);
      this.selection.clear();
      this.bulkDeleteUserActions(selectedActions);
    } else {
      // Select all actions and send only those not yet selected
      const alreadySelected = new Set(this.selection.selected.map((a) => a.id_action));
      const newlySelected = this.dataSource.data.filter(
        (action) => !alreadySelected.has(action.id_action)
      );

      this.selection.select(...this.dataSource.data);
      this.bulkCreateUserActions(newlySelected.map((action) => action.id_action));
    }
  }

  bulkCreateUserActions(actionIds: number[]) {
    const userId = Number(localStorage.getItem('id_user'));

    actionIds.forEach((actionId) => {
      this.userActionService.createUserAction(userId, actionId).subscribe({
        next: () => console.log(`Action ${actionId} enregistrée`),
        error: (error) => console.error(`Erreur enregistrement action ${actionId}`, error),
      });
    });
  }

  bulkDeleteUserActions(actionIds: number[]) {
    const userId = Number(localStorage.getItem('id_user'));

    actionIds.forEach((actionId) => {
      this.userActionService.deleteUserAction(userId, actionId).subscribe({
        next: () => console.log(`Action ${actionId} supprimée`),
        error: (error) => console.error(`Erreur suppression action ${actionId}`, error),
      });
    });
  }

  toggleSelection(action: Action) {
    this.selection.toggle(action);
    const userId = Number(localStorage.getItem('id_user')); // User ID retrieval
    console.error('token after check: ', localStorage.getItem('access_token'));

    if (this.selection.isSelected(action)) {
      // Add user action
      this.userActionService.createUserAction(userId, action.id_action).subscribe({
        next: (response) => console.log(`Action ${action.id_action} enregistrée`, response),
        error: () =>
          console.error(' Erreur lors de l’enregistrement', localStorage.getItem('access_token')),
      });
    } else {
      // Delete user action
      this.userActionService.deleteUserAction(userId, action.id_action).subscribe({
        next: () => console.log(`Action ${action.id_action} supprimée`),
        error: (error) => console.error(' Erreur lors de la suppression', error),
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
      disableClose: true,
      data: { id_project: this.id_project, action },
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
      disableClose: true,
      width: '300px',
      data: { message: `${action}?` },
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
          },
        });
      }
    });
  }

  fetchProjectActions(): void {
    this.projectService.getProjectById(this.id_project).subscribe({
      next: (project) => {
        this._list_action = Array.isArray(project.list_action) ? project.list_action : [];

        //Apply hierarchical sorting
        this.dataSource.data = this.naturalSort([...this._list_action]);

        const userId = Number(localStorage.getItem('id_user'));

        // Retrieve all projects where the user has selected actions
        this.projectActionsService.getUserProjects(userId).subscribe({
          next: (projects: { id_project: number; list_action: Action[] }[]) => {
            const selectedActions = new Set<number>();

            // Find out if the current project is in the user's project list
            const userProject = projects.find((p) => p.id_project === this.id_project);
            if (userProject && Array.isArray(userProject.list_action)) {
              userProject.list_action.forEach((action) => selectedActions.add(action.id_action));
            }

            // Select only the actions corresponding to the project
            this.selection.clear();
            this.selection.select(
              ...this.dataSource.data.filter((a) => selectedActions.has(a.id_action))
            );
          },
          error: (error) =>
            console.error('Erreur récupération des projets de l’utilisateur', error),
        });
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des actions du projet :', error);
        this._list_action = [];
        this.dataSource.data = [];
      },
    });
  }

  showToast(message: string, isError = false) {
    this.snackBar.open(message, '', {
      duration: 5000,
      panelClass: isError ? 'error-toast' : 'success-toast',
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  // Add this function for sorting hierarchical format numbers (1.2.3.3)
  private naturalSort(list: Action[]): Action[] {
    return [...list].sort((a, b) => {
      // Divide numbers into numeric segments
      const segmentsA = a.numero_action.split('.').map((segment) => parseInt(segment, 10));
      const segmentsB = b.numero_action.split('.').map((segment) => parseInt(segment, 10));

      // Compare segment by segment
      const maxLength = Math.max(segmentsA.length, segmentsB.length);

      for (let i = 0; i < maxLength; i++) {
        // If a segment does not exist, it is considered to be 0
        const segA = i < segmentsA.length ? segmentsA[i] : 0;
        const segB = i < segmentsB.length ? segmentsB[i] : 0;

        if (segA !== segB) {
          return segA - segB;
        }
      }

      // If all segments are equal up to this point, the shortest comes first
      return segmentsA.length - segmentsB.length;
    });
  }
}
