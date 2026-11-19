import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { ProductList } from './product-list.component';
import { ProductService } from '../../../core/services/product.service';

describe('ProductList', () => {
  const productServiceMock = {
    getProducts: vi.fn().mockReturnValue(of([])),
    deleteProduct: vi.fn().mockReturnValue(of({ success: true }))
  };

  beforeEach(async () => {
    productServiceMock.getProducts.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        provideRouter([]),
        {
          provide: ProductService,
          useValue: productServiceMock
        }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProductList);

    expect(fixture.componentInstance).toBeTruthy();
  });
});