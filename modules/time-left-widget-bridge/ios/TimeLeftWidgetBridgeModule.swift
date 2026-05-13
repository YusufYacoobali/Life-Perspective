import ExpoModulesCore
import Foundation
import WidgetKit

public class TimeLeftWidgetBridgeModule: Module {
  private let suiteName = "group.com.timeleft.app"
  private let dataKey = "widget_life_data"
  private let widgetKind = "TimeLeftWidget"

  public func definition() -> ModuleDefinition {
    Name("TimeLeftWidgetBridge")

    AsyncFunction("setWidgetData") { (json: String) -> Bool in
      guard let data = json.data(using: .utf8),
            let defaults = UserDefaults(suiteName: self.suiteName) else {
        return false
      }

      defaults.set(data, forKey: self.dataKey)
      defaults.synchronize()
      WidgetCenter.shared.reloadTimelines(ofKind: self.widgetKind)
      return true
    }

    AsyncFunction("clearWidgetData") { () -> Bool in
      guard let defaults = UserDefaults(suiteName: self.suiteName) else {
        return false
      }

      defaults.removeObject(forKey: self.dataKey)
      defaults.synchronize()
      WidgetCenter.shared.reloadTimelines(ofKind: self.widgetKind)
      return true
    }
  }
}
