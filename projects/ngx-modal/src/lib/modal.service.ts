import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  Injectable,
  Injector,
  inputBinding,
  Type,
} from '@angular/core';
import { filter, Observable, Subject } from 'rxjs';
import { CloseResult, CloseState } from './close-state';
import { ModalConfig } from './modal-config';
import { ModalContainerComponent } from './modal-container/modal-container.component';
import { ModalRef } from './modal-ref';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalStack: Array<{
    containerRef: ComponentRef<ModalContainerComponent>;
    modalRef: ModalRef;
  }> = [];
  private contentComponentRegistry = new WeakMap<any, ModalRef>();

  constructor(private injector: Injector, private appRef: ApplicationRef, private environmentInjector: EnvironmentInjector) {}

  open<T>(component: Type<T>, data?: Partial<T>, config: ModalConfig = {}): ModalRef<T> {
    const zIndex = 1000 + (this.modalStack.length + 1) * 100;

    const bindings = [
      inputBinding('showBackdrop', () => config.showBackdrop ?? true),
      inputBinding('dismissOnBackdropClick', () => config.dismissOnBackdropClick ?? true),
      inputBinding('showCloseButton', () => config.showCloseButton ?? true),
      inputBinding('escapeKeyClose', () => config.escapeKeyClose ?? true),
      inputBinding('modalClass', () => config.modalClass || ''),
      inputBinding('backdropClass', () => config.backdropClass || ''),
      inputBinding('zIndex', () => zIndex),
    ];

    const modalContainerRef = createComponent(ModalContainerComponent, {
      environmentInjector: this.environmentInjector,
      elementInjector: this.injector,
      bindings,
    });

    const contentRef = modalContainerRef.instance.createComponent(component);

    if (contentRef.instance && data) {
      Object.assign(contentRef.instance, data);
    }

    const modalRef = new ModalRef<T>(contentRef.instance, this.generateModalId());
    this.modalStack.push({ containerRef: modalContainerRef, modalRef });
    this.contentComponentRegistry.set(contentRef.instance, modalRef);

    // Configure modal container
    Object.assign(modalContainerRef.instance, {
      modalRef: modalRef,
    });

    document.body.appendChild(modalContainerRef.location.nativeElement);
    this.appRef.attachView(modalContainerRef.hostView);

    modalContainerRef.instance.focus();

    modalRef.afterClosed$.subscribe((result) => {
      this.cleanupModal(modalRef.id);
      this.closeSource.next(result);
    });

    Promise.resolve().then(() => modalRef.notifyAfterOpened());

    return modalRef;
  }

  private generateModalId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  getModalRef(contentComponent: unknown): ModalRef | undefined {
    return this.contentComponentRegistry.get(contentComponent as any);
  }

  private cleanupModal(modalId: number): void {
    const index = this.modalStack.findIndex((m) => m.modalRef.id === modalId);
    if (index === -1) return;

    const [modal] = this.modalStack.splice(index, 1);
    this.contentComponentRegistry.delete(modal.modalRef.componentInstance);

    // Destroy content component
    if (modal.modalRef.contentRef) {
      modal.modalRef.contentRef.destroy();
    }

    // Destroy container
    this.appRef.detachView(modal.containerRef.hostView);
    modal.containerRef.destroy();

    // Update z-index and top status for remaining modals
    this.modalStack.forEach((m) => {
      m.containerRef.changeDetectorRef.detectChanges();
    });

    // Focus new top modal
    if (this.modalStack.length > 0) {
      const topModal = this.modalStack[this.modalStack.length - 1];
      topModal.containerRef.instance.focus();
    }
  }

  getTopModal(): ModalRef | undefined {
    return this.modalStack[this.modalStack.length - 1]?.modalRef;
  }
  isTopModal(modalRef: ModalRef): boolean {
    const top = this.getTopModal();
    console.log(modalRef);

    return top?.id === modalRef.id;
  }

  private closeSource = new Subject<CloseResult>();

  // Listen to all closes
  onClose$(): Observable<CloseResult> {
    return this.closeSource.asObservable();
  }

  // Listen to specific states
  onStateClose$(state: CloseState): Observable<CloseResult> {
    return this.closeSource.pipe(filter((result) => result.state === state));
  }

  // Helper methods for common states
  onSubmitted$(): Observable<CloseResult> {
    return this.onStateClose$(CloseState.SUBMITTED);
  }

  onDismissed$(): Observable<CloseResult> {
    return this.onStateClose$(CloseState.BACKDROP_DISMISS);
  }

  onEscaped$(): Observable<CloseResult> {
    return this.onStateClose$(CloseState.ESCAPE);
  }

  notifyClose(result: CloseResult): void {
    this.closeSource.next(result);
  }
}
