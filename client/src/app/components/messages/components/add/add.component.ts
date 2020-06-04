import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Follow } from 'src/app/models/follow';
import { GLOBAL } from 'src/app/services/global';

import { MessageService } from 'src/app/services/message.service';
import { FollowService } from 'src/app/services/follow.service';
import { Message } from 'src/app/models/messages';
import { UserService } from 'src/app/services/user.service';



@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  providers: [MessageService, FollowService,UserService]
})
export class AddComponent implements OnInit {
  public identity;
  public message:Message;
  public url: string;
  public token;
  public page;
  public status;
  public follows;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _followService: FollowService,
    private _messageService: MessageService,
    private _userService:UserService

  ) {
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.url = GLOBAL.url;
      this.message = new Message('','','','',this.identity._id,'');

   }

  ngOnInit() {
    this.getMyFollows();
  }
  onSubmit(form)
  {
    console.log(this.message);
    this._messageService.addMessage(this.token,this.message).subscribe(

      response =>{
        this.status = 'success';
        form.reset();
        
      },
      error =>{
        this.status = 'error'
        console.log(<any>error); 
      }
    )
  }
  getMyFollows(){
    this._followService.getMyFollows(this.token).subscribe(

      response =>{
        this.follows = response.follows;
      },
      error =>{
        console.log("Error");
      }
    )
  }

}
