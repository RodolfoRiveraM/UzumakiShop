import { Component } from '@angular/core';
import { CuponesService } from '../service/cupones.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteCuponeComponent } from '../delete-cupone/delete-cupone.component';

@Component({
  selector: 'app-list-cupone',
  templateUrl: './list-cupone.component.html',
  styleUrls: ['./list-cupone.component.scss']
})
export class ListCuponeComponent {

  cupones:any = [];
  search:string = '';
  totalPages:number = 0;
  currentPage:number = 1;

  isLoading$:any;
  constructor(
    public cuponeService: CuponesService,
    public modalService: NgbModal,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listCupones();
    this.isLoading$ = this.cuponeService.isLoading$;
  }

  listCupones(page = 1){
    this.cuponeService.listCupones(page,this.search).subscribe((resp:any) => {
      console.log(resp);
      this.cupones = resp.cupones.data;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }
    
  searchTo(){
    this.listCupones();
  }

  loadPage($event:any){
    console.log($event);
    this.listCupones($event);
  }

  getNameTypeCupon(type_cupone:number){
    let NAME = "";
    switch (type_cupone) {
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

  deleteCupon(cupone:any) {
    const modalRef = this.modalService.open(DeleteCuponeComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.cupone = cupone;

    modalRef.componentInstance.CuponD.subscribe((resp:any) => {
      let INDEX = this.cupones.findIndex((item:any) => item.id == cupone.id);
      if(INDEX != -1){
        this.cupones.splice(INDEX,1);
      }
    })
  }

}
