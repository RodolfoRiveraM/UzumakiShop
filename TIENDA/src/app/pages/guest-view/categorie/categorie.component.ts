import { Component, afterNextRender, afterRender } from '@angular/core';
import { HomeService } from '../../home/service/home.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule,Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalProductComponent } from '../component/modal-product/modal-product.component';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from '../../home/service/cart.service';
import { ToastrService } from 'ngx-toastr';

declare function SLIDER_PRINCIPAL([]):any;
declare var $:any;
declare function DATA_VALUES([]):any;
declare function PRODUCTS_CAROUSEL_HOME([]):any;
declare function MODAL_PRODUCT_DETAIL([]):any;
@Component({
  selector: 'app-categorie',
  standalone: true,
  imports: [FormsModule,RouterModule,CommonModule,ModalProductComponent],
  templateUrl: './categorie.component.html',
  styleUrl: './categorie.component.css'
})
export class CategorieComponent {
  SLIDERS:any = [];
  CATEGORIES_RANDOMS:any = [];
  
  productos_categoria:any = [];
  TRADING_PRODUCT_FEATURE:any = [];
  TRADING_PRODUCT_TOP_SELLER:any = [];
  PRODUCTS_ELECTRONICS:any = [];
  PRODUCTS_CAROUSEL:any = [];

  BANNERS_SECUNDARIOS:any = [];
  BANNERS_PRODUCTS:any = [];

  LASTS_PRODUCT_DISCOUNT:any = [];
  LASTS_PRODUCT_FEATURE:any = [];
  LASTS_PRODUCT_SELLING:any = [];

  DISCOUNT_FLASH:any;
  DISCOUNT_FLASH_PRODUCTS:any = [];

  product_selected:any = null;
  variation_selected:any = null;
  currency:string = 'MXN';

  CATEGORIA:any;
  dataDategoria:any;

  constructor(
    public homeService: HomeService,
    public activedRoute: ActivatedRoute,
    private cookieService: CookieService,
    public cartService: CartService,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.activedRoute.params.subscribe((resp:any) => {
      this.CATEGORIA = resp.slug;
    })
    // afterNextRender(() => {
      this.homeService.categorie(this.CATEGORIA).subscribe((resp:any) => {
        console.log(resp);
        if (resp.product_categorie.data) {
          this.productos_categoria = resp.product_categorie.data;
        }
        this.dataDategoria = resp.categoria;
        console.log('aaaa', this.dataDategoria);
      })
    // })
    afterRender(() => {
      setTimeout(() => {
        SLIDER_PRINCIPAL($);
        DATA_VALUES($);
        PRODUCTS_CAROUSEL_HOME($);
        this.SLIDERS.forEach((SLIDER:any) => {
          this.getLabelSlider(SLIDER)
          this.getSubtitleSlider(SLIDER)
        });
        this.BANNERS_SECUNDARIOS.forEach((BANNER:any,index:number) => {
          if(index == 0){
            this.getTitleBannerSecundario(BANNER,'title-banner-s-'+BANNER.id);
          }else{
            this.getTitleBannerSecundario(BANNER,'title-banner-sa-'+BANNER.id);
          }
        });
      }, 50);
      // this.currency = this.cookieService.get("currency") ? this.cookieService.get("currency") : 'MXN';
    })

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.currency = this.cookieService.get("currency") ? this.cookieService.get("currency") : 'MXN';
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
    if(COMPARES.length > 1){
      this.router.navigateByUrl("/compare-product");
    }
  }

