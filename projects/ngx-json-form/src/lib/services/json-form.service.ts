import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class JsonFormService {
  private readonly _formData = new BehaviorSubject<any>('')
  formData$: Observable<any> = this._formData.asObservable()

  private readonly _patchData = new Subject
  patchData$: Observable<any> = this._patchData.asObservable()

  files: string[] = []
  private readonly _files = new BehaviorSubject<string[]>([])
  files$: Observable<any> = this._files.asObservable()

  constructor() {}

  setFormData(formData: any) {
    this._formData.next(formData)
  }
  getFormData() {
    return this.formData$
  }

  patchData(patchData: any) {
    this._patchData.next(patchData)
  }

  setFiles(files: string[]) {
    console.log('files', files)
    files.map((file: any) => { console.log('file', file)})
    // files.forEach((file: string) => { 
    //   this.files.push(file)
    //   console.log('file', file)
    // })
    // console.log('files', files)
    // console.log('newFiles', this.files.push(files.map((file: any) => { return file })))
    console.log('this.files', this.files)
    this._files.next(files)
  }
}
