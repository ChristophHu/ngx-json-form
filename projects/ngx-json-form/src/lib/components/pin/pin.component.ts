import { CommonModule } from '@angular/common'
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Input, forwardRef } from '@angular/core';


@Component({
  selector: 'pin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './pin.component.html',
  styleUrl: './pin.component.sass',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PinComponent),
    multi: true
  }]
})
export class PinComponent implements ControlValueAccessor {
  @Input() label: boolean = true
  @Input() type: any = 'text'
  pinForm: FormGroup

  onTouched = () => {}
  onChange = (value: any) => {}

  constructor(private _formBuilder: FormBuilder) {
    this.pinForm = this._formBuilder.group({
      digit_1: '',
      digit_2: '',
      digit_3: '',
      digit_4: ''
    })
  }

  onDigitInput(event: any, previousElement: any, nextElement: any): void {
    this.onChange(Object.values(this.pinForm.value).join())
    if (event.code !== 'Backspace' && nextElement !== null) {
      nextElement.select()
    }
    console.log(event)
    if (event.inputType === 'deleteContentBackward' && previousElement !== null) {
      console.log('back')
      previousElement.select()
    // previousElement.value = ''
    }
  }

  onBlur() {
    this.onTouched()
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn
  }

  registerOnChange(fn: any) {
    this.onChange = fn
  }

  writeValue(value: string) {
    const arr: string[] = value.split(',')
    this.pinForm.patchValue({ digit_1: arr[0], digit_2: arr[1], digit_3: arr[2], digit_4: arr[3]})
  }

  setDisabledState(isDisabled: boolean): void {

  }
}
