import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AttributesService } from '../service/attributes.service';
import { SubAttributeDeleteComponent } from '../sub-attribute-delete/sub-attribute-delete.component';

@Component({
  selector: 'app-sub-attribute-create',
  templateUrl: './sub-attribute-create.component.html',
  styleUrls: ['./sub-attribute-create.component.scss']
})
export class SubAttributeCreateComponent {

  // @Output() AttributeC: EventEmitter<any> = new EventEmitter();
  @Input() attribute:any;
  properties:any = [];
  isLoading$:any;
  
  color:any;
  type_action:number = 1;
  name:string = '';
  constructor(
    public attributeService: AttributesService,
    public modal: NgbActiveModal,
    private toastr: ToastrService,
    public modalService: NgbModal,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.attributeService.isLoading$;
    this.properties = this.attribute.properties;
  }

  store(){
    
    if(!this.name){
      this.toastr.error("Validación","Todos los campos son necesarios");
      return;
    }
    if(this.type_action == 2 && !this.color){
      this.toastr.error("Validación","Necesitas seleccionar un color");
      return;
    }
    let data = {
      name: this.name,
      code: this.color,
      attribute_id: this.attribute.id,
      state: 1,
    };
    this.attributeService.createProperties(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toastr.error("Validación","EL NOMBRE DE LA PROPIEDAD YA EXISTE EN LA BASE DE DATOS");
        return;
      }else{
        this.properties.unshift(resp.propertie);
        // this.AttributeC.emit(resp.attribute);
        this.toastr.success("Exitos","LA PROPIEDAD SE HA REGISTRADO CORRECTAMENTE");
        // this.modal.close();
      }
    })
  }

  delete(propertie:any){
    const modalRef = this.modalService.open(SubAttributeDeleteComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.propertie = propertie;

    modalRef.componentInstance.PropertieD.subscribe((resp:any) => {
      let INDEX = this.properties.findIndex((item:any) => item.id == propertie.id);
      if(INDEX != -1){
        this.properties.splice(INDEX,1);
      }
    })
  }
}
