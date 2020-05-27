import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL} from '../../services/global';

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.scss'],
  providers: [UserService,UploadService]
})
export class EdituserComponent implements OnInit {

  public user: User;
  public identity;
  public token;
  public status: string
  public url:string

  constructor(
    private _userService: UserService,
    private _uploadService: UploadService

  ) {
    this.user = this._userService.getIdentity();
    this.identity = this.user;
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;

  }


  ngOnInit() {

    console.log('edituser component se ha cargado...')
  }
  onSubmit(){
    console.log(this.user);
    this._userService.updateUser(this.user).subscribe(

      response =>{
        if(!response.user){
          this.status = 'error';

        }else{
          this.status ='success';
          localStorage.setItem('identity',JSON.stringify(this.user));
          this.identity = this.user;

          //subida de imagen de usuario//
        
          this._uploadService.makeFileRequest(this.url+'upload-image-user/'+this.user._id,[],this.filestoUpload,this.token,'image').then((result:any)=>
          {
            this.user.image = result.user.image;
            localStorage.setItem('identity',JSON.stringify(this.user))

          });
        }
      },
      error => 
      {
        var errorMessage =<any>error;
        console.log(errorMessage);
        if(errorMessage != null)
        {
          this.status = 'error';
        }
      }
    )
  }

  public filestoUpload: Array<File>;
  fileChangeEvent(fileInput:any)
  {
    this.filestoUpload = <Array<File>>fileInput.target.files; 
    console.log(this.filestoUpload);
  }
}
