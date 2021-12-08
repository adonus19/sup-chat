import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { hasCustomClaim } from '@angular/fire/compat/auth-guard';


import { RoomsPage } from './rooms.page';
import { ChatPage } from './chat/chat.page';
import { ChatUserResolver } from '../resolvers/chat-user.resolver';

const adminOnly = () => hasCustomClaim('admin');

const routes: Routes = [
  {
    path: '',
    component: RoomsPage,
  },
  {
    path: ':id',
    component: ChatPage,
    resolve: { users: ChatUserResolver }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class RoomsPageRoutingModule { }
