import { Component } from '@angular/core';
import { CartService } from '../../../home/service/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.css'
})
export class CheckoutSuccessComponent {

  payment_id:string = '';
  preference_id: string = '';

  currency:string = 'PEN';
  constructor(
    public cartService: CartService,
    public activedRoute: ActivatedRoute,
    public cookieService: CookieService, 
    public toastr: ToastrService,
    public router: Router
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.activedRoute.queryParams.subscribe((resp:any) =>{
      console.log(resp);
      this.payment_id = resp.payment_id;
      this.preference_id = resp.preference_id;
    })
    this.currency = this.cookieService.get("currency") ? this.cookieService.get("currency") : 'PEN';
    let data = {
      method_payment: 'MERCADOPAGO',
      currency_total: this.currency,
      currency_payment: 'PEN',
      price_dolar: 0,
      n_transaccion: this.payment_id,
      preference_id: this.preference_id,
      // description: this.description,
      // sale_address: {
      //   name: this.name,
      //   surname: this.surname,
      //   company: this.company,
      //   country_region: this.country_region,
      //   city: this.city,
      //   address: this.address,
      //   street: this.street,
      //   postcode_zip: this.postcode_zip,
      //   phone: this.phone,
      //   email: this.email,
      // }
    }
    this.cartService.checkoutMercadoPago(data).subscribe((resp:any) => {
      console.log(resp);

      this.toastr.success("Exito","La compra se a realizado");
      this.router.navigateByUrl("/gracias-por-tu-compra/"+this.payment_id);

    })
  }
}
