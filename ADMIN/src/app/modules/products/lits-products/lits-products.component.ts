import { Component } from '@angular/core';
import { ProductService } from '../service/product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteProductComponent } from '../delete-product/delete-product.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lits-products',
  templateUrl: './lits-products.component.html',
  styleUrls: ['./lits-products.component.scss']
})
export class LitsProductsComponent {

  products:any = [];
  search:string = '';
  totalPages:number = 0;
  currentPage:number = 1;

  isLoading$:any;

  marcas:any = [];
  marca_id:string = '';
  categorie_first_id:string = '';
  categorie_second_id:string = '';
  categorie_third_id:string = '';
  categories_first:any = [];
  categories_seconds:any = [];
  categories_seconds_backups:any = [];
  categories_thirds:any = [];
  categories_thirds_backups:any = [];
  constructor(
    public productService: ProductService,
    public modalService: NgbModal,
    private toastr: ToastrService,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listProducts();
    this.isLoading$ = this.productService.isLoading$;
    this.configAll();
  }

  configAll(){
    this.productService.configAll().subscribe((resp:any) => {
      console.log(resp);
      this.marcas = resp.brands;
      this.categories_first = resp.categories_first;
      this.categories_seconds = resp.categories_seconds;
      this.categories_thirds = resp.categories_thirds;
    })
  }
  listProducts(page = 1){
    let data = {
      search: this.search,
      brand_id: this.marca_id,
      categorie_first_id: this.categorie_first_id,
      categorie_second_id: this.categorie_second_id,
      categorie_third_id: this.categorie_third_id,
    }
    this.productService.listProducts(page,data).subscribe((resp:any) => {
      console.log(resp);
      this.products = resp.products.data;
      this.totalPages = resp.total;
      this.currentPage = page;
    },(err:any) => {
      console.log(err);
      this.toastr.error("API RESPONSE - COMUNIQUESE CON EL DESARROLLADOR",err.error.message);
    })
  }
    
  changeDepartamento(){
    this.categories_seconds_backups = this.categories_seconds.filter((item:any) => 
    item.categorie_second_id == this.categorie_first_id
    )
  }
  changeCategorie(){
    this.categories_thirds_backups = this.categories_thirds.filter((item:any) => 
    item.categorie_second_id == this.categorie_second_id
    )
  }

  searchTo(){
    this.listProducts();
  }

  loadPage($event:any){
    console.log($event);
    this.listProducts($event);
  }

  deleteProduct(product:any) {
    const modalRef = this.modalService.open(DeleteProductComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.product = product;

    modalRef.componentInstance.ProductD.subscribe((resp:any) => {
      let INDEX = this.products.findIndex((item:any) => item.id == product.id);
      if(INDEX != -1){
        this.products.splice(INDEX,1);
      }
    })
  }

}
