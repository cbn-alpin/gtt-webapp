import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
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
import { HeaderComponent } from './core/layout/header/header.component';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { ExpensesExportComponent } from './pages/exports/expenses-export/expenses-export.component';
import { ExportsComponent } from './pages/exports/exports.component';
import { ProjectsExportComponent } from './pages/exports/projects-export/projects-export.component';
import { CalendarComponent } from './pages/timesheet/calendar/calendar.component';
import { ExpenseItemDialogComponent } from './pages/travel-expenses/travel-expense-form/expense-item-list/expense-item-dialog/expense-item-dialog.component';
import { TravelExpenseFormComponent } from './pages/travel-expenses/travel-expense-form/travel-expense-form.component';
import { TravelExpenseListComponent } from './pages/travel-expenses/travel-expense-list/travel-expense-list.component';

@NgModule({
  declarations: [
    AppComponent,
    TravelExpenseFormComponent,
    TravelExpenseListComponent,
    ExpenseItemDialogComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MainLayoutComponent,
    HeaderComponent,
    ExportsComponent,
    ProjectsExportComponent,
    ExpensesExportComponent,
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
    MatButtonModule,
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
