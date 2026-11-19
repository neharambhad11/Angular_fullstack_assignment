import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (
  request,
  next
) => {

  const token = sessionStorage.getItem('access_token');

  if (!token) {
    return next(request);
  }

  const authRequest = request.clone({

    setHeaders: {
      Authorization: `Bearer ${token}`
    }

  });

  return next(authRequest);

};