import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SlidersService } from '../service/sliders.service';

@Component({
  selector: 'app-delete-sliders',
  templateUrl: './delete-sliders.component.html',
  styleUrls: ['./delete-sliders.component.scss']
})
export class DeleteSlidersComponent {
  @Input() slider:any;
  
  @Output() SliderD: EventEmitter<any> = new EventEmitter();
  isLoading:any;
  constructor(
    public sliderService: SlidersService,
    private toastr: ToastrService,
    public modal: NgbActiveModal,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading = this.sliderService.isLoading$;
  }
  delete(){
    this.sliderService.deleteSlider(this.slider.id).subscribe((resp:any) => {
      this.SliderD.emit({message: 200});
      this.modal.close();
    })
  }
}
