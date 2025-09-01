# Ngx Runtime Initializer

[![npm version](https://badge.fury.io/js/ngx-runtime-initializer.svg)](https://badge.fury.io/js/ngx-runtime-initializer)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**NgxRuntimeInitializer** is an Angular utility for loading runtime configuration from JSON, managing global app settings, and optionally injecting services with post-initialization callbacks. Perfect for SSR, feature toggles, and dynamic environment configuration.

---

## Features

- Load runtime configuration (`config.json` or custom URL) at app initialization.
- Validate essential properties (`apiURL`, `debug`, `requestTimeout`).
- Inject services into post-initialization logic.
- Support fallback configuration on failure.
- Provides Angular signals for reactive configuration.
- Built-in guards for maintenance mode or app status handling.

---

## Installation

Install via npm:

```bash
npm install ngx-runtime-initializer
```

---

## Usage

### 1. Define your runtime config JSON

```json
// config.json
{
  "coreConfig": {
    "apiURL": "https://api.example.com",
    "debug": true,
    "requestTimeout": 30000
  },
  "status": true
}
```

---

### 2. Provide the runtime initializer in standalone bootstrap

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRuntimeInitializer } from 'ngx-runtime-initializer';

bootstrapApplication(AppComponent, {
  providers: [provideRuntimeInitializer()],
});
```

> ✅ Loads `config.json` with default behavior.

---

### 3. Custom initialization

```ts
import { RuntimeInitializerOptions, provideRuntimeInitializer } from 'ngx-runtime-initializer';
import { MyService1, MyService2 } from './services';

bootstrapApplication(AppComponent, {
  providers: [
    provideRuntimeInitializer(
      new RuntimeInitializerOptions(
        '/assets/runtime-config.json',
        [MyService1, MyService2],
        async (config, services) => {
          console.log('Config loaded:', config);
          services.MyService1?.initialize();
        },
        (error, services) => {
          console.warn('Failed to initialize runtime config:', error);
        }
      )
    ),
  ],
});
```

---

### 4. Accessing configuration

```ts
import { inject } from '@angular/core';
import { AppConfigService } from 'ngx-runtime-initializer';

const appConfigService = inject(AppConfigService);

// Full config
const config = appConfigService.getConfig();

// Specific property
const apiURL = appConfigService.getConfigProperty<string>('coreConfig')?.apiURL;

// Reactive signal
const configSignal = appConfigService.getConfigSignal();
```

---

### 5. Guards for maintenance and status

```ts
import { InMaintenanceGuard, MaintenanceGuard, createStatusGuard } from 'ngx-runtime-initializer';

{
  path: 'maintenance',
  canActivate: [InMaintenanceGuard]
}

{
  path: '',
  canActivate: [MaintenanceGuard]
}

// Or create a custom guard
{
  path: 'custom',
  canActivate: [createStatusGuard(true, '/maintenance')]
}
```

---

## API

### RuntimeInitializerOptions

Class to configure the runtime initializer.

**Constructor**

```ts
new RuntimeInitializerOptions(
  configUrl?: string,
  servicesToInject?: Type<any>[],
  postInit?: (config: AppConfig, services: Record<string, any>) => Promise<void>,
  handleInitializationFailure?: (error: any, services: Record<string, any>) => void
)
```

**Defaults:**

- `configUrl = 'config.json'`
- `servicesToInject = []`
- `postInit = async () => {}`
- `handleInitializationFailure = () => {}`

---

### provideRuntimeInitializer(options?: RuntimeInitializerOptions)

Provides an Angular `provideAppInitializer` — equivalent to `APP_INITIALIZER` in pre-standalone Angular versions — to load runtime configuration.

---

### AppConfigService

- `getConfig(): AppConfig` — Returns full config.
- `getConfigProperty<T>(key: keyof AppConfig): T | undefined` — Returns a specific property.
- `getConfigSignal(): WritableSignal<AppConfig>` — Reactive configuration.
- `getStatus(): boolean` — Returns app status.

---

### AppConfig

Default configuration class:

```ts
coreConfig = { apiURL: '__BACKEND__', debug: false, requestTimeout: 30000 };
status = false;
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
