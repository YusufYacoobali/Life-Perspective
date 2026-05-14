import WidgetKit
import SwiftUI
import Foundation

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
        let defaults = UserDefaults(suiteName: "group.com.yacoobali.lifeperspective"),
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
    static let bgTop = Color(red: 0.018, green: 0.023, blue: 0.031)
    static let bgBottom = Color(red: 0.055, green: 0.066, blue: 0.082)
    static let text = Color(red: 0.97, green: 0.95, blue: 0.91)
    static let dim = Color(red: 0.72, green: 0.68, blue: 0.63)
    static let faint = Color(red: 0.36, green: 0.39, blue: 0.45)
    static let track = Color(red: 0.11, green: 0.14, blue: 0.19)
    static let amber = Color(red: 1.0, green: 0.57, blue: 0.23)
    static let gold = Color(red: 1.0, green: 0.77, blue: 0.38)
    static let blue = Color(red: 0.55, green: 0.83, blue: 0.93)
    static let teal = Color(red: 0.33, green: 0.78, blue: 0.76)
}

extension View {
    @ViewBuilder
    func widgetHostBackground() -> some View {
        if #available(iOSApplicationExtension 17.0, *) {
            self.containerBackground(for: .widget) {
                PremiumWidgetBackground()
            }
        } else {
            self.background(PremiumWidgetBackground())
        }
    }
}

struct PremiumWidgetBackground: View {
    var body: some View {
        ZStack {
            LinearGradient(
                colors: [WidgetPalette.bgTop, Color(red: 0.015, green: 0.028, blue: 0.032), WidgetPalette.bgBottom],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            RadialGradient(
                colors: [WidgetPalette.amber.opacity(0.22), .clear],
                center: .topTrailing,
                startRadius: 8,
                endRadius: 180
            )
            RadialGradient(
                colors: [WidgetPalette.blue.opacity(0.18), .clear],
                center: .bottomLeading,
                startRadius: 10,
                endRadius: 210
            )
            ContainerRelativeShape()
                .stroke(Color.white.opacity(0.075), lineWidth: 1)
        }
    }
}

struct ChromeCard<Content: View>: View {
    let padding: CGFloat
    let content: Content

    init(padding: CGFloat = 18, @ViewBuilder content: () -> Content) {
        self.padding = padding
        self.content = content()
    }

    var body: some View {
        ZStack {
            PremiumWidgetBackground()
            content.padding(padding)
        }
        .clipShape(ContainerRelativeShape())
        .overlay(ContainerRelativeShape().stroke(Color.white.opacity(0.06), lineWidth: 1))
    }
}

struct LifeLeftTicker: View {
    let percentageLived: Double
    let dotCount: Int

    var body: some View {
        let livedIndex = min(max(Int((percentageLived / 100.0) * Double(dotCount)), 0), dotCount - 1)

        GeometryReader { proxy in
            let spacing: CGFloat = 4
            let markerWidth: CGFloat = 2.4
            let width = max(3, (proxy.size.width - spacing * CGFloat(dotCount - 1) - markerWidth) / CGFloat(dotCount))

            HStack(alignment: .center, spacing: spacing) {
                ForEach(0..<dotCount, id: \.self) { index in
                    if index == livedIndex {
                        Capsule()
                            .fill(WidgetPalette.dim)
                            .frame(width: markerWidth, height: 17)
                            .shadow(color: WidgetPalette.gold.opacity(0.25), radius: 5)
                    } else {
                        Capsule()
                            .fill(index < livedIndex ? WidgetPalette.gold : WidgetPalette.faint.opacity(0.45))
                            .frame(width: width, height: index < livedIndex ? 8 : 7)
                            .shadow(color: index < livedIndex ? WidgetPalette.amber.opacity(0.36) : .clear, radius: 5)
                    }
                }
            }
            .frame(maxHeight: .infinity, alignment: .center)
        }
        .frame(height: 24)
    }
}

struct GlowProgressBar: View {
    let percentageLived: Double

