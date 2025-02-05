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
  }

}
