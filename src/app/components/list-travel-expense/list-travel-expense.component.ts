import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TravelExpense } from 'src/app/models/TravelExpense';
import { TravelExpenseComponent } from '../travel-expense/travel-expense.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-travel-expense',
  templateUrl: './list-travel-expense.component.html',
  styleUrls: ['./list-travel-expense.component.scss']
})
export class ListTravelExpenseComponent {

  displayedColumns: string[] = ['date', 'project', 'purpose', 'amount','status','actions'];
  dataSource = new MatTableDataSource<TravelExpense>([]);
  isLoadingResults = false;
  isError = false;
  isAdmin: boolean = false;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar, private router: Router){
      this.isAdmin = localStorage.getItem('is_admin') === 'true';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddExpenseDialog(): void {
    this.router.navigate(['accueil/frais-de-deplacement/']);
  }
  

}
