import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MissionExpense } from 'src/app/models/MissionExpense';
import { MissionExpenseComponent } from '../mission-expense/mission-expense.component';
import { ShareDataService } from 'src/app/services/shareData/share-data.service';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { forkJoin } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-mission-expense',
  templateUrl: './list-mission-expense.component.html',
  styleUrls: ['./list-mission-expense.component.scss']
})
export class ListMissionExpenseComponent implements OnChanges {
  @Input() list_expenses: any[] = [];
  
  displayedColumns: string[] = ['name','comment', 'amount'];
  dataSource = new MatTableDataSource<MissionExpense>([]);
  id_travel = Number(localStorage.getItem('id_travel'));
  

  constructor(private dialog: MatDialog,  private shareDataService : ShareDataService,
    private expenseService: ExpensesService, private readonly snackBar: MatSnackBar) {

    this.shareDataService.travelExpenseValidated$.subscribe(() => {
      this.sendAllExpensesToAPI();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['list_expenses'] && changes['list_expenses'].currentValue) {
      this.dataSource.data = [...this.list_expenses];
    }
  }

  openAddExpenseDialog(): void {
    const dialogRef = this.dialog.open(MissionExpenseComponent, {
      disableClose: false,
      data: { id_travel: this.id_travel }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.id_travel = this.id_travel;
        this.dataSource.data = [...this.dataSource.data, result];
  
        // Envoyer toutes les dépenses à l'API après chaque ajout
        this.sendAllExpensesToAPI();
      }
    });
  }
  

  sendAllExpensesToAPI(): void {
    if (this.dataSource.data.length === 0) return;
  
    const expenseRequests = this.dataSource.data.map(expense => 
      this.expenseService.createMissionExpense(expense)
    );
  
    forkJoin(expenseRequests).subscribe(
      responses => {
        console.log('Toutes les dépenses ont été envoyées avec succès:', responses);
        setTimeout(() => {
          this.dataSource.data = [];
        }, 100);
      },
      error => {
        console.error('Erreur lors de l\'envoi des dépenses:', error);
      }
    );
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
