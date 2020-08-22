import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HeaderComponent } from './common/header/header.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { PaidPlansComponent } from './paid-plans/paid-plans.component';
import { HTTP_INTERCEPTORS, HttpClientXsrfModule } from '@angular/common/http';
import { AuthInterceptor } from './common/helpers/auth.interceptor';
import { AuthGuard } from './common/helpers/auth.guard';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { HttpErrorInterceptor } from './common/helpers/http-error.interceptor';
import { SharedModule } from './common/shared/shared.module';
import { NewDashboardComponent } from './new-dashboard/new-dashboard.component';
import { ListViewComponent } from './list-view/list-view.component';
/** Http interceptor providers  */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];

export const httpErrorProvider = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptor,
    multi: true
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeScreenComponent,
    PageNotFoundComponent,
    PaidPlansComponent,
    NewDashboardComponent,
    ListViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientXsrfModule, // Adds xsrf support
    AppRoutingModule,
    SharedModule,
    NgxExtendedPdfViewerModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      }
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [
    AuthGuard,
    httpInterceptorProviders,
    httpErrorProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
