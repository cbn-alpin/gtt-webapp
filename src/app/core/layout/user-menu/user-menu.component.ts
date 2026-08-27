import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { AuthService } from '../../auth/auth.service';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { UserListComponent } from './user-list/user-list.component';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    PasswordChangeComponent,
    UserListComponent,
  ],
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent implements OnInit {
  userName: string | null = '';
  switched_user_name: string | null = '';
  userImage: string | null = '';
  showUsers = false;
  showPasswordChange = false;
  isAdminChangedAccount = false;
  isAdmin = false;

  private readonly authService = inject(AuthService);

  ngOnInit() {
    // Default image if no image
    this.userImage = localStorage.getItem('user_photo') || 'assets/images/default_profil.png';
    this.userName = localStorage.getItem('user_name') || 'Utilisateur';
    this.switched_user_name = localStorage.getItem('switched_user_name');
    this.isAdmin = localStorage.getItem('is_admin') === 'true';
    this.isAdminChangedAccount = localStorage.getItem('isAdminChangedAccount') === 'true';
  }

  toggleUserList(event: MouseEvent) {
    event.stopPropagation();
    this.showUsers = !this.showUsers;
  }

  togglePasswordChange(event: MouseEvent) {
    event.stopPropagation();
    this.showPasswordChange = !this.showPasswordChange;
  }

  setDefaultImage() {
    this.userImage = 'assets/images/default_profil.png';
  }

  logout() {
    this.authService.logout();
  }
}
