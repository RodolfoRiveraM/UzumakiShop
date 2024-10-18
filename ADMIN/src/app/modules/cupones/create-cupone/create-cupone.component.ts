import { Component } from '@angular/core';
import { CuponesService } from '../service/cupones.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-cupone',
  templateUrl: './create-cupone.component.html',
  styleUrls: ['./create-cupone.component.scss']
})
export class CreateCuponeComponent {

  code:any;
  type_discount:number = 1;
  discount:number = 0;
  type_count:number = 1;
  num_use:number = 0;
  type_cupone:number = 1;
  product_id:any;
  categorie_id:any;
  brand_id:any;
  isLoading$:any;
  
  categories_first:any = [];
  products:any = [];
  brands:any = [];

  categories_add:any = [];
  products_add:any = [];
  brands_add:any = [];
  constructor(
    public cuponesService: CuponesService,
    private toastr: ToastrService,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.cuponesService.isLoading$;
    this.cuponesService.configCupones().subscribe((resp:any) => {
      this.categories_first = resp.categories;
      this.products = resp.products;
      this.brands = resp.brands;
    })
  }
  changeTypeDiscount(value:number){
    this.type_discount = value;
  }
  changeTypeCount(value:number){
    this.type_count = value;
  }
  changeTypeCupone(value:number){
    this.type_cupone = value;
    this.products_add = [];
    this.categories_add = [];
    this.brands_add = [];
    this.product_id = null;
    this.categorie_id = null;
    this.brand_id = null;
  }
  

  save(){

    if(!this.code || !this.discount){
      this.toastr.error("Validacion","Necesitas llenar todos los campos");
      return;
    }

    if(this.type_count == 2 && this.num_use == 0){
      this.toastr.error("Validacion","ES NECESARIO PONERLE UNA CANTIDAD DE USOS AL CUPON");
      return;
    }

    if(this.type_cupone == 1 && this.products_add.length == 0 ){
      this.toastr.error("Validacion","ES NECESARIO SELECCIONAR UNO O VARIOS PRODUCTOS");
      return;
    }

    if(this.type_cupone == 2 && this.categories_add.length == 0 ){
      this.toastr.error("Validacion","ES NECESARIO SELECCIONAR UNO O VARIAS CATEGORIAS");
      return;
    }

    if(this.type_cupone == 3 && this.brands_add.length == 0 ){
      this.toastr.error("Validacion","ES NECESARIO SELECCIONAR UNO O VARIAS MARCAS");
      return;
    }
    
    let data = {
      type_discount: this.type_discount,
      type_count: this.type_count,
      type_cupone: this.type_cupone,
      num_use: this.num_use,
      discount: this.discount,
      code:this.code,
      product_selected: this.products_add,
      categorie_selected: this.categories_add,
      brand_selected: this.brands_add
    }

    this.cuponesService.createCupones(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toastr.error("Validación",resp.message_text);
      }else{
        this.toastr.success("Exito","EL CUPON SE REGISTRO CORRECTAMENTE");
        this.type_discount = 1;
        this.type_count = 1;
        this.type_cupone = 1;
        this.num_use = 0;
        this.discount = 0;
        this.code = null;
        this.products_add = [];
        this.categories_add = [];
        this.brands_add = [];
        this.product_id = null;
        this.categorie_id = null;
        this.brand_id = null;
      }

    })
  }

  addProduct(){
    if(!this.product_id){
      this.toastr.error("Validación","Es necesario seleccionar un producto");
      return;
    }
    let INDEX = this.products_add.findIndex((prod:any) => prod.id == this.product_id);
    if(INDEX != -1){
      this.toastr.error("Validación","EL PRODUCTO YA EXISTE EN LA LISTA");
      return;
    }
    let DATA = this.products.find((product:any) => product.id == this.product_id);
    if(DATA){
      this.products_add.push(DATA);
    }
  }

  addCategorie(){
    if(!this.categorie_id){
      this.toastr.error("Validación","Es necesario seleccionar una categoria");
      return;
    }
    let INDEX = this.categories_add.findIndex((prod:any) => prod.id == this.categorie_id);
    if(INDEX != -1){
      this.toastr.error("Validación","LA CATEGORIA YA EXISTE EN LA LISTA");
      return;
    }
    let DATA = this.categories_first.find((categorie:any) => categorie.id == this.categorie_id);
    if(DATA){
      this.categories_add.push(DATA);
    }
  }

  addBrand(){
    if(!this.brand_id){
      this.toastr.error("Validación","Es necesario seleccionar una marca");
      return;
    }
    let INDEX = this.brands_add.findIndex((prod:any) => prod.id == this.brand_id);
    if(INDEX != -1){
      this.toastr.error("Validación","LA MARCA YA EXISTE EN LA LISTA");
      return;
    }
    let DATA = this.brands.find((brand:any) => brand.id == this.brand_id);
    if(DATA){
      this.brands_add.push(DATA);
    }
  }


  removeProduct(product:any){
    let INDEX = this.products_add.findIndex((prod:any) => prod.id == product.id);
    if(INDEX != -1){
      this.products_add.splice(INDEX,1);
    }
  }

  removeCategorie(categorie:any){
    let INDEX = this.categories_add.findIndex((prod:any) => prod.id == categorie.id);
    if(INDEX != -1){
      this.categories_add.splice(INDEX,1);
    }
  }

  removeBrand(brand:any){
    let INDEX = this.brands_add.findIndex((prod:any) => prod.id == brand.id);
    if(INDEX != -1){
      this.brands_add.splice(INDEX,1);
    }
  }
}
