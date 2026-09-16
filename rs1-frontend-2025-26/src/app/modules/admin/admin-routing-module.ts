import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { ProductsComponent } from './catalogs/products/products.component';
import { ProductsAddComponent } from './catalogs/products/products-add/products-add.component';
import { ProductsEditComponent } from './catalogs/products/products-edit/products-edit.component';
import { ProductCategoriesComponent } from './catalogs/product-categories/product-categories.component';
import {AdminOrdersComponent} from './orders/admin-orders.component';
import {OrderEditComponent} from './orders/order-edit/order-edit.component';
import {AdminSettingsComponent} from './admin-settings/admin-settings.component';
import {ProductCategories2Component} from './catalogs/product-categories-2/product-categories-2.component';
import {
  ProductCategoriesEditComponent
} from './catalogs/product-categories-2/product-categories-edit/product-categories-edit.component';
import {
  ProductCategoriesAddComponent
} from './catalogs/product-categories-2/product-categories-add/product-categories-add.component';
import { ProductReservationsComponent } from './catalogs/product-reservations/product-reservations.component';
import { ProductReservationAddComponent } from './catalogs/product-reservations/product-reservation-add/product-reservation-add.component';
import { ProductReservationEditComponent } from './catalogs/product-reservations/product-reservation-edit/product-reservation-edit.component';
import { ProformasComponent } from './catalogs/proformas/proformas.component';
import { ProformaAddComponent } from './catalogs/proformas/proforma-add/proforma-add.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      // PRODUCTS
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'products/add',
        component: ProductsAddComponent,
      },
      {
        path: 'products/:id/edit',
        component: ProductsEditComponent,
      },

      // PRODUCT CATEGORIES
      {
        path: 'product-categories',
        component: ProductCategoriesComponent,
      },

      {
        path: 'product-categories-2',
        component: ProductCategories2Component,
      },
      {
        path: 'product-categories-2/add',
        component: ProductCategoriesAddComponent,
      },
      {
        path: 'product-categories-2/edit/:abc',
        component: ProductCategoriesEditComponent,
      },

      // ORDERS
      {
        path: 'orders',
        component: AdminOrdersComponent,
      },
      {
        path: 'orders/:id/edit',
        component: OrderEditComponent,
      },

      // SETTINGS
      {
        path: 'settings',
        component: AdminSettingsComponent,
      },

      { path: 'product-reservations', component: ProductReservationsComponent },
      { path: 'product-reservations/add', component: ProductReservationAddComponent },
      { path: 'product-reservations/edit/:id', component: ProductReservationEditComponent },
      { path: 'proformas', component: ProformasComponent },
      { path: 'proformas/add', component: ProformaAddComponent },


      // default admin route → /admin/products
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
