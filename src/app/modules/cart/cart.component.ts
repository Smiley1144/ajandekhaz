import { CartService } from './../../services/cart.service';
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
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
  priceWithoutShipping: number = 0;
  constructor(private CartService: CartService, private cookieService: CookieService){}

  ngOnInit(): void {
    // Először betöltjük a cookie-kból a kosár tartalmát
    this.loadCartFromCookies();

    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
    }

    this.CartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.updateTotalPrice(); // Újraszámoljuk az árat a szállítási költséggel
      // this.deliveryPrice = this.CartService.getDeliveryPrice(); // Frissítjük a szállítási díjat
      this.quantityOfProducts = this.CartService.getQuantityOfProducts();  // Frissíti a termékek mennyiségét
      // this.totalPrice = this.CartService.getTotalPrice();
      this.textInput = items.map(item => item.textInput).filter(text => text).join(', ');
      // this.freeDelivery(); // Ellenőrizzük, hogy ingyenes e a szállítás
      this.saveCartToCookies(); // Mentjük a kosarat minden frissítés után
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
      try {
          this.cartItems = JSON.parse(storedCart);
          this.CartService.updateCart([...this.cartItems]); // Frissítjük a CartService-t is
      } catch (error) {
          console.error('Invalid cart data in cookies', error);
          this.cartItems = [];
      }
  }
}

  onQuantityChange(item: CartItem, event: any) {
    const newQuantity = event.target.value;
    item.quantity = Number(newQuantity); // Frissítjük a mennyiséget

    // Update the CartService to reflect the new quantity
    this.CartService.updateCart([...this.cartItems]);

    this.updateTotalPrice(); // Újraszámoljuk az összeget
    // this.freeDelivery(); // Megnézzük, hogy ingyenes e a hozzáadás után
  }

  freeDelivery(): void {
    // Ellenőrizzük, hogy a teljes ár meghaladja-e a 15000 forintot, és ennek megfelelően frissítjük a szállítási árat
    this.deliveryPrice = this.totalPrice > 15000 ? 0 : 1290;
  }

  quantityOfProd() {
    this.cartItems.length = this.quantityOfProducts;
  }

  updateTotalPrice(): void {
    // Calculate the total price without adding delivery cost yet
    this.priceWithoutShipping = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    this.totalPrice = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    // Hozzáadja a szállítási költséget
    // Ellenőrizzük, hogy szükség van-e szállítási költségre
    this.freeDelivery();
    // this.deliveryPrice = this.CartService.getDeliveryPrice(); // Itt frissítjük a szállítási díjat
    this.totalPrice += this.deliveryPrice; // Ha szükséges hozzáadjuk a szállítási költséget
  }

  removeFromCart(index: number, event: Event): void {
    // Megakadályozzuk az alapértelmezett viselkedést (pl. navigációt)
    event.preventDefault();
    event.stopPropagation();

    // Megkérdezzük a felhasználót, hogy biztosan törölni szeretné-e a terméket
    const confirmation = confirm('Biztosan törölni szeretné ezt a terméket a kosárból?');
  
    if(confirmation){
      // Töröljük az adott indexen lévő elemet a kosárból
      this.cartItems.splice(index, 1);

      // Frissítsük a localStorage tartalmát
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    
      // Frissítjük a kosarat a CartService-ben
      this.CartService.updateCart([...this.cartItems]);
      this.updateTotalPrice();
      // this.saveCartToCookies(); // Mentjük a frissített kosarat a törlés után
    }
  }

  increaseQuantity(item: CartItem): void {
    item.quantity += 1;
    this.CartService.updateCart([...this.cartItems])
    this.updateTotalPrice();
  }

  decreaseQuantity(item: CartItem): void {
    item.quantity -= 1;
    this.CartService.updateCart([...this.cartItems])
    this.updateTotalPrice();
  }

}
