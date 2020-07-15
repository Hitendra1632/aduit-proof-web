import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentValidationRoutingModule } from './document-validation-routing.module';
import { DocumentValidationComponent } from './document-validation/document-validation.component';


@NgModule({
  declarations: [DocumentValidationComponent],
  imports: [
    CommonModule,
    DocumentValidationRoutingModule
  ]
})
export class DocumentValidationModule { }
