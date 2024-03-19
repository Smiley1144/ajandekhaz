import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { ProductModel } from 'src/app/models/product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  subProduct?: Subscription
  productList: ProductModel[] = []
  searchTerm: string = '';
  filteredProducts: ProductModel[] = []
  progressWidth: string = '0';
  lowButton: string = '';
  midButton: string = '';
  highButton: string = '';
  activeButton: string | null = null;
  selectedBrand: string | null = null;

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.lowButton = (document.getElementById('low') as HTMLButtonElement).value;
    this.midButton = (document.getElementById('mid') as HTMLButtonElement).value;
    this.highButton = (document.getElementById('high') as HTMLButtonElement).value;
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

  selectBrand(brand: string): void {
    this.selectedBrand = brand;
    this.filteredProducts = this.productList.filter(product => product.brand === this.selectedBrand);
  }

}
