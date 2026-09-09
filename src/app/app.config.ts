import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ApplicationConfig } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { routes } from './app-routing.module';
import { AuthInterceptor } from './core/auth/auth.interceptor';
import { FRENCH_DATE_FORMATS } from './core/config/date-formats';
import { FrenchPaginatorIntl } from './core/config/french-paginator-intl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule, BrowserAnimationsModule),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }, // Locale en français
    { provide: DateAdapter, useClass: MomentDateAdapter }, // Utilisation de Moment pour la gestion des dates
    { provide: MAT_DATE_FORMATS, useValue: FRENCH_DATE_FORMATS }, // Format personnalisé global
    { provide: MatPaginatorIntl, useClass: FrenchPaginatorIntl },
  ],
};
