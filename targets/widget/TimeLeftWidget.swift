import WidgetKit
import SwiftUI

// Reads data written by the React Native app via App Groups shared container.
// The app writes to UserDefaults(suiteName: "group.com.timeleft.app").

struct LifeData: Codable {
    var percentageLived: Double
    var daysRemaining: Int
    var yearsRemaining: Int
    var dailyQuote: String

    static var placeholder: LifeData {
        LifeData(percentageLived: 31.0, daysRemaining: 18998, yearsRemaining: 52, dailyQuote: "Make today count.")
    }
}

func loadLifeData() -> LifeData {
    guard
        let defaults = UserDefaults(suiteName: "group.com.timeleft.app"),
        let data = defaults.data(forKey: "widget_life_data"),
        let decoded = try? JSONDecoder().decode(LifeData.self, from: data)
    else {
        return .placeholder
    }
    return decoded
}

// MARK: - Timeline Provider

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), lifeData: .placeholder)
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> Void) {
        completion(SimpleEntry(date: Date(), lifeData: loadLifeData()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> Void) {
        let entry = SimpleEntry(date: Date(), lifeData: loadLifeData())
        // Refresh every 30 minutes
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 30, to: Date())!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let lifeData: LifeData
}

// MARK: - Widget Views

struct SmallWidgetView: View {
    let entry: SimpleEntry

    var body: some View {
        ZStack {
            Color(red: 0.067, green: 0.067, blue: 0.067)
            VStack(alignment: .leading, spacing: 6) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("\(Int(entry.lifeData.percentageLived))%")
                        .font(.system(size: 36, weight: .ultraLight))
                        .foregroundColor(Color(red: 0.95, green: 0.94, blue: 0.91))
                    Text("of life used")
                        .font(.system(size: 11))
                        .foregroundColor(Color(red: 0.56, green: 0.56, blue: 0.58))
                }
                Spacer()
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        RoundedRectangle(cornerRadius: 2)
                            .fill(Color(red: 0.17, green: 0.17, blue: 0.18))
                            .frame(height: 4)
                        RoundedRectangle(cornerRadius: 2)
                            .fill(Color(red: 0.42, green: 0.64, blue: 0.77))
                            .frame(width: geo.size.width * (entry.lifeData.percentageLived / 100), height: 4)
                    }
                }
                .frame(height: 4)
                Spacer()
                Text("~\(entry.lifeData.daysRemaining.formatted()) days left")
                    .font(.system(size: 11))
                    .foregroundColor(Color(red: 0.56, green: 0.56, blue: 0.58))
            }
            .padding(14)
        }
    }
}

struct MediumWidgetView: View {
    let entry: SimpleEntry

    var body: some View {
        ZStack {
            Color(red: 0.067, green: 0.067, blue: 0.067)
            HStack(spacing: 0) {
                // Left: percentage
                VStack(alignment: .leading, spacing: 6) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("\(Int(entry.lifeData.percentageLived))%")
                            .font(.system(size: 44, weight: .ultraLight))
                            .foregroundColor(Color(red: 0.95, green: 0.94, blue: 0.91))
                        Text("of life used")
                            .font(.system(size: 12))
                            .foregroundColor(Color(red: 0.56, green: 0.56, blue: 0.58))
                    }
                    Spacer()
                    GeometryReader { geo in
                        ZStack(alignment: .leading) {
                            RoundedRectangle(cornerRadius: 2)
                                .fill(Color(red: 0.17, green: 0.17, blue: 0.18))
                                .frame(height: 4)
                            RoundedRectangle(cornerRadius: 2)
                                .fill(Color(red: 0.42, green: 0.64, blue: 0.77))
                                .frame(width: geo.size.width * (entry.lifeData.percentageLived / 100), height: 4)
                        }
                    }
                    .frame(height: 4)
                }
                .padding(16)
                .frame(maxWidth: .infinity)

                // Divider
                Rectangle()
                    .fill(Color(red: 0.17, green: 0.17, blue: 0.18))
                    .frame(width: 1)
                    .padding(.vertical, 16)

                // Right: days + quote
                VStack(alignment: .leading, spacing: 6) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("\(entry.lifeData.daysRemaining.formatted())")
                            .font(.system(size: 26, weight: .ultraLight))
                            .foregroundColor(Color(red: 0.95, green: 0.94, blue: 0.91))
                        Text("days left")
                            .font(.system(size: 11))
                            .foregroundColor(Color(red: 0.42, green: 0.64, blue: 0.77))
                    }
                    Spacer()
                    Text("\"\(entry.lifeData.dailyQuote.prefix(60))\"")
                        .font(.system(size: 10))
                        .foregroundColor(Color(red: 0.3, green: 0.3, blue: 0.3))
                        .lineLimit(2)
                }
                .padding(16)
                .frame(maxWidth: .infinity)
            }
        }
    }
}

// MARK: - Widget Entry View

struct TimeLeftWidgetEntryView: View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .systemSmall:
            SmallWidgetView(entry: entry)
        case .systemMedium:
            MediumWidgetView(entry: entry)
        default:
            SmallWidgetView(entry: entry)
        }
    }
}

// MARK: - Widget Configuration

@main
struct TimeLeftWidget: Widget {
    let kind: String = "TimeLeftWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            TimeLeftWidgetEntryView(entry: entry)
                .containerBackground(.clear, for: .widget)
        }
        .configurationDisplayName("Time Left")
        .description("See how much of your life remains.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
