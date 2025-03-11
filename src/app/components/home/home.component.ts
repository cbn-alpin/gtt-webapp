import { Component, HostListener} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ShareDataService } from 'src/app/services/shareData/share-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  currentTitle: string = localStorage.getItem('newTitle') || '' ;
  showUsers = false;
  showPasswordChange = false;
  isMobile: boolean = false;
  isSidenavOpened: boolean = true;
  isAdminChangedAccount : boolean = false;

  userName = localStorage.getItem('user_name') || 'Utilisateur';
  isAdmin: boolean = false;
  switched_user_name = localStorage.getItem('switched_user_name');
  // userImage = localStorage.getItem('user_photo') || 'assets/images/default-user.png'; // Image par défaut si aucune image

  constructor(private authService: AuthService) {
    this.isAdmin = localStorage.getItem('is_admin') === 'true';
    this.isAdminChangedAccount = localStorage.getItem('isAdminChangedAccount') === 'true';
  }

  updateTitle(newTitle: string) {
    this.currentTitle = newTitle;
    localStorage.setItem('newTitle', `${newTitle}`);
  }

  logout() {
    this.authService.logout();
  }

  @HostListener('window:resize', [])
  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    this.isSidenavOpened = !this.isMobile; 
  }

  toggleSidenav() {
    this.isSidenavOpened = !this.isSidenavOpened;
  }

  closeSidenavOnMobile() {
    if (this.isMobile) {
      this.isSidenavOpened = false;
    }
  } 

  toggleUserList(event: MouseEvent) {
    event.stopPropagation(); 
    this.showUsers = !this.showUsers;
  }

  togglePasswordChange(event: MouseEvent) {
    event.stopPropagation();
    this.showPasswordChange = !this.showPasswordChange;
  }

}
