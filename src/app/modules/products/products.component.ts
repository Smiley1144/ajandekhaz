import { Component, OnInit } from '@angular/core';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, Subscription, map, of } from 'rxjs';
import { ProductModel } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  subProduct!: Subscription
  productList: ProductModel[] = []
  searchTerm: string = '';
  filteredProducts: ProductModel[] = []
  progressWidth: string = '0';
  lowButton: string = '';
  midButton: string = '';
  highButton: string = '';
  activeButton: string | null = null;
  selectedBrand: string | null = null;
  products$: Observable<{ products: ProductModel[], lastDoc: QueryDocumentSnapshot<any> | null }> = of({ products: [], lastDoc: null });
  lastDoc!: QueryDocumentSnapshot;

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    
    this.lowButton = (document.getElementById('low') as HTMLButtonElement).value;
    this.midButton = (document.getElementById('mid') as HTMLButtonElement).value;
    this.highButton = (document.getElementById('high') as HTMLButtonElement).value;

    this.subProduct = this.productService.getProductsWithGetDocs().subscribe({
      next: (product: ProductModel[]) => {
        this.productList = product;
        this.filteredProducts = product;
      },
      error: (err) => {
        
      },
      complete: () => {
        
      }
    })
    
  }

  img2Exists(product: any): boolean {
    return product.hasOwnProperty('img2');
  }

  goToProductDetails(index: number):void {
    this.router.navigate(['products/details/', index]);
  }

  filterProducts() {
    this.filteredProducts = this.productList.filter(product => product.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  clearSeachTerm() {
    this.searchTerm = '';
    this.filteredProducts = this.productList;
    this.activeButton = null;
    this.progressWidth = '0';
    this.selectedBrand = null;
  }

  getMinPrice(): any {
    if (this.filteredProducts.length === 0) {
      return null;
    }
    return Math.min(...this.filteredProducts.map(product => product.price));
  }

  getMaxPrice(): any {
    if (this.filteredProducts.length === 0) {
      return null;
    }
    return Math.max(...this.filteredProducts.map(product => product.price));
  }

  getValueFromButton(value: string): void {
    this.progressWidth = parseInt(value) + '%';
    console.log(this.progressWidth);
  }

  toggleActive(active: string): void {
    this.activeButton = active;
  }

}
