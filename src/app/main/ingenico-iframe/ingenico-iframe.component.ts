import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormParameter } from '../main.interfaces';

@Component({
  selector: 'app-ingenico-iframe',
  templateUrl: './ingenico-iframe.component.html',
  styleUrls: ['./ingenico-iframe.component.scss']
})
export class IngenicoIframeComponent implements OnInit {

  @Input() providerUrl: string;
  @Input() params: FormParameter[];
  @ViewChild('ingenicoForm') ingenicoForm: ElementRef;

  constructor() { }

  ngOnInit() {
    this._submit();
  }

  private _submit() {
    setTimeout(() => this.ingenicoForm.nativeElement.submit(), 10);
  }
}
