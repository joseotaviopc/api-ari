const Sentry = require('@sentry/nestjs');
const { nodeProfilingIntegration } = require('@sentry/profiling-node');

// Ensure to call this before requiring any other modules!
Sentry.init({
  dsn: 'https://9802b3e50875b8686077986d6ad6a349@o4508643899998208.ingest.us.sentry.io/4508643903078400',
  integrations: [
    // Add our Profiling integration
    nodeProfilingIntegration(),
  ],

  // Add Tracing by setting tracesSampleRate
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // Set sampling rate for profiling
  // This is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});
