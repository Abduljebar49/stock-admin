/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  firebase: {
    projectId: 'dabbal-product-control',
    appId: '1:545843400789:web:fff857b4365b816dbe44dc',
    databaseURL: 'https://dabbal-product-control-default-rtdb.europe-west1.firebasedatabase.app',
    storageBucket: 'dabbal-product-control.appspot.com',
    locationId: 'europe-west2',
    apiKey: 'AIzaSyAfSiWjaKIwlym43JKEsd0-RSCveVzyLCs',
    authDomain: 'dabbal-product-control.firebaseapp.com',
    messagingSenderId: '545843400789',
    measurementId: 'G-J6T6T4R8G3',
  },
  firebaseConfig:{
    apiKey: "AIzaSyAfSiWjaKIwlym43JKEsd0-RSCveVzyLCs",
    authDomain: "dabbal-product-control.firebaseapp.com",
    projectId: "dabbal-product-control",
    storageBucket: "dabbal-product-control.appspot.com",
    messagingSenderId: "545843400789",
    appId: "1:545843400789:web:fff857b4365b816dbe44dc",
    measurementId: "G-J6T6T4R8G3",
    databaseURL:'https://dabbal-product-control-default-rtdb.europe-west1.firebasedatabase.app'
  },
  production: false,
};
