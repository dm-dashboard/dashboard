import { BoxModel } from './box-model';
import { Injectable, ElementRef } from '@angular/core';

@Injectable()
export class ResizeService {

  constructor() { }


  initSize(element: ElementRef, width: number, height: number, gridSize: { width: number, height: number }) {
    const dom = element.nativeElement;
    const parent = new BoxModel(dom.parentElement);

    const gridWidth = (gridSize.width * parent.innerWidth);
    const gridHeight = (gridSize.height * parent.innerHeight);

    const domBox = new BoxModel(dom);
    dom.style.setProperty('width', `${(gridWidth * width) - domBox.horizontalBorder()}px`);
    dom.style.setProperty('height', `${(gridHeight * height) - domBox.verticalBorder()}px`);
  }
}


