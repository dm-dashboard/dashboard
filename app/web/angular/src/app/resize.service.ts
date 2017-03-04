import { Injectable, ElementRef } from '@angular/core';

@Injectable()
export class ResizeService {

  constructor() { }


  initSize(element: ElementRef, width:number, height:number, gridSize:number) {
    console.log('Resize');
  }
}
