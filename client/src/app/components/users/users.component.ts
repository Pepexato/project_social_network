import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { User } from 'src/app/models/user';
import { FollowService } from '../../services/follow.service';
import { Follow } from 'src/app/models/follow';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [UserService, FollowService]

})
export class UsersComponent implements OnInit {

  public identity;
  public url: string;
  public token;
  public page;
  public next_page;
  public pre_page;
  public total;
  public pages;
  public users: User;
  public status: string;
  public follows;
  constructor(
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _followService: FollowService,
    private _router: Router
  ) {
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
    console.log('Arrancando componente de usuarios');
    this.actualPage();
  }

  actualPage() {
    this._route.params.subscribe(params => {
      let page = +params['page'];
      this.page = page;
      console.log(typeof (page));


      if (!params['page']) {
        page = 1;
        console.log("No existo");
      }
      if (!page) {
        page = 1;
      }
      else {
        this.next_page = page + 1;
        this.pre_page = page - 1;

        if (this.pre_page <= 0) {
          this.pre_page = 1;
        }

        //Devolver listado de usuarios
        this.getUsers(page)
      }
    });
  }

  getUsers(page) {
    this._userService.getUsers(page).subscribe(
      response => {
        if (!response.users) {
          console.log('No existe ningun user');
          this.status = 'error'

        }
        else {
          console.log(response);

          this.total = response.total;
          this.users = response.users;
          this.pages = response.pages;
          this.follows = response.users_following;

          console.log(this.follows);
          if (page > this.pages) {
            this._router.navigate(['/gente/1']);
          }
        }
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

  public followUserOver;
  mouseEnter(user_id) {

    this.followUserOver = user_id;
  }
  mouseLeave() {
    this.followUserOver = 0;
  }

  followUser(followed) {
    var follow = new Follow('', this.identity._id, followed);

    this._followService.addFollow(this.token, follow).subscribe(

      response => {
        if (!response.follow) {
          this.status = 'error';
        } else {

          this.status = 'success'
          this.follows.push(followed);
        }

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
        var search = this.follows.indexOf(followed);

        if (search != -1) {
          this.follows.splice(search, 1);
        }
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
}
