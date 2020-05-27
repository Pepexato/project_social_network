import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Componentes

import { LoginComponent } from '../app/components/login/login.component';
import { RegisterComponent } from '../app/components/register/register.component';
import { HomeComponent } from '../app/components/home/home.component';
import { PagenotfoundComponent } from '../app/components/pagenotfound/pagenotfound.component';
import { EdituserComponent } from '../app/components/edituser/edituser.component';
import { UsersComponent } from '../app/components/users/users.component';
import { PublicationComponent } from './components/publication/publication.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FollowingComponent } from './components/following/following.component';
import { FollowedComponent } from './components/followed/followed.component';
 


export const appRoutes: Routes = [
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'siguiendo/:id/:page',
    component: FollowingComponent
  }, {
    path: 'seguidores/:id/:page',
    component: FollowedComponent
  },{
    path: 'profile/:id',
    component: ProfileComponent
  },
  {
    path:'timeline',
    component:TimelineComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }, {
    path: 'home',
    component: HomeComponent
  }, {
    path: 'edituser',
    component: EdituserComponent
  }, {
    path: 'gente/:page',
    component: UsersComponent
  },{
    path: 'gente',
    component: UsersComponent
  },{
    path: 'nueva-publicacion',
    component: PublicationComponent
  },{
    path: '**',
    component: PagenotfoundComponent
  },


];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
