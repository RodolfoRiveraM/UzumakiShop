import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttributesComponent } from './attributes.component';
import { ListAttributeComponent } from './list-attribute/list-attribute.component';

const routes: Routes = [
  {
    path: '',
    component: AttributesComponent,
    children: [
      {
        path:'list',
        component: ListAttributeComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttributesRoutingModule { }
