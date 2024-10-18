import { Component, ElementRef, ViewChild, afterNextRender } from '@angular/core';
import { CartService } from '../../home/service/cart.service';
import { HomeService } from '../../home/service/home.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

declare var paypal:any;
declare var MercadoPago:any;
@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [FormsModule,RouterModule,CommonModule,],
  templateUrl: './compra.component.html',
  styleUrl: './compra.component.css'
})
export class CompraComponent {

  listCarts:any = [];
  totalCarts:number = 0;

  currency:string = 'MXN';

  nombre:string = '';
  apellido:string = '';
  estado:string = '';
  municipio:string = '';
  codigo:string = '';
  localidad:string = '';
  address:string = '';
  street:string = '';
  telefono:string = '';
  email:string = '';
  notas:string = '';

  PRODUCTS:any = [];
  PRODUCT_SLUG:any;
  CAMPAING_CODE:any;
  CANTIDAD:any;
  plus:number = 0;
 
  constructor(
    public homeService: HomeService,
    public cartService: CartService,
    public cookieService: CookieService,
    public activedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public router: Router,
  ) {

    this.activedRoute.params.subscribe((resp: any) => {
      this.PRODUCT_SLUG = resp.slug;
    });
    
    this.activedRoute.queryParams.subscribe((resp: any) => {
      this.CAMPAING_CODE = resp.campaing_discount;
      this.CANTIDAD = resp.cantidad;
    });
    
    this.homeService.showProduct(this.PRODUCT_SLUG, this.CAMPAING_CODE).subscribe((resp: any) => {
      // Espera hasta después del renderizado
      setTimeout(() => {
        if (resp.message == 403) {
          this.PRODUCTS = localStorage.getItem("carrito") ? JSON.parse(localStorage.getItem("carrito") ?? "") : [];
          this.currency = this.cookieService.get("currency") ? this.cookieService.get("currency") : 'MXN';
          this.totalCarts = this.PRODUCTS.reduce((sum: number, item: any) => sum + item.precio_unitario * item.quantity, 0);
          console.log('zzzzzzzzzzzzzzzzzzzzzz', this.totalCarts);
        } else {
          console.log(resp);
          if (resp.discount_campaing) {
            resp.product.discount_g = resp.discount_campaing;
          }
          if (resp.product.discount_g) {
            resp.product.precio_unitario = Number(this.getNewTotal(resp.product, resp.product.discount_g));
            console.log('aaaaaaa');
          } else {
            resp.product.precio_unitario = resp.product.price_pen;
            console.log('bbbbbb');
          }
          console.log(resp.product);
          resp.product.quantity = Number(this.CANTIDAD);
          this.PRODUCTS.push(resp.product);
          console.log(this.PRODUCTS);
          this.currency = this.cookieService.get("currency") ? this.cookieService.get("currency") : 'MXN';
          this.totalCarts = this.PRODUCTS.reduce((sum: number, item: any) => sum + item.precio_unitario * item.quantity, 0);
          console.log(this.totalCarts);
        }
      });
    });
    // afterNextRender(() => {
    //   this.PRODUCTS = localStorage.getItem("carrito") ? JSON.parse(localStorage.getItem("carrito") ?? "") : [];
    //   this.currency = this.cookieService.get("currency") ? this.cookieService.get("currency") : 'MXN';
    //   console.log(this.PRODUCTS);
    //   this.totalCarts = this.PRODUCTS.reduce((sum:number, item:any) => sum + item.precio_unitario*item.quantity, 0);
    // })
  }
  ngOnInit(): void {
    window.scrollTo(0, 0);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.currency = this.cookieService.get("currency") ? this.cookieService.get("currency") : 'MXN';
    this.cartService.currentDataCart$.subscribe((resp:any) => {
      this.listCarts = resp;
      this.totalCarts = this.listCarts.reduce((sum:number, item:any) => sum + item.total, 0);
    })
  }

  realizarCompra() {
    
    
    const telefono = "8129145215"; 

    var mensaje = "Buen día, quiero realizar este pedido.%0AProductos:%0A";
    
    var count = 0
    for (const product of this.PRODUCTS) {
      count++;
      mensaje += `${count}. ${product.title}%0A    - sku: ${product.sku}%0A    - precio: ${product.precio_unitario}%0A    - cantidad: ${product.quantity}%0A`;
    }
    mensaje += `Total: ${this.totalCarts}%0A%0ADomicilio%0AEstado: ${this.estado}%0AMunicipio: ${this.municipio}%0ACodigo postal: ${this.codigo}%0ALocalidad: ${this.localidad}%0ADirección: ${this.address} - ${this.street}%0A%0ADatos%0ANombre: ${this.nombre} ${this.apellido}%0ATelefono: ${this.telefono}%0ACorreo: ${this.email}%0ANotas: ${this.notas}`;

    const url = `https://wa.me/${telefono}?text=${mensaje}`;

    window.open(url, '_blank');
  }

  getNewTotal(PRODUCT:any,DISCOUNT_FLASH_P:any){
    if(this.currency == 'MXN'){
      if(DISCOUNT_FLASH_P.type_discount == 1){//% DE DESCUENT0 50
        // 100 / 100*(50*0.01) 100*0.5=50
        return ((PRODUCT.price_pen+this.plus) - (PRODUCT.price_pen+this.plus)*(DISCOUNT_FLASH_P.discount*0.01)).toFixed(2)
      }else{//-PEN/-USD 
        return ((PRODUCT.price_pen+this.plus) - DISCOUNT_FLASH_P.discount).toFixed(2);
      }
    }else{
      if(DISCOUNT_FLASH_P.type_discount == 1){//% DE DESCUENT0 50
        // 100 / 100*(50*0.01) 100*0.5=50
        return ((PRODUCT.price_usd+this.plus) - (PRODUCT.price_usd+this.plus)*(DISCOUNT_FLASH_P.discount*0.01)).toFixed(2)
      }else{//-PEN/-USD 
        return ((PRODUCT.price_usd+this.plus) - DISCOUNT_FLASH_P.discount).toFixed(2);
      }
    }

  }

}
