import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { OrderList } from './order-list.component';
import { OrderService } from '../../../core/services/order.service';

describe('OrderList', () => {
  const orderServiceMock = {
    getOrders: vi.fn().mockReturnValue(of([])),
    createOrder: vi.fn().mockReturnValue(of({ success: true })),
    updateOrder: vi.fn().mockReturnValue(of({ success: true })),
    deleteOrder: vi.fn().mockReturnValue(of({ success: true }))
  };

  beforeEach(async () => {
    orderServiceMock.getOrders.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [OrderList],
      providers: [
        provideRouter([]),
        {
          provide: OrderService,
          useValue: orderServiceMock
        }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(OrderList);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should load orders', () => {
    const fixture = TestBed.createComponent(OrderList);
    fixture.detectChanges();

    expect(orderServiceMock.getOrders).toHaveBeenCalled();
  });
});