import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import {
  DialogModule
} from 'primeng/primeng';
import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule
} from '@angular/material';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {EmailverifyComponent} from './emailverify.component';
import { AllProductListComponent } from './all-product-list/all-product-list.component';
import { MyProductListComponent } from './my-product-list/my-product-list.component';
import { AuthGuard } from './auth-guard.service';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
const appRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'verify_account/:id',
    component: EmailverifyComponent
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'productList',
    component: AllProductListComponent,
    canActivate: [ AuthGuard]
  },
  {
    path: 'myProduct',
    component: MyProductListComponent,
    canActivate: [ AuthGuard]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SignInComponent,
    SignUpComponent,
    DashboardComponent,
    EmailverifyComponent,
    AllProductListComponent,
    MyProductListComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DropdownModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    CalendarModule,
    DialogModule,
    SlimLoadingBarModule,
    Ng4LoadingSpinnerModule.forRoot(),
    ToastrModule.forRoot({
      preventDuplicates: true,
    }),
  ],
  providers: [ AuthGuard ],
  bootstrap: [AppComponent]
})
export class AppModule { }
