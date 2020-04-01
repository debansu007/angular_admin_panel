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
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyCr8GPzVn6Sq6Q_bDzOJgly7l_xwrUbvPY",
    authDomain: "tribe-235805.firebaseapp.com",
    databaseURL: "https://tribe-235805.firebaseio.com",
    projectId: "tribe-235805",
    storageBucket: "tribe-235805.appspot.com",
    messagingSenderId: "563597639388"
  },
  adminEmail: "admin@admin.com"
};
