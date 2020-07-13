import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './common/helpers/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
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
  // Dashboard Module
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate:[AuthGuard]
  },
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
