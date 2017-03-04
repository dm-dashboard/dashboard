import { MessageService } from './message.service';
import { WindowService } from './window.service';
import { MoveService } from './move.service';
import { ResizeService } from './resize.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';

import { AppRoutingModule } from './app-routing.module';
import { ClientsComponent } from './clients/clients.component';
import { UsersComponent } from './users/users.component';
import { MyProfileComponent } from './my-profile/profile.component';
import { PluginsComponent } from './plugins/plugins.component';
import { BroadcastsComponent } from './broadcasts/broadcasts.component';

import { EditDashboardComponent } from './edit-dashboard/edit-dashboard.component';

import { DashboardService } from './dashboard.service';
import { LoaderComponent } from './loader/loader.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WidgetComponent } from './widget/widget.component';
import { AdminComponent } from './admin/admin.component';
 

@NgModule({
  declarations: [
    AppComponent,
    DashboardAdminComponent,
    ClientsComponent,
    UsersComponent,
    MyProfileComponent,
    PluginsComponent,
    BroadcastsComponent,
    EditDashboardComponent,
    LoaderComponent,
    DashboardComponent,
    WidgetComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    AppRoutingModule
  ],
  providers: [DashboardService, ResizeService, MoveService, WindowService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
