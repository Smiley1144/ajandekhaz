import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './modules/products/products.component';
import { CartComponent } from './modules/cart/cart.component';
import { WelcomePageComponent } from './modules/welcome-page/welcome-page.component';
import { NavBarComponent } from './modules/nav-bar/nav-bar.component';

const routes: Routes = [
  { path: '', component: WelcomePageComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'navBar', component: NavBarComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
