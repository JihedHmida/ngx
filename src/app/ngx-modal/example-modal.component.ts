// example-modal/example-modal.component.ts
import { Component, signal } from '@angular/core';
import { CloseState, ModalService } from 'ngx-modal';
import { FormComponent } from './form.component';

@Component({
  selector: 'app-example-modal',
  template: `
    <h2>Custom Modal</h2>
    <p>Data received: {{ message() }}</p>
    <button (click)="close()">Close</button>
    <button (click)="openFormModal()">openFormModal</button>
  `,
})
export class ExampleModalComponent {
  // modalRef!: ModalRef;

  message = signal<string>('');
  close() {
    this.modalService.getModalRef(this)?.close(null, CloseState.CANCELLED);
  }
  constructor(private modalService: ModalService) {}
  // modalRef!: ModalRef;

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
