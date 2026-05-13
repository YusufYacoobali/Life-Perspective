Pod::Spec.new do |s|
  s.name           = 'TimeLeftWidgetBridge'
  s.version        = '1.0.0'
  s.summary        = 'Writes Life Perspective widget data to the iOS App Group.'
  s.description    = 'Native Expo module for syncing React Native profile stats with WidgetKit.'
  s.author         = 'Life Perspective'
  s.homepage       = 'https://example.com'
  s.license        = { :type => 'MIT' }
  s.platforms      = { :ios => '15.1' }
  s.source         = { :git => '' }
  s.static_framework = true
  s.source_files   = "**/*.{h,m,mm,swift}"

  if defined?(use_expo_modules!)
    s.dependency 'ExpoModulesCore'
  end
end
