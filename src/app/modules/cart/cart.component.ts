import { CartService } from './../../services/cart.service';
import { Component } from '@angular/core';
import { ProductModel } from 'src/app/models/product.model';
import { CartItem } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  productList: ProductModel[] = []
  cartItems: CartItem[] = []
  textInput: string | null = '';
  totalPrice: number = 0;
  quantityOfProducts: number = 0;
  deliveryPrice: number = 1290;
  quantity: number = 1;
  constructor(private CartService: CartService){}

  ngOnInit(): void {
    this.CartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.updateTotalPrice();
      this.quantityOfProducts = this.CartService.getQuantityOfProducts();  // Frissíti a termékek mennyiségét
      this.totalPrice = this.CartService.getTotalPrice();
      this.textInput = items.map(item => item.textInput).filter(text => text).join(', ');
      this.freeDelivery(); // Ellenőrizzük, hogy ingyenes e a szállítás
    })
    this.CartService.currentTextInput$.subscribe(text => {
      this.textInput = text;
    });

  }

  onQuantityChange(item: CartItem, event: any) {
    const newQuantity = event.target.value;
    item.quantity = Number(newQuantity); // Update the item's quantity

    // Update the CartService to reflect the new quantity
    this.CartService.updateCart([...this.cartItems]);

    this.updateTotalPrice(); // Recalculate total price
    this.freeDelivery(); // Check for free delivery after quantity change
  }

  freeDelivery(): number {
    return this.totalPrice > 15000 ? 0 : 1290; // Return delivery price based on totalPrice
  }

  quantityOfProd() {
    this.cartItems.length = this.quantityOfProducts;
  }

  updateTotalPrice(): void {
    // Calculate the total price without adding delivery cost yet
    this.totalPrice = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    this.deliveryPrice = this.freeDelivery(); // Minden módosításnál ellenőrizzük a freeDelivery-t
    // Add delivery cost based on the freeDelivery condition
    this.totalPrice += this.deliveryPrice;
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

}
