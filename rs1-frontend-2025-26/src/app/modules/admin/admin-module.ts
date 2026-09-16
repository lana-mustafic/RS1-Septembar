import {NgModule} from '@angular/core';

import {AdminRoutingModule} from './admin-routing-module';
import {ProductsComponent} from './catalogs/products/products.component';
import {ProductsAddComponent} from './catalogs/products/products-add/products-add.component';
import {ProductsEditComponent} from './catalogs/products/products-edit/products-edit.component';
import {AdminLayoutComponent} from './admin-layout/admin-layout.component';
import {ProductCategoriesComponent} from './catalogs/product-categories/product-categories.component';
import {
  ProductCategoryUpsertComponent
} from './catalogs/product-categories/product-category-upsert/product-category-upsert.component';
import {AdminOrdersComponent} from './orders/admin-orders.component';
import {OrderEditComponent} from './orders/order-edit/order-edit.component';
import {AdminSettingsComponent} from './admin-settings/admin-settings.component';
import {SharedModule} from '../shared/shared-module';
import { OrderDetailsDialogComponent } from './orders/admin-orders-details-dialog/order-details-dialog.component';
import { ChangeStatusDialogComponent } from './orders/change-status-dialog/change-status-dialog.component';
import { ProductCategories2Component } from './catalogs/product-categories-2/product-categories-2.component';
import { ProductCategoriesEditComponent } from './catalogs/product-categories-2/product-categories-edit/product-categories-edit.component';
import { ProductCategoriesAddComponent } from './catalogs/product-categories-2/product-categories-add/product-categories-add.component';
import { ProductReservationsComponent } from './catalogs/product-reservations/product-reservations.component';
import { ProductReservationAddComponent } from './catalogs/product-reservations/product-reservation-add/product-reservation-add.component';
import { ProductReservationEditComponent } from './catalogs/product-reservations/product-reservation-edit/product-reservation-edit.component';
import { ProformasComponent } from './catalogs/proformas/proformas.component';
import { ProformaAddComponent } from './catalogs/proformas/proforma-add/proforma-add.component';


@NgModule({
  declarations: [
    ProductsComponent,
    ProductsAddComponent,
    ProductsEditComponent,
    AdminLayoutComponent,
    ProductCategoriesComponent,
    ProductCategoryUpsertComponent,
    AdminOrdersComponent,
    OrderEditComponent,
    AdminSettingsComponent,
    OrderDetailsDialogComponent,
    ChangeStatusDialogComponent,
    ProductCategories2Component,
    ProductCategoriesEditComponent,
    ProductCategoriesAddComponent,
    ProductReservationsComponent,
    ProductReservationAddComponent,
    ProductReservationEditComponent,
    ProformasComponent,
    ProformaAddComponent,
  ],
  imports: [
    AdminRoutingModule,
    SharedModule,
  ]
})
export class AdminModule { }
