import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { ConnectionPageComponent } from './pages/connection-page/connection-page.component';
import { DownloadPageComponent } from './pages/download-page/download-page.component';
import { HomeComponent } from './pages/home/home.component';
import { ListProjectsComponent } from './pages/list-projects/list-projects.component';
import { ListTravelExpenseComponent } from './pages/list-travel-expense/list-travel-expense.component';
import { TimeSheetComponent } from './pages/time-sheet/time-sheet.component';
import { TravelExpenseComponent } from './pages/travel-expense/travel-expense.component';

const routes: Routes = [
  { path: 'connexion', component: ConnectionPageComponent },
  {
    path: 'accueil',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      { path: 'saisie-des-temps', component: TimeSheetComponent },
      { path: 'liste-des-projets', component: ListProjectsComponent },
      { path: 'liste-frais-de-deplacement', component: ListTravelExpenseComponent },
      { path: 'telechargement', component: DownloadPageComponent },
      { path: 'frais-de-deplacement', component: TravelExpenseComponent },
      { path: '**', redirectTo: 'liste-des-projets', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '/connexion', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
