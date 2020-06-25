import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [UserService, FollowService]
})
export class ProfileComponent implements OnInit {

  public user: User;
  public status: string;
  public identity;
  public token;
  public stats;
  public url;
  public follow;
  public following;
  public followed;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.followed = false;
    this.following = false;
  }

  ngOnInit() {

    console.log('Componente de perfil cargado correctamente');
    this.loadPage();
  }

  loadPage() {
    this._route.params.subscribe(params => {

      let id = params['id'];
      this.getUser(id);
      this.getCounters(id);


    })
  }

  getUser(id) {
    this._userService.getUser(id).subscribe(
      response => {
        if (response.user) {
          

          this.user = response.user;
          console.log("La response del getuser");
          console.log(response);

          //Comprobar si este usuario nos sigue al usuario que esta logeado//

          if (response.following.user && this.identity ) {

            this.following = true;

          } else {
            this.following = false;

          }

          if (response.followed._id && response.following._id) {
            this.followed = true;

          }
          else {
            this.followed = false;
          }
        } else {
          this.status = 'error';
        }
      },

      error => {
        console.log(<any>error);
        //this._router.navigate(['/profile',this.identity._id])
      }
    )
  }

  getCounters(id) {

    this._userService.getCounters(id).subscribe(

      response => {

        this.stats = response;

      },
      error => {
        console.log(<any>error);
        this._router.navigate(['/profile', this.identity._id])
      }
    )

  }

  followUser(followed) {
    var follow = new Follow('', this.identity._id, followed);

    this._followService.addFollow(this.token, follow).subscribe(

      response => {

          this.following = true;
      
      },

      error => {

        let error_message = <any>error;
        console.log(error_message);

        if (error_message != null) {
          this.status = 'error';
        }

      }

    )
  }

  unfollowUser(followed) {

    this._followService.deleteFollow(this.token, followed).subscribe(
      response => {
            this.following = false;
        },
      
      error => {

        let error_message = <any>error;
        console.log(error_message);
        }
    )
  }

  public followUserOver;
  mouseEnter(user_id) {

    this.followUserOver = user_id;
  }
  mouseLeave() {
    this.followUserOver = 0;
  }
}
