import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/compat/auth-guard';


import { ChatPage } from './chat.page';

const adminOnly = () => hasCustomClaim('admin');
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToChat = () => redirectLoggedInTo(['chat']);

const routes: Routes = [
  {
    path: '',
    component: ChatPage,
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'login',
    loadChildren: () => import('../login/login.module').then(m => m.LoginComponentModule),
    ...canActivate(redirectLoggedInToChat)
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class ChatPageRoutingModule { }
