import { WindowService } from '../window.service';
import { ResizeService } from '../resize.service';
import { MoveService } from '../move.service';
import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'dmd-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit {

  @Input()
  width: number;

  @Input()
  height: number;

  @Input()
  x: number;

  @Input()
  y: number;

  @Input()
  gridSize: number;

  constructor(
    private element: ElementRef,
    private moveService: MoveService,
    private resizeService: ResizeService,
    private windowService: WindowService) { }

  ngOnInit() {
    this.onResize();
    this.windowService.windowSize$
      .subscribe(() => this.onResize());
  }

  onResize() {
    this.moveService.initPosition(this.element, this.x, this.y, this.gridSize);
    this.resizeService.initSize(this.element, this.width, this.height, this.gridSize);
  }

}
