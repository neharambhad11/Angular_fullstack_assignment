import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

import { Order } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private http = inject(HttpClient);

  private apiUrl = `${API_BASE_URL}/orders`;

  getOrders(): Observable<Order[]> {

    return this.http.get<Order[]>(this.apiUrl);

  }

  getOrderById(id: number): Observable<Order> {

    return this.http.get<Order>(
      `${this.apiUrl}/${id}`
    );

  }

  createOrder(productIds: string[]): Observable<Order> {

    return this.http.post<Order>(
      this.apiUrl,
      { productIds }
    );

  }

  updateOrder(
    id: number,
    productIds: string[]
  ): Observable<Order> {

    return this.http.put<Order>(
      `${this.apiUrl}/${id}`,
      { productIds }
    );

  }

  deleteOrder(id: number): Observable<unknown> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }

}