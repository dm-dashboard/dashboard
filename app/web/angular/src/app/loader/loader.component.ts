import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dmd-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  @Input()
  loading: boolean;

  constructor() { }

  ngOnInit() {
  }

}
