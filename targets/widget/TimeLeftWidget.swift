import WidgetKit
import SwiftUI

struct LifeData: Codable {
    var percentageLived: Double
    var daysRemaining: Int
    var yearsRemaining: Int
    var dailyQuote: String

    static var placeholder: LifeData {
        LifeData(
            percentageLived: 31.0,
            daysRemaining: 18998,
            yearsRemaining: 52,
            dailyQuote: "Make today count."
        )
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

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), lifeData: .placeholder)
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> Void) {
        completion(SimpleEntry(date: Date(), lifeData: loadLifeData()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> Void) {
        let entry = SimpleEntry(date: Date(), lifeData: loadLifeData())
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 30, to: Date())!
        completion(Timeline(entries: [entry], policy: .after(nextUpdate)))
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let lifeData: LifeData
}

struct WidgetPalette {
    static let bg = Color(red: 0.027, green: 0.031, blue: 0.039)
    static let panel = Color.white.opacity(0.06)
    static let text = Color(red: 0.969, green: 0.949, blue: 0.91)
    static let dim = Color(red: 0.655, green: 0.627, blue: 0.627)
    static let faint = Color(red: 0.369, green: 0.376, blue: 0.408)
    static let teal = Color(red: 0.333, green: 0.78, blue: 0.757)
    static let amber = Color(red: 1.0, green: 0.541, blue: 0.278)
    static let track = Color(red: 0.125, green: 0.141, blue: 0.173)
}

// MARK: - Shared sub-views

struct ProgressBar: View {
    let percentage: Double

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                Capsule().fill(WidgetPalette.track)
                Capsule()
                    .fill(WidgetPalette.teal)
                    .frame(width: max(4, geo.size.width * min(max(percentage, 0), 100) / 100))
            }
        }
        .frame(height: 5)
    }
}

struct DotStrip: View {
    var body: some View {
        HStack(spacing: 4) {
            ForEach(0..<9) { index in
                Circle()
                    .fill(index < 5 ? WidgetPalette.faint : index == 5 ? WidgetPalette.amber : WidgetPalette.track)
                    .frame(width: 7, height: 7)
            }
        }
    }
}

// MARK: - Original widgets (small + medium)

struct SmallWidgetView: View {
    let entry: SimpleEntry

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [WidgetPalette.bg, Color(red: 0.055, green: 0.09, blue: 0.095)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text("LIFE PERSPECTIVE")
                        .font(.system(size: 9, weight: .bold))
                        .foregroundColor(WidgetPalette.amber)
                        .lineLimit(1)
                        .minimumScaleFactor(0.65)
                    Spacer()
                    Text("\(Int(entry.lifeData.percentageLived))%")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(WidgetPalette.text)
                }
                Spacer()
                Text("\(entry.lifeData.daysRemaining.formatted())")
                    .font(.system(size: 34, weight: .ultraLight))
                    .minimumScaleFactor(0.6)
                    .lineLimit(1)
                    .foregroundColor(WidgetPalette.text)
                Text("full days left")
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(WidgetPalette.dim)
                ProgressBar(percentage: entry.lifeData.percentageLived)
                DotStrip()
            }
            .padding(14)
        }
    }
}

struct MediumWidgetView: View {
    let entry: SimpleEntry

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [WidgetPalette.bg, Color(red: 0.07, green: 0.055, blue: 0.047)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            HStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("LIFE PROGRESS")
                        .font(.system(size: 9, weight: .bold))
                        .foregroundColor(WidgetPalette.amber)
                    Text("\(Int(entry.lifeData.percentageLived))%")
                        .font(.system(size: 46, weight: .ultraLight))
                        .foregroundColor(WidgetPalette.text)
                    Text("of the estimate used")
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(WidgetPalette.dim)
                    ProgressBar(percentage: entry.lifeData.percentageLived)
                }
                .frame(maxWidth: .infinity, alignment: .leading)

                VStack(alignment: .leading, spacing: 8) {
                    Text("\(entry.lifeData.daysRemaining.formatted())")
                        .font(.system(size: 28, weight: .ultraLight))
                        .minimumScaleFactor(0.65)
                        .lineLimit(1)
                        .foregroundColor(WidgetPalette.text)
                    Text("days left")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(WidgetPalette.teal)
                    Spacer()
                    DotStrip()
                    Text("\"\(entry.lifeData.dailyQuote.prefix(62))\"")
                        .font(.system(size: 10, weight: .regular))
                        .foregroundColor(WidgetPalette.faint)
                        .lineLimit(2)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(12)
                .background(WidgetPalette.panel)
                .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
            }
            .padding(15)
        }
    }
}

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

