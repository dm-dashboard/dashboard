import { Injectable, ElementRef } from '@angular/core';

@Injectable()
export class MoveService {

  constructor() { }

  initPosition(element: ElementRef, x: number, y: number, gridSize: number) {
    console.log('Move');
  }

}
