import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/app.component';
import {environment} from '../environments/environment';
import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {FormsModule} from '@angular/forms';
import {WordsComponent} from './components/words/words.component';
import {HeaderComponent} from './components/header/header.component';
import {RouterModule, Routes} from '@angular/router';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AuthService} from './service/auth.service';
import {HomeComponent} from './components/home/home.component';
import {AuthGuard} from './guard/auth.guard';
import {WordsService} from './service/words.service';
import {UsersService} from './service/users.service';
import {WordsManagementComponent} from './components/admin/words-mgmt/words-mgmt.component';
import {AdminComponent} from './components/admin/root/admin.component';
import {AdminGuard} from './guard/admin.guard';
import {ParamsService} from './service/params.service';
import {ParamsManagementComponent} from './components/admin/params-mgmt/params-mgmt.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'words', component: WordsComponent, canActivate: [AuthGuard]},
  {path: 'admin', component: AdminComponent, canActivate: [AdminGuard],
    children: [
      {path: 'words', component: WordsManagementComponent},
      {path: 'params', component: ParamsManagementComponent}
    ]
  },
  { path: '**', component: HomeComponent }
];

@NgModule({
  declarations: [
    AdminComponent,
    AppComponent,
    HeaderComponent,
    HomeComponent,
    ParamsManagementComponent,
    WordsComponent,
    WordsManagementComponent
  ],
  imports: [
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AdminGuard,
    AuthGuard,
    AuthService,
    ParamsService,
    UsersService,
    WordsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
