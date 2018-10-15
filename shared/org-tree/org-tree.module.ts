import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {OrgTreeComponent} from './org-tree.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    OrgTreeComponent
  ],
  exports: [
    OrgTreeComponent
  ]
})

export class OrgTreeModule {}
