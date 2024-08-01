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
  
  constructor(
    private productService: ProductService, 
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {


    this.route.params.subscribe(params => {
      const productIndex = +params['id'] - 1; // Az URL-ből indexet olvasunk ki
      this.loadProductDetails(productIndex);
    });
  }

  loadProductDetails(productIndex: number): void {
    this.subProduct = this.productService.getProductByIndex(productIndex).subscribe({
      next: (data) => {
        this.product = data;
        this.calculateTotalPrice();
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

  ngOnDestroy(): void {
    if (this.subProduct) {
      this.subProduct.unsubscribe();
    }
  }

}
