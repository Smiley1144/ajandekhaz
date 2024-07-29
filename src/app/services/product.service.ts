import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firestore, QueryDocumentSnapshot, collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, catchError, from, map, of, switchMap } from 'rxjs';
import { ProductModel } from 'src/app/models/product.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly productCollectionRef = collection(this.firestore, 'gifts');
  private productIds: { [key: number]: string } = {};
  private productIdsLoaded = new BehaviorSubject<boolean>(false);
  
  constructor(private firestore: Firestore) {
    this.initializeProductIds();
  }

  private initializeProductIds(): void {
    getDocs(this.productCollectionRef).then(snapshot => {
      snapshot.docs.forEach((doc, index) => {
        this.productIds[index] = doc.id; // Indexek és Firestore ID-k tárolása
      });
      this.productIdsLoaded.next(true); // Jelzés az indexek betöltéséről
    }).catch(error => {
      console.error("Error initializing product IDs: ", error);
    });
  }

//* Get all products
getProductsWithGetDocs(): Observable<ProductModel[]> {
  return from(getDocs(this.productCollectionRef)).pipe(
    map((snapshot) => {
      return snapshot.docs.map((doc) => {
        const productData: ProductModel = doc.data() as ProductModel;
        productData.id = doc.id; // Firestore ID
        return productData;
      });
    }),
    catchError((error) => {
      console.error("Error fetching documents: ", error);
      return of([]); // Return an empty array on error
    })
  );
}

getProductWithGetDoc(id: string): Observable<ProductModel | undefined> {
  const productDoc = doc(this.firestore, `gifts/${id}`);
  return from(getDoc(productDoc)).pipe(
    map((docSnap) => {
      if (docSnap.exists()) {
        const productData: ProductModel = docSnap.data() as ProductModel;
        productData.id = docSnap.id;
        return productData;
      } else {
        console.error(`Document with id ${id} does not exist!`);
        return undefined;
      }
    }),
    catchError((error) => {
      console.error("Error fetching document: ", error);
      return of(undefined); // Return undefined on error
    })
  );
}

getProductByIndex(index: number): Observable<ProductModel | undefined> {
  return this.productIdsLoaded.pipe(
    switchMap(loaded => {
      if (loaded) {
        const firestoreId = this.productIds[index];
        if (!firestoreId) {
          console.error(`No product found with index ${index}`);
          return of(undefined);
        }
        return this.getProductWithGetDoc(firestoreId);
      } else {
        return of(undefined);
      }
    })
  );
}
}

