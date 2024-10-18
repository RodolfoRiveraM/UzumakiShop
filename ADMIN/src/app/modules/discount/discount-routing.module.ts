import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscountComponent } from './discount.component';
import { CreateDiscountComponent } from './create-discount/create-discount.component';
import { ListDiscountComponent } from './list-discount/list-discount.component';
import { EditDiscountComponent } from './edit-discount/edit-discount.component';

const routes: Routes = [
  {
    path: '',
    component: DiscountComponent,
    children: [
      {
        path: 'register',
        component: CreateDiscountComponent
      },
      {
        path: 'list',
        component: ListDiscountComponent,
      },
      {
        path: 'list/edit/:id',
        component: EditDiscountComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscountRoutingModule { }
