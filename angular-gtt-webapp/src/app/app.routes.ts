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
      {
        path: 'time-entries',
        loadChildren: () => import('./features/time-entries/time-entries.routes')
          .then(m => m.TIME_ENTRIES_ROUTES)
      }
      //{
      //  path: '',
      //  redirectTo: 'time-entries',
      //  pathMatch: 'full'
      //}
    ]
  }
];
