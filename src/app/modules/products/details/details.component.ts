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
  
  constructor(
    private productService: ProductService, 
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {


    this.route.params.subscribe(params => {
      const productIndex = +params['id']; // Az URL-ből indexet olvasunk ki
      this.loadProductDetails(productIndex);
    });
  }

  loadProductDetails(productIndex: number): void {
    this.subProduct = this.productService.getProductByIndex(productIndex).subscribe({
      next: (data) => {
        this.product = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }


}
