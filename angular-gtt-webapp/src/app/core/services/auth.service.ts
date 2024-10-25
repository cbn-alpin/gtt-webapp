import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id_user: number;
  email: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly MOCK_USERS = [
    {
      id_user: 1,
      email: 'admin@cbna.fr',
      first_name: 'Admin',
      last_name: 'User',
      is_admin: true
    },
    {
      id_user: 2,
      email: 'user@cbna.fr',
      first_name: 'Normal',
      last_name: 'User',
      is_admin: false
    }
  ];

  private currentUser = signal<User | null>(null);

  public user = computed(() => this.currentUser());

  constructor(private router: Router) { }

  async login(email: string, password: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = this.MOCK_USERS.find(u => u.email === email) || this.MOCK_USERS[1];
    this.currentUser.set(user);
    this.router.navigate(['/']);
  }

  logout(): void {
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUser();
  }

  isAdmin(): boolean {
    return this.currentUser()?.is_admin ?? false;
  }
}
