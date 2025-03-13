import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { UserInfos } from 'src/app/models/UserInfos';
import { DownloadService } from 'src/app/services/Download/download.service';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { ShareDataService } from 'src/app/services/shareData/share-data.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-download-expenses',
  templateUrl: './download-expenses.component.html',
  styleUrls: ['./download-expenses.component.scss']
})
export class DownloadExpensesComponent {

 private selectionState = new BehaviorSubject<boolean>(false);
  isButtonDisabled$ = this.selectionState.asObservable();
  displayedColumns: string[] = ['selection', 'nom', 'prenom'];
  dataSource = new MatTableDataSource<UserInfos>([]);
  selection = new SelectionModel<UserInfos>(false, []);
  selectedUserId : any = null;
  isLoadingResults = false;
  isError = false;
  startDateFilter: string = '';
  endDateFilter: string  = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userService: UserService, private downloadServivce : DownloadService,
     private readonly expensesService: ExpensesService, private readonly snackBar: MatSnackBar, private shareDateService : ShareDataService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }
   
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
 
  toggleSelection(row: UserInfos): void {
    if (this.selection.isSelected(row)) {
      this.selection.clear();
      this.selectedUserId = null;
      this.selectionState.next(false);
    } else {
      this.selection.clear();
      this.selection.select(row);
      this.selectedUserId = row.id_user;
      this.selectionState.next(true); 
    }
  }

  fetchUsers(): void {
    this.isLoadingResults = true;
    this.isError = false;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        setTimeout(() => { 
          this.dataSource.data = users;
          this.isLoadingResults = false;
          setTimeout(() => { 
            this.dataSource.paginator = this.paginator;   
          }, 100);
        }, 1000);
      },
      error: () => {
        this.isLoadingResults = false;
        this.isError = true;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportProjectData(exportFileName : string): void {
    this.expensesService.getUserAllTravelsExpenses(this.selectedUserId,this.startDateFilter,this.endDateFilter).subscribe({
      next: (usersTravelsExpenses) => {
        if (usersTravelsExpenses.length == 0) {
          this.showToast(`Aucun frais de déplacement trouvé pour cet agent.`);
          return;
        }
        const formattedData = this.formatUserExpensesForCSV(usersTravelsExpenses);  
        this.downloadServivce.downloadCSV(formattedData, exportFileName);
        console.error('selectedUserExpensesData after filter dates in loadTravels:', usersTravelsExpenses);
      },
      error: () => {
        console.error('Erreur lors du chargement des expenses du user');
      }
    });
  }

  formatUserExpensesForCSV(data: any[]): any[] {
    if(!data){
      this.showToast(`Aucun frais de déplacement trouvé pour cet agent.`);
      return [] ;
    }else{
      return data.map(row => {
        // Création d'une chaîne pour les objets de frais de mission
        const expenseObjects = row.list_expenses
          .map((expense: any) => expense.name?.trim())
          .filter(Boolean)
          .join(', ');
    
        // Création d'une chaîne pour les montants
        const expenseAmounts = row.list_expenses
          .map((expense: any) => `${expense.amount} €`.trim())
          .filter(Boolean)
          .join(', ');
    
        // Création d'une chaîne pour les commentaires
        const expenseComments = row.list_expenses
          .map((expense: any) => expense.comment?.trim() || '')
          .filter(Boolean)
          .join(', ');
    
        // Calcul du total des kilomètres
        const totalKm = `${(row.end_km - row.start_km)} KM`;
    
        return {
          'Objet déplacement réalisé': row.purpose,
          'Projet': row.project_code,
          'Destination déplacement réalisé': row.destination,
          'Résidence début': row.start_place,
          'Résidence fin': row.return_place,
          'Date et Heure début': row.start_date,
          'Date et Heure fin': row.end_date,
          'Véhicule déplacé': row.license_vehicle,
          'Commentaire véhicule': row.comment_vehicle,
          'NB KM déplacé': totalKm,
          'NB Nuitée': row.night_count,
          'NB Repas': row.meal_count,
          'Objets frais de mission': expenseObjects,
          'Montant frais de mission': expenseAmounts,
          'Commentaire frais de mission': expenseComments,
          'Commune départ': row.start_municipality,
          'Commune retour': row.end_municipality,
        };
      });
    }
   
  }

  onStartDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      this.startDateFilter = this.shareDateService.formatDate(input.value);
    } else {
      this.startDateFilter = ''; 
    }
  }
  
  onEndDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      this.endDateFilter = this.shareDateService.formatDate(input.value); 
    } else {
      this.endDateFilter = ''; 
    }
  }

  showToast(message: string, isError: boolean = false) {
    this.snackBar.open(message, '', {
      duration: 5000, 
      panelClass: [isError ? 'error-toast' : 'success-toast'], 
      verticalPosition: 'top', 
      horizontalPosition: 'center', 
    });
  }
}

