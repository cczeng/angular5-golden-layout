import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';

import { MapboxComponent } from './mapbox/mapbox.component';
import { GroupComponent } from './group/group.component';
import { UsersComponent } from './users/users.component';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
  ],
  declarations: [
    GroupComponent,
    MapboxComponent,
    UsersComponent,
  ],
  providers: [],
  entryComponents: [
    GroupComponent,
    MapboxComponent,
    UsersComponent
  ],
})
export class HomeModule { }
