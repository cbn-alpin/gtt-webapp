import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule
  ],
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" class="toolbar">
        <img src="assets/images/cbna-logo-white.png" alt="CBNA" class="logo">
        <span class="toolbar-spacer"></span>
        <button mat-button [matMenuTriggerFor]="userMenu">
          {{ authService.user()?.first_name }} {{ authService.user()?.last_name }}
        </button>
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item (click)="authService.logout()">Déconnexion</button>
        </mat-menu>
      </mat-toolbar>

      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav mode="side" opened class="sidenav">
          <div class="sidenav-content">
            <a mat-icon-button routerLink="/time-entries" matTooltip="Saisie des temps">
              <mat-icon>schedule</mat-icon>
            </a>
            <a mat-icon-button routerLink="/projects" matTooltip="Liste des projets">
              <mat-icon>description</mat-icon>
            </a>
            <a mat-icon-button routerLink="/expenses" matTooltip="Frais de déplacement">
              <mat-icon>euro_symbol</mat-icon>
            </a>
            @if (authService.isAdmin()) {
              <a mat-icon-button routerLink="/admin/export" matTooltip="Téléchargement">
                <mat-icon>download</mat-icon>
              </a>
            }
          </div>
        </mat-sidenav>

        <mat-sidenav-content class="main-content">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .toolbar {
      position: relative;
      z-index: 2;
      background-color: var(--primary);
      height: var(--height-menu-lg);
    }

    .logo {
      height: 40px;
      margin-right: 16px;
    }

    .toolbar-spacer {
      flex: 1 1 auto;
    }

    .sidenav-container {
      flex: 1;
    }

    .sidenav {
      width: var(--sidebar-width);
      background-color: var(--light-grey);
      border-right: 1px solid var(--grey);
    }

    .sidenav-content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      padding: var(--spacing-md) var(--spacing-sm);
    }

    .main-content {
      padding: var(--spacing-md);
      background-color: var(--light-grey);
    }

    :host ::ng-deep .mat-mdc-icon-button {
      color: var(--primary);
    }

    :host ::ng-deep .mat-mdc-icon-button:hover {
      background-color: var(--light-color);
    }
  `]
})
export class LayoutComponent {
  constructor(public authService: AuthService) { }
}
