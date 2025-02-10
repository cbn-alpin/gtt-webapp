// connection-page.component.ts
import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
declare const google: any;

@Component({
  selector: 'app-connection-page',
  templateUrl: './connection-page.component.html',
  styleUrls: ['./connection-page.component.scss']
})
export class ConnectionPageComponent implements AfterViewInit {
  loggedIn = false;
  title = 'GESTEMPL';

  constructor(private authService: AuthService, private router: Router) {}

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
          this.router.navigate(['/accueil']);
        },
        error: err => {
          console.error('Google login failed:', err);
          // Handle errors (show a message, etc.)
        }
      });
  }
}
