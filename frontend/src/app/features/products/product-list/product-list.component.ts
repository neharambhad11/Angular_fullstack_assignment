import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/app.models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CurrencyPipe
  ],
  templateUrl: './product-list.component.html'
})
export class ProductList implements OnInit {

  private productService = inject(ProductService);

  products = signal<Product[]>([]);

  loading = signal<boolean>(false);

  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.loadProducts();
  }

  // Load all products
  loadProducts(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.productService.getProducts().subscribe({

      next: (response: any) => {

        console.log('API Response:', response);

        // Handle different backend response formats
        let productData: Product[] = [];

        if (Array.isArray(response)) {

          productData = response;

        } else if (Array.isArray(response?.data)) {

          productData = response.data;

        } else if (Array.isArray(response?.products)) {

          productData = response.products;

        }

        console.log('Products received:', productData);

        this.products.set(productData);

        this.loading.set(false);

      },

      error: (error) => {

        console.error('Product API Error:', error);

        this.loading.set(false);

        this.products.set([]);

        this.errorMessage.set(
          error.error?.message ||
          error.message ||
          'Unable to load products. Please try again.'
        );

      }

    });

  }

  // Get product ID
  getProductId(product: Product): string {

    return String(product._id ?? product.id ?? '');

  }

  // Delete product
  deleteProduct(product: Product): void {

    const id = this.getProductId(product);

    if (!id) {

      this.errorMessage.set('Product ID not found.');

      return;

    }

    const confirmDelete = confirm(
      `Are you sure you want to delete ${product.name}?`
    );

    if (!confirmDelete) {
      return;
    }

    this.productService.deleteProduct(id).subscribe({

      next: (response) => {

        console.log('Delete response:', response);

        alert('Product deleted successfully!');

        this.loadProducts();

      },

      error: (error) => {

        console.error('Delete error:', error);

        this.errorMessage.set(
          error.error?.message || 'Unable to delete product.'
        );

      }

    });

  }

  // Refresh product list
  refreshProducts(): void {

    this.loadProducts();

  }

}