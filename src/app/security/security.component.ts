import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {
  enabled = false;
  name = 'jwt.signing.user';
  key = 'jwt.signing.key';

  constructor() { }

  ngOnInit() {
  }

}
