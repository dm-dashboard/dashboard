import { BoxModel } from './box-model';
import { Injectable, ElementRef } from '@angular/core';

@Injectable()
export class MoveService {

  constructor() { }

  moveTo(x: number, y: number, element, parent: BoxModel, gridsize: { width: number, height: number }) {
    const widgetBox = new BoxModel(element);

    x = (Math.floor(x / gridsize.width) * gridsize.width);
    y = (Math.floor(y / gridsize.height) * gridsize.height);

    element.style.setProperty('top', `${y}px`);
    element.style.setProperty('left', `${x}px`);
  }

  initPosition(element: ElementRef, x: number, y: number, gridSize: { width: number, height: number }) {
    const dom = element.nativeElement;
    const parent = new BoxModel(dom.parentElement);

    const gridWidth = (gridSize.width * parent.innerWidth);
    const gridHeight = (gridSize.height * parent.innerHeight);

    this.moveTo(x * gridWidth, y * gridHeight, dom, parent, gridSize);
  }

}
