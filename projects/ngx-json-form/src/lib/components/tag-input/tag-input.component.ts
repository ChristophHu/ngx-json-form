import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'nxt-tag-input',
  standalone: true,
  imports: [],
  templateUrl: './tag-input.component.html',
  styleUrl: './tag-input.component.sass',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TagInputComponent),
    multi: true
  }]
})
export class TagInputComponent implements ControlValueAccessor {
  @Input() control: any
  @Input() tags: string[] = []
  readonly tagControl: FormControl<string | string[] | null>

  constructor() {
    this.tagControl = new FormControl([])
  }

  private _onChange = (_:any) => { }
  private _onTouched = () => { }

  writeValue(value: any): void {
    this.tagControl.setValue(value)
  }
  registerOnChange(fn: any): void {
    this._onChange = fn
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn
  }
  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.tagControl.disable() : this.tagControl.enable()
  }

  isRequired() {
    // console.log('val: ', this.control.validators == undefined)
    // if (this.control.validators != undefined) return this.control.validators.findIndex((validator: any) => validator.required) > -1
    return false
  }


}
