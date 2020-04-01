import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { AuthhenticationService } from '../../services/authhentication.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { DataServiceService } from '../../services/data-service.service';

@Component({
  selector: 'ngx-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  ckeditorContent: string = '';
  canDisplay: boolean = false;
  // pdfSrc: string = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  pdfSrc: string = '';
  fileName: string = '';
  filBase64: any = null;
  uploadFolderName: string = 'terms';
  uploadFileName: string = 'terms.pdf';
  collectionName: string = 'terms_n_privacy';
  documentName: string = 'terms';
  loading: boolean = false;

  /**
   * @constructor{{DI will be pushed here}} 
   */
  constructor(
    private databaseServ: DatabaseService,
    private authServ: AuthhenticationService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private toastrService: NbToastrService,
    private dataServ: DataServiceService
  ) {
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.canDisplay = false;
        this.router.navigate(['auth/login']);
      }
      else {
        this.canDisplay = true;
        this.getTerms();
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
   * @function{{getTerms}}
   * @description{{get terms html method}}
   */
  getTerms() {
    // this.databaseServ.getTerms(this.authServ.authState.uid)
    this.databaseServ.getTerms(this.collectionName, this.documentName)
    .subscribe(
      (terms: any) => {
        // console.log('terms', terms);
        if(terms) {
          if (terms.showHtml) {
            this.ckeditorContent = terms.showHtml;
          }
        }
      },
      (err: any) => {
        console.log(err);
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
   * @description{{save html method}}
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

  /**
   * @function{{changeListener}}
   * @description{{change listener for file}}
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

}
