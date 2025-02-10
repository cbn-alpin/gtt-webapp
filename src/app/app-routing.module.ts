import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnectionPageComponent } from './components/connection-page/connection-page.component';
import { HomeComponent } from './components/home/home.component';
import { ListProjectsComponent } from './components/list-projects/list-projects.component';
import { DownloadProjectsComponent } from './components/download-projects/download-projects.component';
import { AuthGuard } from './guards/auth.guard';
import { TimeSheetComponent } from './components/TimeSheet/TimeSheet.component';

const routes: Routes = [
  { path: 'connexion', component: ConnectionPageComponent },
  {
    path: 'accueil',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'TimeSheet', component: TimeSheetComponent },
      { path: 'liste-des-projets', component: ListProjectsComponent },
      { path: 'expenses', component: ListProjectsComponent },
      { path: 'telechargement', component: DownloadProjectsComponent },
      { path: '**', redirectTo: 'liste-des-projets', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: '/connexion', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
