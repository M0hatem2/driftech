import { Routes } from '@angular/router';
import { ClientLayout } from './layouts/client-layout/component/client-layout/client-layout';
import { Home } from './features/client/home/home';
import { Cars } from './features/client/cars/cars';
import { About } from './features/client/about/about';
import { ContactUs } from './features/client/contact-us/contact-us';
import { Finance } from './features/client/finance/finance';
import { Support } from './features/client/support/support';
import { Policy } from './features/client/policy/policy';
import { VlogDetailPage } from './shared/vlog-detail-page/vlog-detail-page';
import { Vlogs } from './features/client/vlogs/vlogs';
import { Component } from '@angular/core';
import { Login } from './features/auth/components/login/login';
import { Register } from './features/auth/components/register/register';
import { VerificationOTP } from './features/auth/components/verification-otp/verification-otp';
import { ProfileCompletion } from './features/auth/components/profile-completion/profile-completion';
import { AccountLayoutComponent } from './account/layout/account-layout/account-layout.component';
import { ProfileComponent } from './account/components/profile/profile.component';
import { FinanceStatusComponent } from './account/components/finance-status/finance-status.component';
import { HowItWorksComponent } from './account/components/how-it-works/how-it-works.component';
import { SupportComponent } from './account/components/support/support.component';
import { AuthGuard } from './features/auth/services/auth.guard';
import { AdminLayout } from './layouts/admin-layout/component/admin-layout/admin-layout';
import { Admin } from './layouts/admin-layout/component/dashboard/component/admin/admin';
import { Cars as AdminCars } from './layouts/admin-layout/component/dashboard/component/cars/cars';
import { Cars as CarsList } from './layouts/admin-layout/component/dashboard/component/cars/component/cars/cars';
import { Dashboard } from './layouts/admin-layout/component/dashboard/component/dashboard/dashboard';
import { Designs } from './layouts/admin-layout/component/dashboard/component/designs/designs';
import { FAQ } from './layouts/admin-layout/component/dashboard/component/f.a.q/f.a.q';
import { FinancingRequests } from './layouts/admin-layout/component/dashboard/component/financing-requests/financing-requests';
import { Notifications } from './layouts/admin-layout/component/dashboard/component/notifications/notifications';
import { Profile as AdminProfile } from './layouts/admin-layout/component/dashboard/component/profile/profile';
import { Quizzes } from './layouts/admin-layout/component/dashboard/component/quizzes/quizzes';
import { RolesPermissions } from './layouts/admin-layout/component/dashboard/component/roles-permissions/roles-permissions';
import { Users } from './layouts/admin-layout/component/dashboard/component/users/users';
import { NotFound } from './features/client/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    component: ClientLayout,
    children: [
      { path: '', component: Home },
      { path: 'cars', component: Cars },
      { path: 'about', component: About },
      { path: 'contact-us', component: ContactUs },
      { path: 'finance', component: Finance },
      { path: 'policy', component: Policy },
      { path: 'support', component: Support },
      { path: 'vlogs', component: Vlogs },

      { path: 'vlogs/:id', component: VlogDetailPage },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  {
    path: 'auth',
    children: [
      { path: 'login', component: Login },
      { path: 'register', component: Register },
      { path: 'profile-completion', component: ProfileCompletion },
    ],
  },
  {
    path: 'account',
    component: AccountLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
      { path: 'finance-status', component: FinanceStatusComponent },
      { path: 'how-it-works', component: HowItWorksComponent },
      { path: 'support', component: SupportComponent },
    ],
  },

  // {
  //   path: 'admin',
  //   component: AdminLayout,
  //    children: [
  //     { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  //     { path: 'dashboard', component: Dashboard },
  //     { path: 'admin', component: Admin },
  //     {
  //       path: 'cars',
  //       component: AdminCars,
  //       children: [
  //         { path: '', redirectTo: 'list', pathMatch: 'full' },
  //         { path: 'list', component: CarsList }, // This will be the cars list
  //         { path: 'add-car', loadComponent: () => import('./layouts/admin-layout/component/dashboard/component/cars/component/add-car/add-car').then(m => m.AddCar) },
  //         { path: 'brands', loadComponent: () => import('./layouts/admin-layout/component/dashboard/component/cars/component/brands/brands').then(m => m.Brands) },
  //         { path: 'models', loadComponent: () => import('./layouts/admin-layout/component/dashboard/component/cars/component/models/models').then(m => m.Models) },
  //         { path: 'types', loadComponent: () => import('./layouts/admin-layout/component/dashboard/component/cars/component/types/types').then(m => m.Types) },
  //         { path: 'body-styles', loadComponent: () => import('./layouts/admin-layout/component/dashboard/component/cars/component/body-styles/body-styles').then(m => m.BodyStyles) },
  //         { path: 'engine-types', loadComponent: () => import('./layouts/admin-layout/component/dashboard/component/cars/component/engine-types/engine-types').then(m => m.EngineTypes) },
  //         { path: 'transmission-types', loadComponent: () => import('./layouts/admin-layout/component/dashboard/component/cars/component/transmission-types/transmission-types').then(m => m.TransmissionTypes) },
  //         { path: 'drive-types', loadComponent: () => import('./layouts/admin-layout/component/dashboard/component/cars/component/drive-types/drive-types').then(m => m.DriveTypes) },
  //         { path: 'trim', loadComponent: () => import('./layouts/admin-layout/component/dashboard/component/cars/component/trim/trim').then(m => m.Trim) },
  //         { path: 'vehicle-statuses', loadComponent: () => import('./layouts/admin-layout/component/dashboard/component/cars/component/vehicle-statuses/vehicle-statuses').then(m => m.VehicleStatuses) },
  //       ]
  //     },
  //     { path: 'designs', component: Designs },
  //     { path: 'faq', component: FAQ },
  //     { path: 'financing-requests', component: FinancingRequests },
  //     { path: 'notifications', component: Notifications },
  //     { path: 'profile', component: AdminProfile },
  //     { path: 'quizzes', component: Quizzes },
  //     { path: 'roles-permissions', component: RolesPermissions },
  //     { path: 'users', component: Users },
  //   ],
  // },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: NotFound },
];
