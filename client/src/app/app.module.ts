import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { EdituserComponent } from './components/edituser/edituser.component';
import { UsersComponent } from './components/users/users.component';
import { PublicationComponent } from './components/publication/publication.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { MomentModule } from 'ngx-moment';
import { ProfileComponent } from './components/profile/profile.component';
import { TimelineuserComponent } from './components/timelineuser/timelineuser.component';
import { FollowingComponent } from './components/following/following.component';
import { FollowedComponent } from './components/followed/followed.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainComponent } from './components/messages/components/main/main.component';
import { AddComponent } from './components/messages/components/add/add.component';
import { ReceivedComponent } from './components/messages/components/received/received.component';
import { SendedComponent } from './components/messages/components/sended/sended.component';
import { UserService } from './services/user.service';
import { UserGuard } from './services/user.guard';
//Modelo Custom

//Servicios



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    PagenotfoundComponent,
    EdituserComponent,
    UsersComponent,
    PublicationComponent,
    TimelineComponent,
    ProfileComponent,
    TimelineuserComponent,
    FollowingComponent,
    FollowedComponent,
    FooterComponent,
    MainComponent,
    AddComponent,
    ReceivedComponent, 
    SendedComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MomentModule,
  ],
  providers: [UserService,UserGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
