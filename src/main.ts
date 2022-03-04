import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Input, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';
import { UploadComponent } from './uploadComponent.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app',
  template: `
    <div class="col-md-6">
      <br>
      <upload></upload>
    </div>
  `
})
class AppComponent {
}

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, ReactiveFormsModule],
  declarations: [
    AppComponent,
    UploadComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);