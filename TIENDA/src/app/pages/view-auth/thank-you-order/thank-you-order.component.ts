import { Component, afterNextRender, afterRender } from '@angular/core';
import { CartService } from '../../home/service/cart.service';
import { ActivatedRoute } from '@angular/router';

declare var $:any;
declare function MODAL_PRODUCT_DETAIL([]):any;
@Component({
  selector: 'app-thank-you-order',
  standalone: true,
  imports: [],
  templateUrl: './thank-you-order.component.html',
  styleUrl: './thank-you-order.component.css'
})
export class ThankYouOrderComponent {

  ORDER_SELECTED:any;
  ORDER_SELECTED_ID:any;
  constructor(
    public cartService: CartService,
    public activedRoute: ActivatedRoute,
  ) {

    activedRoute.params.subscribe((resp:any) => {
      this.ORDER_SELECTED_ID = resp.order;
    })

    this.cartService.showOrder(this.ORDER_SELECTED_ID).subscribe((resp:any) => {
      console.log(resp);
      this.ORDER_SELECTED = resp.sale;
    })

    afterRender(() => {
      MODAL_PRODUCT_DETAIL($);
    })
  }
} 
