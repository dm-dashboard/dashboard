import { Component, OnInit } from '@angular/core';
import { Dashboard } from '../dashboard';
import { DashboardService } from '../dashboard.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'dmd-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss']
})
export class DashboardsComponent implements OnInit {
  dashboards: Observable<Dashboard[]>;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboards = this.dashboardService.getDashboards();
  }

}
