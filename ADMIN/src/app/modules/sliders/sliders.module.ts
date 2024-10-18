import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SlidersRoutingModule } from './sliders-routing.module';
import { SlidersComponent } from './sliders.component';
import { CreateSlidersComponent } from './create-sliders/create-sliders.component';
import { EditSlidersComponent } from './edit-sliders/edit-sliders.component';
import { DeleteSlidersComponent } from './delete-sliders/delete-sliders.component';
import { ListsSlidersComponent } from './lists-sliders/lists-sliders.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    SlidersComponent,
    CreateSlidersComponent,
    EditSlidersComponent,
    DeleteSlidersComponent,
    ListsSlidersComponent
  ],
  imports: [
    CommonModule,
    SlidersRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class SlidersModule { }
