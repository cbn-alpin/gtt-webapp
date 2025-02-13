import { Component, HostListener} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  currentTitle: string = 'Saisie des temps';
  isMobile: boolean = false;
  isSidenavOpened: boolean = true;

  // Récupération des infos utilisateur (tu peux les stocker dans `localStorage` après connexion)
  userName = localStorage.getItem('user_name') || 'Utilisateur';
  isAdmin: boolean = false;
  // userImage = localStorage.getItem('user_photo') || 'assets/images/default-user.png'; // Image par défaut si aucune image

constructor(private authService: AuthService) {
  this.isAdmin = localStorage.getItem('is_admin') === 'true';
}

  updateTitle(newTitle: string) {
    this.currentTitle = newTitle;
  }

  logout() {
    this.authService.logout();
  }
  @HostListener('window:resize', [])
  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    this.isSidenavOpened = !this.isMobile; // Fermer le menu si mobile
  }

  toggleSidenav() {
    this.isSidenavOpened = !this.isSidenavOpened;
  }

  closeSidenavOnMobile() {
    if (this.isMobile) {
      this.isSidenavOpened = false;
    }
  }

}
