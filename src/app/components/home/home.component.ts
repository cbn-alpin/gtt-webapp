import { Component, HostListener} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  currentTitle: any = '';
  showUsers = false;
  showPasswordChange = false;
  isMobile: boolean = false;
  isSidenavOpened: boolean = true;
  isAdminChangedAccount : boolean = false;
  userName : any = '';
  userImage :any = '';
  switched_user_name : any = '';
  isAdmin: boolean = false;
  

  constructor(private authService: AuthService) {
    this.currentTitle = localStorage.getItem('newTitle') || '' ;
    this.isAdmin = localStorage.getItem('is_admin') === 'true';
    this.isAdminChangedAccount = localStorage.getItem('isAdminChangedAccount') === 'true';
    this.userName = localStorage.getItem('user_name') || 'Utilisateur';
    this.userImage = localStorage.getItem('user_photo') || 'assets/images/defaultProfil.png'; // Image par défaut si aucune image
    this.switched_user_name = localStorage.getItem('switched_user_name');
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
