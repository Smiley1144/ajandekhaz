import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { ProductModel } from 'src/app/models/product.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly productCollectionRef = collection(this.firestore, 'products')
 
  constructor(private firestore: Firestore) {
    
  }
//* Get all products
  getProductsWithGetDocs(): Observable<ProductModel[]> {
    return from(getDocs(this.productCollectionRef)).pipe(
      map((snapshot) => {
        const resultList = snapshot.docs.map((doc) => {
          const productData: ProductModel = doc.data() as ProductModel;
          productData.id = doc.id;
          return productData;
        });
        return resultList;
      })
    );
  }

  //* Get only one product
  getProductWithGetDoc(id: string){
    const productDoc = doc(this.firestore, `product/${id}`);
    return from(getDoc(productDoc)).pipe(
      map((doc) => {
        const productData: ProductModel = doc.data() as ProductModel;
        productData.id = doc.id;
        return productData;
      })
    )
  }
}

