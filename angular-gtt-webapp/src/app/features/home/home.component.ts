import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  template: `
    <div style="padding: 20px;">
      <h1>Welcome {{ authService.user()?.first_name }}</h1>
      <p>Role: {{ authService.user()?.is_admin ? 'Administrator' : 'User' }}</p>
      <button mat-raised-button color="warn" (click)="authService.logout()">Logout</button>
    </div>
  `
})
export class HomeComponent {
  constructor(public authService: AuthService) { }
}
