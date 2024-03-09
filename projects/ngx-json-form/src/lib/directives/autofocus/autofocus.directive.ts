import { Directive, ElementRef, Input } from '@angular/core'

@Directive({
  selector: '[autofocus]',
  standalone: true
})
export class AutofocusDirective {
  @Input() autofocus: boolean = false
  
  constructor(private host: ElementRef) {}

  ngAfterViewInit() {
    if (this.autofocus) this.host.nativeElement.focus()
  }
}
