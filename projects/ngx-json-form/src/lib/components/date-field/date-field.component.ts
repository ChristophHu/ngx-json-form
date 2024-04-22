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
  @Input() control: any = {}
  @Input() disabled: boolean = false
  readonly formcontrol: FormControl

  private readonly _componentDestroyed$ = new Subject();

  constructor() {
    
    this.formcontrol = new FormControl({ value: '', disabled: false })

    this.formcontrol.valueChanges.pipe(
      // takeUntil(this._componentDestroyed$),
    ).subscribe((value: any) => {
      this.onTouch()
      this.onChange(value)
    })
  }

  // ngOnInit() {
  //   console.log('DateFieldComponent', this.control)
  // }

  // ngOnDestroy(): void {
  //   this._componentDestroyed$.next('');
  //   this._componentDestroyed$.complete();
  // }

  value: any = '';

  onChange = (_:any) => { }
  onTouch = () => { }

  writeValue(value: any): void {
    this.formcontrol.setValue(value)
  }
  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn
  }
  setDisabledState(isDisabled: boolean): void {
    // this.disabled = isDisabled
  }
}
