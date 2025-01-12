import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  
  const user = userService.user();

  if (!user) {
    return router.navigate(['login'])
  }

  if (user?.role === 'ADMIN') {
    return true;
  }

  return router.navigate(['unauthorized'])
};
