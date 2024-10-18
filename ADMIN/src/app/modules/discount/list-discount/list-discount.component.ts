import { Component } from '@angular/core';
import { DeleteDiscountComponent } from '../delete-discount/delete-discount.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DiscountService } from '../service/discount.service';
import { URL_TIENDA } from 'src/app/config/config';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-discount',
  templateUrl: './list-discount.component.html',
  styleUrls: ['./list-discount.component.scss']
})
export class ListDiscountComponent {

  discounts:any = [];
  search:string = '';
  totalPages:number = 0;
  currentPage:number = 1;

  isLoading$:any;
  constructor(
    public discountService: DiscountService,
    public modalService: NgbModal,
    private toastr: ToastrService,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listDiscounts();
    this.isLoading$ = this.discountService.isLoading$;
  }

  listDiscounts(page = 1){
    this.discountService.listDiscounts(page,this.search).subscribe((resp:any) => {
      console.log(resp);
      this.discounts = resp.discounts.data;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }
    
  searchTo(){
    this.listDiscounts();
  }

  loadPage($event:any){
    console.log($event);
    this.listDiscounts($event);
  }

  getNameTypeDiscount(discount_type:number){
    let NAME = "";
    switch (discount_type) {
      case 1:
        NAME = "Productos"
        break;
      case 2:
        NAME = "Categorias"
      break;
      case 3:
        NAME = "Marcas"
        break;
      default:
        break;
    }
    return NAME;
  }
  getNameTypeCampaing(type_campaing:number){
    let NAME = "";
    switch (type_campaing) {
      case 1:
        NAME = "Campaña normal"
        break;
      case 2:
        NAME = "Campaña flash"
      break;
      case 3:
        NAME = "Campaña link"
        break;
      default:
        break;
    }
    return NAME;
  }
  deleteDiscount(discount:any) {
    const modalRef = this.modalService.open(DeleteDiscountComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.discount = discount;

    modalRef.componentInstance.DiscountD.subscribe((resp:any) => {
      let INDEX = this.discounts.findIndex((item:any) => item.id == discount.id);
      if(INDEX != -1){
        this.discounts.splice(INDEX,1);
      }
    })
  }

  copyLink(discount:any) {
    var aux = document.createElement("input");
    aux.setAttribute("value",URL_TIENDA+"/discount/"+discount.code);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    this.toastr.info("Copiado","Ya tienes tu link de descuento");
  }
}
