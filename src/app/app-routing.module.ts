import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './common/helpers/auth.guard';
import { PaidPlansComponent } from './paid-plans/paid-plans.component';
import { NewDashboardComponent } from './new-dashboard/new-dashboard.component';
import { ListViewComponent } from './list-view/list-view.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  // Welcome Module
  {
    path: 'welcome',
    component: HomeScreenComponent
  },
  // Login & SignUp Module
  {
    path: 'authentication',
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule),
    // canActivate:[AuthGuard]

  },
  {
    path: 'new-dashboard',
    component: NewDashboardComponent
  },
  {
    path: 'list-view',
    component: ListViewComponent
  },
  // Dashboard Module
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  // Document Sign
  {
    path: 'sign-document',
    loadChildren: () => import('./document-sign/document-sign.module').then(m => m.DocumentSignModule),
    canActivate: [AuthGuard]
  },
  // Document Validation
  {
    path: 'validate-document',
    loadChildren: () => import('./document-validation/document-validation.module').then(m => m.DocumentValidationModule),
    canActivate: [AuthGuard]
  },
  // Payment Component
  {
    path: 'plans',
    component: PaidPlansComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
