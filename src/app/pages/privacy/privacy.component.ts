import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { DataServiceService } from '../../services/data-service.service';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

  canDisplay: boolean = false;
  ckeditorContent: string = '';
  pdfSrc: string = '';
  fileName: string = '';
  filBase64: any = null;
  uploadFolderName: string = 'privacy';
  uploadFileName: string = 'privacy.pdf';
  collectionName: string = 'terms_n_privacy';
  documentName: string = 'privacy';
  loading: boolean = false;

  /**
   * @constructor{{DI will be pushed here}}
   */
  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    public databaseServ: DatabaseService,
    public toastrService: NbToastrService,
    public dataServ: DataServiceService
  ) {
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.canDisplay = false;
        this.router.navigate(['auth/login']);
      }
      else {
        this.canDisplay = true;
        this.getPrivacy();
        this.dataServ.userSource.subscribe(
          (res: any) => {
            console.log('user page',res);
            if(res) {
              if(res.userType != 'admin') {
                this.router.navigate(['pages/report']);
              }
            }
          },
          (err) => {
            console.log(err);
          }
        );
      }
    });
  }

  /**
   * @function{{getPrivacy}}
   * @description{{get privacy html method}}
   */
  getPrivacy() {
    this.databaseServ.getTerms(this.collectionName, this.documentName)
    .subscribe(
      (privacy: any) => {
        // console.log('privacy', privacy);
        if(privacy) {
          if (privacy.showHtml) {
            this.ckeditorContent = privacy.showHtml;
          }
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  /**
   * @function{{ngOnInit}}
   * @description{{Lifecycle hook}}
   */
  ngOnInit() {
    this.getTermsPdfUrl();
  }

  /**
   * @function{{getTermsPdfUrl}}
   * @description{{get terms pdf url method}}
   */
  getTermsPdfUrl() {
    this.databaseServ.getFileUrl(this.uploadFolderName, this.uploadFileName)
    .subscribe(
      (res: any) => {
        console.log('url',res);
        if(res) {
          this.pdfSrc = res;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * @function{{changeListener}}
   * @description{{change listener for file change}}
   */
  changeListener(event) : void {
    this.readThis(event.target);
  }
  
  /**
   * @function{{readThis}}
   * @description{{File reader method}}
   */
  readThis(inputValue: any): void {
    var file:File = inputValue.files[0];
    this.fileName = file.name;
    var myReader:FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.filBase64 = myReader.result;
      // console.log(myReader.result);
    }
    myReader.readAsDataURL(file);
  }

  /**
   * @function{{uploadPdf}}
   * @description{{upload pdf method}}
   */
  uploadPdf() {
    this.loading = true;
    this.databaseServ.storePdf(this.filBase64, this.uploadFolderName, this.uploadFileName)
    .then(
      (res: any) => {
        console.log('uploaded',res);
        this.toastrService.success('File uploaded successfully.', 'Success!');
        this.loading = false;
        this.fileName = '';
        this.getTermsPdfUrl();
        // console.log('percent',(res.bytesTransferred / res.totalBytes) * 100)
      }
    ).catch(
      (err) => {
        console.log(err);
        this.toastrService.danger('Something went wrong.', 'Error!');
        this.loading = false;
      }
    );
  }

  onChange(event: any) {
    // console.log('onChange',event);
  }

  onEditorChange(event: any) {
    // console.log('onEditorChange',event);
  }

  onReady(event: any) {
    // console.log('onReady',event);
  }

  onFocus(event: any) {
    // console.log('onFocus',event);
  }

  onBlur(event: any) {
    // console.log('onBlur',event);
  }

  onContentDom(event: any) {
    // console.log('onContentDom',event);
  }

  onFileUploadRequest(event: any) {
    // console.log('onFileUploadRequest',event);
  }

  onFileUploadResponse(event: any) {
    // console.log('onFileUploadResponse',event);
  }

  onPaste(event: any) {
    // console.log('onPaste',event);
  }

  onDrop(event: any) {
    // console.log('onDrop',event);
  }

  /**
   * @function{{save}}
   * @description{{save html to database}}
   */
  save() {
    this.loading = true;
    // this.databaseServ.saveTerms(this.authServ.authState.uid, this.ckeditorContent)
    this.databaseServ.saveTerms(this.collectionName, this.documentName , this.ckeditorContent)
    .then(
      (res: any) => {
        this.loading = false;
        this.toastrService.success('Terms text updated.', 'Success!');
        // console.log(res);
      }
    ).catch(
      (err) => {
        this.loading = false;
        console.log(err);
        this.toastrService.danger('Something went wrong.', 'Error!');
      }
    );
  }

}
