import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { DocumentSignComponent } from './document-sign/document-sign.component';


const routes: Routes = [
  {
    path: '',
    component: DocumentSignComponent
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
export class DocumentSignRoutingModule { }
