import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuponesRoutingModule } from './cupones-routing.module';
import { CuponesComponent } from './cupones.component';
import { CreateCuponeComponent } from './create-cupone/create-cupone.component';
import { EditCuponeComponent } from './edit-cupone/edit-cupone.component';
import { DeleteCuponeComponent } from './delete-cupone/delete-cupone.component';
import { ListCuponeComponent } from './list-cupone/list-cupone.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    CuponesComponent,
    CreateCuponeComponent,
    EditCuponeComponent,
    DeleteCuponeComponent,
    ListCuponeComponent
  ],
  imports: [
    CommonModule,
    CuponesRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class CuponesModule { }
