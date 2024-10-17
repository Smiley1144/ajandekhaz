import { CartService } from './../../services/cart.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
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
  quantity: number = 0;

  constructor(private CartService: CartService,private cookieService: CookieService) {}

  ngOnInit(): void {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
    }
    this.CartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.updateTotalPrice();
      this.textInput = items.map(item => item.textInput).filter(text => text).join(', ');
      // Frissítjük a quantity-t
      this.quantity = this.CartService.currentQuantity;
    })
    this.CartService.currentTextInput$.subscribe(text => {
      this.textInput = text;
    });

  }

  saveCartToCookies() {
    this.cookieService.set('cartItems', JSON.stringify(this.cartItems), { expires: 7, path: '/' });
  }
  
  loadCartFromCookies() {
    const storedCart = this.cookieService.get('cartItems');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
    }
  }

  updateTotalPrice(): void {
    this.totalPrice = this.CartService.getTotalPrice();
  }

  removeFromCart(index: number, event: Event): void {
    // Megakadályozzuk az alapértelmezett viselkedést (pl. navigációt)
    event.preventDefault();
    event.stopPropagation();
  
    // Töröljük az adott indexen lévő elemet a kosárból
    this.cartItems.splice(index, 1);
  
    // Frissítjük a kosarat a CartService-ben
    this.CartService.updateCart([...this.cartItems]);
    this.updateTotalPrice();
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
