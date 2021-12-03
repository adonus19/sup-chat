import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/compat/auth-guard';


import { ChatPage } from './chat.page';

const adminOnly = () => hasCustomClaim('admin');
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToChat = () => redirectLoggedInTo(['room']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../login/login.module').then(m => m.LoginComponentModule),
    ...canActivate(redirectLoggedInToChat)
  },
  {
    path: 'room',
    component: ChatPage,
    ...canActivate(redirectUnauthorizedToLogin)
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class ChatPageRoutingModule { }
