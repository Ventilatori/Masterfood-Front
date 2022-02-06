import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './common/navbar/navbar.component';
import { ExploreViewComponent } from './views/explore-view/explore-view.component';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { ShopViewComponent } from './views/shop-view/shop-view.component';
import { SearchComponent } from './common/search/search.component';
import { OrderComponent } from './views/shop-view/components/order/order.component';
import { SearchViewComponent } from './views/search-view/search-view.component';
import { ShopListComponent } from './common/shop-list/shop-list.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SearchComponent,
    ExploreViewComponent,
    ShopViewComponent,
    OrderComponent,
    SearchViewComponent,
    ShopListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
