import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ActionComponent } from '../action/action.component';
import { MatDialog } from '@angular/material/dialog';
import { Action } from 'src/app/models/Action';

@Component({
  selector: 'app-project-actions',
  templateUrl: './project-actions.component.html',
  styleUrls: ['./project-actions.component.scss']
})
export class ProjectActionsComponent {
  displayedColumns: string[] = ['position', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<Action>([]);
  selection = new SelectionModel<Action>(true, []);

  @Input() id_project!: number;
  private _list_action: Action[] = [];

  @Input()
  set list_action(actions: Action[]) {
    this._list_action = actions || []; 
    this.dataSource.data = this._list_action;
  }

  constructor(private readonly dialog: MatDialog){}

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: Action): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id_action + 1}`;
  }

  createAction() {
    const dialogRef = this.dialog.open(ActionComponent, {
      data: { id_project: this.id_project }
    });
    
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        console.log(`Action confirmée pour le projet ${this.id_project}`);
        this.dataSource.data = this._list_action;
      } else {
        console.log(`Action annulée pour le projet ${this.id_project}`);
      }
    });
  }
}
