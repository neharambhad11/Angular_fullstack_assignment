import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ProductService } from '../../../core/services/product.service';


describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:5000/api/products';

  const mockProduct = {
    _id: 'product123',
    name: 'Laptop',
    price: 50000,
    description: 'Dell Laptop'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create ProductService', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all products', () => {
    service.getProducts().subscribe((response) => {
      expect(response).toEqual([mockProduct]);
    });

    const req = httpMock.expectOne(apiUrl);

    expect(req.request.method).toBe('GET');

    req.flush([mockProduct]);
  });

  it('should fetch product by ID', () => {
    service.getProductById('product123').subscribe((response) => {
      expect(response).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${apiUrl}/product123`);

    expect(req.request.method).toBe('GET');

    req.flush(mockProduct);
  });

  it('should create a product', () => {
    service.createProduct(mockProduct).subscribe((response) => {
      expect(response).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(apiUrl);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);

    req.flush(mockProduct);
  });

  it('should update a product', () => {
    service.updateProduct('product123', mockProduct).subscribe((response) => {
      expect(response).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${apiUrl}/product123`);

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockProduct);

    req.flush(mockProduct);
  });

  it('should delete a product', () => {
    service.deleteProduct('product123').subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/product123`);

    expect(req.request.method).toBe('DELETE');

    req.flush({ success: true, message: 'Product deleted' });
  });
});