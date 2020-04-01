import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsComponent } from './terms.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
import { NbCardModule, NbIconModule, NbInputModule, NbButtonModule, NbSpinnerModule } from '@nebular/theme';
import { PdfViewerModule } from 'ng2-pdf-viewer';

const routes: Routes = [{
  path: '',
  component: TermsComponent,
}];

@NgModule({
  declarations: [TermsComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    CKEditorModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbButtonModule,
    NbSpinnerModule,
    PdfViewerModule
  ]
})
export class TermsModule { }
