import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MissionExpense } from 'src/app/models/MissionExpense';

@Component({
  selector: 'app-list-mission-expense',
  templateUrl: './list-mission-expense.component.html',
  styleUrls: ['./list-mission-expense.component.scss']
})
export class ListMissionExpenseComponent {
  displayedColumns: string[] = ['object','comment', 'amount'];
  dataSource = new MatTableDataSource<MissionExpense>([]);
}
