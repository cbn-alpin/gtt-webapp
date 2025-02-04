import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnectionPageComponent } from './components/connection-page/connection-page.component';
import { HomeComponent } from './components/home/home.component';
import { ListProjectsComponent } from './components/list-projects/list-projects.component';

const routes: Routes = [
  { path: 'connexion', component: ConnectionPageComponent },
  { 
    path: 'accueil', 
    component: HomeComponent,
    children: [
      { path: 'time-entries', component: ListProjectsComponent },
      { path: 'projects', component: ListProjectsComponent },
      { path: 'expenses', component: ListProjectsComponent },
      { path: 'download', component: ListProjectsComponent },
      { path: '**', redirectTo: 'projects', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: '/connexion', pathMatch: 'full' }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
