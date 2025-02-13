import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-modify-password',
  templateUrl: './modify-password.component.html',
  styleUrls: ['./modify-password.component.scss']
})
export class ModifyPasswordComponent {
  passwordForm: FormGroup;
  isLoading = false;
  isPasswordChanged = false;
  passwordError: string = '';


  constructor(private fb: FormBuilder, private userService: UserService) {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', Validators.required]
    });
  }

  changePassword() {
    this.passwordError = '';

    if (this.passwordForm.invalid) {
      this.passwordError = "Veuillez remplir correctement le formulaire.";
      return;
    }

    const { newPassword, confirmPassword } = this.passwordForm.value;

    if (newPassword !== confirmPassword) {
      this.passwordError = "Les mots de passe ne correspondent pas.";
      return;
    }

    this.isLoading = true;
    const userId = Number(localStorage.getItem('id_user'));

    this.userService.updateUserById(userId,newPassword).subscribe({
      next: () => {
        this.isPasswordChanged = true;
        setTimeout(() => {
          this.isPasswordChanged = false;
        }, 3000);
        this.passwordForm.reset();
      },
      error: () => {
        this.passwordError = "Erreur lors du changement de mot de passe.";
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Méthode pour afficher les erreurs de validation
  getErrorMessage(field: string): string {
    if (this.passwordForm.controls[field].hasError('required')) {
      return "Ce champ est obligatoire.";
    }
    if (this.passwordForm.controls[field].hasError('minlength')) {
      return "Le mot de passe doit contenir au moins 6 caractères.";
    }
    return "";
  }
}

