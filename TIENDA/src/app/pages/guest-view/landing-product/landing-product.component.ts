import { Component, afterNextRender, afterRender } from '@angular/core';
import { HomeService } from '../../home/service/home.service';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalProductComponent } from '../component/modal-product/modal-product.component';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from '../../home/service/cart.service';

declare function MODAL_PRODUCT_DETAIL([]):any;
declare function LANDING_PRODUCT([]):any;
declare function MODAL_QUANTITY_LANDING([]):any;
declare var $:any;
@Component({
  selector: 'app-landing-product',
  standalone: true,
  imports: [CommonModule,FormsModule,ModalProductComponent,RouterModule],
  templateUrl: './landing-product.component.html',
  styleUrl: './landing-product.component.css'
})
export class LandingProductComponent {

  PRODUCT_SLUG:any;
  PRODUCT_SELECTED:any;
  variation_selected:any;
  sub_variation_selected:any;
  PRODUCT_RELATEDS:any = [];
  product_selected_modal:any;
  CAMPAING_CODE:any;
  DISCOUNT_CAMPAING:any;

  currency:string = 'MXN';
  plus:number = 0;

  reviews:any = [];
  constructor(
    public homeService: HomeService,
    public activedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router:Router,
    private cookieService: CookieService,
    public cartService: CartService,
  ) {
      this.activedRoute.params.subscribe((resp:any) => {
        this.PRODUCT_SLUG = resp.slug;
      })
      this.activedRoute.queryParams.subscribe((resp:any) => {
        this.CAMPAING_CODE = resp.campaing_discount;
      })
      // afterNextRender(() => {
      this.homeService.showProduct(this.PRODUCT_SLUG,this.CAMPAING_CODE).subscribe((resp:any) => {
        // window.scrollTo(0, 0);
        console.log(resp);
        if(resp.message == 403){
          this.toastr.error("Validacion",resp.message_text);
          this.router.navigateByUrl("/");
        }else{
          this.PRODUCT_SELECTED = resp.product;
          this.PRODUCT_RELATEDS = resp.product_relateds.data;
          this.DISCOUNT_CAMPAING = resp.discount_campaing;
          this.reviews = resp.reviews;
          if(this.DISCOUNT_CAMPAING){
            this.PRODUCT_SELECTED.discount_g = this.DISCOUNT_CAMPAING;
          } 
        }
      })
      // })
      afterRender(() => {
        setTimeout(() => {
          MODAL_PRODUCT_DETAIL($);
            LANDING_PRODUCT($);
        }, 50);
        this.currency = this.cookieService.get("currency") ? this.cookieService.get("currency") : 'MXN';
      })
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    setTimeout(() => {
      MODAL_QUANTITY_LANDING($);
    }, 500);
  }
  
  addCompareProduct(TRADING_PRODUCT:any){
    let COMPARES = localStorage.getItem("compares") ? JSON.parse(localStorage.getItem("compares") ?? '') : [];

    let INDEX = COMPARES.findIndex((item:any) => item.id == TRADING_PRODUCT.id);
    if(INDEX != -1){
      this.toastr.error("Validacion","El producto ya existe en la lista");
      return;
    }
    COMPARES.push(TRADING_PRODUCT);
    this.toastr.success("Exito","El producto se agrego a lista de comparacion");

    localStorage.setItem("compares",JSON.stringify(COMPARES));
  }

