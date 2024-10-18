import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandsRoutingModule } from './brands-routing.module';
import { BrandsComponent } from './brands.component';
import { CreateBrandComponent } from './create-brand/create-brand.component';
import { EditBrandComponent } from './edit-brand/edit-brand.component';
import { ListsBrandComponent } from './lists-brand/lists-brand.component';
import { DeleteBrandComponent } from './delete-brand/delete-brand.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    BrandsComponent,
    CreateBrandComponent,
    EditBrandComponent,
    ListsBrandComponent,
    DeleteBrandComponent
  ],
  imports: [
    CommonModule,
    BrandsRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class BrandsModule { }
