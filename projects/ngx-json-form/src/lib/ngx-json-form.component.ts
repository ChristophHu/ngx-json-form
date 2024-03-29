import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms'
import { Observable, catchError, forkJoin, map, of, take, tap } from 'rxjs'
import { GenericControl, Options } from './models/generic-control'
import { SelectDropdownConfig } from './models/select-dropdown.model'
import { ExtendedFileModel } from './models/extendedfile.model'
import { JsonFormService } from './services/json-form.service'
import { FileuploadService } from './services/fileupload.service'
import { CustomValidator } from './validators/customvalidators'
import { flatten, getLocalISO } from './utils/json-form-utils'
import { HttpEventType } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { MaskDirective } from './directives/mask/mask.directive'
import { IndexOfObjectValuePipe } from './pipes/indexOfObjektValue/index-of-object-value.pipe'
import { ImageThumbnailComponent } from './components/image-thumbnail/image-thumbnail.component'
import { SanitizePipe } from './pipes/sanitize/sanitize.pipe'
import { ToggleComponent } from './components/toggle/toggle.component'
import { MatSelectModule } from '@angular/material/select'
import { SelectDropdownComponent } from './components/select-dropdown/select-dropdown.component'
import { HiddenDirective } from './directives/hidden/hidden.directive'
import { SignatureComponent } from './components/signature/signature.component'
// import { AutofocusDirective } from './directives/autofocus/autofocus.directive'

@Component({
  selector: 'json-form',
  standalone: true,
  imports: [
    // AutofocusDirective,
    CommonModule,
    FormsModule,
    HiddenDirective,
    IndexOfObjectValuePipe,
    ImageThumbnailComponent,
    MaskDirective,
    MatSelectModule,
    ReactiveFormsModule,
    SanitizePipe,
    SelectDropdownComponent,
    SignatureComponent,
    ToggleComponent
  ],
  templateUrl: './ngx-json-form.component.html',
  styleUrls: ['./ngx-json-form.component.sass']
})
export class NgxJsonFormComponent {
  @Input() formContent!: GenericControl[]
  @Output() formValue: EventEmitter<any> = new EventEmitter<any>()
  @Output() formStatus: EventEmitter<any> = new EventEmitter<any>()
  
  dynamicForm!: FormGroup
  value: any
  loading: boolean = false

  // selectoptions
  selectfields: any[] = []

  // dependedselect
  dependedSelectfields: any[] = []
  dependedKeys: any[] = []
  rules: any[] = []

  // searchselect
  config: SelectDropdownConfig = {
    displayKey: "name",
    search: true,
    limitTo: 0,
    height: "250px",
    enableSelectAll: true,
    placeholder: "Test",
    searchOnKey: "",
    moreText: "more",
    noResultsFound: "No results found!",
    searchPlaceholder: 'Search',
    clearOnSelection: false,
    inputDirection: 'ltr',
  }
  options = [
    {
      _id: "5a66d6c31d5e4e36c7711b7a",
      index: 0,
      balance: "$2,806.37",
      picture: "http://placehold.it/32x32",
      name: "Burns Dalton"
    },
    {
      _id: "5a66d6c3657e60c6073a2d22",
      index: 1,
      balance: "$2,984.98",
      picture: "http://placehold.it/32x32",
      name: "Mcintyre Lawson"
    },
    {
      _id: "5a66d6c376be165a5a7fae33",
      index: 2,
      balance: "$2,794.16",
      picture: "http://placehold.it/32x32",
      name: "Amie Franklin"
    },
    {
      _id: "5a66d6c376be165a5a7fae34",
      index: 2,
      balance: "$3,794.16",
      picture: "http://placehold.it/32x32",
      name: "Amie Palmer"
    },
    {
      _id: "5a66d6c376be165a5a7fae37",
      index: 2,
      balance: "$4,794.16",
      picture: "http://placehold.it/32x32",
      name: "Amie Andrews"
    }
  ]
  resetOption: any

