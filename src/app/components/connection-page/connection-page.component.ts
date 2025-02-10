import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-connection-page',
  templateUrl: './connection-page.component.html',
  styleUrls: ['./connection-page.component.scss']
})
export class ConnectionPageComponent {
  title = 'GESTEMPS';
  credentials = { login: '', password: '' };
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  nativeLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.nativeAuthenticate(this.credentials).subscribe({
      next: (userInfo: any) => {
        console.log('Authentification réussie ✅', userInfo);
        
        // Stocker le token et autres infos si nécessaire
        localStorage.setItem('access_token', userInfo.access_token);
        localStorage.setItem('user_email', userInfo.email);
        localStorage.setItem('user_name', `${userInfo.first_name} ${userInfo.last_name}`);
        localStorage.setItem('is_admin', `${userInfo.is_admin}`);
        localStorage.setItem('id_user', `${userInfo.id_user}`);

        console.error('user id stocké dans localstorage', userInfo.id_user);

        this.isLoading = false;
        // TODO: Rediriger l'utilisateur vers la page d'accueil ou tableau de bord
        this.router.navigate(['/accueil/saisie-des-temps']);
      },
      error: (error) => {
        console.error('Erreur lors de l’authentification ❌', error);
        this.errorMessage = 'Échec de connexion. Vérifiez vos identifiants.';
        this.isLoading = false;
      }
    });
  }
}

