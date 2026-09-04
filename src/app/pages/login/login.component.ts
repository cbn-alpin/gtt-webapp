import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/core/auth/auth.service';
import { environment } from 'src/environments/environment';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSnackBarModule],
})
export class LoginComponent implements AfterViewInit {
  private errorMessage = '';
  private codeClient: any;

  title = 'Potemps-Tille';
  isLoading = false;
  loginForm: FormGroup;

  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private ngZone = inject(NgZone);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    // Initialize the Google Identity Services
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: this.handleCredentialResponse.bind(this),
      auto_select: false,
    });
    google.accounts.id.prompt();

    this.codeClient = google.accounts.oauth2.initCodeClient({
      client_id: environment.googleClientId,
      scope: 'profile email',
      callback: this.handleCodeResponse.bind(this),
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onLoginWithNativeAuth() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials: any = {
        login: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };

      this.authService.loginWithNativeAuth(credentials).subscribe({
        next: () => {
          this.isLoading = false;
          // Ensure that navigation takes place in the Angular zone
          this.ngZone.run(() => {
            this.router.navigate(['/accueil/saisie-temps']);
          });
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 404) {
            this.errorMessage = 'Utilisateur non trouvé. Vérifiez vos identifiants et réessayez.';
          } else if (error.status === 401) {
            this.errorMessage = 'Échec de connexion. Vérifiez vos identifiants.';
          } else {
            this.errorMessage = 'Échec de connexion. Une erreur est survenue.';
          }

          this.showToast(`${this.errorMessage} ❌`, true);
        },
      });
    }
  }

  onLoginWithGoogle(): void {
    this.codeClient.requestCode();
  }

  /**
   * Handle the response from the One Tap prompt (ID token flow).
   */
  private handleCredentialResponse(response: any): void {
    this.authService.loginWithGoogleToken(response.credential).subscribe({
      next: () => {
        this.router.navigate(['/accueil/saisie-temps']);
      },
      error: (err) => {
        const detailedMessage =
          err.error && err.error.message
            ? err.error.message
            : 'Échec de connexion via Google One Tap.';
        console.error('Google One Tap login failed:', err);
        this.showToast(detailedMessage, true);
      },
    });
  }

  /**
   * Handle the response from the popup (authorization code flow).
   */
  private handleCodeResponse(response: any): void {
    this.authService.loginWithGoogleCode(response.code).subscribe({
      next: () => {
        this.router.navigate(['/accueil/saisie-temps']);
      },
      error: (err) => {
        const detailedMessage =
          err.error && err.error.message
            ? err.error.message
            : 'Échec de connexion via Google One Tap.';
        console.error('Google One Tap login failed:', err);
        this.showToast(detailedMessage, true);
      },
    });
  }

  private showToast(message: string, isError = false) {
    this.snackBar.open(message, '', {
      duration: 5000,
      panelClass: isError ? 'error-toast' : 'success-toast',
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}
