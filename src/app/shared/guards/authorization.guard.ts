import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { jwtDecode } from "jwt-decode";
import { getToken } from "../functions";

export const AuthorizationGuard: CanActivateFn = (route, state) => {
  if (!getToken()) { return inject(Router).createUrlTree(['/sign-in']); };

  const decodedToken: any = jwtDecode(getToken());

  return decodedToken?.isAdmin || inject(Router).createUrlTree(['/home']);
}
