import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnectionPageComponent } from './components/connection-page/connection-page.component';
import { HomeComponent } from './components/home/home.component';
import { GestiontempsComponent } from './components/gestiontemps/gestiontemps.component';
import { ListProjectsComponent } from './components/list-projects/list-projects.component';

const routes: Routes = [
    { path: 'connexion', component: ConnectionPageComponent },
    { path: 'accueil', component: HomeComponent },
    { path: 'gestiontemps', component: HomeComponent },
    { path: 'projets', component: ListProjectsComponent },
    { path: '**', redirectTo: '/gestiontemps', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
