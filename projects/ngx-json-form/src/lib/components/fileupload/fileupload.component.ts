import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ExtendedFileModel } from '../../models/extendedfile.model';
import { catchError, forkJoin, of, tap } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { FileuploadService } from '../../services/fileupload.service';
import { CommonModule } from '@angular/common';
import { SanitizePipe } from "../../pipes/sanitize/sanitize.pipe";

@Component({
    selector: 'fileupload',
    standalone: true,
    imports: [
      CommonModule,
      SanitizePipe
    ],
    templateUrl: './fileupload.component.html',
    styleUrl: './fileupload.component.sass',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FileuploadComponent),
            multi: true
        }
    ]
})
export class FileuploadComponent implements ControlValueAccessor {
  @Input() control: any
  @Input() name: string = ''
  @Input() disabled: boolean = false
  @Input() value: string[] = []

  @Output() valueChange = new EventEmitter()
  
  // fileupload
  fileList: boolean = true
  toUploadFilesList: ExtendedFileModel[] = []
  toUploadBase64List: string[] = []
  upload: any

  constructor(private _fileuploadService: FileuploadService) { }
  
  onChange = (_:any) => { }
  onTouch = () => { }

  writeValue(value: any): void {
    console.log('writeValue: ', value)
    this.value = value
  }
  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  // file upload
  uploadBtn(t: any) {
    document.getElementById(t)?.click()
  }

  addFiles(event: Event) {
    this.toUploadFilesList = []
    const { target } = event
    const filesList = (target as HTMLInputElement).files
    if (!filesList) return
    this.constructToUploadFilesList(filesList)
  }

  uploadFiles(): void {
    // const requestsList = this.constructRequestsChain()
    // this.executeFileUpload(requestsList)
    this.onChange(this.toUploadBase64List)
  }

  async fileChangeEvent(event: Event) {
    this.toUploadFilesList = []
    this.toUploadBase64List = []
    const { target } = event
    const filesList = (target as HTMLInputElement).files
    if (!filesList) return
    this.constructToUploadFilesList(filesList)

    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
    for (const file of Array.from(filesList)) {
      try {
        var fileToLoad = file 

        var reader: FileReader = new FileReader()
        var imgSrcData
        reader.onloadend = (fileLoadedEvent: any) => {
          imgSrcData = fileLoadedEvent.target.result // <--- data: base64
          this.toUploadBase64List.push(imgSrcData)
        }
        reader.readAsDataURL(fileToLoad)
      } catch (error) {
        console.log('Catch-Error: ', error)
      }
    }
    // this._jsonFormService.setFiles(this.toUploadBase64List)
  }

  private constructToUploadFilesList(filesList: FileList): void {
    Array.from(filesList).forEach((item: File, index: number) => {
      const newFile: ExtendedFileModel = {
        file: item,
        uploadUrl: this.control.upload.url,
        uploadStatus: {
          isSucess: false,
          isError: false,
          errorMessage: '',
          progressCount: 0
        }
      }
      this.toUploadFilesList.push(newFile)
    })
  }

  private constructRequestsChain(): any {
    return this.toUploadFilesList.map((item, index) => {
      return this._fileuploadService.uploadFiles(item).pipe(
        tap((event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.toUploadFilesList[index].uploadStatus.progressCount = Math.round(100 * (event.loaded / event.total))
          }
        }),
        catchError((error) => {
          return of({ isError: true, index, error })
        })
      )
    })
  }

  private executeFileUpload(requestsChain: any[]): void {
    forkJoin(requestsChain).subscribe((response: any) => {
      response.forEach((item: { isError: any; index: number; error: { statusText: string } }) => {
        if (item.isError) {
          this.toUploadFilesList[item.index].uploadStatus.isError = true
          this.toUploadFilesList[item.index].uploadStatus.errorMessage = item.error.statusText
        }
      })
    })
  }

  deleteImage(index: number) {
    this.toUploadFilesList.splice(index, 1)
  }
}
