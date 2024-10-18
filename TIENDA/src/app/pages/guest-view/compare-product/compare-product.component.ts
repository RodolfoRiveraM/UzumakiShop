import { CommonModule } from '@angular/common';
import { Component, afterNextRender } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalProductComponent } from '../component/modal-product/modal-product.component';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';

declare var $:any;
declare function MODAL_PRODUCT_DETAIL([]):any;
@Component({
  selector: 'app-compare-product',
  standalone: true,
  imports: [FormsModule,RouterModule,CommonModule,ModalProductComponent],
  templateUrl: './compare-product.component.html',
  styleUrl: './compare-product.component.css'
})
export class CompareProductComponent {

  PRODUCTS:any = [];
  currency:string = 'MXN';
  constructor(
    public cookieService: CookieService,
    public toaster: ToastrService,
  ) {
    afterNextRender(() => {
      this.PRODUCTS = localStorage.getItem("compares") ? JSON.parse(localStorage.getItem("compares") ?? "") : [];
      this.currency = this.cookieService.get("currency") ? this.cookieService.get("currency") : 'MXN';
    })
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    setTimeout(() => {
      MODAL_PRODUCT_DETAIL($)
    }, 50);
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

  removeproduct(PRODUCT:any){
    let INDEX = this.PRODUCTS.findIndex((item:any) => item.id == PRODUCT.id);
    if(INDEX != -1){
      this.PRODUCTS.splice(INDEX,1);
      setTimeout(() => {
        localStorage.setItem("compares",JSON.stringify(this.PRODUCTS));
      }, 50);
      this.toaster.info("Informacion","El producto ha sido eliminado de la lista de comparaciones");
    }
  }
}
