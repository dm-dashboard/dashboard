import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { ClientsComponent } from './clients/clients.component';
import { BroadcastsComponent } from './broadcasts/broadcasts.component';
import { PluginsComponent } from './plugins/plugins.component';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
    { path: '', redirectTo: '/dashboards', pathMatch: 'full' },
    { path: 'dashboards', component: DashboardsComponent },
    { path: 'clients', component: ClientsComponent },
    { path: 'broadcasts', component: BroadcastsComponent },
    { path: 'plugins', component: PluginsComponent },
    { path: 'users', component: UsersComponent },
    { path: 'profile', component: ProfileComponent }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }