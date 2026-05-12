import integrations from '@/data/dashboard-integrations.json';

export function getDashboardIntegrations() {
  return integrations;
}

export function getIntegrationSummary(env = process.env) {
  const has = (key) => Boolean(env[key] && String(env[key]).trim());
  return {
    google: {
      localStatus: integrations.googleDrive.status,
      driveRuntimeReady: has('GOOGLE_SERVICE_ACCOUNT_JSON') || has('GOOGLE_APPLICATION_CREDENTIALS'),
      calendarRuntimeReady: has('GOOGLE_SERVICE_ACCOUNT_JSON') || has('GOOGLE_APPLICATION_CREDENTIALS'),
      driveUrl: integrations.googleDrive.url,
      sheetUrl: integrations.googleDrive.sheetUrl,
      calendarUrl: integrations.googleCalendar.url,
    },
    slack: {
      floRunning: integrations.slack.status === 'flo-running',
      bookingAlertsReady: has('SLACK_WEBHOOK_URL') || has('SLACK_BOT_TOKEN'),
      growthChannel: integrations.slack.growthChannel,
      allJukesChannel: integrations.slack.allJukesChannel,
    },
    stripe: {
      readOnlyReady: has('STRIPE_SECRET_KEY'),
      missingKeys: integrations.stripe.requiredEnv.filter((key) => !has(key)),
      dashboardUrl: integrations.stripe.dashboardUrl,
    },
    metricool: {
      ready: integrations.metricool.requiredEnv.every((key) => has(key)),
      missingKeys: integrations.metricool.requiredEnv.filter((key) => !has(key)),
      url: integrations.metricool.url,
    },
    printful: {
      ready: integrations.printful.requiredEnv.every((key) => has(key)),
      missingKeys: integrations.printful.requiredEnv.filter((key) => !has(key)),
      url: integrations.printful.url,
    },
  };
}
