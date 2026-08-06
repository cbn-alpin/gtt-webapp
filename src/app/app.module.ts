import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  MatOptionModule,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ActionComponent } from './components/action/action.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ConnectionPageComponent } from './components/connection-page/connection-page.component';
import { DownloadExpensesComponent } from './components/download-expenses/download-expenses.component';
import { DownloadPageComponent } from './components/download-page/download-page.component';
import { DownloadProjectsComponent } from './components/download-projects/download-projects.component';
import { HomeComponent } from './components/home/home.component';
import { ListMissionExpenseComponent } from './components/list-mission-expense/list-mission-expense.component';
import { ListProjectsComponent } from './components/list-projects/list-projects.component';
import { ListTravelExpenseComponent } from './components/list-travel-expense/list-travel-expense.component';
import { ListUsersComponent } from './components/list-users/list-users.component';
import { MissionExpenseComponent } from './components/mission-expense/mission-expense.component';
import { ModifyPasswordComponent } from './components/modify-password/modify-password.component';
import { ProjectActionsComponent } from './components/project-actions/project-actions.component';
import { ProjectComponent } from './components/project/project.component';
import { TimeSheetComponent } from './components/time-sheet/time-sheet.component';
import { TravelExpenseComponent } from './components/travel-expense/travel-expense.component';
import { AuthInterceptor } from './core/auth/auth.interceptor';
import { FRENCH_DATE_FORMATS } from './core/config/date-formats';
import { FrenchPaginatorIntl } from './core/config/french-paginator-intl';
import { PopupMessageComponent } from './popup-message/popup-message.component';

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
    ListMissionExpenseComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
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
    MatAutocompleteModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }, // Locale en français
    { provide: DateAdapter, useClass: MomentDateAdapter }, // Utilisation de Moment pour la gestion des dates
    { provide: MAT_DATE_FORMATS, useValue: FRENCH_DATE_FORMATS }, // Format personnalisé global
    { provide: MatPaginatorIntl, useClass: FrenchPaginatorIntl },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