    var body: some View {
        GeometryReader { proxy in
            let width = proxy.size.width * min(max(percentageLived, 0), 100) / 100
            ZStack(alignment: .leading) {
                Capsule().fill(WidgetPalette.track.opacity(0.86))
                Capsule()
                    .fill(LinearGradient(colors: [WidgetPalette.teal, WidgetPalette.blue], startPoint: .leading, endPoint: .trailing))
                    .frame(width: max(8, width))
                    .shadow(color: WidgetPalette.teal.opacity(0.45), radius: 7)
            }
        }
        .frame(height: 7)
    }
}

struct RingGauge: View {
    let percentageLived: Double
    let lineWidth: CGFloat

    var body: some View {
        let remaining = min(max(100.0 - percentageLived, 0), 100)
        let trimAmount = CGFloat(remaining / 100.0) * 0.78

        GeometryReader { proxy in
            let side = min(proxy.size.width, proxy.size.height)

            ZStack {
                Circle()
                    .trim(from: 0, to: 0.78)
                    .stroke(WidgetPalette.track.opacity(0.95), style: StrokeStyle(lineWidth: lineWidth, lineCap: .round))
                    .rotationEffect(.degrees(130))

                Circle()
                    .trim(from: 0, to: trimAmount)
                    .stroke(
                        LinearGradient(
                            colors: [WidgetPalette.gold, WidgetPalette.amber],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ),
                        style: StrokeStyle(lineWidth: lineWidth, lineCap: .round)
                    )
                    .rotationEffect(.degrees(130))
                    .shadow(color: WidgetPalette.amber.opacity(0.62), radius: 8)

                Circle()
                    .trim(from: 0.79, to: 0.93)
                    .stroke(
                        LinearGradient(colors: [.clear, WidgetPalette.blue], startPoint: .top, endPoint: .bottom),
                        style: StrokeStyle(lineWidth: lineWidth * 0.72, lineCap: .round)
                    )
                    .rotationEffect(.degrees(130))
                    .opacity(0.9)

                Circle()
                    .stroke(Color.white.opacity(0.08), lineWidth: 1)
                    .padding(lineWidth + 9)
            }
            .frame(width: side, height: side)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }
}

struct LifeLeftCard: View {
    let entry: SimpleEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        let remainingPct = max(0, 100 - Int(entry.lifeData.percentageLived.rounded()))
        let compact = family == .systemSmall

        ChromeCard(padding: compact ? 15 : 22) {
            VStack(alignment: .leading, spacing: compact ? 14 : 20) {
                HStack(alignment: .firstTextBaseline) {
                    Text("Life Left")
                        .font(.system(size: compact ? 15 : 17, weight: .regular))
                        .foregroundColor(WidgetPalette.dim)
                    Spacer()
                    Text("\(remainingPct)%")
                        .font(.system(size: compact ? 25 : 34, weight: .light))
                        .foregroundColor(WidgetPalette.gold)
                        .shadow(color: WidgetPalette.amber.opacity(0.45), radius: 8)
                }

                LifeLeftTicker(percentageLived: entry.lifeData.percentageLived, dotCount: compact ? 16 : 28)

                Spacer(minLength: 0)

                Text("\(entry.lifeData.yearsRemaining) years left")
                    .font(.system(size: compact ? 14 : 16, weight: .regular))
                    .foregroundColor(WidgetPalette.text)
                    .lineLimit(1)
            }
        }
    }
}

struct DaysLeftCard: View {
    let entry: SimpleEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        let compact = family == .systemSmall

