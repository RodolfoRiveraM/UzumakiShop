import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandsComponent } from './brands.component';
import { ListsBrandComponent } from './lists-brand/lists-brand.component';

const routes: Routes = [
  {
    path: '',
    component: BrandsComponent,
    children: [
      {
        path: 'list',
        component: ListsBrandComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandsRoutingModule { }
