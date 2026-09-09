import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { ExportsComponent } from './pages/exports/exports.component';
import { LoginComponent } from './pages/login/login.component';
import { ProjectsListComponent } from './pages/projects-list/projects-list.component';
import { TimesheetComponent } from './pages/timesheet/timesheet.component';
import { TravelExpenseFormComponent } from './pages/travel-expenses/travel-expense-form/travel-expense-form.component';
import { TravelExpenseListComponent } from './pages/travel-expenses/travel-expense-list/travel-expense-list.component';

export const routes: Routes = [
  { path: 'connexion', component: LoginComponent },
  {
    path: 'accueil',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'saisie-temps', component: TimesheetComponent, data: { title: 'Saisie des temps' } },
      {
        path: 'liste-projets',
        component: ProjectsListComponent,
        data: { title: 'Liste des projets' },
      },
      {
        path: 'liste-frais-deplacement',
        component: TravelExpenseListComponent,
        data: { title: 'Liste des frais de déplacement' },
      },
      {
        path: 'exports',
        component: ExportsComponent,
        data: { title: 'Exports' },
      },
      {
        path: 'frais-deplacement',
        component: TravelExpenseFormComponent,
        data: { title: 'Frais de déplacement' },
      },
      { path: '**', redirectTo: 'liste-projets', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '/connexion', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
