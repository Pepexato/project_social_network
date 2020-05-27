import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {

  public user: User;
  public status: string;
  constructor(
    private _userService: UserService

  ) {
    this.user = new User('', '', '', '', '', '', '', '');
  }

  ngOnInit() {
  }

  onSubmit(form) {
    console.log(this.user);
    this._userService.register(this.user).subscribe(
      response => {

        if (response.user && response.user._id) {
          console.log(response.user)
          this.status = 'success';
          form.reset();
        } else {
          this.status = 'error'
        }
      },
      err => {
        console.log("La cagaste");
        console.log(<any>err);
      }
    );
  }

}
