import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { DashboardsComponent } from './dashboards/dashboards.component';

import { AppRoutingModule } from './app-routing.module';
import { ClientsComponent } from './clients/clients.component';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';
import { PluginsComponent } from './plugins/plugins.component';
import { BroadcastsComponent } from './broadcasts/broadcasts.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardsComponent,
    ClientsComponent,
    UsersComponent,
    ProfileComponent,
    PluginsComponent,
    BroadcastsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
