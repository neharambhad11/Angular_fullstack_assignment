import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WeatherService } from '../../../core/services/weather.service';
import { WeatherResponse } from '../../../core/models/app.models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './dashboard.component.html'
})
export class Dashboard implements OnInit {

  private weatherService = inject(WeatherService);

  city = signal('Mumbai');

  weather = signal<WeatherResponse | null>(null);

  loading = signal(false);

  errorMessage = signal('');

  ngOnInit(): void {
    this.getWeather();
  }

  getWeather(): void {

    const selectedCity = this.city().trim();

    if (!selectedCity) {
      this.errorMessage.set('Please enter a city name.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.weather.set(null);

    this.weatherService.getWeather(selectedCity).subscribe({

      next: (response: any) => {

        console.log('Weather API Response:', response);

        if (response.success && response.data) {

          // Extract actual weather data
          this.weather.set(response.data);

        } else {

          this.errorMessage.set('Weather data not available.');

        }

        this.loading.set(false);

      },

      error: (error) => {

        console.error('Weather API Error:', error);

        this.loading.set(false);

        this.errorMessage.set(
          error.error?.message ?? 'Unable to fetch weather.'
        );

      }

    });

  }

  onCityChange(value: string): void {
    this.city.set(value);
  }

}