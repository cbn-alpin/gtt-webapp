import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TravelExpense } from 'src/app/models/TravelExpense';
import { TravelExpenseComponent } from '../travel-expense/travel-expense.component';
import { Router } from '@angular/router';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-list-travel-expense',
  templateUrl: './list-travel-expense.component.html',
  styleUrls: ['./list-travel-expense.component.scss']
})
export class ListTravelExpenseComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['date', 'project', 'purpose', 'amount','status','actions'];
  statusOptions = ['En cours', 'Traité', 'Problème'];
  dataSource = new MatTableDataSource<any>([]);
  isLoadingResults = false;
  isError = false;
  isAdmin: boolean = false;
  userId : number;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar, private router: Router, private readonly expensesService: ExpensesService,){
      this.isAdmin = localStorage.getItem('is_admin') === 'true';
      this.userId = Number(localStorage.getItem('id_user'));
  }

  ngOnInit(): void {
    this.loadUserTravelExpenses();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUserTravelExpenses(): void {
    this.isLoadingResults = true;
    this.isError = false;

    if (!this.userId) {
      console.error('Utilisateur non connecté');
      return;
    }

    this.expensesService.getUserAllTravelsExpenses(this.userId).subscribe({
      next: (travels) => {
        setTimeout(() => {
          this.dataSource.data = travels;
          this.isLoadingResults = false;
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }, 100);
        }, 1000);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des frais de déplacement :', error);
        this.isLoadingResults = false;
        this.isError = true;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createExpense(): void {
    this.router.navigate(['accueil/frais-de-deplacement/']);
  }

  editExpense(travel: any): void {
    this.router.navigate(['accueil/frais-de-deplacement/'], { 
      state: { travelData: travel }  
    });
  }

  deleteTravelExpense(action: string, travelId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: `${action}?` }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.expensesService.deleteUserTravelExpense(travelId,this.userId).subscribe({
          next: () => {
            this.loadUserTravelExpenses();
            this.showToast(`Frais de déplacement supprimé avec succès ✅`);
          },
          error: (error) => {
            this.showToast(`Erreur : ${error.message || 'Suppression impossible'} ❌`, true);
          }
        });
      }
    });
  }

  
  updateStatus(element: any, newStatus: string): void {
    if (!element || !this.userId) return;

    const formattedStartDate = this.formatDate(element.start_date);
    const formattedEndDate = this.formatDate(element.end_date);

   // Vérifier si le statut a changé
   if (element.status === newStatus) return;

   // Créer l'objet selon le schéma attendu
   const travelData = {
     id_travel: element.id_travel,
     start_date: this.formatDate(element.start_date),
     end_date: this.formatDate(element.end_date),
     start_place: element.start_place,
     return_place: element.return_place,
     status: newStatus,
     purpose: element.purpose,
     start_municipality: element.start_municipality,
     end_municipality: element.end_municipality,
     night_municipality: element.night_municipality,
     destination: element.destination,
     night_count: Number(element.night_count) || 0,
     meal_count: Number(element.meal_count) || 0,
     comment: element.comment || '',
     license_vehicle: element.license_vehicle || '',
     comment_vehicle: element.comment_vehicle || '',
     start_km: Number(element.start_km) || 0,
     end_km: Number(element.end_km) || 0
   };
    this.isLoadingResults = true;

    this.expensesService.updateUserTravelExpense(element.id_travel, this.userId, travelData)
      .subscribe({
        next: () => {
          this.showToast('Statut mis à jour avec succès ✅');
          element.status = newStatus; // Mise à jour locale
          this.isLoadingResults = false;
        },
        error: (error) => {
          this.showToast(`Erreur lors de la mise à jour du statut : ${error.message || 'Erreur inconnue'} ❌`, true);
          this.isLoadingResults = false;
        }
    });
  }

  formatDate(date: Date | string): string {
    let parsedDate;
    if (typeof date === 'string' && date.includes('/')) {
      const [day, month, year] = date.split('/');
      parsedDate = new Date(`${year}-${month}-${day}`);
    } else {
      parsedDate = new Date(date);
    }
  
    const day = parsedDate.getDate().toString().padStart(2, '0');
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = parsedDate.getFullYear();

    return `${year}-${month}-${day}`;
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
