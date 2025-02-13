import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ListUsersComponent } from '../list-users/list-users.component';
import { UserInfos } from 'src/app/models/UserInfos';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  currentTitle: string = localStorage.getItem('newTitle') || '' ;
  userName = localStorage.getItem('user_name') || 'Utilisateur';
  isAdmin: boolean = false;
  // userImage = localStorage.getItem('user_photo') || 'assets/images/default-user.png'; // Image par défaut si aucune image

constructor(private authService: AuthService) {
  this.isAdmin = localStorage.getItem('is_admin') === 'true';
}

  updateTitle(newTitle: string) {
    this.currentTitle = newTitle;
    localStorage.setItem('newTitle', `${newTitle}`);
  }

  logout() {
    this.authService.logout(); 
  }

  showUsers = false;

  toggleUserList(event: MouseEvent) {
    event.stopPropagation(); // Empêche la fermeture du menu
    this.showUsers = !this.showUsers;
  }

  selectUser(user: any) {
    console.log('Selected user:', user);
    // Ajoutez votre logique de sélection d'utilisateur ici
  }

  showPasswordChange = false;

  togglePasswordChange(event: MouseEvent) {
    event.stopPropagation();
    this.showPasswordChange = !this.showPasswordChange;
  }

}
