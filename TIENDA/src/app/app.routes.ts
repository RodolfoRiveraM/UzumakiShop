import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { LandingProductComponent } from './pages/guest-view/landing-product/landing-product.component';
import { CategorieComponent } from './pages/guest-view/categorie/categorie.component';
import { CompraComponent } from './pages/guest-view/compra/compra.component';
import { authGuard } from './pages/auth/service/auth.guard';
import { CartComponent } from './pages/view-auth/cart/cart.component';
import { CheckoutComponent } from './pages/view-auth/checkout/checkout.component';
import { ThankYouOrderComponent } from './pages/view-auth/thank-you-order/thank-you-order.component';
import { CheckoutSuccessComponent } from './pages/view-auth/checkout/checkout-success/checkout-success.component';
import { CheckoutFailureComponent } from './pages/view-auth/checkout/checkout-failure/checkout-failure.component';
import { CheckoutPendingComponent } from './pages/view-auth/checkout/checkout-pending/checkout-pending.component';
import { ProfileClientComponent } from './pages/view-auth/profile-client/profile-client.component';
import { FilterAdvanceComponent } from './pages/guest-view/filter-advance/filter-advance.component';
import { CampaingLinkComponent } from './pages/guest-view/campaing-link/campaing-link.component';
import { CompareProductComponent } from './pages/guest-view/compare-product/compare-product.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        // canActivate: [authGuard],
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'cambiar-credenciales',
        component: ForgotPasswordComponent
    }
    ,
    {
        path: 'producto/:slug',
        component: LandingProductComponent
    },
    {
        path: 'categoria/:slug',
        component: CategorieComponent
    },
    {
        path: 'compra/:slug',
        component: CompraComponent
    },
    {
        path: 'carrito-de-compra',
        component: CartComponent
    },
    {
        canActivate: [authGuard],
        path: 'proceso-de-pago',
        component: CheckoutComponent
    },
    {
        canActivate: [authGuard],
        path: 'gracias-por-tu-compra/:order',
        component: ThankYouOrderComponent
    },
    {
        canActivate: [authGuard],
        path: 'mercado-pago-success',
        component: CheckoutSuccessComponent
    },
    {
        canActivate: [authGuard],
        path: 'mercado-pago-failure',
        component: CheckoutFailureComponent
    },
    {
        canActivate: [authGuard],
        path: 'mercado-pago-pending',
        component: CheckoutPendingComponent
    },
    {
        canActivate: [authGuard],
        path: 'perfil-del-cliente',
        component: ProfileClientComponent,
    },
    {
        path: 'productos-busqueda',
        component: FilterAdvanceComponent,
    },
    {
        path: 'discount/:code',
        component: CampaingLinkComponent,
    },
    {
        path: 'compare-product',
        component: CompareProductComponent,
    },
];
