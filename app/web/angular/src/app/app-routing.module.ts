import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { ClientsComponent } from './clients/clients.component';
import { BroadcastsComponent } from './broadcasts/broadcasts.component';
import { PluginsComponent } from './plugins/plugins.component';
import { UsersComponent } from './users/users.component';
import { MyProfileComponent } from './my-profile/profile.component';
import { EditDashboardComponent } from './edit-dashboard/edit-dashboard.component';
import { AdminComponent } from 'app/admin/admin.component';

const routes: Routes = [
    {
        path: 'admin', component: AdminComponent, children: [
            { path: '', redirectTo: 'dashboards', pathMatch: 'full' },
            {
                path: 'dashboards', component: DashboardAdminComponent,
                children: [
                    {
                        path: ':id',
                        component: EditDashboardComponent
                    }
                ]
            },
            { path: 'clients', component: ClientsComponent },
            { path: 'broadcasts', component: BroadcastsComponent },
            { path: 'plugins', component: PluginsComponent },
            { path: 'users', component: UsersComponent },
            { path: 'profile', component: MyProfileComponent }
        ]
    },
    { path: '', redirectTo: '/default', pathMatch: 'full' },
    { path: ':name', component: DashboardComponent },
    { path: '**', redirectTo: 'admin' }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }