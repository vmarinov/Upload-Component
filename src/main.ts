import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Input, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';
import { UploadComponent } from './uploadComponent.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UploadItemComponent } from './uploadItem.component';

@Component({
  selector: 'app',
  template: `
    <div class="col-md-6">
      <br>
      <upload url="http://httpbin.org/post"></upload>
    </div>
  `
})
class AppComponent { }

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, ReactiveFormsModule],
  declarations: [
    AppComponent,
    UploadComponent,
    UploadItemComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);