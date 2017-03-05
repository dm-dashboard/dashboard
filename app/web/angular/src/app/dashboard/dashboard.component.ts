import { MessageService } from '../message.service';
import { DashboardService } from '../dashboard.service';
import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dashboard } from 'app/dashboard';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'dmd-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {


  gridSize = {
    width: 1.0 / 40,
    height: 1.0 / 22
  };

  dashboard: Observable<Dashboard>;
  element;
  name: string;

  constructor(private route: ActivatedRoute, private dashboardService: DashboardService,
    private domElement: ElementRef, private messageService: MessageService) {

    this.element = domElement.nativeElement;
    route.params
      .subscribe(params => {
        this.loadDashboard(params['name']);
      });

    this.messageService.subscribe('__system__')
      .subscribe(message => {
        switch (message.command) {
          case 'refresh':
            window.location.reload();
            break;
          case 'identify':
          // $rootScope.$emit('identify', message.text);
          // break;
          case 'changeDashboard':
            // setTimeout(function () {
            //   location.path('dashboard/' + message.dashboardId)
            // }, 100);
            break;
        }
      });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.messageService.disconnect();
  }


  loadDashboard(name: string) {
    this.name = name;
    this.dashboard = this.dashboardService
      .getByName(name);
  }

}
