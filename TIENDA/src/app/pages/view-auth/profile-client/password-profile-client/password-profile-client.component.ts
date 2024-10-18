import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProfileClientService } from '../service/profile-client.service';

@Component({
  selector: 'app-password-profile-client',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './password-profile-client.component.html',
  styleUrl: './password-profile-client.component.css'
})
export class PasswordProfileClientComponent {

  password:string = '';
  confirmet_password:string = '';

  constructor(
    public profileClient: ProfileClientService,
    public toaster: ToastrService,
  ) {
    
  }

  updateUser(){
    if(!this.password || !this.confirmet_password){
      this.toaster.error("Validación","Es necesario ingresar la contraseña y la confirmación");
      return;
    }
    if(this.password != this.confirmet_password){
      this.toaster.error("Validación","Es necesario que las contraseñas coincidan");
      return;
    }
    let data = {
      password: this.password,
    }
    this.profileClient.updateProfile(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.error("Validación",resp.message_text);
      }else{
        this.toaster.success("Exitos","El usuario ha sido editado correctamente");
      }
    })
  }
  
}