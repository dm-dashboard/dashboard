import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dmd-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  gridSize = {
    width: 1.0 / 40,
    height: 1.0 / 22
  };

  constructor() { }

  ngOnInit() {
  }

}
