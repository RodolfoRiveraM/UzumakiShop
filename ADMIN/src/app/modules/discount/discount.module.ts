import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscountRoutingModule } from './discount-routing.module';
import { DiscountComponent } from './discount.component';
import { CreateDiscountComponent } from './create-discount/create-discount.component';
import { EditDiscountComponent } from './edit-discount/edit-discount.component';
import { DeleteDiscountComponent } from './delete-discount/delete-discount.component';
import { ListDiscountComponent } from './list-discount/list-discount.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    DiscountComponent,
    CreateDiscountComponent,
    EditDiscountComponent,
    DeleteDiscountComponent,
    ListDiscountComponent
  ],
  imports: [
    CommonModule,
    DiscountRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class DiscountModule { }
