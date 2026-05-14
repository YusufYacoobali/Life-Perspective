/** @type {import('@bacons/apple-targets').Config} */
module.exports = {
  type: 'widget',
  name: 'TimeLeftWidget',
  bundleIdentifier: 'yacoobali.lifeperspective.widget',
  deploymentTarget: '16.0',
  entitlements: {
    'com.apple.security.application-groups': ['group.yacoobali.lifeperspective'],
  },
  frameworks: ['WidgetKit', 'SwiftUI'],
};
