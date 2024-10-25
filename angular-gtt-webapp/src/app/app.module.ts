import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { LoginComponent } from './features/auth/login.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    LoginComponent
  ],
  providers: [
    provideHttpClient(),
    provideRouter(routes)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
