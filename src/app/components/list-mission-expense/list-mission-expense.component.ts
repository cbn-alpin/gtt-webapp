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
      console.error('Nouvel ID Travel reçu dans ListMissionExpense:', this.id_travel);
    });
  }
  
  constructor(private dialog: MatDialog,  private shareDataService : ShareDataService,
    private expenseService: ExpensesService, private readonly snackBar: MatSnackBar, private cdr: ChangeDetectorRef) {

    this.shareDataService.travelExpenseValidated$.subscribe(() => {
      this.sendAllExpensesToAPI();
    });

    console.error('ID Travel enregistré:', localStorage.getItem('id_travel'));
    console.error('ID Travel enregistré dans id_travel:', this.id_travel);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['list_expenses'] && changes['list_expenses'].currentValue) {
      this.dataSource.data = [...this.list_expenses];
    }
  }

  openAddExpenseDialog(): void {
    // this.id_travel = Number(localStorage.getItem('id_travel'));
    console.error('Ouverture du dialogue avec ID Travel:', this.id_travel);
    const dialogRef = this.dialog.open(MissionExpenseComponent, {
      disableClose: false,
      data: { id_travel: this.id_travel }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.id_travel = this.id_travel;
        console.error('Ajouter la dépense au tableau temporaire:', result.id_travel);
        // this.list_expenses = [...this.list_expenses, result];
        // this.list_expenses = [...this.list_expenses, ...this.pendingExpenses];
        // this.dataSource.data = [...this.list_expenses];

        // Ajouter la dépense au tableau temporaire
        this.pendingExpenses.push(result);
        this.cdr.detectChanges();
        // this.list_expenses = [...this.pendingExpenses];
        this.dataSource.data = [...this.list_expenses, ...this.pendingExpenses];
        console.error('list missions expenses dans datasource:', this.dataSource.data);

      }
    });
  }
  

  // Fonction pour envoyer toutes les dépenses à l'API après tous les ajouts
  sendAllExpensesToAPI(): void {
    const expenseRequests = this.pendingExpenses.map(expense => {
      expense.id_travel = this.id_travel;
      return this.expenseService.createMissionExpense(expense);
    });

    forkJoin(expenseRequests).subscribe({
      next: (responses) => {
        console.error('Toutes les dépenses ont été envoyées avec succès:', responses);

        this.shareDataService.notifyMissionExpensesProcessed(true);
    
         // Ajouter les nouvelles dépenses à `list_expenses` et vider `pendingExpenses`
         this.list_expenses = [...this.list_expenses, ...this.pendingExpenses];
         this.pendingExpenses = [];
 
         // Rafraîchir la table
         this.dataSource.data = [...this.list_expenses];
         this.cdr.detectChanges();
    
          // Recharger la page (pas optimal, mais fonctionne)
          // window.location.reload();
      },
      error: (error) => {
        console.error('Erreur lors de l\'envoi des dépenses:', error);
        this.showToast('Erreur lors de l\'envoi des dépenses.', true);
      }
    });
    
  }

  openEditExpenseDialog(expense: any): void {
    console.error('Modification d\'une dépense:', expense);
    
    const dialogRef = this.dialog.open(MissionExpenseComponent, {
      disableClose: false,
      data: { id_travel: this.id_travel, expense }
    });
  
    dialogRef.afterClosed().subscribe(updatedExpense => {
      if (updatedExpense) {
        updatedExpense.id_travel = this.id_travel;
        console.error('Mise à jour de la dépense:', updatedExpense);
  
        // Remplacer l'ancienne dépense par la nouvelle dans la liste
        this.list_expenses = this.list_expenses.map(exp => 
          exp === expense ? updatedExpense : exp
        );
  
        this.dataSource.data = [...this.list_expenses];
        this.cdr.detectChanges();
      }
    });
  } 
  
  deleteExpenseById(action: string, expenseId: number): void {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '300px',
        data: { message: `${action}?` }
      });
  
      // dialogRef.afterClosed().subscribe((result: boolean) => {
      //   if (result) {
      //     this.projectService.deleteProjectById(projectId).subscribe({
      //       next: () => {
      //         this.fetchProjects();
      //         this.showToast(`Projet supprimé avec succès ✅`);
      //       },
      //       error: (error) => {
      //         this.showToast(`Erreur : ${error.message || 'Suppression impossible'} ❌`, true);
      //       }
      //     });
      //   }
      // });
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
