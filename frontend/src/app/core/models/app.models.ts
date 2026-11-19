export interface User {
  id?: number;
  username: string;
}

export interface AuthResponse {
  message?: string;
  token?: string;
  user?: User;
  data?: {
    token?: string;
    user?: User;
  };
}

export interface Product {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  description: string;
}

export interface Order {
  orderId?: number;
  id?: number;
  userId?: number;
  productIds: string[];
  totalAmount: number;
  createdAt?: string;
}

export interface WeatherResponse {

  coord?: {
    lon: number;
    lat: number;
  };

  weather?: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];

  main?: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };

  wind?: {
    speed: number;
    deg: number;
    gust?: number;
  };

  clouds?: {
    all: number;
  };

  visibility?: number;

  sys?: {
    country: string;
    sunrise: number;
    sunset: number;
  };

  name?: string;

  dt?: number;

  timezone?: number;

}