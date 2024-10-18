import { Component, afterNextRender } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../home/service/cart.service';
import { HomeService } from '../../home/service/home.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalProductComponent } from '../component/modal-product/modal-product.component';

declare var $:any;
@Component({
  selector: 'app-campaing-link',
  standalone: true,
  imports: [FormsModule,RouterModule,CommonModule,ModalProductComponent],
  templateUrl: './campaing-link.component.html',
  styleUrl: './campaing-link.component.css'
})
export class CampaingLinkComponent {

  Categories:any = [];
  Colors:any = [];
  Brands:any = [];
  Products_relateds:any = [];

  PRODUCTS:any = [];
  currency:string = 'PEN';

  product_selected:any = null;
  variation_selected:any = null;

  categories_selected:any = [];
  colors_selected:any = [];
  brands_selected:any = [];
  min_price:number = 0;
  max_price:number = 0;
  options_aditional:any = [];
  CODE_DISCOUNT:any = null;
  DISCOUNT_LINK:any = null;
  constructor(
    public homeService: HomeService,
    public cookieService: CookieService,
    public cartService: CartService,
    public toastr: ToastrService,
    public router: Router,
    public activedRoute: ActivatedRoute,
  ) {
    
    this.homeService.getConfigFilter().subscribe((resp:any) => {
      // console.log(resp);
      this.Categories = resp.categories;
      this.Colors = resp.colors;
      this.Brands = resp.brands;
      this.Products_relateds = resp.product_relateds.data;
    })

    this.activedRoute.params.subscribe((resp:any) => {
      this.CODE_DISCOUNT = resp.code;
    })

    this.homeService.campaingDiscountLink({code_discount: this.CODE_DISCOUNT}).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toastr.info("Validación",resp.message_text);
        return;
      }
      this.PRODUCTS = resp.products;
      this.DISCOUNT_LINK = resp.discount;
    })

    afterNextRender(() => {
      $("#slider-range").slider({
        range: true,
        min: 0,
        max: 2000,
        values: [200, 500],
        slide: (event:any, ui:any) => {
          $("#amount").val(this.currency+ " " + ui.values[0] + " - "+this.currency+ " " + ui.values[1]);
          this.min_price = ui.values[0];
          this.max_price = ui.values[1];
        },stop: () => {
          // this.filterAdvanceProduct();
        }
      });
      $("#amount").val(this.currency+ " " + $("#slider-range").slider("values", 0) +
        " - "+this.currency+ " " + $("#slider-range").slider("values", 1));
    })
  }

  ngOnInit(): void {
    this.currency = this.cookieService.get("currency") ? this.cookieService.get("currency") : 'PEN';
  }

  reset(){
    window.location.href = "/productos-busqueda";
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
  addOptionAditional(option:string){
    let INDEX = this.options_aditional.findIndex((item:any) => item == option);
    if(INDEX != -1){
      this.options_aditional.splice(INDEX,1);
    }else{
      this.options_aditional.push(option);
    }
    console.log(this.options_aditional);
    this.filterAdvanceProduct();
    
  }
  addCategorie(categorie:any){
    let INDEX = this.categories_selected.findIndex((item:any) => item == categorie.id);
    if(INDEX != -1){
      this.categories_selected.splice(INDEX,1);
    }else{
      this.categories_selected.push(categorie.id);
    }
    console.log(this.categories_selected);
    this.filterAdvanceProduct();
  }
  addBrand(Brand:any) {
    let INDEX = this.brands_selected.findIndex((item:any) => item == Brand.id);
    if(INDEX != -1){
      this.brands_selected.splice(INDEX,1);
    }else{
      this.brands_selected.push(Brand.id);
    }
    console.log(this.brands_selected);
    this.filterAdvanceProduct();
  }
  addColor(color:any){
    let INDEX = this.colors_selected.findIndex((item:any) => item == color.id);
    if(INDEX != -1){
      this.colors_selected.splice(INDEX,1);
    }else{
      this.colors_selected.push(color.id);
    }
    console.log(this.colors_selected);
    this.filterAdvanceProduct();
  }

  filterAdvanceProduct() {
    let data = {
      categories_selected: this.categories_selected,
      colors_selected: this.colors_selected,
      brands_selected: this.brands_selected,
      min_price: this.min_price,
      max_price: this.max_price,
      currency: this.currency,
      options_aditional: this.options_aditional,
    }
    // this.homeService.filterAdvanceProduct(data).subscribe((resp:any) => {
    //   console.log(resp);
    //   this.PRODUCTS = resp.products.data;
    // })
  }

  getTotalCurrency(PRODUCT:any){
    if(this.currency == 'PEN'){
      return PRODUCT.price_pen;
    }else{
      return PRODUCT.price_usd;
    }
  }

  getNewTotal(PRODUCT:any,DISCOUNT_FLASH_P:any){
    if(this.currency == 'PEN'){
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
    if(this.DISCOUNT_LINK){
      return this.getNewTotal(PRODUCT,this.DISCOUNT_LINK);
    }
    if(this.currency == 'PEN'){
      return PRODUCT.price_pen;
    }else{
      return PRODUCT.price_usd;
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
      price_unit: this.currency == 'PEN' ? PRODUCT.price_pen : PRODUCT.price_usd,
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
  
  openDetailProduct(PRODUCT:any,DISCOUNT_FLASH:any = null){
    this.product_selected = null;
    this.variation_selected = null;
    setTimeout(() => {
      setTimeout(() => {
        if(DISCOUNT_FLASH){
          this.product_selected.discount_g = DISCOUNT_FLASH;
        }
      }, 25);
      this.product_selected = PRODUCT;
      // MODAL_PRODUCT_DETAIL($);
    }, 50);
  }
  
}
