import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PopularShopResolver} from './shop/popular-shop.resolver';
import {ShopExploreComponent} from './shop/shop-explore/shop-explore.component';
import {ShopViewComponent} from './shop/shop-view/shop-view.component';
import {ShopResolver} from './shop/shop.resolver';

const routes: Routes = [
  { 
    path: '',
    pathMatch: 'full',
    redirectTo: 'explore'
  },
  { 
    path: 'explore', 
    component: ShopExploreComponent,
    resolve: { popular: PopularShopResolver }
  },
  { 
    path: 'shop/:id',
    component: ShopViewComponent,
    resolve: { shop: ShopResolver }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
