/* eslint-env node */

module.exports = function(environment) {
  const wsHost = process.env.API_WS_HOST || 'ws://localhost:4000';
  const host = process.env.API_HOST || 'http://localhost:4000';

  const ENV = {
    modulePrefix: 'accent-webapp',
    podModulePrefix: 'accent-webapp/pods',
    environment,
    rootURL: '/',
    locationType: 'auto',

    i18n: {
      defaultLocale: 'en'
    },

    flashMessageDefaults: {
      // flash message defaults
      timeout: 5000,
      destroyOnClick: false,
      extendedTimeout: 300,
      priority: 200,
      sticky: false,
      showProgress: false,

      // service defaults
      type: 'info',
      types: ['info', 'success', 'error', 'socket'],
      injectionFactories: []
    },

    EmberENV: {
      EXTEND_PROTOTYPES: false,
      LOG_VERSION: false
    },

    APP: {
      LOCAL_STORAGE: {
        SESSION_NAMESPACE: 'accent-session'
      }
    },

    GOOGLE_API: {
      CLIENT_ID: process.env.GOOGLE_API_CLIENT_ID
    },

    GOOGLE_LOGIN_ENABLED: Boolean(process.env.GOOGLE_API_CLIENT_ID),
    DUMMY_LOGIN_ENABLED: !Boolean(process.env.GOOGLE_API_CLIENT_ID),

    SENTRY: {
      DSN: process.env.WEBAPP_SENTRY_DSN
    },

    API: {
      WS_HOST: wsHost,
      HOST: host,
      AUTHENTICATION_PATH: `${host}/auth`,
      PROJECT_PATH: `${host}/projects/{0}`,
      SYNC_PEEK_PROJECT_PATH: `${host}/sync/peek?project_id={0}&language={1}`,
      SYNC_PROJECT_PATH: `${host}/sync?project_id={0}&language={1}`,
      MERGE_PEEK_PROJECT_PATH: `${host}/merge/peek?project_id={0}&language={1}&merge_type={2}`,
      MERGE_REVISION_PATH: `${host}/merge?project_id={0}&language={1}&merge_type={2}`,
      EXPORT_DOCUMENT: `${host}/export`,
      PERCENTAGE_REVIEWED_BADGE_SVG_PROJECT_PATH: `${host}/{0}/percentage_reviewed_badge.svg`
    },

    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval' apis.google.com cdn.ravenjs.com",
      // Allow fonts to be loaded from http://fonts.gstatic.com
      'font-src': "'self' http://fonts.gstatic.com",
      // Allow data (ajax/websocket)
      'connect-src': `'self' https://www.googleapis.com ${wsHost} ${host} https://sentry.io`,
      'img-src': '*',
      // Allow inline styles and loaded CSS from http://fonts.googleapis.com
      'style-src': "'self' 'unsafe-inline' http://fonts.googleapis.com",
      'media-src': "'self'",
      'frame-src': 'accounts.google.com'
    }

  };

  if (environment === 'test') {
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';

    ENV.APP.LOCAL_STORAGE.SESSION_NAMESPACE = 'accent-session-test';
  }

  return ENV;
};
