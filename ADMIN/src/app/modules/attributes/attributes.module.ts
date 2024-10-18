import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttributesRoutingModule } from './attributes-routing.module';
import { AttributesComponent } from './attributes.component';
import { CreateAttributeComponent } from './create-attribute/create-attribute.component';
import { EditAttributeComponent } from './edit-attribute/edit-attribute.component';
import { DeleteAttributeComponent } from './delete-attribute/delete-attribute.component';
import { ListAttributeComponent } from './list-attribute/list-attribute.component';
import { SubAttributeCreateComponent } from './sub-attribute-create/sub-attribute-create.component';
import { SubAttributeDeleteComponent } from './sub-attribute-delete/sub-attribute-delete.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    AttributesComponent,
    CreateAttributeComponent,
    EditAttributeComponent,
    DeleteAttributeComponent,
    ListAttributeComponent,
    SubAttributeCreateComponent,
    SubAttributeDeleteComponent
  ],
  imports: [
    CommonModule,
    AttributesRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class AttributesModule { }
