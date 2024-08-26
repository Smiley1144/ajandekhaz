import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  image: string;
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems: CartItem[] = [];
  private cart = new BehaviorSubject<CartItem[]>([])

  cart$ = this.cart.asObservable();

  addToCart(item: CartItem): void{
    const existingItem = this.cartItems.find(ci => ci.productId === item.productId);
    if(existingItem){
      existingItem.quantity += item.quantity;
      existingItem.totalPrice += item.totalPrice;
    }
    else{
      this.cartItems.push(item)
    }
    this.cart.next(this.cartItems)
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
