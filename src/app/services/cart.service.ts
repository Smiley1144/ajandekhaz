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

  addToCart(item: CartItem): void {
    // Ellenőrizd, hogy azonos termék és ugyanaz a textInput van-e már a kosárban
    const existingItem = this.cartItems.find(ci => 
      ci.productId === item.productId && ci.textInput === item.textInput
    );
    
    if (existingItem) {
      // Ha létezik ugyanolyan termék azonos inputtal, frissítjük a mennyiségét és az összárat
      existingItem.quantity += item.quantity;
      existingItem.totalPrice += item.totalPrice;
    } else {
      // Ha a termék vagy az input eltér, akkor külön adjuk hozzá
      this.cartItems.push(item);
    }

    console.log("Cart items after adding:", this.cartItems); // DEBUG LOG
    
    // Frissítjük a kosár állapotát
    this.cart.next(this.cartItems);
    this.cartSubject.next(this.cartItems);
  }

  updateCart(updatedItems: CartItem[]): void {
    this.cartSubject.next(updatedItems);  // Frissítjük a Subject-et
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
