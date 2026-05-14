/** @type {import('@bacons/apple-targets').Config} */
module.exports = {
  type: 'widget',
  name: 'TimeLeftWidget',
  bundleIdentifier: 'com.yacoobali.lifeperspective.widget',
  deploymentTarget: '16.0',
  entitlements: {
    'com.apple.security.application-groups': ['group.com.yacoobali.lifeperspective'],
  },
  frameworks: ['WidgetKit', 'SwiftUI'],
};
