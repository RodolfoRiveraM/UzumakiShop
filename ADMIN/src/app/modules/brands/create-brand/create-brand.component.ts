import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BrandService } from '../service/brand.service';

@Component({
  selector: 'app-create-brand',
  templateUrl: './create-brand.component.html',
  styleUrls: ['./create-brand.component.scss']
})
export class CreateBrandComponent {

  @Output() BrandC: EventEmitter<any> = new EventEmitter();

  name:string = '';
  isLoading$:any;

  constructor(
    public brandService: BrandService,
    public modal: NgbActiveModal,
    private toastr: ToastrService,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.brandService.isLoading$;
  }

  store(){
    if(!this.name){
      this.toastr.error("Validación","Todos los campos son necesarios");
      return;
    }
    let data = {
      name: this.name,
      state: 1,
    };
    this.brandService.createBrands(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toastr.error("Validación","EL NOMBRE DE LA MARCA YA EXISTE EN LA BASE DE DATOS");
        return;
      }else{
        this.BrandC.emit(resp.brand);
        this.toastr.success("Exitos","LA MARCA SE HA REGISTRADO CORRECTAMENTE");
        this.modal.close();
      }
    })
  }

}
