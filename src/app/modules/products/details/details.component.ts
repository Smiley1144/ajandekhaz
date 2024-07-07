import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductModel } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  product?: ProductModel;
  
  constructor(
    private productService: ProductService, 
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.loadProductDetails(productId);
    });
  }

  loadProductDetails(id: number): void {
    this.productService.getProductWithGetDoc(id).subscribe({
        next: (data) => {
          this.product = data;
        },
        error: (err) => {
          console.log(err);
        }
      });
    }

}