struct TimeLeftWidget: Widget {
    let kind: String = "TimeLeftWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            TimeLeftWidgetEntryView(entry: entry)
                .containerBackground(.clear, for: .widget)
        }
        .configurationDisplayName("Life Perspective")
        .description("See your estimated life perspective at a glance.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

// MARK: - Dot Progress widget (Pic 1: "Life Left" with dot row)

private struct LifeLeftDotRow: View {
    let percentageLived: Double
    private let totalDots = 22

    var body: some View {
        let livedDots = Int((percentageLived / 100.0) * Double(totalDots))
        HStack(spacing: 3) {
            ForEach(0..<totalDots, id: \.self) { i in
                if i == livedDots {
                    Rectangle()
                        .fill(Color(red: 0.86, green: 0.82, blue: 0.78))
                        .frame(width: 1.5, height: 13)
                } else {
                    Circle()
                        .fill(i < livedDots ? WidgetPalette.amber : WidgetPalette.faint)
                        .frame(width: 5, height: 5)
                        .opacity(i < livedDots ? 1.0 : 0.48)
                }
            }
        }
    }
}

struct DotProgressWidgetView: View {
    let entry: SimpleEntry

    var body: some View {
        let pct = entry.lifeData.percentageLived
        let remaining = max(0, 100 - Int(pct.rounded()))
        ZStack {
            Color(red: 0.067, green: 0.075, blue: 0.094)
            VStack(alignment: .leading, spacing: 0) {
                HStack {
                    Text("Life Left")
                        .font(.system(size: 15, weight: .regular))
                        .foregroundColor(WidgetPalette.dim)
                    Spacer()
                    Text("\(remaining)%")
                        .font(.system(size: 22, weight: .bold))
                        .foregroundColor(WidgetPalette.amber)
                }
                Spacer()
                LifeLeftDotRow(percentageLived: pct)
                Spacer()
                Text("\(entry.lifeData.yearsRemaining) years left")
                    .font(.system(size: 14, weight: .regular))
                    .foregroundColor(WidgetPalette.text)
            }
            .padding(16)
        }
    }
}

struct DotProgressWidget: Widget {
    let kind: String = "DotProgressWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            DotProgressWidgetView(entry: entry)
                .containerBackground(.clear, for: .widget)
        }
        .configurationDisplayName("Life Left")
        .description("Dot progress bar showing life percentage remaining.")
        .supportedFamilies([.systemMedium])
    }
}

// MARK: - Arc Gauge widget (Pic 2: circular arc with % + years)

struct ArcGaugeWidgetView: View {
    let entry: SimpleEntry

    var body: some View {
        let pct = entry.lifeData.percentageLived
        let remaining = 100.0 - pct
        let remainingStr = String(format: "%.1f", remaining)

        ZStack {
            Color(red: 0.053, green: 0.059, blue: 0.075)

            // Background arc — full 270°, gap at bottom
            Circle()
                .trim(from: 0, to: 0.75)
                .stroke(WidgetPalette.track, style: StrokeStyle(lineWidth: 13, lineCap: .round))
                .rotationEffect(.degrees(135))
                .padding(18)

            // Amber arc — proportional to remaining %
            Circle()
                .trim(from: 0, to: CGFloat(remaining / 100.0) * 0.75)
                .stroke(
                    LinearGradient(
                        colors: [
                            Color(red: 1.0, green: 0.54, blue: 0.28),
                            Color(red: 1.0, green: 0.72, blue: 0.18),
                        ],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ),
                    style: StrokeStyle(lineWidth: 13, lineCap: .round)
                )
                .rotationEffect(.degrees(135))
                .padding(18)

            VStack(spacing: 1) {
                Text("\(remainingStr)%")
                    .font(.system(size: 26, weight: .ultraLight))
                    .foregroundColor(WidgetPalette.text)
                Text("AHEAD")
                    .font(.system(size: 8, weight: .bold))
                    .foregroundColor(WidgetPalette.dim)
                    .kerning(1.8)

                Spacer().frame(height: 6)

                Text("\(entry.lifeData.yearsRemaining)")
                    .font(.system(size: 24, weight: .ultraLight))
                    .foregroundColor(WidgetPalette.text)
                Text("YEARS LEFT")
                    .font(.system(size: 8, weight: .bold))
                    .foregroundColor(WidgetPalette.amber)
                    .kerning(1.5)
            }
        }
    }
}

struct ArcGaugeWidget: Widget {
    let kind: String = "ArcGaugeWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            ArcGaugeWidgetView(entry: entry)
                .containerBackground(.clear, for: .widget)
        }
        .configurationDisplayName("Life Arc")
        .description("Circular arc gauge showing estimated life remaining.")
        .supportedFamilies([.systemSmall])
    }
}

// MARK: - Widget Bundle (entry point for all widgets)

@main
struct TimeLeftWidgets: WidgetBundle {
    var body: some Widget {
        TimeLeftWidget()
        DotProgressWidget()
        ArcGaugeWidget()
    }
}
