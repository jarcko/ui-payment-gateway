import { Component, ElementRef, Input, Output, OnInit, ViewChild, EventEmitter, AfterViewInit } from '@angular/core';
import { FormParameter } from '../main.interfaces';

@Component({
  selector: 'app-ingenico-iframe',
  templateUrl: './ingenico-iframe.component.html',
  styleUrls: ['./ingenico-iframe.component.scss']
})
export class IngenicoIframeComponent implements OnInit, AfterViewInit {

  @Input() providerUrl: string;
  @Input() params: FormParameter[];
  @Input() hideIframe: boolean;
  @Output() updateSpinner = new EventEmitter<boolean>();
  @ViewChild('ingenicoForm') ingenicoForm: ElementRef;

  constructor() { }

  ngOnInit() {
    this._submit();
    // this.updateSpinner.emit(false);
  }

  ngAfterViewInit() {
    this.updateSpinner.emit(false);
  }

  private _submit() {
    setTimeout(() => this.ingenicoForm.nativeElement.submit(), 10);
  }
}
