import { Component } from '@angular/core';
import { ProductModel } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  productList: ProductModel[] = [];
  constructor(private productService: ProductService) {}
  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  getDeliveryDate(): string {
    const date = new Date();
    let workDays = 0;
    while (workDays < 7) {
      date.setDate(date.getDate() + 1);
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        workDays++;
      }
    }
    return date.toISOString().split('T')[0];
  }
}
