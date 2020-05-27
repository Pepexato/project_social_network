import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router'; 




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public user: User;
  public status: string;
  public identity;
  public token;
 

  constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private _userService: UserService
  ) {

    this.user = new User('', '', '', '', '', '', '', '');

  }

  ngOnInit() {
  }
  onSubmit() {
    //loguear al usuario y conseguir sus datos

    this._userService.singup(this.user).subscribe(
      response => {
        console.log(response.user)

        this.identity = response.user;

        if (!this.identity || !this.identity._id) {
          this.status = 'error'
        } else {

          //Persistir el usuario

          localStorage.setItem('identity', JSON.stringify(this.identity));


          //Conseguir el token
          this.getToken();
        }
      },

      error => {
        let errorMessage = <any>error;
        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    )
  }

  getToken() {

    this._userService.singup(this.user, 'true').subscribe(
      response => {
        this.token = response.token;

        console.log(this.token)

        if (this.token == null || this.token == '') {
          this.status = 'error'
        } else {
          //Persistir el usuario//


          //conseguir el token

          localStorage.setItem('token', this.token);
          this.getCounters();
        }

      },

      error => {
        let errorMessage = <any>error;
        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    )
  }

  getCounters() {
    this._userService.getCounters().subscribe(

      response => {
        localStorage.setItem('stats', JSON.stringify(response));
        this.status = 'success'
        this._router.navigate(['/home']);

        
      },

      error => {
        console.log(<any>error);
      }
    );
  }
}
