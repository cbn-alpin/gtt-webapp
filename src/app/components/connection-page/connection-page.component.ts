import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';


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

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
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
        next: (userInfo: any) => {

          console.error('Authentification réussie ', userInfo);
          
          // Stocker le token et autres infos si nécessaire
          localStorage.setItem('access_token', userInfo.access_token);
          localStorage.setItem('user_email', userInfo.email);
          localStorage.setItem('user_name', `${userInfo.first_name} ${userInfo.last_name}`);
          localStorage.setItem('is_admin', `${userInfo.is_admin}`);
          localStorage.setItem('id_user', `${userInfo.id_user}`);

          console.error('user id stocké dans localstorage', userInfo.id_user);

          this.isLoading = false;
          // Rediriger l'utilisateur vers la page d'accueil ou tableau de bord
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
}

