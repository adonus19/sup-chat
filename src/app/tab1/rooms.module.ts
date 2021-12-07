import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponentModule } from '../login/login.module';

import { RoomsPageRoutingModule } from './rooms-routing.module';
import { RoomsPage } from './rooms.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    LoginComponentModule,
    RoomsPageRoutingModule
  ],
  declarations: [RoomsPage],
  providers: []
})
export class RoomsPageModule { }
