import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import * as Raven from 'raven-js';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {Angulartics2Module} from 'angulartics2';
import {Angulartics2Mixpanel} from 'angulartics2/mixpanel';
import {Angulartics2GoogleAnalytics} from 'angulartics2/ga';
import {ModalModule} from 'ngx-bootstrap';

import CONFIG from '@config';
import {AppComponent} from './app.component';
import {NavbarComponent, FooterComponent} from '@core/components';
import {IntercomService} from '@core/services';
import {ModulesDeclarations, ModulesRouting} from './modules';

// build declarations
const declarations = [
  // core components
  AppComponent,
  NavbarComponent,
  FooterComponent,
  // modules
  ...ModulesDeclarations
];

// build routes
const routes = [
  ...ModulesRouting
];

function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// error Monitoring using sentry
Raven
  .config(CONFIG.sentryDSN)
  .install();

class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    Raven.captureException(err);
  }
}

@NgModule({
  declarations,
  imports: [
    // routing
    RouterModule.forRoot(routes),
    BrowserModule,
    // bootstrap modal module
    ModalModule.forRoot(),
    // logging
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      // will log ERROR to CONFIG.serverLogUrl
      serverLoggingUrl: CONFIG.serverLogUrl,
      serverLogLevel: NgxLoggerLevel.ERROR
    }),
    // translation
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    // analytics
    Angulartics2Module.forRoot([
      Angulartics2Mixpanel,
      Angulartics2GoogleAnalytics
    ])
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: RavenErrorHandler
    },
    IntercomService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor() {
    // for initializing mixpanel
    // mixpanel.init(CONFIG.mixpanelToken);
    // for initializing google analytics
    // ga('create', CONFIG.gaTrackingId, 'auto');
    // for initializing intercom
    // IntercomService.boot(userParams);
  }
}
