# Ngx Light Modal

[![npm version](https://badge.fury.io/js/ngx-light-modal.svg)](https://badge.fury.io/js/ngx-light-modal)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**NgxLightModal** is a lightweight, dependency-free Angular modal package built with standalone components and fully dynamic rendering. It supports modal stacking, backdrop control, custom content components, and complete lifecycle observables — without requiring a host component in your templates.

---

## Features

- ✅ **No modal host required** – Just call the service, and it works.
- 🧩 **Standalone Components Support** – Built for modern Angular architecture.
- 📦 **Lightweight & Dependency-Free** – Zero external dependencies, minimal size.
- 📚 **Dynamic Component Injection** – Display any component dynamically as a modal.
- 🔁 **Stackable Modals** – Open and manage multiple modals with ease.
- 🌙 **Backdrop & ESC Handling** – Configurable dismissal via backdrop click or ESC key.
- 🧠 **Full Lifecycle Events** – Hooks for open, close, submit, escape, and more.
- 🎨 Customizable via `modalClass` and options

## Installation

Install the package via npm:

```bash
npm install ngx-light-modal
```

---

## ModalRef Lifecycle Methods

Once you open a modal using `modalService.open(...)`, it returns a `ModalRef<T>` instance.  
Here are all the lifecycle methods available on the `ModalRef`:

| Method                                    | Description                                                |
| ----------------------------------------- | ---------------------------------------------------------- |
| `afterClosed$`                            | Emits once when the modal is closed, regardless of how     |
| `beforeClosed$`                           | Emits right before the modal begins closing                |
| `afterOpened$`                            | Emits once when the modal has been fully opened            |
| `onSubmitted()`                           | Emits when modal closes using `CloseState.SUBMITTED`       |
| `onEscaped()`                             | Emits when modal is closed using the ESC key               |
| `onBackdropDismiss()`                     | Emits when user clicks the backdrop to dismiss             |
| `onCancelled()`                           | Emits when modal closes using `CloseState.CANCELLED`       |
| `onStateClose(state: CloseState)`         | Listen for a specific `CloseState` only                    |
| `onUserDismissed()`                       | Emits when modal closes via ESC, backdrop, or close button |
| `close(result?: any, state?: CloseState)` | Manually close modal with optional result and reason       |

---

### CloseState Enum

```ts
enum CloseState {
  CLOSED = 'CLOSED',
  SUBMITTED = 'SUBMITTED',
  CANCELLED = 'CANCELLED',
  ESCAPED = 'ESCAPED',
  BACKDROP_DISMISS = 'BACKDROP_DISMISS',
  CLOSE_BUTTON = 'CLOSE_BUTTON',
  EXITED = 'EXITED',
}
```

---

## Usage

### Open a Modal from Any Component

```ts
import { Component, inject } from '@angular/core';
import { ModalService } from 'ngx-light-modal';
import { ExampleModalComponent } from './modal/example-modal/example-modal.component';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `<button (click)="openModal()">Open Modal</button>`,
})
export class AppComponent {
  private modalService = inject(ModalService);

  openModal() {
    const modalRef = this.modalService.open(
      ExampleModalComponent,
      { message: 'Hello from parent!' },
      {
        showBackdrop: true,
        dismissOnBackdropClick: true,
        showCloseButton: true,
        modalClass: 'custom-modal-style',
      }
    );

    modalRef.afterClosed$.subscribe((result) => {
      console.log('Modal closed with:', result?.state);
    });

    modalRef.onSubmitted().subscribe((result) => {
      console.log('Submitted data:', result.data);
    });

    modalRef.onEscaped().subscribe(() => {
      console.log('User pressed ESC');
    });

    modalRef.afterOpened$.subscribe(() => {
      console.log('Modal opened');
    });

    modalRef.beforeClosed$.subscribe(() => {
      console.log('Modal will close');
    });

    modalRef.onBackdropDismiss().subscribe(() => console.log('Backdrop clicked'));
    modalRef.onCancelled().subscribe(() => console.log('Cancelled by user'));

    // More specific
    modalRef.onStateClose(CloseState.CLOSE_BUTTON).subscribe(() => console.log('Close button used'));

    // Aggregated
    modalRef.onUserDismissed().subscribe((result) => console.log('Dismissed by user:', result.state));
  }
}
```

---

### Example Modal Component

```ts
import { Component } from '@angular/core';
import { ModalService } from 'ngx-light-modal';
import { CloseState } from 'ngx-light-modal';

@Component({
  selector: 'app-example-modal',
  template: `
    <h2>Custom Modal</h2>
    <p>Data received: {{ message }}</p>
    <button (click)="close()">Close</button>
    <button (click)="openForm()">Open Form Modal</button>
  `,
})
export class ExampleModalComponent {
  message: any;

  constructor(private modalService: ModalService) {}

  close() {
    this.modalService.getModalRef(this)?.close(null, CloseState.CANCELLED);
  }

  openForm() {
    this.modalService.open(FormComponent, {
      data: { title: 'User Form', userId: 123 },
    });
  }
}
```

---

## API

### ModalService

#### `open(component: Type<T>, data?: any, options?: ModalOptions): ModalRef<T>`

Opens a modal component with the specified data and options.

#### `getModalRef(component: object): ModalRef | null`

Returns the `ModalRef` for a given component instance.

---

### ModalRef

Handles lifecycle and communication.

#### Observables

- `afterClosed$`: Emits when modal is closed.
- `beforeClosed$`: Emits right before the modal is closed.
- `afterOpened$`: Emits after the modal is rendered.
- `onSubmitted<T>()`: Emits custom submit result.
- `onEscaped()`: Emits if user hits ESC.

#### Methods

- `close(data?: any, state?: CloseState)`: Closes the modal manually.
- `submit<T>(data: T)`: Triggers the submit observable.
- `escape()`: Simulates ESC key behavior.

---

### ModalOptions

```ts
interface ModalOptions {
  showBackdrop?: boolean; // default: true
  dismissOnBackdropClick?: boolean; // default: true
  showCloseButton?: boolean; // default: true
  modalClass?: string; // optional CSS class for modal
}
```

---

### CloseState

```ts
enum CloseState {
  CLOSED = 'CLOSED',
  SUBMITTED = 'SUBMITTED',
  CANCELLED = 'CANCELLED',
  ESCAPED = 'ESCAPED',
}
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<!-- ## Contributions -->
