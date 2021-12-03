import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatPage } from './chat.page';
import { LoginComponentModule } from '../login/login.module';

import { ChatPageRoutingModule } from './chat-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    LoginComponentModule,
    ChatPageRoutingModule
  ],
  declarations: [ChatPage],
  providers: []
})
export class ChatPageModule { }
