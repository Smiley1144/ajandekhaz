import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZipCodeService {

  private apiUrl = 'http://api.zippopotam.us/hu'; // Zippopotam API URL (Magyarország)

  constructor(private http: HttpClient) { }

  // Az irányítószám alapján kérdezzük le a várost
  getCityByZipCode(zipCode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${zipCode}`);
  }
}
