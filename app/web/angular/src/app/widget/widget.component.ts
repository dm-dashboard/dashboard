import { WindowService } from '../window.service';
import { ResizeService } from '../resize.service';
import { MoveService } from '../move.service';
import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Widget } from "app/widget";

@Component({
  selector: 'dmd-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit {
  @Input()
  widget: Widget;

  @Input()
  gridSize: { width: number, height: number };

  @Input()
  dashboardElement;

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
    this.moveService.initPosition(this.dashboardElement, this.element, this.widget.x, this.widget.y, this.gridSize);
    this.resizeService.initSize(this.dashboardElement, this.element, this.widget.width, this.widget.height, this.gridSize);
  }

}
