# Ngx Seo Utils

[![npm version](https://badge.fury.io/js/ngx-seo-utils.svg)](https://badge.fury.io/js/ngx-seo-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)


**NgxSeoUtils** is an npm package designed to simplify seo management in Angular applications, especially in Server-Side Rendering (SSR) environments.


## Features

- Manage Seo tags in Angular SSR applications effortlessly.
- Compatible with Angular Universal for SSR setups.
- Provides a simple API .
- Supports both client-side and server-side execution.

## Installation

Install the package via npm:

```bash
npm install ngx-storage-utils
```
## Usage
### 


SeoUtilsModule.forRoot(defaultSeoContent)

### Usage in Components or Services

Inject and use `SeoUtilsService` in your Angular components or services:

```typescript
import { Component } from '@angular/core';
import { SeoUtilsService } from 'ngx-seo-utils';

@Component({
  selector: 'app-root',
  template: `<h1>ngx-seo-utils</h1>`,
})
export class AppComponent {
  seoUtilsService = inject(SeoUtilsService);
}
```
## API

- `setSEO(): void`: Set Seo.
