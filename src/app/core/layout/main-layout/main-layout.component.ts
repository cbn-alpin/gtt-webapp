import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink, RouterOutlet } from '@angular/router';

import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  imports: [
    CommonModule,
    HeaderComponent,
    MatDialogModule,
    MatIconModule,
    MatSidenavModule,
    MatSnackBarModule,
    RouterLink,
    RouterOutlet,
  ],
})
export class MainLayoutComponent implements OnInit {
  isSidenavOpened = true;
  isMobile = false;
  isAdmin = false;

  ngOnInit() {
    this.isAdmin = localStorage.getItem('is_admin') === 'true';
  }

  @HostListener('window:resize', [])
  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    this.isSidenavOpened = !this.isMobile;
  }

  toggleSidenav() {
    this.isSidenavOpened = !this.isSidenavOpened;
  }

  closeSidenavOnMobile() {
    if (this.isMobile) {
      this.isSidenavOpened = false;
    }
  }
}
