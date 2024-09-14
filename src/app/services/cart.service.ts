import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  image: string;
  totalPrice: number;
  textInput?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private cart = new BehaviorSubject<CartItem[]>([]);
  private textInputSource = new BehaviorSubject<string | null>(null);
  currentTextInput$ = this.textInputSource.asObservable();

  cart$ = this.cart.asObservable();

  updateTextInput(text: string): void {
    this.textInputSource.next(text);
  }
  
  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  addToCart(item: CartItem): void{
    const existingItem = this.cartItems.find(ci => ci.productId === item.productId);
      this.cartItems.push(item)
      this.cart.next(this.cartItems)
      this.cartSubject.next(this.cartItems);
  }

  getCartItems(): CartItem[]{
    return this.cartItems;
  }

  clearCart(): void{
    this.cartItems = [];
    this.cart.next(this.cartItems);
  }

  constructor() { }
}
