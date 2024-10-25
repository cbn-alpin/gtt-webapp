import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: HomeComponent
      },
      // Other routes will go here
    ]
  }
];
