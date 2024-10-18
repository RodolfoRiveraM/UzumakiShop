import { Component } from '@angular/core';
import { ProfileClientService } from '../service/profile-client.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit-profile-client',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './edit-profile-client.component.html',
  styleUrl: './edit-profile-client.component.css'
})
export class EditProfileClientComponent {

  name:string = '';
  surname:string = '';
  email:string = '';
  phone:string = '';
  bio:string = '';
  fb:string = '';
  tw:string = '';
  sexo:string = '';
  description:string = '';
  address_city:string = '';
  file_imagen:any;
  imagen_previsualiza:any;
  constructor(
    public profileClient: ProfileClientService,
    public toaster: ToastrService,
  ) {
    
    this.profileClient.showUsers().subscribe((resp:any) => {
      console.log(resp);
      this.name = resp.name
      this.surname = resp.surname
      this.email = resp.email
      this.phone = resp.phone
      this.bio = resp.bio
      this.fb = resp.fb
      this.tw = resp.tw
      this.sexo = resp.sexo
      this.address_city = resp.address_city
      this.imagen_previsualiza = resp.avatar;
    })
  }
  processFile($event:any){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.toaster.error("Validacion","El archivo no es una imagen");
      return;
    }
    this.file_imagen = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.file_imagen);
    reader.onloadend = () => this.imagen_previsualiza = reader.result;
  }
  updateUser(){
    if(!this.name || !this.email){
      this.toaster.error("Validación","Es necesario ingresar un nombre y un correo electronico");
      return;
    }
    // let data = {
    //   name: this.name,
    //   surname: this.surname,
    //   email: this.email,
    //   phone: this.phone,
    //   bio: this.bio,
    //   fb: this.fb,
    //   tw: this.tw,
    //   sexo: this.sexo,
    //   address_city: this.address_city,
    // }

    let formData = new FormData();
    formData.append("name",this.name);
    formData.append("surname",this.surname);
    formData.append("email",this.email);
    if(this.phone){
      formData.append("phone",this.phone);
    }
    if(this.bio){
      formData.append("bio",this.bio);
    }
    if(this.fb){
      formData.append("fb",this.fb);
    }
    if(this.tw){
      formData.append("tw",this.tw);
    }
    if(this.sexo){
      formData.append("sexo",this.sexo);
    }
    if(this.address_city){
      formData.append("address_city",this.address_city);
    }
    
    if(this.file_imagen){
      formData.append("file_imagen",this.file_imagen);
    }
    this.profileClient.updateProfile(formData).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.error("Validación",resp.message_text);
      }else{
        this.toaster.success("Exitos","El usuario ha sido editado correctamente");
      }
    })
  }
}
