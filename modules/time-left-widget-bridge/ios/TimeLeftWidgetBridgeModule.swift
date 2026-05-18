import ExpoModulesCore
import Foundation
import WidgetKit

public class TimeLeftWidgetBridgeModule: Module {
  private let suiteName = "group.com.yacoobali.lifeperspective"
  private let dataKey = "widget_life_data"
  private let widgetKinds = ["LifeLeftGridWidget", "LifeArcWidget", "TodayLeftWidget", "MilestoneCountdownWidget"]

  public func definition() -> ModuleDefinition {
    Name("TimeLeftWidgetBridge")

    AsyncFunction("setWidgetData") { (json: String) -> Bool in
      guard let data = json.data(using: .utf8),
            let defaults = UserDefaults(suiteName: self.suiteName) else {
        return false
      }

      defaults.set(data, forKey: self.dataKey)
      defaults.synchronize()
      self.reloadWidgets()
      return true
    }

    AsyncFunction("clearWidgetData") { () -> Bool in
      guard let defaults = UserDefaults(suiteName: self.suiteName) else {
        return false
      }

      defaults.removeObject(forKey: self.dataKey)
      defaults.synchronize()
      self.reloadWidgets()
      return true
    }
  }

  private func reloadWidgets() {
    for kind in widgetKinds {
      WidgetCenter.shared.reloadTimelines(ofKind: kind)
    }
    WidgetCenter.shared.reloadAllTimelines()
  }
}
