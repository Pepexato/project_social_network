import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [UserService]

})
export class NavbarComponent implements OnInit, DoCheck {
  public identity;
  public url;
  title: 'Petstagram';

  constructor(
    private _userService: UserService

  ) {
    this.url = GLOBAL.url;
  }

  ngOnInit() {

    this.identity = this._userService.getIdentity();

  }

  ngDoCheck() {
    this.identity = this._userService.getIdentity();

  }
  logout() {
    localStorage.clear();
    this.identity = null;


  }

}
