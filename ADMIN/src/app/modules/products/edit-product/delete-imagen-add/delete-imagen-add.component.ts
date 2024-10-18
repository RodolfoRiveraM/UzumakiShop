import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../service/product.service';

@Component({
  selector: 'app-delete-imagen-add',
  templateUrl: './delete-imagen-add.component.html',
  styleUrls: ['./delete-imagen-add.component.scss']
})
export class DeleteImagenAddComponent {

  @Input() id:any;
  
  @Output() ImagenD: EventEmitter<any> = new EventEmitter();
  isLoading:any;
  constructor(
    public productImagenService: ProductService,
    private toastr: ToastrService,
    public modal: NgbActiveModal,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading = this.productImagenService.isLoading$;
  }
  delete(){
    this.productImagenService.deleteImageProduct(this.id).subscribe((resp:any) => {
      this.ImagenD.emit({message: 200});
      this.modal.close();
    })
  }

}
