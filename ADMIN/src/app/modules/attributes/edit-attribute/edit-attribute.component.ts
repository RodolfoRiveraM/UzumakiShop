import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AttributesService } from '../service/attributes.service';

@Component({
  selector: 'app-edit-attribute',
  templateUrl: './edit-attribute.component.html',
  styleUrls: ['./edit-attribute.component.scss']
})
export class EditAttributeComponent {

  @Output() AttributeE: EventEmitter<any> = new EventEmitter();

  @Input() attribute:any;

  name:string = '';
  type_attribute:number = 1;
  isLoading$:any;

  constructor(
    public attributeService: AttributesService,
    public modal: NgbActiveModal,
    private toastr: ToastrService,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.attributeService.isLoading$;
    this.name = this.attribute.name;
    this.type_attribute = this.attribute.type_attribute;
  }

  store(){
    if(!this.name || !this.type_attribute){
      this.toastr.error("Validación","Todos los campos son necesarios");
      return;
    }
    let data = {
      name: this.name,
      type_attribute: this.type_attribute,
      state: 1,
    };
    this.attributeService.updateAttributes(this.attribute.id,data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toastr.error("Validación","EL NOMBRE DEL ATRIBUTO YA EXISTE EN LA BASE DE DATOS");
        return;
      }else{
        this.AttributeE.emit(resp.attribute);
        this.toastr.success("Exitos","EL ATRIBUTO SE HA EDITADO CORRECTAMENTE");
        this.modal.close();
      }
    })
  }
}
