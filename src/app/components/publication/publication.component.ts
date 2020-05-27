import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { PublicationService } from '../../services/publication.service';
import { Publication } from '../../models/publications';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadService } from '../../services/upload.service';


@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.scss'],
  providers: [UserService, PublicationService, UploadService]
})
export class PublicationComponent implements OnInit {
  public identity;
  public url: string;
  public token;
  public status: string;
  public publication: Publication;
  public stats;
  public file_help:Publication;

  constructor(
    private _userService: UserService,
    private _publicationService: PublicationService,
    private _uploadService: UploadService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.stats = _userService.getStats();
    this.publication = new Publication('', '', '', '', this.identity.id);

  }

  ngOnInit() {
  }

  onSubmit(form) {
    this._publicationService.addPublication(this.token, this.publication).subscribe(

      response => {

        if (response.publication) {
          
          this.publication = response.publication;
          console.log(response.publication._id);
          console.log(this.url + 'upload-img-pub/'+response.publication._id);
          
        
            this._uploadService.makeFileRequest(this.url + 'upload-image-pub/'+response.publication._id, [], this.filesToUpload, this.token, 'image')
            .then((result: any) => {

              this.publication.file = result.image;

              this.status = 'success';
              form.reset();

              this._router.navigate(['/timeline']);

            });
     
        }
        else{
          alert("Sos un borrego");
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

  public filesToUpload: Array<File>;
  fileChangeEvent(fileInput: any) {
    
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload);
  }
}
