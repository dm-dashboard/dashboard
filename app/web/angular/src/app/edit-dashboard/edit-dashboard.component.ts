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

  widgets: Array<any> = [
    {
      x: 0, y: 0, w: 1, h: 2,
      title: 'Basic form inputs 1',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
      x: 1, y: 0, w: 2, h: 1,
      title: 'Basic form inputs 2',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
      x: 1, y: 1, w: 2, h: 1,
      title: 'Basic form inputs 3',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
      x: 3, y: 0, w: 1, h: 2,
      title: 'Basic form inputs 4',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    }
  ];

  // gridConfig = {
  //   resizeable: true,
  //   margins: [5, 10],
  //   min_cols : 40,
  //   min_rows : 22,
  //   col_width: 10,
  //   row_height : 20,
  //   min_width: 10,
  //   min_height : 20,
  //   fix_to_grid : true
  // };

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
