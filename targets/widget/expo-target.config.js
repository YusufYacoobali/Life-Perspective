/** @type {import('@bacons/apple-targets').Config} */
module.exports = {
  type: 'widget',
  name: 'TimeLeftWidget',
  bundleIdentifier: 'com.timeleft.app.widget',
  deploymentTarget: '16.0',
  entitlements: {
    'com.apple.security.application-groups': ['group.com.timeleft.app'],
  },
  frameworks: ['WidgetKit', 'SwiftUI'],
};
