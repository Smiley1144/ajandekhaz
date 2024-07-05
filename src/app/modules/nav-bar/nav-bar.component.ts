import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  navbarOpen = false;

  constructor() {}

  ngOnInit(): void {}

  toggleNavbar(): void {
    this.navbarOpen = !this.navbarOpen;
  }

  setActive(link: string) {
    // Töröljük el az összes 'active' osztályt a nav-item elemekről
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // Állítsuk be az aktív osztályt a kattintott elemre
    const activeNavItem = document.querySelector(`.nav-item.${link}`);
    if (activeNavItem) {
      activeNavItem.classList.add('active');
    }
  }
}
