import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ExploreViewComponent} from './views/explore-view/explore-view.component';
import {ShopViewComponent} from './views/shop-view/shop-view.component';
import {ShopResolver} from './common/shop.resolver';
import {SearchViewComponent} from './views/search-view/search-view.component';

const routes: Routes = [
  { 
    path: '',
    pathMatch: 'full',
    redirectTo: 'explore'
  },
  { 
    path: 'explore', 
    component: ExploreViewComponent,
  },
  { 
    path: 'shop/:id',
    component: ShopViewComponent,
    resolve: { shop: ShopResolver }
  },
  { 
    path: 'search',
    component: SearchViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
