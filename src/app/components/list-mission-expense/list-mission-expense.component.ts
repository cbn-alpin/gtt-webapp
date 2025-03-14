import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MissionExpense } from 'src/app/models/MissionExpense';
import { MissionExpenseComponent } from '../mission-expense/mission-expense.component';
import { ShareDataService } from 'src/app/services/shareData/share-data.service';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { forkJoin } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-list-mission-expense',
  templateUrl: './list-mission-expense.component.html',
  styleUrls: ['./list-mission-expense.component.scss']
})
export class ListMissionExpenseComponent implements OnChanges, OnInit {
  @Input() list_expenses: any[] = [];
  
  displayedColumns: string[] = ['name','comment', 'amount', 'actions'];
  dataSource = new MatTableDataSource<MissionExpense>([]);
  id_travel? : Number;
  pendingExpenses: any[] = [];

  ngOnInit(): void {
    this.shareDataService.newTravelId$.subscribe(id => {
      this.id_travel = id;
    });
  }
  
  constructor(private dialog: MatDialog,  private shareDataService : ShareDataService,
    private expenseService: ExpensesService, private readonly snackBar: MatSnackBar, private cdr: ChangeDetectorRef) {

    this.shareDataService.travelExpenseValidated$.subscribe(() => {
      this.sendAllExpensesToAPI();
    });
    this.id_travel = Number(localStorage.getItem('id_travel'));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['list_expenses'] && changes['list_expenses'].currentValue) {
      this.dataSource.data = [...this.list_expenses];
    }
  }

  openAddExpenseDialog(): void {
    const dialogRef = this.dialog.open(MissionExpenseComponent, {
      disableClose: true,
      data: { id_travel: this.id_travel }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.id_travel = result.id_travel;
        // Ajouter la dépense au tableau temporaire
        this.pendingExpenses.push(result);
        this.cdr.detectChanges();
        this.dataSource.data = [...this.list_expenses, ...this.pendingExpenses];
      }
    });
  }

  // Fonction pour envoyer toutes les dépenses à l'API après tous les ajouts
  sendAllExpensesToAPI(): void {
    const userId = Number(localStorage.getItem('id_user'));

    const expenseRequests = this.pendingExpenses.map(expense => {
      return this.expenseService.createMissionExpense(expense, userId , this.id_travel);
    });

    forkJoin(expenseRequests).subscribe({
      next: (responses) => {
        this.shareDataService.notifyMissionExpensesProcessed(true);
    
         // Ajouter les nouvelles dépenses à `list_expenses` et vider `pendingExpenses`
         this.list_expenses = [...this.list_expenses, ...this.pendingExpenses];
         this.pendingExpenses = [];
 
         // Rafraîchir la table
         this.dataSource.data = [...this.list_expenses];
         this.cdr.detectChanges();
    
          // Recharger la page (pas optimal, mais fonctionne)
          window.location.reload();
      },
      error: (error) => {
        console.error('Erreur lors de l\'envoi des dépenses:', error);
        this.showToast('Erreur lors de l\'envoi des dépenses.', true);
      }
    });
    
  }

  openEditExpenseDialog(expense: any): void {    
    const dialogRef = this.dialog.open(MissionExpenseComponent, {
      disableClose: true,
      data: { id_travel: this.id_travel, expense }
    });
  
    dialogRef.afterClosed().subscribe(updatedExpense => {
      if (updatedExpense) {
  
        const userId = Number(localStorage.getItem('id_user'));
        const pendingIndex = this.pendingExpenses.findIndex(e => e === expense);
  
        if (pendingIndex !== -1) {
          // Modifier la dépense en pending sans appel API
          this.pendingExpenses[pendingIndex] = updatedExpense;
        }else{
          // Appel API pour mettre à jour la dépense
        this.expenseService.updateMissionExpense(updatedExpense, userId, expense.id_expense).subscribe({
          next: (response) => {  
            // Remplace l'ancienne dépense par la nouvelle version
            this.list_expenses = this.list_expenses.map(exp => 
              exp.id_expense === expense.id_expense ? response : exp
            );
  
            this.dataSource.data = [...this.list_expenses]; // Mise à jour du tableau
            this.cdr.detectChanges(); 
            
            this.showToast(`Frais de mission mis à jour avec succès ✅`);
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour:', error);
            this.showToast(`Erreur : Impossible de mettre à jour la dépense ❌`, true);
          }
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
        data: { message: `${action}?` } 
      });

      const userId = Number(localStorage.getItem('id_user'));
  
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          if (!expense.id_expense) {
            // Supprimer une dépense qui est encore en pending
            this.pendingExpenses = this.pendingExpenses.filter(e => e !== expense);
            this.showToast(`Frais de mission supprimé avec succès ✅`);
          }else{
            this.expenseService.deleteMissionExpense( userId, expense.id_expense).subscribe({
              next: () => {
                 // Supprimer la dépense de la liste et mettre à jour la table
                this.list_expenses = this.list_expenses.filter(expense => expense.id_expense !== expense.id_expense);
                this.dataSource.data = [...this.list_expenses]; 
                this.cdr.detectChanges(); 
  
                this.showToast(`Frais de mission supprimé avec succès ✅`);
              },
              error: (error) => {
                this.showToast(`Erreur : ${error.message || 'Suppression impossible'} ❌`, true);
              }
            });
          }
          this.dataSource.data = [...this.list_expenses, ...this.pendingExpenses];
          this.cdr.detectChanges();
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
