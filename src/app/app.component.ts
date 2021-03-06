/*
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation,
  NgZone,
  ChangeDetectionStrategy
} from '@angular/core';
import { AppState } from './app.service';
import { AuthService } from './services/auth.service';
import { SpinnerService } from './services/spinner.service';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  providers: [SpinnerService],
  styleUrls: [
    './app.component.css'
  ],
  template: `
    <main>
      <spinner></spinner>
      <header-component></header-component>
      <router-outlet></router-outlet>
      <footer-component></footer-component>
    </main>
  `
})
export class AppComponent implements OnInit {
  public name = 'Angular 2 Webpack Starter';
  public url = 'https://twitter.com/AngularClass';
  public unstableTime: any;

  constructor(
    public appState: AppState,
    public ngZone: NgZone
  ) {
    this.ngZone.onStable.subscribe(this.onZoneStable.bind(this));
    this.ngZone.onUnstable.subscribe(this.onZoneUnstable.bind(this));
  }

  public onZoneStable() {
    return true;
  }

  public onZoneUnstable() {
    this.unstableTime = new Date().getTime();
  }

  public ngOnInit() {
    return true;
  }

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
