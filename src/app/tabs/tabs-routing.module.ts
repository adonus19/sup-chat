import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'chat',
        loadChildren: () => import('../tab1/chat.module').then(m => m.ChatPageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/events.module').then(m => m.EventsPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/chat',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/chat',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
