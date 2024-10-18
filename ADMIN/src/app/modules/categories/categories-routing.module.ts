import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories.component';
import { CreateCategorieComponent } from './create-categorie/create-categorie.component';
import { ListCategorieComponent } from './list-categorie/list-categorie.component';
import { EditCategorieComponent } from './edit-categorie/edit-categorie.component';

const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent,
    children:[
      {
        path:'register',
        component: CreateCategorieComponent
      },
      {
        path:'list/edit/:id',
        component: EditCategorieComponent
      },
      {
        path:'list',
        component: ListCategorieComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