  addCart(PRODUCT:any) {
    if(!this.cartService.authService.user){
      this.toastr.error("Validacion","Ingrese a la tienda");
      this.router.navigateByUrl("/login");
      return;
    }

    if(PRODUCT.variations.length > 0){
      $("#producQuickViewModal").modal("show");
      this.openDetailProduct(PRODUCT);
      return;
    }

    let discount_g = null;

    if(PRODUCT.discount_g){
      discount_g = PRODUCT.discount_g;
    }

    let data = {
      product_id: PRODUCT.id,
      type_discount: discount_g ? discount_g.type_discount : null,
      discount: discount_g ? discount_g.discount : null,
      type_campaing: discount_g ? discount_g.type_campaing : null,
      code_cupon: null,
      code_discount: discount_g ? discount_g.code : null,
      product_variation_id: null,
      quantity: 1,
      price_unit: this.currency == 'MXN' ? PRODUCT.price_pen : PRODUCT.price_usd,
      subtotal: this.getTotalPriceProduct(PRODUCT),
      total: this.getTotalPriceProduct(PRODUCT)*1,
      currency: this.currency,
    }

    this.cartService.registerCart(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toastr.error("Validacion",resp.message_text);
      }else{
        this.cartService.changeCart(resp.cart);
        this.toastr.success("Exitos","El producto se agrego al carrito de compra");
      }
    },err => {
      console.log(err);
    })
  }

  getLabelSlider(SLIDER:any){
    var miDiv:any = document.getElementById('label-'+SLIDER.id);
    miDiv.innerHTML = SLIDER.label; 
    return '';
  }

  getSubtitleSlider(SLIDER:any){
    var miDiv:any = document.getElementById('subtitle-'+SLIDER.id);
    miDiv.innerHTML = SLIDER.subtitle; 
    return '';
  }

  getTitleBannerSecundario(BANNER:any,ID_BANNER:string){
    var miDiv:any = document.getElementById(ID_BANNER);
    miDiv.innerHTML = BANNER.title; 
    return '';
  }

  getNewTotal(PRODUCT:any,DISCOUNT_FLASH_P:any){
    if(this.currency == 'MXN'){
      if(DISCOUNT_FLASH_P.type_discount == 1){//% DE DESCUENT0 50
        // 100 / 100*(50*0.01) 100*0.5=50
        return (PRODUCT.price_pen - PRODUCT.price_pen*(DISCOUNT_FLASH_P.discount*0.01)).toFixed(2)
      }else{//-PEN/-USD 
        return (PRODUCT.price_pen - DISCOUNT_FLASH_P.discount).toFixed(2);
      }
    }else{
      if(DISCOUNT_FLASH_P.type_discount == 1){//% DE DESCUENT0 50
        // 100 / 100*(50*0.01) 100*0.5=50
        return (PRODUCT.price_usd - PRODUCT.price_usd*(DISCOUNT_FLASH_P.discount*0.01)).toFixed(2)
      }else{//-PEN/-USD 
        return (PRODUCT.price_usd - DISCOUNT_FLASH_P.discount).toFixed(2);
      }
    }
  }

  getTotalPriceProduct(PRODUCT:any){
    if(PRODUCT.discount_g){
      return this.getNewTotal(PRODUCT,PRODUCT.discount_g);
    }
    if(this.currency == 'MXN'){
      return PRODUCT.price_pen;
    }else{
      return PRODUCT.price_usd;
    }
  }

  getTotalCurrency(PRODUCT:any){
    if(this.currency == 'MXN'){
      return PRODUCT.price_pen;
    }else{
      return PRODUCT.price_usd;
    }
  }

  trackById(index: number, product: any): number {
    return product.id;
  }

  openDetailProduct(PRODUCT:any,DISCOUNT_FLASH:any = null){
    console.log('aaaaaaa', PRODUCT, DISCOUNT_FLASH);
    this.product_selected = null;
    this.variation_selected = null;
    setTimeout(() => {
      setTimeout(() => {
        if(DISCOUNT_FLASH){
          console.log(DISCOUNT_FLASH)
          this.product_selected.discount_g = DISCOUNT_FLASH;
        }
      }, 25);
      this.product_selected = PRODUCT;
      // MODAL_PRODUCT_DETAIL($);
    }, 50);
  }

  selectedVariation(variation:any){
    this.variation_selected = null;
    setTimeout(() => {
      this.variation_selected = variation;
      MODAL_PRODUCT_DETAIL($);
    }, 50);
  }

  addCarrito(PRODUCT:any, new_precio:string = "0"){
    PRODUCT.precio_unitario = PRODUCT.price_pen;
    if(new_precio != "0"){
      PRODUCT.precio_unitario = Number(new_precio);
    }
    console.log(PRODUCT)
    PRODUCT.quantity = 1;
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
}
