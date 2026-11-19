import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

import { Product } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);

  private apiUrl = `${API_BASE_URL}/products`;

  getProducts(): Observable<Product[]> {

    return this.http.get<Product[]>(this.apiUrl);

  }

 getProductById(id: string): Observable<any> {

  return this.http.get<any>(`${this.apiUrl}/${id}`);

}


  createProduct(product: Product): Observable<Product> {

    return this.http.post<Product>(
      this.apiUrl,
      product
    );

  }

  updateProduct(id: string, product: Product): Observable<any> {

  return this.http.put<any>(
    `${this.apiUrl}/${id}`,
    product
  );

}
  deleteProduct(id: string): Observable<unknown> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }

}