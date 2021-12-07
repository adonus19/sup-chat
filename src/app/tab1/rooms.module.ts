import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponentModule } from '../login/login.module';
import { FormsModule } from '@angular/forms';
import { RoomsPageRoutingModule } from './rooms-routing.module';
import { RoomsPage } from './rooms.page';
import { AddChatPage } from './add-chat/add-chat.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    LoginComponentModule,
    RoomsPageRoutingModule,
    FormsModule
  ],
  declarations: [RoomsPage, AddChatPage],
  providers: []
})
export class RoomsPageModule { }
