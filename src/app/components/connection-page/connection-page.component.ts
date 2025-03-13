import { AfterViewInit, Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserInfos } from 'src/app/models/UserInfos';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';
declare const google: any;

@Component({
  selector: 'app-connection-page',
  templateUrl: './connection-page.component.html',
  styleUrls: ['./connection-page.component.scss']
})
export class ConnectionPageComponent implements AfterViewInit {
  title = 'GESTEMPS';
  isLoading = false;
  errorMessage = '';
  loginForm: FormGroup;
  codeClient: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private ngZone: NgZone
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  nativeLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials: any = {
        login: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.nativeAuthenticate(credentials).subscribe({
        next: (userInfo: UserInfos) => {
          // Mettre à jour le localStorage de manière synchrone
          localStorage.setItem('access_token', userInfo.access_token);
          localStorage.setItem('user_email', userInfo.email);
          localStorage.setItem('user_name', `${userInfo.first_name} ${userInfo.last_name}`);
          localStorage.setItem('is_admin', `${userInfo.is_admin}`);
          localStorage.setItem('id_user', `${userInfo.id_user}`);
          localStorage.setItem('newTitle', 'saisie des temps');
          localStorage.setItem('user_photo', `${userInfo.picture}`);

          this.isLoading = false;
          // Assurer que la navigation se fait dans la zone Angular
          this.ngZone.run(() => {
            this.router.navigate(['/accueil/saisie-des-temps']);
          });
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 404) {
            this.errorMessage = 'Utilisateur non trouvé. Vérifiez votre email et réessayez.';
          } else if (error.status === 401) {
            this.errorMessage = 'Échec de connexion. Vérifiez vos identifiants.';
          } else {
            this.errorMessage = 'Échec de connexion. Une erreur est survenue.';
          }

          this.showToast(`${this.errorMessage} ❌`, true);
        }
      });
    }
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
      callback: this.handleCodeResponse.bind(this)
    });
  }

  googleLogin(): void {
    this.codeClient.requestCode();
  }

  /**
   * Handle the response from the One Tap prompt (ID token flow).
   */
  handleCredentialResponse(response: any): void {
    console.log("One Tap - Encoded JWT ID token:", response.credential);
    this.authService.loginWithGoogle(response.credential)
      .subscribe({
        next: () => {
          this.router.navigate(['/accueil/saisie-des-temps']);
        },
        error: err => {
          const detailedMessage = err.error && err.error.message
            ? err.error.message
            : 'Échec de connexion via Google One Tap.';
          console.error('Google One Tap login failed:', err);
          this.showToast(detailedMessage, true);
        }
      });
  }

  /**
   * Handle the response from the popup (authorization code flow).
   */
  handleCodeResponse(response: any): void {
    console.log("Popup - Authorization code:", response.code);
    this.authService.loginWithGoogleCode(response.code)
      .subscribe({
        next: () => {
          this.router.navigate(['/accueil/saisie-des-temps']);
        },
        error: err => {
          const detailedMessage = err.error && err.error.message
          ? err.error.message
          : 'Échec de connexion via Google One Tap.';
          console.error('Google One Tap login failed:', err);
          this.showToast(detailedMessage, true);
        }
      });
  }

  showToast(message: string, isError: boolean = false) {
    this.snackBar.open(message, '', {
      duration: 5000,
      panelClass: isError ? 'error-toast' : 'success-toast',
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}

