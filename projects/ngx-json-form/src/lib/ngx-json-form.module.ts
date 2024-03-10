import { NgModule } from '@angular/core';

// import { ConvertOptionsPipe } from './pipes/convert-options/convert-options.pipe';
import { CommonModule } from '@angular/common';
// import { DropdownModule } from './components/dropdown/dropdown.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { DropdownDirective } from './directives/dropdown/dropdown.directive';

// import { FilesizePipe } from './pipes/filesize/filesize.pipe';
// import { FiletypePipe } from './pipes/filetype/filetype.pipe';

import { NgxJsonFormComponent } from './ngx-json-form.component';
import { SelectComponent } from './components/select/select.component';
import { SelectDropdownComponent } from './components/select-dropdown/select-dropdown.component';
import { SignatureComponent } from './components/signature/signature.component';
import { ToggleComponent } from './components/toggle/toggle.component';

import { FileuploadService } from './services/fileupload.service';
import { JsonFormService } from './services/json-form.service';
import { SelectDropdownService } from './services/select-dropdown.service';

@NgModule({
  declarations: [
    // ConvertOptionsPipe,
    // FilesizePipe,
    // FiletypePipe,
    DropdownDirective,
    SelectComponent
  ],
  imports: [
    CommonModule,
    // DropdownModule,
    NgxJsonFormComponent,
    OverlayModule,
    SelectDropdownComponent,
    SignatureComponent,
    ToggleComponent
  ],
  exports: [
    // ConvertOptionsPipe,
    NgxJsonFormComponent,
    SelectDropdownComponent,
    SignatureComponent,
    ToggleComponent
  ],
  providers: [
    FileuploadService,
    JsonFormService,
    SelectDropdownService
  ]
})
export class JsonFormModule { }