import { NgClass } from '@angular/common';
import { Component, ComponentRef, ElementRef, HostListener, inject, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { CloseState } from '../close-state';
import { ModalRef } from '../modal-ref';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-modal-container',
  template: `
    <div
      #modal
      [ngClass]="{ 'backdrop-active': showBackdrop }"
      [class]="'modal-backdrop ' + backdropClass"
      (click)="onBackdropClick($event)"
      tabindex="-1"
      [style.zIndex]="zIndex"
    >
      <div class="modal-content" [ngClass]="modalClass" [style.zIndex]="zIndex + 1">
        @if (showCloseButton) {
        <button class="close-button" (click)="closeWithButton()">&times;</button>
        }

        <ng-container #modalContent></ng-container>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;

        &.backdrop-active {
          background-color: rgba(0, 0, 0, 0.5);
        }
      }
      .modal-backdrop:focus {
        outline: none;
      }
      .modal-content {
        background: white;
        padding: 20px;
        border-radius: 4px;
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        overflow: auto;
      }

      .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        z-index: 100;
      }
    `,
  ],
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
