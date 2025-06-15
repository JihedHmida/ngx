import { Component, signal } from '@angular/core';
import { ModalService } from 'ngx-modal';
import { ExampleModalComponent } from './example-modal.component';
import { FormComponent } from './form.component';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-test',
  template: `
    <button (click)="openModal()">Open Modal</button>
    <button (click)="openFormModal()">Open Modal</button>

    @for (item of items; track $index) {
    <div>{{ item }}</div>
    }
  `,
})
export class NgxModalComponent {
  constructor(private modalService: ModalService) {}
  items = Array.from(Array(1000).keys());
  openModal() {
    const modalRef = this.modalService.open(
      ExampleModalComponent,
      {
        message: signal('Hello from parent!'),
      },
      {
        showBackdrop: true,
        dismissOnBackdropClick: true,
        showCloseButton: true,
        modalClass: 'custom-modal-style',
      }
    );

    // Handle close event if needed
    // General close handler
    modalRef.afterClosed$.subscribe((result) => {
      console.log('Modal closed with:', result.state);
    });

    // Specific handlers
    modalRef.onSubmitted().subscribe((result) => {
      console.log('Form submitted:', result.data);
    });

    modalRef.onEscaped().subscribe(() => {
      console.log('User pressed ESC');
    });

    // Lifecycle events
    modalRef.afterOpened$.subscribe(() => {
      console.log('Modal opened');
    });

    modalRef.beforeClosed$.subscribe(() => {
      console.log('Modal will close');
    });
  }

  openFormModal() {
    const modalRef = this.modalService.open(
      FormComponent,
      {
        data: { title: 'User Form', userId: 123 },
        data2: signal({ title: 'User Form', userId: 123 }),
      },
      {
        showBackdrop: true,
        dismissOnBackdropClick: true,
        showCloseButton: true,
        modalClass: 'custom-modal-style',
      }
    );

    // Handle close event if needed
    // General close handler
    modalRef.afterClosed$.subscribe((result) => {
      console.log('Modal closed with:', result);
    });

    // Specific handlers
    modalRef.onSubmitted().subscribe((result) => {
      console.log('Form submitted:', result.data);
    });

    modalRef.onEscaped().subscribe(() => {
      console.log('User pressed ESC');
    });

    // Lifecycle events
    modalRef.afterOpened$.subscribe(() => {
      console.log('Modal opened');
    });

    modalRef.beforeClosed$.subscribe(() => {
      console.log('Modal will close');
    });
  }
}
