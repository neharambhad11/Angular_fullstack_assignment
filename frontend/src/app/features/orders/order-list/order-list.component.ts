import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { OrderService } from '../../../core/services/order.service';

import { Order } from '../../../core/models/app.models';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    ReactiveFormsModule
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderList implements OnInit {

  private orderService = inject(OrderService);

  private fb = inject(FormBuilder);

  orders = signal<Order[]>([]);

  loading = signal<boolean>(false);

  errorMessage = signal<string>('');

  successMessage = signal<string>('');

  orderForm = this.fb.nonNullable.group({
    productIds: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadOrders();
  }

  // GET: Load order history
  loadOrders(): void {

    this.loading.set(true);

    this.errorMessage.set('');

    this.orderService.getOrders().subscribe({

      next: (response: any) => {

        console.log('Orders API Response:', response);

        let orderData: any[] = [];

        // Handle different API response formats
        if (Array.isArray(response)) {

          orderData = response;

        } else if (Array.isArray(response?.data)) {

          orderData = response.data;

        } else if (Array.isArray(response?.orders)) {

          orderData = response.orders;

        }

        // Normalize order data
        const formattedOrders: Order[] = orderData.map((order: any) => {

          let productIds: string[] = [];

          if (Array.isArray(order.productIds)) {

            productIds = order.productIds.map(String);

          } else if (typeof order.productIds === 'string') {

            try {

              const parsed = JSON.parse(order.productIds);

              productIds = Array.isArray(parsed)
                ? parsed.map(String)
                : [order.productIds];

            } catch {

              productIds = order.productIds
                .split(',')
                .map((id: string) => id.trim())
                .filter(Boolean);

            }

          }

          return {
            ...order,
            orderId: order.orderId ?? order.id,
            productIds,
            totalAmount: Number(order.totalAmount ?? 0),
            createdAt: order.createdAt ?? order.orderDate
          };

        });

        console.log('Formatted Orders:', formattedOrders);

        this.orders.set(formattedOrders);

        this.loading.set(false);

      },

      error: (error) => {

        console.error('Get Orders Error:', error);

        this.loading.set(false);

        this.orders.set([]);

        this.errorMessage.set(
          error.error?.message ??
          'Unable to load order history.'
        );

      }

    });

  }

  // POST: Create order
  createOrder(): void {

    this.errorMessage.set('');

    this.successMessage.set('');

    if (this.orderForm.invalid) {

      this.orderForm.markAllAsTouched();

      return;

    }

    const productIds = this.orderForm.controls.productIds.value
      .split(',')
      .map(id => id.trim())
      .filter(Boolean);

    if (productIds.length === 0) {

      this.errorMessage.set('Please enter at least one product ID.');

      return;

    }

    this.loading.set(true);

    this.orderService.createOrder(productIds).subscribe({

      next: (response) => {

        console.log('Create Order Response:', response);

        this.orderForm.reset({
          productIds: ''
        });

        this.successMessage.set('Order created successfully!');

        this.loadOrders();

      },

      error: (error) => {

        console.error('Create Order Error:', error);

        this.loading.set(false);

        this.errorMessage.set(
          error.error?.message ?? 'Unable to create order.'
        );

      }

    });

  }

  // GET order ID
  getOrderId(order: Order): number {

    return Number(order.orderId ?? order.id ?? 0);

  }

  // Display product IDs
  getProductIds(order: Order): string[] {

    return Array.isArray(order.productIds)
      ? order.productIds
      : [];

  }

  // PUT: Update order
  updateOrder(order: Order): void {

    const id = this.getOrderId(order);

    if (!id) {

      this.errorMessage.set('Invalid order ID.');

      return;

    }

    const entered = prompt(
      'Enter updated MongoDB product IDs separated by commas:',
      this.getProductIds(order).join(', ')
    );

    if (entered === null) {
      return;
    }

    const productIds = entered
      .split(',')
      .map(value => value.trim())
      .filter(Boolean);

    if (!productIds.length) {

      this.errorMessage.set('At least one product ID is required.');

      return;

    }

    this.orderService.updateOrder(id, productIds).subscribe({

      next: () => {

        this.successMessage.set('Order updated successfully!');

        this.loadOrders();

      },

      error: (error) => {

        console.error('Update Order Error:', error);

        this.errorMessage.set(
          error.error?.message ?? 'Unable to update order.'
        );

      }

    });

  }

  // DELETE: Delete order
  deleteOrder(order: Order): void {

    const id = this.getOrderId(order);

    if (!id) {

      this.errorMessage.set('Invalid order ID.');

      return;

    }

    if (!confirm(`Are you sure you want to delete order #${id}?`)) {

      return;

    }

    this.orderService.deleteOrder(id).subscribe({

      next: () => {

        this.successMessage.set('Order deleted successfully!');

        this.loadOrders();

      },

      error: (error) => {

        console.error('Delete Order Error:', error);

        this.errorMessage.set(
          error.error?.message ?? 'Unable to delete order.'
        );

      }

    });

  }

  // Refresh order history
  refreshOrders(): void {

    this.loadOrders();

  }

}