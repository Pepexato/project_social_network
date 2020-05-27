import { Component, OnInit,Input } from '@angular/core';
import { Publication } from '../../models/publications';
import { PublicationService } from '../../services/publication.service';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Router, ActivatedRoute } from '@angular/router'; 
import * as $ from 'jquery';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  providers: [UserService, PublicationService
  ]
})
export class TimelineComponent implements OnInit {
  
  public moment;
  public identity;
  public token;
  public status: string
  public url: string
  public page;
  public pages;
  public total;
  public items_per_page;
  public publications:Publication[];
  @Input() user:string;

  constructor(
   

    private _route:ActivatedRoute,
    private _router:Router,
    private _userService: UserService,
    private _publicationService: PublicationService

  ) {

    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.page = 1;
    this.total;
  }

  ngOnInit() {

    console.log("Timeline cargado...")
    this.getPublications(this.page);
  }

  getPublications(page, adding = false) {

    this._publicationService.getPublications(this.token, page).subscribe(

      response => {

        console.log(response);
        if(response.publications)
        {
          
          this.total = response.total_items;
          this.pages = response.pages;
          this.items_per_page = response.itemsper_page;
          if(!adding)
          {
            this.publications = response.publications;

          }else{
            console.log();
            var arrayA = this.publications;
            var arrayB =  response.publications;
            this.publications = arrayA.concat(arrayB);

            $("html, body").animate({ scrollTop: $('body').prop("scrollHeight")},500)

          }

         

        }
        else{
          this.status = 'error'
        }

      },

      error => {

        var errorMessage = <any>error;
        console.log(errorMessage)
        if (errorMessage != null) {
          this.status = 'error';
        }

      }
    );


  }

  getPublicationsUser(user,page, adding = false) {

    this._publicationService.getPublicationsUser(this.token,user, page).subscribe(

      response => {

        console.log(response);
        if(response.publications)
        {
          
          this.total = response.total_items;
          this.pages = response.pages;
          this.items_per_page = response.itemsper_page;
          if(!adding)
          {
            this.publications = response.publications;

          }else{
            console.log();
            var arrayA = this.publications;
            var arrayB =  response.publications;
            this.publications = arrayA.concat(arrayB);

            $("html, body").animate({ scrollTop: $('body').prop("scrollHeight")},500)

          }

         

        }
        else{
          this.status = 'error'
        }

      },

      error => {

        var errorMessage = <any>error;
        console.log(errorMessage)
        if (errorMessage != null) {
          this.status = 'error';
        }

      }
    );


  }

  public noMore = false;
  viewMore()
  {
    this.page += 1;
    if(this.page == this.pages){

        this.noMore = true;
    }

    this.getPublications(this.page,true);
  }
 
  deletePublication(id)
  {
    this._publicationService.deletePublication(this.token,id).subscribe(response =>{

      
          console.log(response);
          this.ngOnInit(); 

        
    },
    
    error =>{
        console.log(<any>error);
    });

  }

}
