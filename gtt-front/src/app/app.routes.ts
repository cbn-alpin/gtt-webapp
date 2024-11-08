import { Routes } from '@angular/router';
import { HomeComponent }  from '../home/home.component';

export const routes: Routes = [
    { path: 'accueil', component: HomeComponent },
    { path: '', redirectTo: '/accueil', pathMatch: 'full' }
];
