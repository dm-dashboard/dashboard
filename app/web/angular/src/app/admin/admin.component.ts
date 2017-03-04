import { Component, OnInit } from '@angular/core';
import { RouterStateSnapshot, RouterState, Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'dmd-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  section = '';

  constructor(private router: Router) {
    router.events
      .filter(event => event instanceof RoutesRecognized)
      .subscribe(event => {
        this.section = this.extractSectionName((event as RoutesRecognized).state);
      });
  }

  extractSectionName(routerState: RouterStateSnapshot | RouterState): string {
    const componentName = ((routerState.root.children[0].component) as Function).name.replace('Component', '');
    return componentName.replace(/([A-Z])+/g, ' $1').trim();
  }

  closeMenu(menu) {
    menu.close();
  }

  ngOnInit() {
    setTimeout(() => {
      this.section = this.extractSectionName(this.router.routerState);
    });
  }

}
