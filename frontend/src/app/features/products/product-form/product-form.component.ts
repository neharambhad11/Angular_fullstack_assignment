import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { ProductService } from '../../../core/services/product.service';

import { Product } from '../../../core/models/app.models';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './product-form.component.html'
})
export class ProductForm implements OnInit {

  private fb = inject(FormBuilder);

  private productService = inject(ProductService);

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  productId: string | null = null;

  isEditMode = false;

  loading = signal(false);

  errorMessage = signal('');

  successMessage = signal('');

  productForm = this.fb.nonNullable.group({

    name: ['', [
      Validators.required,
      Validators.minLength(2)
    ]],

    price: [0, [
      Validators.required,
      Validators.min(0.01)
    ]],

    description: ['', [
      Validators.required,
      Validators.minLength(5)
    ]]

  });

  ngOnInit(): void {

    this.productId = this.route.snapshot.paramMap.get('id');

    this.isEditMode = !!this.productId;

    if (this.productId) {

      this.loadProduct(this.productId);

    }

  }

  // GET particular product by MongoDB ID
  loadProduct(id: string): void {

    this.loading.set(true);

    this.errorMessage.set('');

    console.log('Loading Product ID:', id);

    this.productService.getProductById(id).subscribe({

      next: (response: any) => {

        console.log('Product API Response:', response);

        // Support different backend response structures
        const product: Product | undefined =
          response?.data?.product ??
          response?.data ??
          response?.product ??
          response;

        if (!product || !product.name) {

          this.errorMessage.set('Product details not found.');

          this.loading.set(false);

          return;

        }

        // Patch particular product values into the form
        this.productForm.patchValue({

          name: product.name,

          price: Number(product.price),

          description: product.description ?? ''

        });

        console.log('Patched Product:', this.productForm.value);

        this.loading.set(false);

      },

      error: (error) => {

        console.error('Get Product Error:', error);

        this.loading.set(false);

        this.errorMessage.set(
          error.error?.message ?? 'Unable to load product details.'
        );

      }

    });

  }

  // CREATE or UPDATE product
  submit(): void {

    this.errorMessage.set('');

    this.successMessage.set('');

    if (this.productForm.invalid) {

      this.productForm.markAllAsTouched();

      return;

    }

    this.loading.set(true);

    const product = this.productForm.getRawValue();

    const request = this.isEditMode && this.productId

      ? this.productService.updateProduct(
          this.productId,
          product
        )

      : this.productService.createProduct(product);

    request.subscribe({

      next: (response) => {

        console.log('Save Product Response:', response);

        this.loading.set(false);

        alert(
          this.isEditMode
            ? 'Product updated successfully!'
            : 'Product created successfully!'
        );

        this.router.navigate(['/products']);

      },

      error: (error) => {

        console.error('Save Product Error:', error);

        this.loading.set(false);

        this.errorMessage.set(
          error.error?.message ?? 'Unable to save product.'
        );

      }

    });

  }

  // Reset form
  resetForm(): void {

    if (this.isEditMode && this.productId) {

      this.loadProduct(this.productId);

    } else {

      this.productForm.reset({
        name: '',
        price: 0,
        description: ''
      });

    }

  }

}