import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Input, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app',
  template: `
  `
})
class AppComponent {
}

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule],
  declarations: [
    AppComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);