import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { forkJoin } from 'rxjs';

import { MissionExpense } from 'src/app/core/models/mission-expense.model';
import { ExpensesService } from 'src/app/core/services/expenses/expenses.service';
import { ShareDataService } from 'src/app/core/services/share-data/share-data.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ExpenseItemDialogComponent } from './expense-item-dialog/expense-item-dialog.component';

@Component({
  selector: 'app-expense-item-list',
  standalone: true,
  templateUrl: './expense-item-list.component.html',
  styleUrls: ['./expense-item-list.component.scss'],
  imports: [CommonModule, MatIconModule, MatTableModule, MatButtonModule, MatTooltipModule],
})
export class ExpenseItemListComponent implements OnChanges, OnInit {
  @Input() list_expenses: any[] = [];

  displayedColumns: string[] = ['name', 'comment', 'amount', 'actions'];
  dataSource = new MatTableDataSource<MissionExpense>([]);
  id_travel?: number;
  pendingExpenses: any[] = [];

  private readonly dialog = inject(MatDialog);
  private readonly shareDataService = inject(ShareDataService);
  private readonly expenseService = inject(ExpensesService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    this.shareDataService.travelExpenseValidated$.subscribe(() => {
      this.sendAllExpensesToAPI();
    });
    this.id_travel = Number(localStorage.getItem('id_travel'));
  }

  ngOnInit(): void {
    this.shareDataService.newTravelId$.subscribe((id) => {
      this.id_travel = id;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['list_expenses'] && changes['list_expenses'].currentValue) {
      this.dataSource.data = [...this.list_expenses];
    }
  }

  openAddExpenseDialog(): void {
    const dialogRef = this.dialog.open(ExpenseItemDialogComponent, {
      disableClose: true,
      data: { id_travel: this.id_travel },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.id_travel = result.id_travel;
        // Add expense to temporary table
        this.pendingExpenses.push(result);
        this.cdr.detectChanges();
        this.dataSource.data = [...this.list_expenses, ...this.pendingExpenses];
      }
    });
  }

  // Function to send all expenses to API after all additions
  sendAllExpensesToAPI(): void {
    const userId = Number(localStorage.getItem('id_user'));

    const expenseRequests = this.pendingExpenses.map((expense) => {
      return this.expenseService.createMissionExpense(expense, userId, this.id_travel);
    });

    forkJoin(expenseRequests).subscribe({
      next: () => {
        this.shareDataService.notifyMissionExpensesProcessed(true);

        // Add new expenses to `list_expenses` and empty `pendingExpenses`.
        this.list_expenses = [...this.list_expenses, ...this.pendingExpenses];
        this.pendingExpenses = [];

        // Refresh the table
        this.dataSource.data = [...this.list_expenses];
        this.cdr.detectChanges();

        // Reload page (not optimal, but works)
        window.location.reload();
      },
      error: (error) => {
        console.error("Erreur lors de l'envoi des dépenses:", error);
        this.showToast("Erreur lors de l'envoi des dépenses.", true);
      },
    });
  }

  openEditExpenseDialog(expense: any): void {
    const dialogRef = this.dialog.open(ExpenseItemDialogComponent, {
      disableClose: true,
      data: { id_travel: this.id_travel, expense },
    });

    dialogRef.afterClosed().subscribe((updatedExpense) => {
      if (updatedExpense) {
        const userId = Number(localStorage.getItem('id_user'));
        const pendingIndex = this.pendingExpenses.findIndex((e) => e === expense);

        if (pendingIndex !== -1) {
          // Modify pending expenditure without API call
          this.pendingExpenses[pendingIndex] = updatedExpense;
        } else {
          // API call to update expense
          this.expenseService
            .updateMissionExpense(updatedExpense, userId, expense.id_expense)
            .subscribe({
              next: (response) => {
                // Replaces the old expense with the new version
                this.list_expenses = this.list_expenses.map((exp) =>
                  exp.id_expense === expense.id_expense ? response : exp
                );

                this.dataSource.data = [...this.list_expenses]; // Table update
                this.cdr.detectChanges();

                this.showToast(`Frais de mission mis à jour avec succès ✅`);
              },
              error: (error) => {
                console.error('Erreur lors de la mise à jour:', error);
                this.showToast(`Erreur : Impossible de mettre à jour la dépense ❌`, true);
              },
            });
        }
        this.dataSource.data = [...this.list_expenses, ...this.pendingExpenses];
        this.cdr.detectChanges();
      }
    });
  }

  deleteExpenseById(action: string, expense: any): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      width: '300px',
      data: { message: `${action}?` },
    });

    const userId = Number(localStorage.getItem('id_user'));

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        if (!expense.id_expense) {
          // Eliminate a pending expense
          this.pendingExpenses = this.pendingExpenses.filter((e) => e !== expense);
          this.showToast(`Frais de mission supprimé avec succès ✅`);
        } else {
          this.expenseService.deleteMissionExpense(userId, expense.id_expense).subscribe({
            next: () => {
              // Remove expense from list and update table
              this.list_expenses = this.list_expenses.filter(
                (expense) => expense.id_expense !== expense.id_expense
              );
              this.dataSource.data = [...this.list_expenses];
              this.cdr.detectChanges();

              this.showToast(`Frais de mission supprimé avec succès ✅`);
            },
            error: (error) => {
              this.showToast(`Erreur : ${error.message || 'Suppression impossible'} ❌`, true);
            },
          });
        }
        this.dataSource.data = [...this.list_expenses, ...this.pendingExpenses];
        this.cdr.detectChanges();
      }
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
}
