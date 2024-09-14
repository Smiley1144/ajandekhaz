import { CartService } from './../../services/cart.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/services/cart.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  navbarOpen = false;
  cartItems: CartItem[] = []
  textInput: string | null = '';
  totalPrice: number = 0;

  constructor(private CartService: CartService) {}

  ngOnInit(): void {
    this.CartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.totalPrice = this.CartService.getTotalPrice();  // Frissítjük a kosár összértékét
    })
    this.CartService.currentTextInput$.subscribe(text => {
      this.textInput = text;
    });

  }

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
