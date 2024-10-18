import { Component } from '@angular/core';
import { AttributesService } from '../../service/attributes.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { EditVariationSpecificationsComponent } from '../edit-variation-specifications/edit-variation-specifications.component';
import { DeleteVariationSpecificationsComponent } from '../delete-variation-specifications/delete-variation-specifications.component';
import { CreateAnidadoVariationsComponent } from '../create-anidado-variations/create-anidado-variations.component';

@Component({
  selector: 'app-create-variation-specifications',
  templateUrl: './create-variation-specifications.component.html',
  styleUrls: ['./create-variation-specifications.component.scss']
})
export class CreateVariationSpecificationsComponent {

  title:string = '';
  sku:string = '';

  isLoading$:any;

  specification_attribute_id:string = '';
  type_attribute_specification:number = 2;
  variations_attribute_id:string = '';
  type_attribute_variation:number = 4;
  attributes:any = [];

  dropdownList:any = [];
  selectedItems:any = [];//CAMPO_4
  dropdownSettings:IDropdownSettings = {};
  word:string = '';

  isShowMultiselect:Boolean = false;
  PRODUCT_ID:string = '';
  PRODUCT_SELECTED:any;

  campo_1:string = '';
  campo_2:number = 0;
  campo_3:any;

  campo_1_variation:any;
  dropdownListVariations:any = [];
  selectedItemsVariations:any = [];
  precio_add:number = 0;
  stock_add:number = 0;

