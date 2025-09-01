/*
 * Public API Surface of ngx-runtime-initializer
 */
export * from './lib/app-config';
export * from './lib/app-config.service';
export * from './lib/guards/maintenance.guard';
export * from './lib/models/app-config.model';
export * from './lib/models/runtime-initializer-options';
export * from './lib/runtime-initializer';
declare global {
  const $CORE_API: string;
  const $DEBUG: boolean;
}

export {};
