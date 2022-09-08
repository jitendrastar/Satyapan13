import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';

import {FormsModule} from '@angular/forms';
import {IonicStorageModule} from '@ionic/storage';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {File} from '@ionic-native/file/ngx';
import {FileOpener} from '@ionic-native/file-opener/ngx';
import {
    FileTransfer,
    FileUploadOptions,
    FileTransferObject,
} from '@ionic-native/file-transfer/ngx';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {
    DocumentViewer,
    DocumentViewerOptions,
} from '@ionic-native/document-viewer/ngx';
import {ForwardToPage} from './forward-to/forward-to.page';
import {Market} from '@ionic-native/market/ngx';
// import {AppVersion} from '@ionic-native/app-version/ngx';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import {Network} from '@ionic-native/network/ngx';
// import { Diagnostic } from "@ionic-native/diagnostic/ngx";
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';

import {Downloader} from '@ionic-native/downloader/ngx';

import {LocationAccuracy} from '@ionic-native/location-accuracy/ngx';
// import {enterAnimation} from './navAnimation';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        IonicModule.forRoot(),

        //  IonicModule.forRoot({
            // navAnimation: enterAnimation
        // }),
         AppRoutingModule,
        HttpClientModule,
        FormsModule, BrowserModule, 
        IonicStorageModule.forRoot(),
    ],
    providers: [
        StatusBar,
        SplashScreen,
        HttpClient,
        Geolocation,
        PhotoViewer,
        CallNumber,
        // Diagnostic,
        AndroidPermissions,
        File,
        FileOpener,
        FileTransferObject,
        FileTransfer,
        Camera,
        Market,
        DocumentViewer,
        // AppVersion,
        SQLite,
        Network,
        Downloader,
        LocationAccuracy,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
