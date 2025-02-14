import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserInfos } from 'src/app/models/UserInfos';
import { AuthService } from 'src/app/services/auth/auth.service';
declare const google: any;


@Component({
  selector: 'app-connection-page',
  templateUrl: './connection-page.component.html',
  styleUrls: ['./connection-page.component.scss']
})
export class ConnectionPageComponent {
  title = 'GESTEMPS';
  isLoading = false;
  errorMessage = '';
  loginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, 
    private fb: FormBuilder, private readonly snackBar: MatSnackBar) {
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

      const credentials : any = {
        login: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.nativeAuthenticate(credentials).subscribe({
        next: (userInfo: UserInfos) => {
          localStorage.setItem('access_token', userInfo.access_token);
          localStorage.setItem('user_email', userInfo.email);
          localStorage.setItem('user_name', `${userInfo.first_name} ${userInfo.last_name}`);
          localStorage.setItem('is_admin', `${userInfo.is_admin}`);
          localStorage.setItem('id_user', `${userInfo.id_user}`);
          localStorage.setItem('newTitle', `saisie des temps`);
          console.error("courant user:", userInfo.is_admin);
          this.isLoading = false;
          this.router.navigate(['/accueil/saisie-des-temps']);
          console.error("courant user après redirection:", userInfo.is_admin);
        },
        error: (error) => {
          this.errorMessage = 'Échec de connexion. Vérifiez vos identifiants.';
          this.showToast(` ${this.errorMessage } ❌`, true);
          this.isLoading = false;
        }
      });
    }
  }

  ngAfterViewInit(): void {
    // Initialize the Google Identity Services
    google.accounts.id.initialize({
      client_id: '800152835915-atf9657e73dip71f7velahqvn3rhf1k0.apps.googleusercontent.com',                   
      callback: this.handleCredentialResponse.bind(this),
      auto_select: false,
    });

    // Render the Google sign-in button into a container element
    google.accounts.id.renderButton(
      document.getElementById("google-signin-button"),
      { theme: "outline", size: "large" }
    );
  }

  handleCredentialResponse(response: any): void {
    console.log("Encoded JWT ID token:", response.credential);

    // Use the AuthService to handle login
    this.authService.loginWithGoogle(response.credential)
      .subscribe({
        next: () => {
          // On successful authentication, navigate to the protected home route
          this.router.navigate(['/accueil/saisie-des-temps']);
        },
        error: err => {
          console.error('Google login failed:', err);
          // Handle errors (show a message, etc.)
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

