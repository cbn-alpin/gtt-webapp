import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-modify-password',
  templateUrl: './modify-password.component.html',
  styleUrls: ['./modify-password.component.scss']
})
export class ModifyPasswordComponent {
  @Output() passwordUpdated = new EventEmitter<MouseEvent>();

  passwordForm: FormGroup;
  isLoading = false;
  isPasswordChanged = false;
  passwordError: string = '';


  constructor(private fb: FormBuilder, private userService: UserService,
     private readonly snackBar: MatSnackBar) {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', Validators.required]
    });
  }

  changePassword() {
    this.passwordError = '';

    if (this.passwordForm.invalid) {
      this.passwordError = "Veuillez remplir correctement le formulaire.";
      this.showToast(`${this.passwordError } ❌`, true);
      return;
    }

    const { newPassword, confirmPassword } = this.passwordForm.value;

    if (newPassword !== confirmPassword) {
      this.passwordError = "Les mots de passe ne correspondent pas.";
      this.showToast(`${this.passwordError } ❌`, true);
      return;
    }

    this.isLoading = true;
    const userId = Number(localStorage.getItem('id_user'));

    const passwordData = { password: newPassword };

    this.userService.updateUserById(userId,passwordData).subscribe({
      next: () => {
        this.isPasswordChanged = true;
        this.passwordUpdated.emit(new MouseEvent('click'));
        this.showToast(" Mot de passe changé avec succès ! ✅", false);
        setTimeout(() => {
          this.isPasswordChanged = false;
        }, 3000);
        this.passwordForm.reset();
        Object.keys(this.passwordForm.controls).forEach((key) => {
          this.passwordForm.controls[key].setErrors(null); 
          this.passwordForm.controls[key].markAsPristine(); 
          this.passwordForm.controls[key].updateValueAndValidity();
        });
      },
      error: () => {
        this.passwordError = "Erreur lors du changement de mot de passe.";
        this.showToast(`${this.passwordError } ❌`, true);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  getErrorMessage(field: string): string {
    if (this.passwordForm.controls[field].hasError('required')) {
      return "Ce champ est obligatoire.";
    }
    if (this.passwordForm.controls[field].hasError('minlength')) {
      return "Le mot de passe doit contenir au moins 6 caractères.";
    }
    return "";
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

