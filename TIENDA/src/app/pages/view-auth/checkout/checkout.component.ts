import { Component, ElementRef, ViewChild, afterNextRender } from '@angular/core';
import { CartService } from '../../home/service/cart.service';
import { CookieService } from 'ngx-cookie-service';
import { UserAddressService } from '../service/user-address.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

declare var paypal:any;
declare var MercadoPago:any;
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule,RouterModule,CommonModule,],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  listCarts:any = [];
  totalCarts:number = 0;

  currency:string = 'PEN';

  address_list:any = [];

  name:string = '';
  surname:string = '';
  company:string = '';
  country_region:string = '';
  city:string = '';
  address:string = '';
  street:string = '';
  postcode_zip:string = '';
  phone:string = '';
  email:string = '';

  address_selected:any;
  description:string = '';
  @ViewChild('paypal',{static: true}) paypalElement?: ElementRef;
  PREFERENCE_ID:string = '';
  price_dolar:number = 3.86;
  constructor(
    public cartService: CartService,
    public cookieService: CookieService, 
    public addressService: UserAddressService,
    private toastr: ToastrService,
    public router: Router,
  ) {

    afterNextRender(() => {
      this.addressService.listAddress().subscribe((resp:any) => {
        console.log(resp);
        this.address_list = resp.address;
      })
    })

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.currency = this.cookieService.get("currency") ? this.cookieService.get("currency") : 'PEN';
    this.cartService.currentDataCart$.subscribe((resp:any) => {
      this.listCarts = resp;
      this.totalCarts = this.listCarts.reduce((sum:number, item:any) => sum + item.total, 0);
    })

    // const mp = new MercadoPago('TEST-b1cd2cef-428c-4ccb-9cf4-c9c350f34215');
    //     const bricksBuilder = mp.bricks();

    //     mp.checkout({
    //         preference: {
    //           id: '1602678415-b4edf3cb-5651-4865-b936-8280703e2462',
    //         },
    //         render: {
    //           container: "#wallet_container",
    //           label: "Pagar",
    //         },
    //         callback: (response:any) => {
    //           console.log(response);
    //           if (response.status === 'approved') {
    //             console.log('Pago aprobado. Detalles:', response);
    //           } else {
    //             console.log('Pago no aprobado o cancelado. Detalles:', response);
    //           }
    //         },
    //   });

    paypal.Buttons({
      // optional styling for buttons
      // https://developer.paypal.com/docs/checkout/standard/customize/buttons-style-guide/
      style: {
        color: "gold",
        shape: "rect",
        layout: "vertical"
      },

      // set up the transaction
      createOrder: (data:any, actions:any) => {
          // pass in any options from the v2 orders create call:
          // https://developer.paypal.com/api/orders/v2/#orders-create-request-body
        if(this.totalCarts == 0){
          this.toastr.error("Validación","No puedes procesar el pago con un monto de 0")
          return;
        }
        if(this.listCarts.length == 0){
          this.toastr.error("Validación","No puedes procesar el pago con un carrito de compra vacio")
          return;
        }
        if(!this.name ||
          !this.surname ||
          !this.company ||
          !this.country_region ||
          !this.city ||
          !this.address ||
          !this.street ||
          !this.postcode_zip ||
          !this.phone ||
          !this.email){
          this.toastr.error("Validacion","Todos los campos de la dirección son necesarios");
          return;
        }
          const createOrderPayload = {
            purchase_units: [
              {
                amount: {
                    description: "COMPRAR POR EL ECOMMERCE 2024",
                    value: this.totalPaypayl(),
                }
              }
            ]
          };

          return actions.order.create(createOrderPayload);
      },

      // finalize the transaction
      onApprove: async (data:any, actions:any) => {
          
          let Order = await actions.order.capture();
          // Order.purchase_units[0].payments.captures[0].id

          let dataSale = {
            method_payment: 'PAYPAL',
            currency_total: this.currency,
            currency_payment: 'USD',
            discount: 0,
            subtotal: this.totalPaypayl(),
            total: this.totalPaypayl(),
            price_dolar: 0,
            n_transaccion: Order.purchase_units[0].payments.captures[0].id,
            description: this.description,
            sale_address: {
              name: this.name,
              surname: this.surname,
              company: this.company,
              country_region: this.country_region,
              city: this.city,
              address: this.address,
              street: this.street,
              postcode_zip: this.postcode_zip,
              phone: this.phone,
              email: this.email,
            }
          }
          this.cartService.checkout(dataSale).subscribe((resp:any) => {
            console.log(resp);
            this.toastr.success("Exito","La compra se a realizado");
            this.cartService.resetCart();
            setTimeout(() => {
              this.router.navigateByUrl("/gracias-por-tu-compra/"+Order.purchase_units[0].payments.captures[0].id);
            }, 50);
            // La redirección a la pagina de gracias
          });
          // return actions.order.capture().then(captureOrderHandler);
      },

      // handle unrecoverable errors
      onError: (err:any) => {
          console.error('An error prevented the buyer from checking out with PayPal');
      }
  }).render(this.paypalElement?.nativeElement);
  }
  totalPaypayl(){
    if(this.currency == 'USD'){
      return this.totalCarts;
    }else{
      return (this.totalCarts/this.price_dolar).toFixed(2);
    }
  }
  openMercadoPago(){
    if(this.totalCarts == 0){
      this.toastr.error("Validación","No puedes procesar el pago con un monto de 0")
      return;
    }
    if(this.listCarts.length == 0){
      this.toastr.error("Validación","No puedes procesar el pago con un carrito de compra vacio")
      return;
    }
    if(!this.name ||
      !this.surname ||
      !this.company ||
      !this.country_region ||
      !this.city ||
      !this.address ||
      !this.street ||
      !this.postcode_zip ||
      !this.phone ||
      !this.email){
      this.toastr.error("Validacion","Todos los campos de la dirección son necesarios");
      return;
    }
    this.cartService.mercadopago(this.totalCarts).subscribe((resp:any) => {
      console.log(resp);

        this.PREFERENCE_ID = resp.preference.id;
        let data = {
          description: this.description,
          sale_address: {
            name: this.name,
            surname: this.surname,
            company: this.company,
            country_region: this.country_region,
            city: this.city,
            address: this.address,
            street: this.street,
            postcode_zip: this.postcode_zip,
            phone: this.phone,
            email: this.email,
          }
        }

        this.cartService.storeTemp(data).subscribe((resp:any) => {

          const mp = new MercadoPago('TEST-b1cd2cef-428c-4ccb-9cf4-c9c350f34215');
          const bricksBuilder = mp.bricks();
  
          mp.bricks().create("wallet", "wallet_container", {
            initialization: {
                preferenceId: this.PREFERENCE_ID,
            },
          });
          //   mp.checkout({
          //       preference: {
          //         id: this.PREFERENCE_ID,
          //       },
          //       render: {
          //         container: "#wallet_container",
          //         label: "Pagar",
          //       },
          //       callback: (response:any) => {
          //         console.log(response);
          //         if (response.status === 'approved') {
          //           console.log('Pago aprobado. Detalles:', response);
          //         } else {
          //           console.log('Pago no aprobado o cancelado. Detalles:', response);
          //         }
          //       },
          // });

        })

    })
  }

  registerAddress(){

    if(!this.name ||
      !this.surname ||
      !this.company ||
      !this.country_region ||
      !this.city ||
      !this.address ||
      !this.street ||
      !this.postcode_zip ||
      !this.phone ||
      !this.email){
      this.toastr.error("Validacion","Todos los campos son necesarios");
      return;
    }

    let data = {
      name: this.name,
      surname: this.surname,
      company: this.company,
      country_region: this.country_region,
      city: this.city,
      address: this.address,
      street: this.street,
      postcode_zip: this.postcode_zip,
      phone: this.phone,
      email: this.email,
    };
    this.addressService.registerAddress(data).subscribe((resp:any) => {
      console.log(resp);
      this.toastr.success("Exitoso","La dirección se acaba de registrar");
      this.address_list.unshift(resp.addres);
    })
  }
  editAddress(){
    if(!this.name ||
      !this.surname ||
      !this.company ||
      !this.country_region ||
      !this.city ||
      !this.address ||
      !this.street ||
      !this.postcode_zip ||
      !this.phone ||
      !this.email){
      this.toastr.error("Validacion","Todos los campos son necesarios");
      return;
    }

    let data = {
      name: this.name,
      surname: this.surname,
      company: this.company,
      country_region: this.country_region,
      city: this.city,
      address: this.address,
      street: this.street,
      postcode_zip: this.postcode_zip,
      phone: this.phone,
      email: this.email,
    };
    this.addressService.updateAddress(this.address_selected.id,data).subscribe((resp:any) => {
      console.log(resp);
      this.toastr.success("Exitoso","La dirección se acaba de editar");
      let INDEX = this.address_list.findIndex((item:any) => item.id == resp.addres.id);
      if(INDEX != -1){
        this.address_list[INDEX] = resp.addres;
      }
    })
  }

  selectedAddress(addres:any){
    this.address_selected = addres;
    this.name = this.address_selected.name;
    this.surname = this.address_selected.surname;
    this.company = this.address_selected.company;
    this.country_region = this.address_selected.country_region;
    this.city = this.address_selected.city;
    this.address = this.address_selected.address;
    this.street = this.address_selected.street;
    this.postcode_zip = this.address_selected.postcode_zip;
    this.phone = this.address_selected.phone;
    this.email = this.address_selected.email;
  }

  resertAddress(){
    this.address_selected = null;
    this.name =  '';
    this.surname = '';
    this.company =  '';
    this.country_region =  '';
    this.city =  '';
    this.address =  '';
    this.street =  '';
    this.postcode_zip =  '';
    this.phone =  '';
    this.email =  '';
  }
}
