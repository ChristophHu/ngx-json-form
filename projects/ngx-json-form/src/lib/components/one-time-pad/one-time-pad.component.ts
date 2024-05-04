import { CommonModule } from '@angular/common'
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Input, forwardRef } from '@angular/core';

@Component({
  selector: 'one-time-pad',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './one-time-pad.component.html',
  styleUrl: './one-time-pad.component.sass',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OneTimePadComponent),
    multi: true
  }]
})
export class OneTimePadComponent implements ControlValueAccessor {
  @Input() label: boolean = true
  otpForm: FormGroup

  onTouched = () => {}
  onChange = (value: any) => {}

  constructor(private _formBuilder: FormBuilder) {
    this.otpForm = this._formBuilder.group({
      digit_1: '',
      digit_2: '',
      digit_3: '',
      digit_4: '',
      digit_5: '',
      digit_6: '',
    })
  }

  onDigitInput(event: any, previousElement: any, nextElement: any): void {
    this.onChange(Object.values(this.otpForm.value).join())
    if (event.code !== 'Backspace' && nextElement !== null) {
      nextElement.select()
    }
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
    this.otpForm.patchValue({ digit_1: arr[0], digit_2: arr[1], digit_3: arr[2], digit_4: arr[3], digit_5: arr[4], digit_6: arr[5],})
  }

  setDisabledState(isDisabled: boolean): void {

  }
}
