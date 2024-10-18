import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CuponesService } from '../service/cupones.service';

@Component({
  selector: 'app-delete-cupone',
  templateUrl: './delete-cupone.component.html',
  styleUrls: ['./delete-cupone.component.scss']
})
export class DeleteCuponeComponent {

  @Input() cupone:any;
  
  @Output() CuponD: EventEmitter<any> = new EventEmitter();
  isLoading:any;
  constructor(
    public cuponeService: CuponesService,
    private toastr: ToastrService,
    public modal: NgbActiveModal,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading = this.cuponeService.isLoading$;
  }
  delete(){
    this.cuponeService.deleteCupone(this.cupone.id).subscribe((resp:any) => {
      if(resp.message == 403){
        this.toastr.error("Validación",resp.message_text);
      }else{
        this.CuponD.emit({message: 200});
        this.modal.close();
      }
    })
  }

}
