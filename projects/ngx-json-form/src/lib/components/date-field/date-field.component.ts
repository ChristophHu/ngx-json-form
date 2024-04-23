import { CommonModule } from '@angular/common'
import { Component, OnInit, Input, forwardRef } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormControl, ValidatorFn, Validators } from '@angular/forms'
import { takeUntil, map } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { getLocalISO } from '../../utils/json-form-utils'

@Component({
  selector: 'nxt-date-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './date-field.component.html',
  styleUrl: './date-field.component.sass',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateFieldComponent),
    multi: true
  }]
})
export class DateFieldComponent implements ControlValueAccessor {
  @Input() control: any
  readonly dateControl: FormControl<string | Date | null>

  private readonly _componentDestroyed$ = new Subject()

  constructor() {
    this.dateControl = new FormControl(new Date)

    this.dateControl.valueChanges.pipe(
      takeUntil(this._componentDestroyed$),
    ).subscribe((value: any) => {
      this._onChange(value)
      this._onTouched()
    })
  }

  ngOnDestroy(): void {
    this._componentDestroyed$.next('')
    this._componentDestroyed$.complete()
  }

  private _onChange = (_:any) => { }
  private _onTouched = () => { }

  writeValue(value: any): void {
    this.dateControl.setValue(value)
  }
  registerOnChange(fn: any): void {
    this._onChange = fn
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn
  }
  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.dateControl.disable() : this.dateControl.enable()
  }

  isRequired() {
    return this.control.validators.findIndex((validator: any) => validator.required) > -1
  }

  // input options
  delete(key: string) {
    this.dateControl.setValue(null)
    // this.writeValue('')
    this.dateControl.markAsDirty()
    this.dateControl.updateValueAndValidity()
  }
  setDateTime(key: string) {
    this.dateControl.setValue(getLocalISO('now'))
    this.dateControl.markAsDirty()
    this.dateControl.updateValueAndValidity()
  }
}
