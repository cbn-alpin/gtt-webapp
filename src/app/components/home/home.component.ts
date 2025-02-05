import { Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  currentTitle: string = 'Saisie des temps';
  activePage: string = 'saisie';

constructor(
  private readonly route: ActivatedRoute,
  private readonly router: Router  ) {}

  updateTitle(newTitle: string) {
    this.currentTitle = newTitle;

    const encodedTitle = encodeURIComponent(this.currentTitle);
    console.log(encodedTitle);

    this.router.navigate(['encodedTitle'], {relativeTo: this.route})
    .then(nav => {
      console.log(nav , "true if navigation is successful");
    }, err => {
      console.log(err, "when there's an error");
    });
  }
  showPage(page: string) {
    this.activePage = page;

    switch (page) {
      case 'saisie':
        this.currentTitle = 'Saisie du temps';
        break;
      case 'projets':
        this.currentTitle = 'Liste des projets';
        break;
      case 'frais':
        this.currentTitle = 'Liste Frais de déplacement';
        break;
      case 'download':
        this.currentTitle = 'Téléchargement';
        break;
      default:
        this.currentTitle = 'Saisie du temps';
    }
  }

}
