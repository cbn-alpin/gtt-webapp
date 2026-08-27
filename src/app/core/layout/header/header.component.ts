import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { filter, map, mergeMap } from 'rxjs';

import { UserMenuComponent } from '../user-menu/user-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, MatToolbarModule, UserMenuComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() menuToggled = new EventEmitter<void>();

  private readonly defaultTitle = 'Potemps-Tille';
  currentTitle: string | null = '';

  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly titleService = inject(Title);

  ngOnInit(): void {
    this.currentTitle = localStorage.getItem('newTitle') || this.defaultTitle;
    this.titleService.setTitle(this.currentTitle);
    this.handleRouteChange();
  }

  toggleSidenav() {
    this.menuToggled.emit();
  }

  private handleRouteChange(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        mergeMap((route) => {
          console.log('route:', route.data);
          return route.data;
        })
      )
      .subscribe((data) => {
        const pageTitle = data['title'] || this.defaultTitle;
        this.currentTitle = pageTitle;
        localStorage.setItem('newTitle', `${pageTitle}`);
        this.titleService.setTitle(`${pageTitle} - Potemps-Tille`);
      });
  }
}
