import { Component } from '@angular/core';
import { CategoriesService } from '../service/categories.service';
import { Toast } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-categorie',
  templateUrl: './create-categorie.component.html',
  styleUrls: ['./create-categorie.component.scss']
})
export class CreateCategorieComponent {

  type_categorie:number = 1;

  name:string = '';
  icon:string = '';
  position:number = 1;
  categorie_second_id:string = '';
  categorie_third_id:string = '';

  imagen_previsualiza:any = "https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg";
  file_imagen:any = null;

  isLoading$:any;

  categories_first:any = [];
  categories_seconds:any = [];
  categories_seconds_backups:any = [];
  constructor(
    public categorieService: CategoriesService,
    private toastr: ToastrService,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.categorieService.isLoading$;
    this.config();
  }

  config(){
    this.categorieService.configCategories().subscribe((resp:any) => {
      this.categories_first = resp.categories_first;
      this.categories_seconds = resp.categories_seconds;
    })
  }

  processFile($event:any){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.toastr.error("Validacion","El archivo no es una imagen");
      return;
    }
    this.file_imagen = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.file_imagen);
    reader.onloadend = () => this.imagen_previsualiza = reader.result;
    this.isLoadingView();
  }

  isLoadingView(){
    this.categorieService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.categorieService.isLoadingSubject.next(false);
    }, 50);
  }

  changeTypeCategorie(val:number){
    this.type_categorie = val;
    this.categorie_third_id = '';
    this.categorie_second_id = '';
  }

  changeDepartamento(){
    this.categories_seconds_backups = this.categories_seconds.filter((item:any) => item.categorie_second_id == this.categorie_third_id)
    // console.log(this.categories_seconds_backups,)
  }

  save(){

    if(!this.name || !this.position){
      this.toastr.error("Validacion","Los campos con el * son obligatorio");
      return;
    }
    
    if(this.type_categorie == 1 && !this.icon){
      this.toastr.error("Validacion","El icono es obligatoria");
      return;
    }

    if(this.type_categorie == 1 && !this.file_imagen){
      this.toastr.error("Validacion","La imagen es obligatoria");
      return;
    }

    if(this.type_categorie == 2 && !this.categorie_second_id){
      this.toastr.error("Validacion","El departamento es obligatorio");
      return;
    }

    if(this.type_categorie == 3 && (!this.categorie_second_id || !this.categorie_third_id)){
      this.toastr.error("Validacion","El departamento y la categoria es obligatorio");
      return;
    }


    let formData = new FormData();
    formData.append("name",this.name);
    if(this.icon){
      formData.append("icon",this.icon);
    }
    formData.append("position",this.position+"");
    formData.append("type_categorie",this.type_categorie+"");
    if(this.file_imagen){
      formData.append("image",this.file_imagen);
    }
    if(this.categorie_second_id){
      formData.append("categorie_second_id",this.categorie_second_id);
    }
    if(this.categorie_third_id){
      formData.append("categorie_third_id",this.categorie_third_id);
    }

    this.categorieService.createCategories(formData).subscribe((resp:any) => {
      console.log(resp);

      if(resp.message == 403){
        this.toastr.error("Validacion","La categoria ya existe");
        return;
      }

      this.name = '';
      this.icon = '';
      this.position = 1;
      this.type_categorie = 1;
      this.file_imagen = null;
      this.imagen_previsualiza = "https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg";
      this.categorie_second_id = '';
      this.categorie_third_id = '';
      this.toastr.success("Exito","La categoria se registro perfectamente");
      this.config();
    })
  }
}