  // fileupload
  fileList: boolean = true
  toUploadFilesList: ExtendedFileModel[] = []
  toUploadBase64List: string[] = []
  upload: any
  
  constructor(private _jsonFormService: JsonFormService, private _fileuploadService: FileuploadService) {}

  ngOnInit(): void {
    // dynamic reactive form
    this.dynamicForm = new FormGroup(
      this.formContent.reduce((mo: {}, fieldDesc: any) => {
        // default values
        let value: string | boolean | undefined = fieldDesc.defaultValue
        // if (fieldDesc.type == 'input') {
        //   // console.log('input', fieldDesc)
        //   if (fieldDesc.type == 'input' && fieldDesc.hasOwnProperty('dependOnKey')) console.log('input!!!', fieldDesc, )
        // }
        // seperate selectoptions
        if (fieldDesc.type == 'select') {
          this.selectfields.push({ key: fieldDesc.key, options: fieldDesc.options })
        }
        // seperate dependingselect
        if (fieldDesc.type == 'dependedselect') {
          this.dependedSelectfields.push({ key: fieldDesc.key, dependOnKey: fieldDesc.dependOnKey, options$: fieldDesc.options$ })
          fieldDesc.dependedOptions$ = fieldDesc.options$
          this.dependedKeys.push(fieldDesc.dependOnKey)
        }
        if (fieldDesc.dependOnKey) {
          // console.log('fieldDesc.dependOnKey', fieldDesc)
          this.dependedKeys.push(fieldDesc.dependOnKey)
        }
        // seperate fileupload
        if (fieldDesc.type == 'fileupload') {
          this.upload = fieldDesc.upload
        }
        let disabled: boolean = fieldDesc.disabled

        // create validators
        let validators: ValidatorFn[] = []
        if (fieldDesc.validators) {
          for (let validator of fieldDesc.validators) {
            switch (true) {
              case validator.email:
                validators = [...validators, Validators.email]
                break
              case typeof validator.max == 'number':
                validators = [...validators, Validators.max(validator.max)]
                break
              case typeof validator.min == 'number':
                validators = [...validators, Validators.min(validator.min)]
                break 
              case validator.maxlength > 0:
                validators = [...validators, Validators.maxLength(validator.maxlength)]
                break
              case validator.minlength > 0:
                validators = [...validators, Validators.minLength(validator.minlength)]
                break
              case validator.required:
                validators = [...validators, Validators.required]
                break
              case validator.validStrongPassword:
                validators = [...validators, CustomValidator.validStrongPassword]
                break
              case validator.zipCodeValidator:
                validators = [...validators, CustomValidator.zipCodeValidator]
                break
              default:
                console.log(this.constructor.name, 'cant find validator', validator)
                break
            }
          }
        }
        return {...mo, [fieldDesc.key]: new FormControl({ value, disabled }, validators)}
      }, {})
    )    

    this._jsonFormService.formData$
    .subscribe({
      next: (data) => {
        if (!data || this.value == data) return
        this.value = data
        this.loading = true
        // patchvalue simple value + flatten
        if (data) this.dynamicForm.patchValue(flatten(data))

        // patchvalue of selected
        if (this.selectfields && data) {
          this.selectfields.forEach(el => {
            el.options.find((kat: Options) => kat.value == data[el.key])
          })
        }

        // patchvalue of dependedselect
        if (this.dependedSelectfields && data) {
          this.dependedSelectfields.forEach(el => {
            el.options$.pipe(
              take(1),
              map((options: any) => {
                // patch options
                let depoptions: any = options.filter((option: any) => option.dep == data[el.dependOnKey])
                let dep: any = this.formContent.find((item: any) => item.key == el.key)
                if (depoptions != undefined) dep.dependedOptions$ = of(depoptions) // todo: FEHLER???
                return options.find((option: any) => {
                  if (option.value == data[el.dependOnKey]) {
                    return option
                  }
                })
              })
            ).subscribe({
              next: (option: any) => {
                // patch value
                if (option) {
                  var obj: any = {}
                  obj[el.key] = option.value
  
                  if (option) this.dynamicForm.patchValue(obj)
                }
              }
            })
          })
        }

        // if (this.dynamicForm.valid) {
          this.formValue.emit(Object.assign({}, this.value, data))
          this.formStatus.emit({ pristine: this.dynamicForm.pristine, dirty: this.dynamicForm.dirty, valid: this.dynamicForm.valid, invalid: this.dynamicForm.invalid, touched: this.dynamicForm.touched, untouched: this.dynamicForm.untouched })
        // }
        this.loading = false
      }
    })

    this._jsonFormService.patchData$.subscribe({
      next: data => {
        this.loading = true
        if (data) this.dynamicForm.patchValue(data)
        this.loading = false
      }
    })

    this.dynamicForm.statusChanges.subscribe({
      next: () => {
        this.formStatus.emit({ pristine: this.dynamicForm.pristine, dirty: this.dynamicForm.dirty, valid: this.dynamicForm.valid, invalid: this.dynamicForm.invalid, touched: this.dynamicForm.touched, untouched: this.dynamicForm.untouched })
      }
    })

    this.dynamicForm.valueChanges
    .subscribe({
      next: (data) => {

        if (this.loading) return
        // Fehler: Maximum call stack size exceeded in depended input (use simple changes)
        if (!this.loading && this.dynamicForm.valid) {
          this.formValue.emit(Object.assign({}, this.value, data))
        }
        if (this.dependedKeys) {
          let dependedSet = new Set(this.dependedKeys)
          dependedSet.forEach((el: any) => {
            // depended key value changes
            let item: any = this.formContent.filter((item: any) => item.hasOwnProperty('dependOnKey') && item.dependOnKey == el)
            item.forEach((item: any) => {
              switch (item.type) {
                case 'input':
                  // patch value of depended input
                  let option: any = item.options.find((option: any) => option.value == this.dynamicForm.controls[el].value)
                  if (option) {
                    this.loading = true
                    var obj: any = {}
                    obj[item.key] = option.label
    
                    this.dynamicForm.patchValue(obj)
                    this.loading = false
                  }
                  break
                case 'dependedselect':
                  // update options on depended select
                  item.dependedOptions$ = item.options$.pipe(
                    map((options: any) => options.filter((option: any) => option.dep == this.dynamicForm.controls[el].value)),
                    // tap((options: any) => { console.log('last options', options)})
                  )
                  break
                default:
                  console.log('item.type undefined')
              }
            })
          })
        }
      },
      complete: () => {
        console.log('complete')
      }
    })
  }

