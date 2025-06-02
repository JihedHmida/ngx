import { NgClass } from '@angular/common';
import { Component, ComponentRef, ElementRef, HostListener, inject, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { CloseState } from '../close-state';
import { ModalRef } from '../modal-ref';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-modal-container',
  templateUrl: './modal-container.component.html',
  styleUrl: './modal-container.component.scss',
  imports: [NgClass],
  standalone: true,
})
export class ModalContainerComponent {
  @ViewChild('modalContent', { read: ViewContainerRef, static: true })
  public modalContent!: ViewContainerRef;

  @ViewChild('modal', { static: true }) modal!: ElementRef;
  modalRef!: ModalRef;
  contentComponent!: ComponentRef<any>;
  modalService = inject(ModalService);

  @Input() showBackdrop = true;
  @Input() dismissOnBackdropClick = true;
  @Input() showCloseButton = true;
  @Input() escapeKeyClose = true;
  @Input() modalClass = '';
  @Input() backdropClass = '';
  @Input() zIndex = 1000;

  focus(): void {
    this.modal.nativeElement.focus();
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    if (this.escapeKeyClose && this.modalService.isTopModal(this.modalRef)) {
      this.close(CloseState.ESCAPE);
    }
  }

  createComponent(component: any): ComponentRef<any> {
    this.modalContent.clear();
    return this.modalContent.createComponent(component);
  }

  onBackdropClick(event: MouseEvent) {
    if (this.dismissOnBackdropClick && event.target === this.modal.nativeElement) {
      this.close(CloseState.BACKDROP_DISMISS);
    }
  }
  closeWithButton() {
    this.close(CloseState.CLOSE_BUTTON);
  }

  close(state: CloseState): void {
    this.modalRef?.close(undefined, state);
  }
}
