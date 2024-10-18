import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import { CreateCategorieComponent } from './create-categorie/create-categorie.component';
import { EditCategorieComponent } from './edit-categorie/edit-categorie.component';
import { DeleteCategorieComponent } from './delete-categorie/delete-categorie.component';
import { ListCategorieComponent } from './list-categorie/list-categorie.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    CategoriesComponent,
    CreateCategorieComponent,
    EditCategorieComponent,
    DeleteCategorieComponent,
    ListCategorieComponent
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class CategoriesModule { }
