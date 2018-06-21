import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatRadioModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { CommunicationService } from './main/communication.service';
import { NotificationService } from './main/notification/notification.service';
import { HttpClientModule } from '@angular/common/http';
import { NotificationComponent } from './main/notification/notification.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NotificationComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatRadioModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    CommunicationService,
    NotificationService
  ],
  bootstrap: [AppComponent],
})

export class AppModule {
}
