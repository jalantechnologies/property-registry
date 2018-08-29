import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';

import {PropertyDetailComponent, DashboardComponent} from './pages';

@NgModule({
  imports: [
    RouterModule.forRoot([
      // pages
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'property-detail/:propertyAddress',
        component: PropertyDetailComponent
      }
    ])
  ],
  exports: [RouterModule]
})

export class AppRouting {
}
