import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AppConfigService } from '../app-config.service';

/**
 * Factory function to create a route guard that checks the application status.
 *
 * The guard compares the current application status from {@link AppConfigService}
 * with the expected `shouldBeOk` value. If the actual status does not match,
 * the user is redirected to the provided `redirectUrl`.
 *
 * @param shouldBeOk - Expected status:
 *   - `true`: route is accessible only if the app is up/active
 *   - `false`: route is accessible only if the app is down/maintenance
 * @param redirectUrl - URL to redirect to when the status does not match `shouldBeOk`
 * @returns A `CanActivateFn` that enforces the status check.
 *
 * @example
 * // Only allow access when the app is up
 * const guard = createStatusGuard(true, '/maintenance');
 *
 * // Only allow access when the app is down
 * const guard = createStatusGuard(false, '/');
 */
export function createStatusGuard(shouldBeOk: boolean, redirectUrl: string): CanActivateFn {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);
    const isStatusOK = inject(AppConfigService).getStatus();

    if (isStatusOK !== shouldBeOk) {
      router.navigate([redirectUrl], { replaceUrl: true });
      return false;
    }

    return true;
  };
}

/**
 * Predefined guard that only allows access when the application is UP.
 * Redirects to `/maintenance` if the application is down.
 */
export const InMaintenanceGuard = createStatusGuard(true, '/maintenance');

/**
 * Predefined guard that only allows access when the application is DOWN.
 * Redirects to `/` if the application is up.
 */
export const MaintenanceGuard = createStatusGuard(false, '/');
