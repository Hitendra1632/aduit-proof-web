import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentValidationComponent } from './document-validation/document-validation.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';


const routes: Routes = [
  {
    path: '',
    component: DocumentValidationComponent,
  },
  {
    path: ':document-id',
    component: DocumentValidationComponent
  },
  // Wildcard route for a 404 page
  {
    path: '**',
    component: PageNotFoundComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentValidationRoutingModule { }
