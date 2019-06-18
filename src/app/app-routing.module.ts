import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuListComponent } from './menu-list/menu-list.component';
import { PlannedMealComponent } from './planned-meal/planned-meal.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/menu-list',
    pathMatch: 'full'
  },
  {
    path: 'menu-list',
    component: MenuListComponent
  },
  {
    path: 'planned-menu',
    component: PlannedMealComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
