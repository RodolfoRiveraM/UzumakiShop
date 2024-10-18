import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoriesService } from '../service/categories.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-categorie',
  templateUrl: './delete-categorie.component.html',
  styleUrls: ['./delete-categorie.component.scss']
})
export class DeleteCategorieComponent {

  @Input() categorie:any;
  
  @Output() CategorieD: EventEmitter<any> = new EventEmitter();
  isLoading:any;
  constructor(
    public categorieService: CategoriesService,
    private toastr: ToastrService,
    public modal: NgbActiveModal,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading = this.categorieService.isLoading$;
  }
  delete(){
    this.categorieService.deleteCategorie(this.categorie.id).subscribe((resp:any) => {
      if(resp.message == 403){
        this.toastr.error("Validación",resp.message_text);
      }else{
        this.CategorieD.emit({message: 200});
        this.modal.close();
      }
    })
  }
}
