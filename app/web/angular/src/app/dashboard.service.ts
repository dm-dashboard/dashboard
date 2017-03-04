import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Dashboard } from './dashboard';
import { Widget } from './widget';

@Injectable()
export class DashboardService {
  private dashboards: Dashboard[] = [new Dashboard(1, 'default', [
    new Widget('teamcity', 0, 0, 10, 10),
    new Widget('adtempus', 20, 10, 10, 10)
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

  getByName(name: string): Observable<Dashboard> {
    return Observable.of(
      this.dashboards.filter(dash => dash.name === name)[0]
    );
  }

}
