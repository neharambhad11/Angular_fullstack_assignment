import { Injectable, inject } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

import { WeatherResponse } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private http = inject(HttpClient);

  getWeather(city: string): Observable<WeatherResponse> {

    const params = new HttpParams()
      .set('city', city);

    return this.http.get<WeatherResponse>(
      `${API_BASE_URL}/weather`,
      { params }
    );

  }

}