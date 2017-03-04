import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Dashboard } from './dashboard';
import { Widget } from './widget';

@Injectable()
export class DashboardService {
  private dashboards: Dashboard[] = [new Dashboard(1, 'Duane', [
    new Widget('teamcity', 1, 1, 1, 1),
    new Widget('adtempus',50, 2, 1, 1)
  ])];

  constructor() {

  }

  getDashboards(): Observable<Dashboard[]> {
    return Observable.of(
      this.dashboards
    );
  }

  getById(id: number): Observable<Dashboard> {
    return Observable.of(
      this.dashboards.filter(dash => dash.id === id)[0]
    );
  }

}
