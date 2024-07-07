import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './modules/products/products.component';
import { CartComponent } from './modules/cart/cart.component';
import { WelcomePageComponent } from './modules/welcome-page/welcome-page.component';
import { NavBarComponent } from './modules/nav-bar/nav-bar.component';
import { DetailsComponent } from './modules/products/details/details.component';

const routes: Routes = [
  { path: '', component: WelcomePageComponent },
  { path: 'home', component: WelcomePageComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'navBar', component: NavBarComponent },
  { path: 'products/details/:id', component: DetailsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
