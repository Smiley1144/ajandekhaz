import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firestore, QueryDocumentSnapshot, collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter } from '@angular/fire/firestore';
import { Observable, catchError, from, map, of } from 'rxjs';
import { ProductModel } from 'src/app/models/product.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly productCollectionRef = collection(this.firestore, 'gifts');
  private readonly pageSize = 12;
  
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
    }),
    catchError((error) => {
      console.error("Error fetching documents: ", error);
      return of([]); // Return an empty array on error
    })
  );
}

  //* Get products with pagination

  getProductsWithPagination(lastDoc?: QueryDocumentSnapshot<any> | null): Observable<{ products: ProductModel[], lastDoc: QueryDocumentSnapshot<any> | null }> {
    let q;
    if (lastDoc) {
      q = query(this.productCollectionRef, orderBy('name'), startAfter(lastDoc), limit(this.pageSize));
    } else {
      q = query(this.productCollectionRef, orderBy('name'), limit(this.pageSize));
    }

    return from(getDocs(q)).pipe(
      map((snapshot) => {
        const resultList = snapshot.docs.map((doc) => {
          const productData: ProductModel = doc.data() as ProductModel;
          productData.id = doc.id;
          return productData;
        });
        const lastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
        return { products: resultList, lastDoc: lastVisible };
      }),
      catchError((error) => {
        console.error('Error fetching documents: ', error);
        return of({ products: [], lastDoc: null });
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

