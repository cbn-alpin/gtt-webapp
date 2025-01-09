import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ActionComponent } from '../action/action.component';
import { ProjectComponent } from '../project/project.component';

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
export class ListProjectsComponent {
  constructor(private readonly dialog: MatDialog) {}

  displayedColumns: string[] = ['id', 'name', 'startDate', 'endDate'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'add', 'save', 'expand']
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  expandedElement: PeriodicElement | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openConfirmationDialog(action: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        message: `${action}?`
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        console.log(`Action confirmée : ${action}`);
      } else {
        console.log(`Action annulée : ${action}`);
      }
    });
  }

  createProject(){
    const dialogRef = this.dialog.open(ProjectComponent);

    
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        console.log(`Action confirmée : project`);
      } else {
        console.log(`Action annulée : project`);
      }
    });
  }

  createAction(){
    const dialogRef = this.dialog.open(ActionComponent);
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        console.log(`Action confirmée : project`);
      } else {
        console.log(`Action annulée : project`);
      }
    });
  }
}

export interface PeriodicElement {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { id: 24012, name: 'PIFH-ORB 24', startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31') },
  { id: 24013, name: 'PIFH-ORB 25', startDate: new Date('2024-03-15'), endDate: new Date('2024-09-15') },
  { id: 24014, name: 'PIFH-ORB 26', startDate: new Date('2024-02-10'), endDate: new Date('2024-08-10') },
  { id: 24015, name: 'PIFH-ORB 27', startDate: new Date('2024-01-05'), endDate: new Date('2024-12-31') },
  { id: 24016, name: 'PIFH-ORB 28', startDate: new Date('2024-06-01'), endDate: new Date('2024-11-30') },
  { id: 24017, name: 'PIFH-ORB 29', startDate: new Date('2024-02-20'), endDate: new Date('2024-08-20') },
  { id: 24018, name: 'PIFH-ORB 30', startDate: new Date('2024-05-10'), endDate: new Date('2024-11-10') },
  { id: 24019, name: 'PIFH-ORB 31', startDate: new Date('2024-04-01'), endDate: new Date('2024-09-30') },
  { id: 24020, name: 'PIFH-ORB 32', startDate: new Date('2024-07-15'), endDate: new Date('2024-12-15') },
  { id: 24021, name: 'PIFH-ORB 33', startDate: new Date('2024-08-01'), endDate: new Date('2024-12-31') },
  { id: 24022, name: 'PIFH-ORB 34', startDate: new Date('2024-09-15'), endDate: new Date('2025-03-15') },
  { id: 24023, name: 'PIFH-ORB 35', startDate: new Date('2024-11-01'), endDate: new Date('2025-04-30') },
  { id: 24024, name: 'PIFH-ORB 36', startDate: new Date('2024-12-01'), endDate: new Date('2025-05-30') },
  { id: 24025, name: 'PIFH-ORB 37', startDate: new Date('2025-01-01'), endDate: new Date('2025-06-30') },
  { id: 24026, name: 'PIFH-ORB 38', startDate: new Date('2025-02-01'), endDate: new Date('2025-07-31') },
  { id: 24027, name: 'PIFH-ORB 39', startDate: new Date('2025-03-01'), endDate: new Date('2025-08-31') },
  { id: 24028, name: 'PIFH-ORB 40', startDate: new Date('2025-04-01'), endDate: new Date('2025-09-30') },
  { id: 24029, name: 'PIFH-ORB 41', startDate: new Date('2025-05-01'), endDate: new Date('2025-10-31') },
  { id: 24030, name: 'PIFH-ORB 42', startDate: new Date('2025-06-01'), endDate: new Date('2025-11-30') },
  { id: 24031, name: 'PIFH-ORB 43', startDate: new Date('2025-07-01'), endDate: new Date('2025-12-31') },
];