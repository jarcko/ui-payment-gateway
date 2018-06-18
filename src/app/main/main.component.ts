import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  enabled = false;
  name = 'jwt.signing.user';
  key = 'jwt.signing.key';

  constructor() { }

  ngOnInit() {
  }

}
