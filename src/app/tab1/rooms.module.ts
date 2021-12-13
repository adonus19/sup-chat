import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomsPageRoutingModule } from './rooms-routing.module';
import { RoomsPage } from './rooms.page';
import { AddChatPage } from './add-chat/add-chat.page';
import { ChatPage } from './chat/chat.page';
import { ChatUserResolver } from '../resolvers/chat-user.resolver';
import { EditUserPage } from './edit-user/edit-user.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    RoomsPageRoutingModule,
    FormsModule
  ],
  declarations: [
    RoomsPage,
    AddChatPage,
    ChatPage,
    EditUserPage
  ],
  providers: []
})
export class RoomsPageModule { }
