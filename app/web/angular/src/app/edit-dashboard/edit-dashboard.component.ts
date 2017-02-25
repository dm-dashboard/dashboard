import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { Dashboard } from '../dashboard';
import { IGridsterOptions } from 'angular2gridster';

@Component({
  selector: 'dmd-edit-dashboard',
  templateUrl: './edit-dashboard.component.html',
  styleUrls: ['./edit-dashboard.component.scss']
})
export class EditDashboardComponent implements OnInit {

  dashboard: Dashboard;
  isLoading: boolean;
  gridsterConfig: IGridsterOptions = {
    lanes: 5,
    direction: 'horizontal',
    dragAndDrop: true
  };

  constructor(private route: ActivatedRoute, private dashboardService: DashboardService) { }

  ngOnInit() {
    this.isLoading = true;

    this.dashboardService.getById(+this.route.snapshot.params['id'])
      .subscribe(dashboard => {
        this.dashboard = dashboard;
        this.isLoading = false;
      });
  }

}
