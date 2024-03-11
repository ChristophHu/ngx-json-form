import { AfterContentInit, Component, Inject, Injector, Input, OnInit, ViewEncapsulation, forwardRef } from '@angular/core'
import { trigger, state, style, transition, animate } from '@angular/animations'
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, NgControl, ValidationErrors } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { PadComponent } from './pad/pad.component'

@Component({
  selector: 'nxt-signature',
  standalone: true,
  imports: [
    CommonModule,
    PadComponent
  ],
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.sass', '../../style/json-form.sass'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 }) ),
      state('*', style({ opacity: 1 })),
      transition('void => false', []),
      transition('void => *', animate('200ms cubic-bezier(0.0, 0.0, 0.2, 1)'))
    ]),
    trigger('fadeOut', [
      state('*', style({ opacity: 1 })), 
      state('void', style({ opacity: 0 })),
      transition('false => void', []),
      transition('* => void', animate('200ms 200ms cubic-bezier(0.0, 0.0, 0.2, 1)'))
    ]),
    trigger('fadeInTop', [
        state('void', style({ opacity  : 0, transform: 'translate3d(0, -100%, 0)' })),
        state('*', style({ opacity  : 1, transform: 'translate3d(0, 0, 0)' })),
        transition('void => false', []),
        transition('void => *', animate('400ms cubic-bezier(0.0, 0.0, 0.2, 1)'))
    ]),
    trigger('fadeOutTop', [
        state('*', style({ opacity  : 1, transform: 'translate3d(0, 0, 0)' })),
        state('void', style({ opacity  : 0, transform: 'translate3d(0, -100%, 0)' })), 
        transition('false => void', []),
        transition('* => void', animate('400ms cubic-bezier(0.0, 0.0, 0.2, 1)'))
    ])
  ],
  providers: [     
    {       
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SignatureComponent),
      multi: true
    }
  ]
})
export class SignatureComponent implements AfterContentInit, ControlValueAccessor  {
  @Input() label: string = 'Unterschrift'
  @Input() description: string | undefined
  @Input() formControlName: string = 'signature'

  myGroup: FormGroup = new FormGroup({})
  errors: ValidationErrors | null | undefined
  signature: string = ''
  signImg = new Image();

  isShowModal: boolean = false
  isDisabled: boolean = false

  myImg = new Image();
  // Place link to original base64 image here, then adjust width and height below

  onTouched = () => {}
  onChange = (_: any | null) => { }

  constructor(@Inject(Injector) private injector: Injector) {
    this.myGroup = new FormGroup({
      value: new FormControl()
    })
    // this.myImg.src = "data:image/png;base64,R0lGODlhDwAUAIABAAAAAP///yH5BAEAAAEALAAAAAAPABQAAAIXjI+py+0Po5wH2HsXzmw//lHiSJZmUAAAOw==";
    // this.signImg.src = this.signature
    // this.invertColor()
  }

  ngAfterContentInit(): void {
    const injectedControl = this.injector.get(NgControl)
    
    injectedControl.control?.valueChanges.subscribe({
      next: (data: any) => {
        this.errors = injectedControl.control?.errors
      }
    })
    // this.signImg.src = this.signature
    // this.invertColor()
  }

  sign(event: any) {
    this.signature = event
    this.onChange(event)
  }

  openSignPad() {
    this.isShowModal = true
  }
  close() {
    this.isShowModal = false
  }
  clear() {
    this.signature = ''
    this.onChange('0')
  }

  registerOnChange(fn: any): any {
    this.onChange = fn
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }
  setDisabledState?(isDisabled: boolean): void {
    // this.disabled = isDisabled
  }
  writeValue(value: string): void {
    this.myGroup.patchValue({ value })
    this.signature = value
  }

  invertColor() {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d")!;
  
    // set width and height to original image width and height
    canvas.width = 150;
    canvas.height= 200;

    console.log('signature', this.signImg)
    console.log('this.myImg', this.myImg)
    ctx.drawImage(this.signImg,0,0);
    var imgd = ctx.getImageData(0, 0, this.signImg.width, this.signImg.height);
    console.log('imgd', imgd)
    // console.log(imgd)
    for (let i = 0; i <imgd.data.length; i += 4) {
        // change these values (RGB) to output new colors
        imgd.data[i]   = 155;
        imgd.data[i+1] = 143;
        imgd.data[i+2] = 143;
    }
    ctx.putImageData(imgd, 0, 0);
    var newImage=new Image()
    newImage.src=canvas.toDataURL("image/png")
    console.log('newImage', newImage)
  }
}
