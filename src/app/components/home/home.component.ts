import { Component} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  currentTitle: string = 'Saisie des temps';
  activePage: string = 'saisie';
  // Récupération des infos utilisateur (tu peux les stocker dans `localStorage` après connexion)
  userName = localStorage.getItem('user_name') || 'Utilisateur';
  // userImage = localStorage.getItem('user_photo') || 'assets/images/default-user.png'; // Image par défaut si aucune image

constructor(private authService: AuthService  ) {}

  updateTitle(newTitle: string) {
    this.currentTitle = newTitle;
  }

  logout() {
    this.authService.logout(); 
  }

}
