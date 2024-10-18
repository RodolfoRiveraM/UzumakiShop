import { Injectable } from '@angular/core';
import { AuthService } from '../../../auth/service/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../../config/config';

@Injectable({
  providedIn: 'root'
})
export class ProfileClientService {

  constructor(
    public authService: AuthService,
    public http: HttpClient,
  ) { }

  getInfoProfileClient(){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/ecommerce/profile_client/";
    return this.http.get(URL,{headers: headers});
  }

  updateProfile(data:any){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/ecommerce/profile_client";
    return this.http.post(URL,data,{headers: headers});
  }

  showUsers(){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/ecommerce/profile_client/me";
    return this.http.get(URL,{headers: headers});
  }

  showOrders(){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/ecommerce/profile_client/orders";
    return this.http.get(URL,{headers: headers});
  }

  registerReview(data:any){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/ecommerce/reviews";
    return this.http.post(URL,data,{headers: headers});
  }

  updateReview(review_id:string,data:any){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/ecommerce/reviews/"+review_id;
    return this.http.put(URL,data,{headers: headers});
  }
}
