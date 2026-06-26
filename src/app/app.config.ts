import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      })
    ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()), provideFirebaseApp(() => initializeApp({ projectId: "bitu-yetu-26b38", appId: "1:88820617816:web:695cef3f88f2972a81b02d", storageBucket: "bitu-yetu-26b38.firebasestorage.app", apiKey: "AIzaSyAGlnuYnTWJoqVKS6e6G1j-Isje5SKpHsw", authDomain: "bitu-yetu-26b38.firebaseapp.com", messagingSenderId: "88820617816", measurementId: "G-4J7KN0RW8P" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),
  ],
};
