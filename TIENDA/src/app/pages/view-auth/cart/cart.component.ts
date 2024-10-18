import { CommonModule } from '@angular/common';
import { Component, afterNextRender } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartService } from '../../home/service/cart.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule,RouterModule,CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  PRODUCTS:any = [];
  currency:string = 'MXN';
  listCarts:any = [];
  totalCarts:number = 0;
  
  code_cupon:string = '';
  constructor(
    public cartService: CartService,
    private cookieService: CookieService,
    private toastr: ToastrService,
  ) {
    setTimeout(() => {
      this.PRODUCTS = localStorage.getItem("carrito") ? JSON.parse(localStorage.getItem("carrito") ?? "") : [];
      this.currency = this.cookieService.get("currency") ? this.cookieService.get("currency") : 'MXN';
      console.log(this.PRODUCTS);
      this.totalCarts = this.PRODUCTS.reduce((sum:number, item:any) => sum + item.precio_unitario*item.quantity, 0);
    })
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.currency = this.cookieService.get("currency") ? this.cookieService.get("currency") : 'MXN';
    this.cartService.currentDataCart$.subscribe((resp:any) => {
      this.listCarts = resp;
    })
  }

  deleteCart(CART:any) {
    // this.cartService.deleteCart(CART.id).subscribe((resp:any) => {
    //   this.toastr.info("Eliminación","Se elimino el producto "+CART.product.title + " del carrito de compra");
    //   this.cartService.removeCart(CART);
    // })
  }

  removeproduct(PRODUCT:any){
    let INDEX = this.PRODUCTS.findIndex((item:any) => item.id == PRODUCT.id);
    if(INDEX != -1){
      this.PRODUCTS.splice(INDEX,1);
      setTimeout(() => {
        localStorage.setItem("carrito",JSON.stringify(this.PRODUCTS));
        this.totalCarts = this.PRODUCTS.reduce((sum:number, item:any) => sum + item.precio_unitario*item.quantity, 0);
      }, 50);
      this.toastr.info("Informacion","El producto ha sido eliminado en el carrito");
    }
  }

  // minusQuantity(cart:any){
  //   if(cart.quantity == 1){
  //     this.toastr.error("Validacion","Ya no puedes disminuir el producto");
  //     return;
  //   }
  //   cart.quantity = cart.quantity - 1;

  //   // this.cartService.updateCart(cart.id,cart).subscribe((resp:any) => {
  //   //   console.log(resp);
  //   //   if(resp.message == 403){
  //   //     this.toastr.error("Validacion",resp.message_text);
  //   //   }else{
  //   //     this.cartService.changeCart(resp.cart);
  //   //     this.toastr.info("Exito","Se actualizo la cantidad  del producto "+resp.cart.product.title);
  //   //   }
  //   // })
  // }

  minusQuantity(cart:any) {
      // Verificar si la cantidad es igual a 1
      if (cart.quantity === 1) {
          this.toastr.error("Validación", "Ya no puedes disminuir el producto");
          return;
      }

      // Disminuir la cantidad
      cart.quantity = cart.quantity - 1;

      // Obtener el carrito desde localStorage
      let carritoString = localStorage.getItem('carrito');
      let carrito: any[] = []; // Inicializar carrito como un arreglo vacío

      if (carritoString) { // Verificar que el string no sea null
          carrito = JSON.parse(carritoString);
      }

      // Actualizar la cantidad del producto en el carrito
      carrito = carrito.map(producto => {
          if (producto.id === cart.id) {
              return { ...producto, quantity: cart.quantity }; // Actualizar solo la cantidad
          }
          return producto;
      });

      // Guardar el carrito actualizado en localStorage
      localStorage.setItem('carrito', JSON.stringify(carrito));

      // Notificación de éxito (opcional)
      this.toastr.success("Cantidad actualizada", `La nueva cantidad es ${cart.quantity}`);
      this.totalCarts = this.PRODUCTS.reduce((sum:number, item:any) => sum + item.precio_unitario*item.quantity, 0);
  }

  // plusQuantity(cart:any){
  //   if(cart.quantity >= cart.stock){
  //     this.toastr.error("Validacion","Ya no puedes aumentar el producto");
  //     return;
  //   }
  //   let quantity_old =  cart.quantity;
  //   cart.quantity = cart.quantity + 1;
  //   // this.cartService.updateCart(cart.id,cart).subscribe((resp:any) => {
  //   //   console.log(resp);
  //   //   if(resp.message == 403){
  //   //     cart.quantity = quantity_old;
  //   //     cart.total = cart.subtotal * cart.quantity;
  //   //     this.toastr.error("Validacion",resp.message_text);
  //   //   }else{
  //   //     this.cartService.changeCart(resp.cart);
  //   //     this.toastr.info("Exito","Se actualizo la cantidad  del producto "+resp.cart.product.title);
  //   //   }
  //   // })
  // }

  plusQuantity(cart:any) {
      // Verificar si la cantidad actual es mayor o igual al stock
      if (cart.quantity >= cart.stock) {
          this.toastr.error("Validación", "Ya no puedes aumentar el producto");
          return;
      }
      
      // Almacenar la cantidad anterior
      let quantity_old = cart.quantity;

      // Aumentar la cantidad
      cart.quantity = quantity_old + 1;

      // Obtener el carrito desde localStorage
      let carritoString = localStorage.getItem('carrito');
      let carrito: any[] = []; // Inicializar carrito como un arreglo vacío

      if (carritoString) { // Verificar que el string no sea null
          carrito = JSON.parse(carritoString);
      }

      // Actualizar la cantidad del producto en el carrito
      carrito = carrito.map(producto => {
          if (producto.id === cart.id) {
              return { ...producto, quantity: cart.quantity }; // Actualizar solo la cantidad
          }
          return producto;
      });

      // Guardar el carrito actualizado en localStorage
      localStorage.setItem('carrito', JSON.stringify(carrito));

      // Notificación de éxito (opcional)
      this.toastr.success("Cantidad actualizada", `La nueva cantidad es ${cart.quantity}`);
      this.totalCarts = this.PRODUCTS.reduce((sum:number, item:any) => sum + item.precio_unitario*item.quantity, 0);
  }

  appyCupon(){
    if(!this.code_cupon){
      this.toastr.error("Validacion",'Se necesita ingresar un codigo de cupon');
      return;
    }
    let data = {
      code_cupon : this.code_cupon,
    };
    this.cartService.applyCupon(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toastr.error("Validacion",resp.message_text);
        return;
      }else{
        this.cartService.resetCart();
        this.cartService.listCart().subscribe((resp:any) => {
          resp.carts.data.forEach((cart:any) => {
            this.cartService.changeCart(cart)
          });
        })
      }
    })
  }
}
