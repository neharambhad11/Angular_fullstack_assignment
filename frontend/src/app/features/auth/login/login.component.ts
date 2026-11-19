import { Component, inject, signal } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html'
})
export class Login {

  private fb = inject(FormBuilder);

  private auth = inject(Auth);

  private router = inject(Router);

  loading = signal(false);

  errorMessage = signal('');

  loginForm = this.fb.nonNullable.group({

    username: ['', [
      Validators.required,
      Validators.minLength(3)
    ]],

    password: ['', [
      Validators.required,
      Validators.minLength(6)
    ]]

  });

  submit(): void {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;

    }

    this.loading.set(true);

    this.errorMessage.set('');

    this.auth.login(this.loginForm.getRawValue())
      .subscribe({

        next: () => {

          this.loading.set(false);

          this.router.navigate(['/dashboard']);

        },

        error: (error) => {

          this.loading.set(false);

          this.errorMessage.set(
            error.error?.message ?? 'Login failed'
          );

        }

      });

  }

}