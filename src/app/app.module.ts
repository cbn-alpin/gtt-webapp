import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FRENCH_DATE_FORMATS } from './core/config/date-formats'; 
import {MatAutocompleteModule} from '@angular/material/autocomplete';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConnectionPageComponent } from './components/connection-page/connection-page.component';
import { HomeComponent } from './components/home/home.component';
import { ListProjectsComponent } from './components/list-projects/list-projects.component';
import { ProjectActionsComponent } from './components/project-actions/project-actions.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ActionComponent } from './components/action/action.component';
import { ProjectComponent } from './components/project/project.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { TimeSheetComponent } from './components/TimeSheet/TimeSheet.component';
import { PopupMessageComponent } from './popup-message/popup-message.component';
import { DownloadPageComponent } from './components/download-page/download-page.component';
import { DownloadProjectsComponent } from './components/download-projects/download-projects.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ListUsersComponent } from './components/list-users/list-users.component';
import { ModifyPasswordComponent } from './components/modify-password/modify-password.component';
import { DownloadExpensesComponent } from './components/download-expenses/download-expenses.component';
import { TravelExpenseComponent } from './components/travel-expense/travel-expense.component';
import { ListTravelExpenseComponent } from './components/list-travel-expense/list-travel-expense.component';
import { MissionExpenseComponent } from './components/mission-expense/mission-expense.component';
import { ListMissionExpenseComponent } from './components/list-mission-expense/list-mission-expense.component';
import { FrenchPaginatorIntl } from './core/config/frenchPaginatorIntl';

@NgModule({
  declarations: [
    AppComponent,
    ConnectionPageComponent,
    HomeComponent,
    ListProjectsComponent,
    ProjectActionsComponent,
    ConfirmationDialogComponent,
    ActionComponent,
    ProjectComponent,
    DownloadPageComponent,
    DownloadProjectsComponent,
    PopupMessageComponent,
    TimeSheetComponent,
    ListUsersComponent,
    ModifyPasswordComponent,
    DownloadExpensesComponent,
    TravelExpenseComponent,
    ListTravelExpenseComponent,
    MissionExpenseComponent,
    ListMissionExpenseComponent
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatMenuModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSidenavModule,
    FormsModule,
    CalendarComponent,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatOptionModule,
    MatSelectModule,
    MatSlideToggleModule,
    FormsModule,
    MatDividerModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule
],
providers: [
  { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }, // Locale en français
  { provide: DateAdapter, useClass: MomentDateAdapter }, // Utilisation de Moment pour la gestion des dates
  { provide: MAT_DATE_FORMATS, useValue: FRENCH_DATE_FORMATS }, // Format personnalisé global
  { provide: MatPaginatorIntl, useClass: FrenchPaginatorIntl },
],
  bootstrap: [AppComponent]
})
export class AppModule { }
