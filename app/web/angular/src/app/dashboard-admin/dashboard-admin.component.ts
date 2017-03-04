import { Component, OnInit } from '@angular/core';
import { Dashboard } from '../dashboard';
import { DashboardService } from '../dashboard.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'dmd-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent implements OnInit {
  dashboards: Observable<Dashboard[]>;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboards = this.dashboardService.getDashboards();
  }

}
