import { MessageService } from '../message.service';
import { DashboardService } from '../dashboard.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dashboard } from 'app/dashboard';
import { Observable } from 'rxjs/Observable';

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

  dashboard: Observable<Dashboard>;
  element;
  name: string;

  constructor(private route: ActivatedRoute, private dashboardService: DashboardService, private domElement: ElementRef,
    private messageService: MessageService) {
    this.element = domElement.nativeElement;
    route.params
      .subscribe(params => {
        this.loadDashboard(params['name']);
      });

    this.messageService.subscribe('message')
      .subscribe(message => {
        console.log(message);
      })
  }

  ngOnInit() {
  }

  loadDashboard(name: string) {
    this.name = name;
    this.dashboard = this.dashboardService
      .getByName(name);
  }

}
