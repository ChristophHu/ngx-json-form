import { CommonModule } from '@angular/common'
import { Component, OnInit, Input, forwardRef } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormControl } from '@angular/forms'
import { takeUntil, map } from 'rxjs/operators'
import { Subject } from 'rxjs'

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
  readonly dateControl: FormControl

  private readonly _componentDestroyed$ = new Subject()

  constructor() {
    
    this.dateControl = new FormControl(new Date)

    this.dateControl.valueChanges.pipe(
      takeUntil(this._componentDestroyed$),
    ).subscribe((invoiceId: Date) => {
      this._onChange(invoiceId)
      this._onTouched()
    })
  }

  ngOnDestroy(): void {
    this._componentDestroyed$.next('')
    this._componentDestroyed$.complete()
  }

  value: any = '';

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
}