        ChromeCard(padding: compact ? 15 : 20) {
            VStack(alignment: .leading, spacing: compact ? 9 : 13) {
                HStack {
                    Text("LIFE PERSPECTIVE")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(WidgetPalette.amber)
                        .kerning(1.1)
                        .lineLimit(1)
                        .minimumScaleFactor(0.65)
                    Spacer()
                    Text("\(Int(entry.lifeData.percentageLived.rounded()))%")
                        .font(.system(size: compact ? 22 : 28, weight: .semibold))
                        .foregroundColor(WidgetPalette.text)
                }

                Spacer(minLength: 0)

                Text(entry.lifeData.daysRemaining.formatted())
                    .font(.system(size: compact ? 36 : 54, weight: .ultraLight))
                    .foregroundColor(WidgetPalette.text)
                    .lineLimit(1)
                    .minimumScaleFactor(0.58)

                Text("full days left")
                    .font(.system(size: compact ? 15 : 19, weight: .semibold))
                    .foregroundColor(WidgetPalette.dim)

                GlowProgressBar(percentageLived: entry.lifeData.percentageLived)

                if !compact {
                    LifeLeftTicker(percentageLived: entry.lifeData.percentageLived, dotCount: family == .systemLarge ? 34 : 10)
                    Text("\"\(entry.lifeData.dailyQuote.prefix(80))\"")
                        .font(.system(size: 11, weight: .regular))
                        .foregroundColor(WidgetPalette.faint)
                        .lineLimit(2)
                }
            }
        }
    }
}

struct ArcGaugeCard: View {
    let entry: SimpleEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        let remaining = max(0, 100.0 - entry.lifeData.percentageLived)
        let lineWidth: CGFloat = family == .systemLarge ? 18 : 14

        ChromeCard(padding: family == .systemSmall ? 14 : 18) {
            GeometryReader { proxy in
                let side = min(proxy.size.width, proxy.size.height)

                ZStack {
                    RingGauge(percentageLived: entry.lifeData.percentageLived, lineWidth: lineWidth)
                        .frame(width: side, height: side)

                    VStack(spacing: family == .systemSmall ? 4 : 7) {
                        Text(String(format: "%.1f%%", remaining))
                            .font(.system(size: family == .systemSmall ? 27 : 38, weight: .ultraLight))
                            .foregroundColor(WidgetPalette.text)
                            .lineLimit(1)
                            .minimumScaleFactor(0.7)
                        Text("AHEAD")
                            .font(.system(size: family == .systemSmall ? 9 : 11, weight: .bold))
                            .foregroundColor(WidgetPalette.dim)
                            .kerning(2)
                        Circle()
                            .fill(WidgetPalette.faint)
                            .frame(width: 4, height: 4)
                            .padding(.vertical, 2)
                        Text("\(entry.lifeData.yearsRemaining)")
                            .font(.system(size: family == .systemSmall ? 31 : 42, weight: .ultraLight))
                            .foregroundColor(WidgetPalette.text)
                        Text("YEARS LEFT")
                            .font(.system(size: family == .systemSmall ? 9 : 11, weight: .bold))
                            .foregroundColor(WidgetPalette.amber)
                            .kerning(2)
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
    }
}

struct TimeLeftWidgetEntryView: View {
    var entry: Provider.Entry

    var body: some View {
        DaysLeftCard(entry: entry)
    }
}

struct DotProgressWidgetView: View {
    var entry: Provider.Entry

    var body: some View {
        LifeLeftCard(entry: entry)
    }
}

struct ArcGaugeWidgetView: View {
    var entry: Provider.Entry

    var body: some View {
        ArcGaugeCard(entry: entry)
    }
}

struct TimeLeftWidget: Widget {
    let kind: String = "TimeLeftWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            TimeLeftWidgetEntryView(entry: entry)
                .widgetHostBackground()
        }
        .configurationDisplayName("Life Perspective")
        .description("A striking days-left widget for your estimated life perspective.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

struct DotProgressWidget: Widget {
    let kind: String = "DotProgressWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            DotProgressWidgetView(entry: entry)
                .widgetHostBackground()
        }
        .configurationDisplayName("Life Left")
        .description("A glowing life-left ticker with years remaining.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

struct ArcGaugeWidget: Widget {
    let kind: String = "ArcGaugeWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            ArcGaugeWidgetView(entry: entry)
                .widgetHostBackground()
        }
        .configurationDisplayName("Life Arc")
        .description("A circular life-remaining indicator.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

@main
struct TimeLeftWidgets: WidgetBundle {
    var body: some Widget {
        TimeLeftWidget()
        DotProgressWidget()
        ArcGaugeWidget()
    }
}
