import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <div class="login-box">
        <img src="assets/images/cbna-logo.png" alt="CBNA Logo" class="logo">
        <h1>Gestion des temps</h1>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline">
            <mat-label>Identifiant</mat-label>
            <input matInput formControlName="email" type="email" placeholder="votre@email.com">
            @if (loginForm.get('email')?.errors?.['required'] && loginForm.get('email')?.touched) {
              <mat-error>Email requis</mat-error>
            }
            @if (loginForm.get('email')?.errors?.['email'] && loginForm.get('email')?.touched) {
              <mat-error>Email invalide</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Mot de passe</mat-label>
            <input matInput formControlName="password" type="password">
            @if (loginForm.get('password')?.errors?.['required'] && loginForm.get('password')?.touched) {
              <mat-error>Mot de passe requis</mat-error>
            }
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" [disabled]="loading || !loginForm.valid">
            @if (loading) {
              <mat-spinner diameter="20"></mat-spinner>
            } @else {
              <span>Se connecter</span>
            }
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f5f5f5;
    }

    .login-box {
      padding: 2.5rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
      text-align: center;
    }

    .logo {
      width: 200px;
      margin-bottom: 1.5rem;
    }

    h1 {
      margin-bottom: 2rem;
      color: #333;
      font-size: 1.5rem;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    mat-form-field {
      width: 100%;
    }

    button {
      height: 48px;
      margin-top: 1rem;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;

    this.loading = true;
    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login(email, password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      this.loading = false;
    }
  }
}
