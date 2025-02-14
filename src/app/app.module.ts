import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
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

import { HTTP_INTERCEPTORS } from '@angular/common/http';

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
import { ListExpensesComponent } from './components/list-expenses/list-expenses.component';

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
    ListExpensesComponent,
  
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
    MatDividerModule
],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
