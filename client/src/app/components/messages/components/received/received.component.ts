import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Follow } from 'src/app/models/follow';
import { GLOBAL } from 'src/app/services/global';

import { MessageService } from 'src/app/services/message.service';
import { FollowService } from 'src/app/services/follow.service';
import { Message } from 'src/app/models/messages';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-received',
  templateUrl: './received.component.html',
  styleUrls: ['./received.component.scss'],
  providers: [FollowService, MessageService, UserService]
})
export class ReceivedComponent implements OnInit {
  public identity;
  public messages: Message[];
  public url: string;
  public token;
  public page;
  public pages;
  public total;
  public pre_page;
  public next_page;
  public status;
  public follows;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _followService: FollowService,
    private _messageService: MessageService,
    private _userService: UserService

  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    this.actualPage();
  }
  actualPage() {
    this._route.params.subscribe(params => {
      let page = +params['page'];
      this.page = page;

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

        //Devolver listado de mensajes recibidos
       
        this.getMessages(this.token,page)
      }
    });
  }

  getMessages(token, page) {
    this._messageService.getMyMessages(token, page).subscribe(
      response => {
        if (!response.messages) {

        } else {
         
          console.log(page);
          this.total = response.total;
          this.pages = response.pages;
          this.messages = response.messages;

          console.log(this.messages);


         
        }
      },
      error => {
        console.log(<any>error);
      }
    )
  }
 

}
