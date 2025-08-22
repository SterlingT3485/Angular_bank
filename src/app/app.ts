import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgbCollapse],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'Banking Application';
  currentYear = new Date().getFullYear();

  // Navigation bar collapse state
  isMenuCollapsed = true;

  // Toggle menu state
  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }
}