  // rules
  isHiddenRule(control: any): boolean | Observable<boolean> {
    const rule = control.rules?.find((el: any) => el.property == 'hidden')
    if (rule == undefined || rule.dependOn == undefined) return false
    switch (rule.dependOn?.operation) {
      case 'eq':
        if (this.dynamicForm.controls[rule.dependOn.key].value == rule.dependOn.except) return rule.value
        break
      case 'ne':
        if (this.dynamicForm.controls[rule.dependOn.key].value != rule.dependOn.except) return rule.value
        break
    }
    return false
  }

  // input options
  delete(key: string) {
    this.dynamicForm.get(key)?.setValue('')
  }
  setDateTime(key: string) {
    this.dynamicForm.get(key)?.setValue(getLocalISO('now'))
  }

  // file upload
  uploadBtn(t: any) {
    console.log('t', t)
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
    const requestsList = this.constructRequestsChain()
    this.executeFileUpload(requestsList)
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
    this._jsonFormService.setFiles(this.toUploadBase64List)
  }

  private constructToUploadFilesList(filesList: FileList): void {
    Array.from(filesList).forEach((item: File, index: number) => {
      const newFile: ExtendedFileModel = {
        file: item,
        uploadUrl: this.upload.url, //(index % 2 === 0) ? this.upload.url: '',
        uploadStatus: {
          isSucess: false,
          isError: false,
          errorMessage: '',
          progressCount: 0
        }
      }
      console.log(newFile)
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
