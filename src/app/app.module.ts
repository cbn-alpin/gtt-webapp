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
import { AuthInterceptor } from './core/auth/auth.interceptor';
import { FRENCH_DATE_FORMATS } from './core/config/date-formats';
import { FrenchPaginatorIntl } from './core/config/french-paginator-intl';
import { ConnectionPageComponent } from './pages/connection-page/connection-page.component';
import { DownloadExpensesComponent } from './pages/download-page/download-expenses/download-expenses.component';
import { DownloadPageComponent } from './pages/download-page/download-page.component';
import { DownloadProjectsComponent } from './pages/download-page/download-projects/download-projects.component';
import { HomeComponent } from './pages/home/home.component';
import { ListUsersComponent } from './pages/home/list-users/list-users.component';
import { ModifyPasswordComponent } from './pages/home/modify-password/modify-password.component';
import { ListProjectsComponent } from './pages/list-projects/list-projects.component';
import { ActionComponent } from './pages/list-projects/project-actions/action/action.component';
import { ProjectActionsComponent } from './pages/list-projects/project-actions/project-actions.component';
import { ProjectComponent } from './pages/list-projects/project/project.component';
import { ListTravelExpenseComponent } from './pages/list-travel-expense/list-travel-expense.component';
import { CalendarComponent } from './pages/time-sheet/calendar/calendar.component';
import { PopupMessageComponent } from './pages/time-sheet/calendar/popup-message/popup-message.component';
import { TimeSheetComponent } from './pages/time-sheet/time-sheet.component';
import { ListMissionExpenseComponent } from './pages/travel-expense/list-mission-expense/list-mission-expense.component';
import { MissionExpenseComponent } from './pages/travel-expense/list-mission-expense/mission-expense/mission-expense.component';
import { TravelExpenseComponent } from './pages/travel-expense/travel-expense.component';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';

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
