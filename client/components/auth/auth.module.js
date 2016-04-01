'use strict';

angular.module('launcherApp.auth', [
  'launcherApp.constants',
  'launcherApp.util',
  'ngCookies',
  'ngRoute'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
