import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class WindowService {

  windowSize$: Observable<any>;

  constructor() {

    this.windowSize$ = Observable.fromEvent(window, 'resize');
  }
}