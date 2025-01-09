import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';


export interface PeriodicElement {
  position: number;
  name: string;
  description: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', description: 'Hhghfgdhfgfrdh'},
  {position: 2, name: 'Helium', description: 'Hehjgdqhfhdhjfhjds'},
  {position: 3, name: 'Lithium',description: 'Lidbfhsbhfdbhsb'},
  {position: 4, name: 'Beryllium', description: 'Bedsfdgfhgfjhjyg'},
];


@Component({
  selector: 'app-project-actions',
  templateUrl: './project-actions.component.html',
  styleUrls: ['./project-actions.component.scss']
})
export class ProjectActionsComponent {
  @Input() project: any;

  displayedColumns: string[] = ['select', 'position', 'name', 'description', 'edit', 'save'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

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

  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

}