  attributes_specifications:any = [];
  attributes_variations:any = [];
  properties:any = [];
  propertie_id:any = null;
  value_add:any = null;
  specifications:any = [];
  variations:any = [];
  constructor(
    public attributeService: AttributesService,
    private toastr: ToastrService,
    private activedRoute: ActivatedRoute,
    public modalService: NgbModal,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.attributeService.isLoading$;

    // this.dropdownList = [
    //   { item_id: 5, item_text: 'New Delhi' },
    //   { item_id: 6, item_text: 'Laravest' }
    // ];
    // this.selectedItems = [
    //   { item_id: 6, item_text: 'Laravest' }
    // ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.activedRoute.params.subscribe((resp:any) => {
      console.log(resp);
      this.PRODUCT_ID = resp.id;
    });
    
    this.showProduct();
    this.configAll();
    this.listSpecification();
    this.listVariations();
  }

  configAll(){
    this.attributeService.configAll().subscribe((resp:any) => {
      console.log(resp);
      this.attributes_specifications = resp.attributes_specifications;
      this.attributes_variations = resp.attributes_variations;
    })
  }
  listSpecification(){
    this.attributeService.listSpecification(this.PRODUCT_ID).subscribe((resp:any) => {
      console.log(resp);
      this.specifications = resp.specifications;
    })
  }
  listVariations(){
    this.attributeService.listVariations(this.PRODUCT_ID).subscribe((resp:any) => {
      console.log(resp);
      this.variations = resp.variations;
    })
  }
  showProduct() {
    this.attributeService.showProduct(this.PRODUCT_ID).subscribe((resp:any) => {
      console.log(resp);
      this.PRODUCT_SELECTED = resp.product;
      this.title = resp.product.title;
      this.sku = resp.product.sku;
    })
  }

  changeSpecifications(){
    this.value_add = null;
    this.propertie_id = null;
    this.selectedItems = [];
    let ATTRIBUTE = this.attributes_specifications.find((item:any) => item.id == this.specification_attribute_id);
    if(ATTRIBUTE){
      this.type_attribute_specification = ATTRIBUTE.type_attribute;
      if(this.type_attribute_specification == 3 || this.type_attribute_specification == 4){
        this.properties = ATTRIBUTE.properties;
        this.dropdownList = ATTRIBUTE.properties;
      }else{
        this.properties = [];
        this.dropdownList = [];
      }
    }else{
      this.type_attribute_specification = 0;
      this.properties = [];
      this.dropdownList = [];
    }
  }

  changeVariations(){
    this.value_add = null;
    this.propertie_id = null;
    let ATTRIBUTE = this.attributes_variations.find((item:any) => item.id == this.variations_attribute_id);
    if(ATTRIBUTE){
      this.type_attribute_variation = ATTRIBUTE.type_attribute;
      if(this.type_attribute_variation == 3 || this.type_attribute_variation == 4){
        this.properties = ATTRIBUTE.properties;
      }else{
        this.properties = [];
      }
    }else{
      this.type_attribute_variation = 0;
      this.properties = [];
    }
  }

  addItems(){
    this.isShowMultiselect = true;
    let time_date = new Date().getTime();
    this.dropdownList.push({ item_id: time_date, item_text: this.word });
    this.selectedItems.push({ item_id: time_date, item_text: this.word });
    setTimeout(() => {
      this.word = '';
      this.isShowMultiselect = false;
      this.isLoadingView();
    }, 100);
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  isLoadingView(){
    this.attributeService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.attributeService.isLoadingSubject.next(false);
    }, 50);
  }
  

  save(){

    if(this.type_attribute_specification == 4 && this.selectedItems.length == 0 ){
      this.toastr.error("Validación","Necesitas seleccionar algunos items");
      return;
    }
    if(this.selectedItems.length > 0){
      this.value_add = JSON.stringify(this.selectedItems);
    }
    if(!this.specification_attribute_id || ( !this.propertie_id && !this.value_add)){
      this.toastr.error("Validación","Llene los campos necesarios");
      return;
    }
    let data = {
      product_id: this.PRODUCT_ID,
      attribute_id: this.specification_attribute_id,
      propertie_id: this.propertie_id,
      value_add: this.value_add,
    }

    this.attributeService.createSpecification(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toastr.error("Validación",resp.message_text);
      }else{
        this.toastr.success("Exito","Se registro la especificación correctamente");
        this.specifications.unshift(resp.specification); 
        this.value_add = null;
        this.propertie_id = null;
        this.specification_attribute_id = '';
      }
    })
  }

  editSpecification(specification:any){
    const modal = this.modalService.open(EditVariationSpecificationsComponent,{centered:true,size: 'md'});
    modal.componentInstance.specification = specification;
    modal.componentInstance.attributes_specifications = this.attributes_specifications;

    modal.componentInstance.EspecificationE.subscribe((edit:any) => {
      console.log(edit);
      let INDEX = this.specifications.findIndex((item:any) => item.id == edit.specification.id);
      if(INDEX != -1){
        this.specifications[INDEX] = edit.specification;
      }
    })
  }

  deleteSpecification(specification:any){
    const modal = this.modalService.open(DeleteVariationSpecificationsComponent,{centered:true,size: 'md'});
    modal.componentInstance.specification = specification;

    modal.componentInstance.EspecificationD.subscribe((edit:any) => {
      console.log(edit);
      let INDEX = this.specifications.findIndex((item:any) => item.id == specification.id);
      if(INDEX != -1){
        this.specifications.splice(INDEX,1);
      }
    })
  }

  getValueAttribute(attribute_special:any){
    if(attribute_special.propertie_id){
      return attribute_special.propertie.name;
    }
    if(attribute_special.value_add){
      return attribute_special.value_add;
    }

    return "---";
  }
  
  saveVariation(){

    if(!this.variations_attribute_id || ( !this.propertie_id && !this.value_add)){
      this.toastr.error("Validación","Llene los campos necesarios");
      return;
    }
    if(this.precio_add < 0){
      this.toastr.error("Validación","El valor del precio debe ser mayor o igual");
      return;
    }
    if(this.stock_add <= 0){
      this.toastr.error("Validación","El stock debe ser mayor a 0");
      return;
    }
    let data = {
      product_id: this.PRODUCT_ID,
      attribute_id: this.variations_attribute_id,
      propertie_id: this.propertie_id,
      value_add: this.value_add,
      add_price: this.precio_add,
      stock: this.stock_add,
    }

    this.attributeService.createVariations(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toastr.error("Validación",resp.message_text);
      }else{
        this.toastr.success("Exito","Se registro la variación correctamente");
        this.variations.unshift(resp.variation); 
        this.value_add = null;
        this.propertie_id = null;
        this.variations_attribute_id = '';
        this.precio_add = 0;
        this.stock_add = 0;
      }
    })
  }

  editVariation(variation:any){
    const modal = this.modalService.open(EditVariationSpecificationsComponent,{centered:true,size: 'md'});
    modal.componentInstance.specification = variation;
    modal.componentInstance.attributes_specifications = this.attributes_specifications;
    modal.componentInstance.attributes_variations = this.attributes_variations;
    modal.componentInstance.is_variation = 1;

    modal.componentInstance.EspecificationE.subscribe((edit:any) => {
      console.log(edit);
      let INDEX = this.variations.findIndex((item:any) => item.id == edit.variation.id);
      if(INDEX != -1){
        this.variations[INDEX] = edit.variation;
      }
    })
  }

  deleteVariation(variation:any){
    const modal = this.modalService.open(DeleteVariationSpecificationsComponent,{centered:true,size: 'md'});
    modal.componentInstance.specification = variation;
    modal.componentInstance.is_variation = 1;

    modal.componentInstance.EspecificationD.subscribe((edit:any) => {
      console.log(edit);
      let INDEX = this.variations.findIndex((item:any) => item.id == variation.id);
      if(INDEX != -1){
        this.variations.splice(INDEX,1);
      }
    })
  }

  openAnidado(variation:any){
    const modal = this.modalService.open(CreateAnidadoVariationsComponent,{centered:true,size: 'lg'});
    modal.componentInstance.variation = variation;
    modal.componentInstance.attributes_variations = this.attributes_variations;
    
  }
}
