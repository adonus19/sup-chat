import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/compat/auth-guard';


import { RoomsPage } from './rooms.page';

const adminOnly = () => hasCustomClaim('admin');
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToRooms = () => redirectLoggedInTo(['']);

const routes: Routes = [
  {
    path: '',
    component: RoomsPage,
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'login',
    loadChildren: () => import('../login/login.module').then(m => m.LoginComponentModule),
    ...canActivate(redirectLoggedInToRooms)
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class RoomsPageRoutingModule { }
