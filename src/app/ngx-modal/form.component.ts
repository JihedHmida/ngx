import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CloseState, ModalRef, ModalService } from 'ngx-modal';
import { ExampleModalComponent } from './example-modal.component';

@Component({
  selector: 'app-form',
  imports: [CommonModule],
  template: `
    <h2>Form Component</h2>
    <label for="name">Name:</label>
    <input type="text" id="name" />
    <p>Received Data: {{ data | json }}</p>
    <p>Received Data 2 : {{ data2 | json }}</p>

    <button type="button" (click)="submit()">Submit</button> <button type="button" (click)="openModal()">Open Modal</button>
  `,
  styles: `
      form {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
    `,
})
export class FormComponent {
  @Input() data: any;
  @Input() data2: any;
  constructor(private modalService: ModalService) {}
  get modalRef(): ModalRef | undefined {
    return this.modalService.getModalRef(this);
  }
  submit() {
    this.modalRef?.close({ data: this.data2 }, CloseState.SUBMITTED);
  }
  cancel() {
    this.modalRef?.close(null, CloseState.CANCELLED);
  }

  openModal() {
    const modalRef = this.modalService.open(
      ExampleModalComponent,
      {
        message: 'Hello from parent!',
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
}
