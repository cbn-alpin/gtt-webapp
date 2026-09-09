import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, MainLayoutComponent],
})
export class AppComponent implements OnInit {
  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }
}
