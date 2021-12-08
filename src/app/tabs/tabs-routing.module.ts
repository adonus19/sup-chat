import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'rooms',
        loadChildren: () => import('../tab1/rooms.module').then(m => m.RoomsPageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/events.module').then(m => m.EventsPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/rooms',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
