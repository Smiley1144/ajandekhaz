import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductModel } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {

  subProduct!: Subscription
  productList: ProductModel[] = []

  constructor(private productService: ProductService, private router: Router) { }
  ngOnInit(): void {
    
    this.subProduct = this.productService.getProductsWithGetDocs().subscribe({
      next: (product: ProductModel[]) => {
        this.productList = product;
        console.log(product);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('Product request is done!');
      }
    })
  }
  }

