import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './common/navbar/navbar.component';
import { ExploreViewComponent } from './views/explore-view/explore-view.component';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { ShopViewComponent } from './views/shop-view/shop-view.component';
import { SearchComponent } from './common/search/search.component';
import { OrderComponent } from './views/shop-view/components/order/order.component';
import { SearchViewComponent } from './views/search-view/search-view.component';
import { ShopListComponent } from './common/shop-list/shop-list.component';
import { ItemEditDialog } from './views/shop-view/components/item-edit-dialog/item-edit-dialog.component';
import { TagEditComponent } from './common/tag-edit/tag-edit.component';
import { ShopEditDialog } from './common/shop-edit-dialog/shop-edit-dialog.component';
import { OrderInfoComponent } from './views/shop-view/components/order-info/order-info.component';
import { AuthDialog } from './common/auth-dialog/auth-dialog.component';
import {AuthInterceptor} from './common/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SearchComponent,
    ExploreViewComponent,
    ShopViewComponent,
    OrderComponent,
    SearchViewComponent,
    ShopListComponent,
    ItemEditDialog,
    TagEditComponent,
    ShopEditDialog,
    OrderInfoComponent,
    AuthDialog
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
  providers: [
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
