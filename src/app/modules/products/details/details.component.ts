import { CartItem, CartService } from './../../../services/cart.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductModel } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  product?: ProductModel;
  subProduct!: Subscription
  productList: ProductModel[] = []
  quantity?: string = '1';
  quantities: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  totalPrice: number = 0;
  displayMessage: string = '';
  cartItems: CartItem[] = [];
  propertyItems: string[] = []; // A darabolt leírás
  textInput: string = '';
  selectedFile: File | null = null;
  errorMessage: string = '';
  
  constructor(
    private productService: ProductService, 
    private route: ActivatedRoute,
    private CartService: CartService,
  ) { }

  ngOnInit(): void {


    this.route.params.subscribe(params => {
      const productIndex = +params['id'] - 1; // Az URL-ből indexet olvasunk ki
      this.loadProductDetails(productIndex);
    });
  }

  // Ezt hívd meg, amikor a felhasználó módosítja a textInput-ot
  onTextInputChange(): void {
    this.CartService.updateTextInput(this.textInput);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file || null; // Ha nincs fájl, állítsd null-ra
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(form: any): void {
    // Ellenőrizzük, hogy a form érvényes-e
    if (this.isValidForm()) {
      // Ha érvényes, akkor lefuttatjuk az addToCart metódust
      this.addToCart();
    } else {
      this.errorMessage = 'Kérjük, töltsd ki a szükséges mezőket!';
    }
  }

  loadProductDetails(productIndex: number): void {
    this.subProduct = this.productService.getProductByIndex(productIndex).subscribe({
      next: (data) => {
        this.product = data;
        this.calculateTotalPrice();
        if (this.product?.property) {
          this.propertyItems = this.product.property.split('-');
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  calculateTotalPrice(): void {
    if (this.product) {
      const quantityString = this.quantity || '1'; // Alapértelmezett érték '1' ha undefined
      const quantityNumber = parseInt(quantityString, 10); // Átalakítjuk számmá
  
      if (quantityNumber === 10) { // Csak számként ellenőrizzük
        this.displayMessage = 'Kérjük, lépjen kapcsolatba velünk a nagyobb mennyiségek árajánlatáért!';
        this.totalPrice = 0; // Itt nem számítjuk az árat
      } else {
        this.totalPrice = (this.product.price ?? 0) * quantityNumber;
        this.displayMessage = ''; // Töröljük az üzenetet, ha nem "10"
      }
    } else {
      this.totalPrice = 0;
    }
  }

  isValidForm(): boolean {
    // Ha a product image szükséges
    const isImageRequired = this.product?.image;
    // Ha a product text szükséges
    const isTextRequired = this.product?.text;
  
    // Ellenőrizzük, hogy legalább az egyik kötelező mező ki van töltve
    const isImageValid = !isImageRequired || (isImageRequired && !!this.selectedFile);
    const isTextValid = !isTextRequired || (isTextRequired && !!this.textInput);
    const quantityString = this.quantity || '1'; // Alapértelmezett érték '1' ha undefined
    const quantityNumber = parseInt(quantityString, 10); // Átalakítjuk számmá
    if (quantityNumber === 10){
      return false;
    }
  
    // Ha a product.image szükséges, és a selectedFile nem üres, vagy
    // Ha a product.text szükséges, és a textInput nem üres
    return (isImageRequired && isImageValid) || (isTextRequired && isTextValid) || (!isImageRequired && !isTextRequired);
  }
  addToCart(): void {
    // Validálás: csak akkor folytatódik, ha a form érvényes
    if (!this.isValidForm()) {
      this.errorMessage = 'Kérjük, töltsön fel egy képet vagy adjon meg egy szöveget!';
      return;
    }
  
    if (this.product) {
      const quantityString = this.quantity || '1'; // Alapértelmezett érték '1', ha undefined
      const quantityNumber = parseInt(quantityString, 10); // Átalakítjuk számmá
  
      const productId = this.product.id ? parseInt(this.product.id.toString(), 10) : 0;
      const cartItem: CartItem = {
        productId: productId,
        productName: this.product.name,
        quantity: quantityNumber,
        price: this.product.price,
        image: this.product.img,
        totalPrice: this.totalPrice
      };
      this.cartItems.push(cartItem);
      this.CartService.addToCart(cartItem);
      alert('A terméket sikeresen hozzáadtuk a kosárhoz!');
    }
  }

  ngOnDestroy(): void {
    if (this.subProduct) {
      this.subProduct.unsubscribe();
    }
  }

}
