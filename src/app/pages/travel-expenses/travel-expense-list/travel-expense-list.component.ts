import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { ExpensesService } from 'src/app/core/services/expenses/expenses.service';
import { ShareDataService } from 'src/app/core/services/share-data/share-data.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-travel-expense-list',
  templateUrl: './travel-expense-list.component.html',
  styleUrls: ['./travel-expense-list.component.scss'],
})
export class TravelExpenseListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['date', 'project', 'purpose', 'amount', 'status', 'actions'];
  statusOptions = ['A Traiter', 'En cours', 'Traité', 'Problème'];
  dataSource = new MatTableDataSource<any>([]);
  isLoadingResults = false;
  isError = false;
  isAdmin = false;
  userId: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly expensesService = inject(ExpensesService);
  private readonly shareDataService = inject(ShareDataService);

  constructor() {
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
      return;
    }

    this.expensesService.getUserAllTravelsExpenses(this.userId, '', '').subscribe({
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
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createExpense(): void {
    localStorage.removeItem('id_travel');
    this.router.navigate(['accueil/frais-deplacement/']);
  }

  editExpense(travel: any): void {
    this.router.navigate(['accueil/frais-deplacement/'], {
      state: { travelData: travel },
    });
    this.shareDataService.sendTravelId(travel.travel_id);
  }

  deleteTravelExpense(action: string, travelId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      width: '300px',
      data: { message: `${action}?` },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.expensesService.deleteUserTravelExpense(travelId, this.userId).subscribe({
          next: () => {
            this.loadUserTravelExpenses();
            this.showToast(`Frais de déplacement supprimé avec succès ✅`);
          },
          error: (error) => {
            this.showToast(`Erreur : ${error.message || 'Suppression impossible'} ❌`, true);
          },
        });
      }
    });
  }

  updateStatus(element: any, newStatus: string): void {
    if (!element || !this.userId) return;

    // Check if status has changed
    if (element.status === newStatus) return;

    // Create the object as expected
    const travelData = {
      start_date: element.start_date,
      end_date: element.end_date,
      start_place: element.start_place,
      return_place: element.return_place,
      status: newStatus,
      purpose: element.purpose,
      start_municipality: element.start_municipality,
      end_municipality: element.end_municipality,
      night_municipality: element.night_municipality,
      destination: element.destination,
      night_count: element.night_count || 0,
      meal_count: element.meal_count || 0,
      comment: element.comment || '',
      license_vehicle: element.license_vehicle || '',
      comment_vehicle: element.comment_vehicle || '',
      start_km: element.start_km || 0,
      end_km: element.end_km || 0,
    };

    this.isLoadingResults = true;

    this.expensesService
      .updateUserTravelExpense(element.id_travel, this.userId, travelData)
      .subscribe({
        next: () => {
          this.showToast('Statut mis à jour avec succès ✅');
          element.status = newStatus;
          this.isLoadingResults = false;
        },
        error: (error) => {
          this.showToast(
            `Erreur lors de la mise à jour du statut : ${error.message || 'Erreur inconnue'} ❌`,
            true
          );
          this.isLoadingResults = false;
        },
      });
  }

  getFilteredStatusOptions(currentStatus: string): string[] {
    return this.statusOptions.filter((status) => status !== currentStatus);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'En cours':
        return 'in-progress';
      case 'Traité':
        return 'completed';
      case 'À traiter':
        return 'pending';
      case 'Problème':
        return 'problem';
      default:
        return '';
    }
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
