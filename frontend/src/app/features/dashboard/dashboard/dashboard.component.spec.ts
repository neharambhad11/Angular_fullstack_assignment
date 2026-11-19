import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { Dashboard } from './dashboard.component';
import { WeatherService } from '../../../core/services/weather.service';

describe('Dashboard', () => {
  const weatherServiceMock = {
    getWeather: vi.fn().mockReturnValue(
      of({
        success: true,
        data: {
          name: 'Mumbai',
          main: {
            temp: 30,
            humidity: 55,
            feels_like: 32,
            temp_min: 29,
            temp_max: 31,
            pressure: 1012
          },
          weather: [
            {
              description: 'clear sky',
              icon: '01d'
            }
          ],
          wind: {
            speed: 5
          },
          sys: {
            country: 'IN'
          }
        }
      })
    )
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]),
        {
          provide: WeatherService,
          useValue: weatherServiceMock
        }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Dashboard);

    expect(fixture.componentInstance).toBeTruthy();
  });
});