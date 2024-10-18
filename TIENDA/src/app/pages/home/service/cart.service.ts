import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../auth/service/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PRODUCTION, URL_SERVICIOS } from '../../../config/config';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  public cart = new BehaviorSubject<Array<any>>([]);
  public currentDataCart$ = this.cart.asObservable();

  constructor(
    public authService: AuthService,
    public http: HttpClient,
  ) { }

  changeCart(DATA:any){
    let listCart = this.cart.getValue();
    let INDEX = listCart.findIndex((item:any) => item.id == DATA.id);
    if(INDEX != -1){
      listCart[INDEX] = DATA;
    }else{
      listCart.unshift(DATA);
    }
    this.cart.next(listCart);
  }

  resetCart(){
    let listCart:any = [];
    this.cart.next(listCart);
  }

  removeCart(DATA:any){
    let listCart = this.cart.getValue();
    let INDEX = listCart.findIndex((item:any) => item.id == DATA.id);
    if(INDEX != -1){
      listCart.splice(INDEX,1);
    }
    this.cart.next(listCart);
  }

  listCart(){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/ecommerce/carts/";
    return this.http.get(URL,{headers: headers});
  }

  registerCart(data:any){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/ecommerce/carts";
    return this.http.post(URL,data,{headers: headers});
  }

  updateCart(cart_id:string,data:any){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/ecommerce/carts/"+cart_id;
    return this.http.put(URL,data,{headers: headers});
  }

  deleteCart(cart_id:any){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/ecommerce/carts/"+cart_id;
    return this.http.delete(URL,{headers: headers});
  }
  deleteCartsAll(){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/ecommerce/carts/delete_all";
    return this.http.delete(URL,{headers: headers});
  }
  applyCupon(data:any) {
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/ecommerce/carts/apply_cupon";
    return this.http.post(URL,data,{headers: headers});
  }

  checkout(data:any) {
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/ecommerce/checkout";
    return this.http.post(URL,data,{headers: headers});
  }

  showOrder(sale_id:string = ''){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/ecommerce/sale/"+sale_id;
    return this.http.get(URL,{headers: headers});
  }

  mercadopago(price_total:number = 0){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = "";
    if(PRODUCTION){
      URL = URL_SERVICIOS+"/ecommerce/mercadopago";
    }else{
      URL = "https://mercadopago.laravest.com/api/ecommerce/mercadopago?price_unit="+price_total;
    }
    return this.http.get(URL,{headers: headers});
  }

  checkoutMercadoPago(data:any) {
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/ecommerce/checkout-mercadopago";
    return this.http.post(URL,data,{headers: headers});
  }

  storeTemp(data:any) {
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/ecommerce/checkout-temp";
    return this.http.post(URL,data,{headers: headers});
  }
}
