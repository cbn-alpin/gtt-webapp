import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
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

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConnectionPageComponent } from './components/connection-page/connection-page.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListProjectsComponent } from './components/list-projects/list-projects.component';
import { ProjectActionsComponent } from './components/project-actions/project-actions.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ActionComponent } from './components/action/action.component';
import { ProjectComponent } from './components/project/project.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { GestiontempsComponent } from './components/gestiontemps/gestiontemps.component';
import { FormsModule } from '@angular/forms';
import { PopupMessageComponent } from './popup-message/popup-message.component';
import { DownloadPageComponent } from './components/download-page/download-page.component';
import { DownloadProjectsComponent } from './components/download-projects/download-projects.component';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { TokenInterceptor } from './components/connection-page/token.interceptor';


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
    GestiontempsComponent
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
    CalendarComponent,
    SocialLoginModule
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule
],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false, // Set to true for automatic sign in
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '800152835915-atf9657e73dip71f7velahqvn3rhf1k0.apps.googleusercontent.com' // <-- Replace with your client ID
            )
          }
        ],
        onError: (err: any) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }, { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
