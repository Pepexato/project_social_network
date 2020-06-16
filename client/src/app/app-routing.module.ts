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
import { MainComponent } from './components/messages/components/main/main.component';
import { AddComponent } from './components/messages/components/add/add.component';
import { ReceivedComponent } from './components/messages/components/received/received.component';
import { SendedComponent } from './components/messages/components/sended/sended.component';
import { UserGuard } from './services/user.guard';
 


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
    component: FollowingComponent,canActivate:[UserGuard]
  }, {
    path: 'seguidores/:id/:page',
    component: FollowedComponent,canActivate:[UserGuard]
  },{
    path: 'profile/:id',
    component: ProfileComponent,canActivate:[UserGuard]
  },
  {
    path:'timeline',
    component:TimelineComponent,canActivate:[UserGuard]
  },
  {
    path: 'register',
    component: RegisterComponent
  }, {
    path: 'mensajes',component:MainComponent,canActivate:[UserGuard], children: [
        
            {path:'',redirectTo:'recibidos/1',pathMatch:'full'},
            {path:'enviar', component:AddComponent},
            {path:'recibidos', component:ReceivedComponent},
            {path:'recibidos/:page', component:ReceivedComponent},
            {path:'enviados', component:SendedComponent},
            {path:'enviados/:page', component:SendedComponent}
    ]
  }, {
    path: 'home',
    component: HomeComponent
  }, {
    path: 'edituser',
    component: EdituserComponent,canActivate:[UserGuard]
  }, {
    path: 'gente/:page',
    component: UsersComponent,canActivate:[UserGuard]
  },{
    path: 'gente',
    component: UsersComponent,canActivate:[UserGuard]
  },{
    path: 'nueva-publicacion',
    component: PublicationComponent,canActivate:[UserGuard]
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
