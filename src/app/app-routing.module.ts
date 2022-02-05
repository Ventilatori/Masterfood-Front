import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PopularShopResolver} from './common/popular-shop.resolver';
import {ExploreViewComponent} from './views/explore-view/explore-view.component';
import {ShopViewComponent} from './views/shop-view/shop-view.component';
import {ShopResolver} from './common/shop.resolver';

const routes: Routes = [
  { 
    path: '',
    pathMatch: 'full',
    redirectTo: 'explore'
  },
  { 
    path: 'explore', 
    component: ExploreViewComponent,
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
