import { Component, OnInit } from '@angular/core';
import { RouterState, RouterStateSnapshot, Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'dmd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  section = '';

  constructor(private router: Router) {
    router.events
      .filter(event => event instanceof RoutesRecognized)
      .subscribe(event => {
        this.section = this.extractSectionName((event as RoutesRecognized).state);
      });
  }

  extractSectionName(routerState: RouterStateSnapshot | RouterState): string {
    return ((routerState.root.children[0].component) as Function).name.replace('Component', '');
  }

  ngOnInit() {
    setTimeout(() => {
      this.section = this.extractSectionName(this.router.routerState);
    });
  }


}
