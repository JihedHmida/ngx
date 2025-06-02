import { ComponentRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CloseResult, CloseState } from './close-state';

export class ModalRef<T = any> {
  private _afterClosed = new Subject<CloseResult<T>>();
  private _beforeClosed = new Subject<void>();
  private _afterOpened = new Subject<void>();

  afterClosed$ = this._afterClosed.asObservable();
  beforeClosed$ = this._beforeClosed.asObservable();
  afterOpened$ = this._afterOpened.asObservable();

  contentRef?: ComponentRef<any>;

  constructor(public componentInstance: any, public readonly id: number) {}

  onSubmitted(): Observable<CloseResult<T>> {
    return this.getStateObservable(CloseState.SUBMITTED);
  }

  onEscaped(): Observable<CloseResult<T>> {
    return this.getStateObservable(CloseState.ESCAPE);
  }

  onBackdropDismiss(): Observable<CloseResult<T>> {
    return this.getStateObservable(CloseState.BACKDROP_DISMISS);
  }

  onStateClose(state: CloseState): Observable<CloseResult<T>> {
    return this.getStateObservable(state);
  }
  onCancelled(): Observable<CloseResult<T>> {
    return this.getStateObservable(CloseState.CANCELLED);
  }
  onUserDismissed(): Observable<CloseResult<T>> {
    return this.afterClosed$.pipe(
      filter((result) => [CloseState.BACKDROP_DISMISS, CloseState.ESCAPE, CloseState.CLOSE_BUTTON].includes(result.state))
    );
  }
  close(result?: any, state: CloseState = CloseState.EXITED): void {
    this._beforeClosed.next();
    this._beforeClosed.complete();
    this._afterClosed.next({ state, data: result });
    this._afterClosed.complete();
  }

  notifyAfterOpened(): void {
    if (this._afterOpened.closed) return;

    this._afterOpened.next();
    this._afterOpened.complete();
  }
  private getStateObservable(state: CloseState): Observable<CloseResult<T>> {
    return this.afterClosed$.pipe(filter((result) => result.state === state));
  }
}
