import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SlidersService } from '../service/sliders.service';

@Component({
  selector: 'app-create-sliders',
  templateUrl: './create-sliders.component.html',
  styleUrls: ['./create-sliders.component.scss']
})
export class CreateSlidersComponent {


  title:string = '';
  label:string = '';
  subtitle:string = '';
  link:string = '';
  color:string = '';
  imagen_previsualiza:any = "https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg";
  file_imagen:any = null;
  type_slider:any = 1;
  price_original:any = null;
  price_campaing:any = null;

  isLoading$:any;

  constructor(
    public sliderService: SlidersService,
    private toastr: ToastrService,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.sliderService.isLoading$;
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
    this.sliderService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.sliderService.isLoadingSubject.next(false);
    }, 50);
  }

  save(){

    if(!this.title || !this.subtitle || !this.file_imagen){
      this.toastr.error("Validacion","Los campos con el * son obligatorio");
      return;
    }


    let formData = new FormData();
    formData.append("title",this.title);
    if(this.label){
      formData.append("label",this.label);
    }
    formData.append("subtitle",this.subtitle+"");

    formData.append("image",this.file_imagen);

    formData.append("type_slider",this.type_slider);

    if(this.price_original){
      formData.append("price_original",this.price_original);
    }
    if(this.price_campaing){
      formData.append("price_campaing",this.price_campaing);
    }

    if(this.link){
      formData.append("link",this.link);
    }
    if(this.color){
      formData.append("color",this.color);
    }
    
    this.sliderService.createSliders(formData).subscribe((resp:any) => {
      console.log(resp);

      this.title = '';
      this.label = '';
      this.subtitle = '';
      this.link = '';
      this.color = '';
      this.file_imagen = null;
      this.imagen_previsualiza = "https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg";
      this.toastr.success("Exito","El slider se registro perfectamente");
    })
  }

}
