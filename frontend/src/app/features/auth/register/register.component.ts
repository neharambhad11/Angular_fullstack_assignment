import { Component, inject, signal } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html'
})
export class Register {

  private fb = inject(FormBuilder);

  private auth = inject(Auth);

  private router = inject(Router);

  loading = signal(false);

  message = signal('');

  errorMessage = signal('');

  registerForm = this.fb.nonNullable.group({

    username: ['', [
      Validators.required,
      Validators.minLength(3)
    ]],

    password: ['', [
      Validators.required,
      Validators.minLength(8)
    ]],

    confirmPassword: ['', Validators.required]

  });

  submit(): void {

    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;

    }

    const {
      username,
      password,
      confirmPassword
    } = this.registerForm.getRawValue();

    if (password !== confirmPassword) {

      this.errorMessage.set('Passwords do not match');

      return;

    }

    this.loading.set(true);

    this.auth.register({
      username,
      password
    }).subscribe({

      next: () => {

        this.loading.set(false);

        this.message.set('Registration successful');

        this.router.navigate(['/login']);

      },

      error: (error) => {

        this.loading.set(false);

        this.errorMessage.set(
          error.error?.message ?? 'Registration failed'
        );

      }

    });

  }

}