  irAProducto(slug: string) {
    this.router.navigate(['/producto', slug]).then(() => {
      window.location.reload(); // Refresca la página
    });
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

  getTotalPriceProduct(PRODUCT:any){
    console.log(PRODUCT);
    if(PRODUCT.discount_g){
      return this.getNewTotal(PRODUCT,PRODUCT.discount_g);
    }
    if(this.currency == 'MXN'){
      return PRODUCT.price_pen + this.plus;
    }else{
      return PRODUCT.price_usd + this.plus;
    }
  }

  getTotalCurrency(PRODUCT:any){
    if(this.currency == 'MXN'){
      return PRODUCT.price_pen;
    }else{
      return PRODUCT.price_usd;
    }
  }
  
  selectedVariation(variation:any){
    this.variation_selected = null;
    this.sub_variation_selected = null;
    this.plus = 0;
    setTimeout(() => {
      this.plus += variation.add_price;
      this.variation_selected = variation;
      MODAL_PRODUCT_DETAIL($);
    }, 50);
  }
  selectedSubVariation(subvariation:any){
    this.sub_variation_selected = null;
    this.plus =  this.variation_selected.add_price;
    setTimeout(() => {
      this.plus += subvariation.add_price;
      this.sub_variation_selected = subvariation;
    }, 50);
  }
  openDetailModal(PRODUCT:any){
    this.product_selected_modal = null;
    console.log('---', this.product_selected_modal);
    setTimeout(() => {
      this.product_selected_modal = PRODUCT;
      console.log('---', this.product_selected_modal);
    }, 50);
  }

  validateQuantity() {
    console.log('aa');
    console.log(this.PRODUCT_SELECTED.stock);
    setTimeout(() => {
    var count = $("#tp-cart-input-val").val()
    if ((Number(count)) > (this.PRODUCT_SELECTED.stock)) {
      $("#tp-cart-input-val").val(this.PRODUCT_SELECTED.stock); // Ajusta la cantidad al stock
    } else if (Number(count) < 1) {
      $("#tp-cart-input-val").val(1); // No permitir cantidad menor a 1
    }
    }, 50);
  }

  addCarrito(PRODUCT:any, new_precio:string = "0"){
    PRODUCT.precio_unitario = PRODUCT.price_pen;
    if(new_precio != "0"){
      PRODUCT.precio_unitario = Number(new_precio);
    }
    console.log(PRODUCT)
    PRODUCT.quantity = $("#tp-cart-input-val").val();
    let CARRITO = localStorage.getItem("carrito") ? JSON.parse(localStorage.getItem("carrito") ?? '') : [];

    let INDEX = CARRITO.findIndex((item:any) => item.id == PRODUCT.id);
    if(INDEX != -1){
      this.toastr.error("Validacion","El producto ya existe en la lista");
      return;
    }
    CARRITO.push(PRODUCT);
    this.toastr.success("Exito","El producto se agrego al carrito");

    localStorage.setItem("carrito",JSON.stringify(CARRITO));

    window.location.reload();
    
    // if(CARRITO.length > 1){
    //   this.router.navigateByUrl("/compare-product");
    // }
  }

  compraProducto(slug:any) {
    console.log(slug);
    const cantidad = $('#tp-cart-input-val').val();
    
    this.router.navigate(['/compra/'+slug], { 
      queryParams: { 
        campaing_discount: this.CAMPAING_CODE,
        cantidad: cantidad
      } 
    });

    // setTimeout(() => {
    //   window.location.reload();
    //   window.scrollTo(0, 0);
    // }, 50);
    
  }

  // addCart(){
  //   if(!this.cartService.authService.user){
  //     this.toastr.error("Validacion","Ingrese a la tienda");
  //     this.router.navigateByUrl("/login");
  //     return;
  //   }

  //   let product_variation_id = null;
  //   if(this.PRODUCT_SELECTED.variations.length > 0){
  //     if(!this.variation_selected){
  //       this.toastr.error("Validacion","Necesitas seleccionar una variación");
  //       return;
  //     }
  //     if(this.variation_selected && this.variation_selected.subvariations.length > 0){
  //       if(!this.sub_variation_selected){
  //         this.toastr.error("Validacion","Necesitas seleccionar una SUB variación");
  //         return;
  //       }
  //     }
  //   }

  //   if(this.PRODUCT_SELECTED.variations.length > 0 && this.variation_selected &&
  //     this.variation_selected.subvariations.length == 0){
  //     product_variation_id = this.variation_selected.id;
  //   }
  //   if(this.PRODUCT_SELECTED.variations.length > 0 && this.variation_selected &&
  //     this.variation_selected.subvariations.length > 0){
  //     product_variation_id = this.sub_variation_selected.id;
  //   }

  //   let discount_g = null;

  //   if(this.PRODUCT_SELECTED.discount_g){
  //     discount_g = this.PRODUCT_SELECTED.discount_g;
  //   }

  //   let data = {
  //     product_id: this.PRODUCT_SELECTED.id,
  //     type_discount: discount_g ? discount_g.type_discount : null,
  //     discount: discount_g ? discount_g.discount : null,
  //     type_campaing: discount_g ? discount_g.type_campaing : null,
  //     code_cupon: null,
  //     code_discount: discount_g ? discount_g.code : null,
  //     product_variation_id: product_variation_id,
  //     quantity: $("#tp-cart-input-val").val(),
  //     price_unit: this.currency == 'MXN' ? this.PRODUCT_SELECTED.price_pen : this.PRODUCT_SELECTED.price_usd,
  //     subtotal: this.getTotalPriceProduct(this.PRODUCT_SELECTED),
  //     total: this.getTotalPriceProduct(this.PRODUCT_SELECTED)*$("#tp-cart-input-val").val(),
  //     currency: this.currency,
  //   }

  //   this.cartService.registerCart(data).subscribe((resp:any) => {
  //     console.log(resp);
  //     if(resp.message == 403){
  //       this.toastr.error("Validacion",resp.message_text);
  //     }else{
  //       this.cartService.changeCart(resp.cart);
  //       this.toastr.success("Exitos","El producto se agrego al carrito de compra");
  //     }
  //   },err => {
  //     console.log(err);
  //   })
  // }
}
