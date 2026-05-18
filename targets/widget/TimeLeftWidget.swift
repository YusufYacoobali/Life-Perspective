import WidgetKit
import SwiftUI
import Foundation

struct WidgetMilestone: Codable, Identifiable {
    var id: String { "\(title)-\(days)" }
    var title: String
    var subtitle: String
    var days: Int
    var tone: String
}

struct LifeData: Codable {
    var percentageLived: Double
    var percentageRemaining: Double?
    var daysRemaining: Int
    var yearsRemaining: Int
    var weeksLived: Int?
    var weeksRemaining: Int?
    var totalWeeksEstimated: Int?
    var monthsLived: Int?
    var monthsRemaining: Int?
    var todayMinutesRemaining: Int?
    var todayElapsedPercentage: Double?
    var todayTimeLeftLabel: String?
    var dailyQuote: String
    var milestones: [WidgetMilestone]?
    var updatedAt: String?

    static var placeholder: LifeData {
        LifeData(
            percentageLived: 31.0,
            percentageRemaining: 69.0,
            daysRemaining: 18998,
            yearsRemaining: 52,
            weeksLived: 2384,
            weeksRemaining: 1776,
            totalWeeksEstimated: 4160,
            monthsLived: 548,
            monthsRemaining: 624,
            todayMinutesRemaining: 462,
            todayElapsedPercentage: 67.9,
            todayTimeLeftLabel: "7h 42m",
            dailyQuote: "Do not waste what you cannot get back.",
            milestones: [
                WidgetMilestone(title: "Next Birthday", subtitle: "47 Sundays", days: 47, tone: "pink"),
                WidgetMilestone(title: "New Year", subtitle: "231 days", days: 231, tone: "green"),
                WidgetMilestone(title: "Age 30", subtitle: "842 days", days: 842, tone: "blue")
            ],
            updatedAt: nil
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
        let now = Date()
        let data = loadLifeData()
        let entries = (0..<60).compactMap { minuteOffset in
            Calendar.current.date(byAdding: .minute, value: minuteOffset, to: now).map {
                SimpleEntry(date: $0, lifeData: data)
            }
        }
        completion(Timeline(entries: entries, policy: .atEnd))
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let lifeData: LifeData
}

struct WidgetPalette {
    static let bgTop = Color(red: 0.018, green: 0.023, blue: 0.031)
    static let bgMid = Color(red: 0.019, green: 0.042, blue: 0.052)
    static let bgBottom = Color(red: 0.055, green: 0.066, blue: 0.082)
    static let text = Color(red: 0.97, green: 0.95, blue: 0.91)
    static let dim = Color(red: 0.72, green: 0.68, blue: 0.63)
    static let faint = Color(red: 0.36, green: 0.39, blue: 0.45)
    static let track = Color(red: 0.11, green: 0.14, blue: 0.19)
    static let amber = Color(red: 1.0, green: 0.57, blue: 0.23)
    static let gold = Color(red: 1.0, green: 0.77, blue: 0.38)
    static let blue = Color(red: 0.55, green: 0.83, blue: 0.93)
    static let green = Color(red: 0.55, green: 0.9, blue: 0.55)
    static let pink = Color(red: 1.0, green: 0.36, blue: 0.58)
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
    var showStroke = false

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [WidgetPalette.bgTop, WidgetPalette.bgMid, WidgetPalette.bgBottom],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            RadialGradient(colors: [WidgetPalette.amber.opacity(0.16), .clear], center: .topTrailing, startRadius: 8, endRadius: 170)
            RadialGradient(colors: [WidgetPalette.blue.opacity(0.15), .clear], center: .bottomLeading, startRadius: 8, endRadius: 210)
            ContainerRelativeShape().stroke(Color.white.opacity(showStroke ? 0.08 : 0), lineWidth: showStroke ? 1 : 0)
        }
    }
}

struct ChromeCard<Content: View>: View {
    let padding: CGFloat
    let showBorder: Bool
    let content: Content

    init(padding: CGFloat = 16, showBorder: Bool = false, @ViewBuilder content: () -> Content) {
        self.padding = padding
        self.showBorder = showBorder
        self.content = content()
    }

    var body: some View {
        ZStack {
            PremiumWidgetBackground(showStroke: showBorder)
            content.padding(padding)
        }
        .clipShape(ContainerRelativeShape())
        .overlay(ContainerRelativeShape().stroke(Color.white.opacity(showBorder ? 0.06 : 0), lineWidth: showBorder ? 1 : 0))
    }
}

func todayCountdown(from date: Date) -> (label: String, elapsed: Double) {
    let calendar = Calendar.current
    let midnight = calendar.nextDate(after: date, matching: DateComponents(hour: 0, minute: 0), matchingPolicy: .nextTime)!
    let minutesRemaining = max(0, Int(ceil(midnight.timeIntervalSince(date) / 60)))
    let hours = minutesRemaining / 60
    let minutes = minutesRemaining % 60
    let elapsed = min(max(Double((24 * 60) - minutesRemaining) / Double(24 * 60) * 100, 0), 100)
    return ("\(hours)h \(String(format: "%02d", minutes))m", elapsed)
}

func milestoneColor(_ tone: String) -> Color {
    switch tone {
    case "pink": return WidgetPalette.pink
    case "blue": return Color(red: 0.48, green: 0.58, blue: 0.85)
    case "green": return WidgetPalette.green
    default: return WidgetPalette.amber
    }
}

func milestoneSymbol(for title: String) -> String {
    let lower = title.lowercased()
    if lower.contains("birthday") { return "gift" }
    if lower.contains("year") { return "sun.max" }
    if lower.contains("retire") { return "briefcase" }
    if lower.contains("age") { return "calendar" }
    return "sparkles"
}

struct WeekGrid: View {
    let data: LifeData
    @Environment(\.widgetFamily) var family

    var body: some View {
        let cols = family == .systemSmall ? 14 : 32
        let rows = family == .systemSmall ? 7 : 8
        let totalDots = cols * rows
        let totalWeeks = max(data.totalWeeksEstimated ?? (data.weeksLived ?? 0) + (data.weeksRemaining ?? 0), 1)
        let livedWeeks = data.weeksLived ?? Int(Double(totalWeeks) * data.percentageLived / 100)
        let livedDots = min(totalDots - 1, max(0, Int(Double(livedWeeks) / Double(totalWeeks) * Double(totalDots))))

        GeometryReader { proxy in
            let cellW = proxy.size.width / CGFloat(cols)
            let cellH = proxy.size.height / CGFloat(rows)
            let radius = min(cellW, cellH) * 0.28

            ForEach(0..<totalDots, id: \.self) { index in
                let col = index % cols
                let row = index / cols
                let x = CGFloat(col) * cellW + cellW / 2
                let y = CGFloat(row) * cellH + cellH / 2

                Circle()
                    .fill(index < livedDots ? WidgetPalette.text.opacity(0.96) : WidgetPalette.faint.opacity(0.52))
                    .frame(width: radius * 2, height: radius * 2)
                    .position(x: x, y: y)

                if index == livedDots {
                    Circle()
                        .stroke(WidgetPalette.text, lineWidth: 1.45)
                        .frame(width: radius * 3.1, height: radius * 3.1)
                        .position(x: x, y: y)
                }
            }
        }
    }
}

struct LifeLeftGridCard: View {
    let entry: SimpleEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        let data = entry.lifeData
        let lived = data.weeksLived ?? 2384
        let remaining = data.weeksRemaining ?? 1776
        let compact = family == .systemSmall

        ChromeCard(padding: compact ? 12 : 16, showBorder: true) {
            VStack(alignment: .leading, spacing: compact ? 8 : 12) {
                Text("Life Dots")
                    .font(.system(size: compact ? 13 : 15, weight: .bold))
                    .foregroundColor(WidgetPalette.text)

                WeekGrid(data: data)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)

                HStack(alignment: .lastTextBaseline) {
                    Text("\(lived.formatted()) weeks lived")
                        .font(.system(size: compact ? 9 : 11, weight: .semibold))
                        .foregroundColor(WidgetPalette.dim)
                        .lineLimit(1)
                        .minimumScaleFactor(0.75)
                    Spacer(minLength: 8)
                    Text("\(remaining.formatted()) remaining")
                        .font(.system(size: compact ? 9 : 11, weight: .semibold))
                        .foregroundColor(WidgetPalette.dim)
                        .lineLimit(1)
                        .minimumScaleFactor(0.75)
                }
            }
        }
    }
}

struct LifeArcShape: Shape {
    let startDegrees: Double
    let endDegrees: Double

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let radius = min(rect.width * 0.43, rect.height * 0.9)
        let center = CGPoint(x: rect.midX, y: rect.maxY * 0.96)
        path.addArc(
            center: center,
            radius: radius,
            startAngle: .degrees(startDegrees),
            endAngle: .degrees(endDegrees),
            clockwise: false
        )
        return path
    }
}

struct LifeArcMarker: View {
    let progress: Double

    var body: some View {
        GeometryReader { proxy in
            let clamped = min(max(progress, 0), 1)
            let radius = min(proxy.size.width * 0.43, proxy.size.height * 0.9)
            let center = CGPoint(x: proxy.size.width / 2, y: proxy.size.height * 0.96)
            let angle = (180 + (180 * clamped)) * Double.pi / 180
            let x = center.x + CGFloat(cos(angle)) * radius
            let y = center.y + CGFloat(sin(angle)) * radius

            Circle()
                .fill(WidgetPalette.green)
                .overlay(Circle().stroke(WidgetPalette.text.opacity(0.86), lineWidth: 1.4))
                .shadow(color: WidgetPalette.green.opacity(0.5), radius: 4)
                .frame(width: 12, height: 12)
                .position(x: x, y: y)
        }
    }
}

struct SmoothLifeArc: View {
    let percentage: Double

    var body: some View {
        let progress = min(max(percentage / 100, 0), 1)
        ZStack {
            LifeArcShape(startDegrees: 180, endDegrees: 360)
                .stroke(WidgetPalette.track.opacity(0.95), style: StrokeStyle(lineWidth: 7, lineCap: .round))
            LifeArcShape(startDegrees: 180, endDegrees: 180 + 180 * progress)
                .stroke(
                    LinearGradient(
                        colors: [WidgetPalette.green, Color(red: 0.72, green: 0.92, blue: 0.75)],
                        startPoint: .leading,
                        endPoint: .trailing
                    ),
                    style: StrokeStyle(lineWidth: 7, lineCap: .round)
                )
                .shadow(color: WidgetPalette.green.opacity(0.24), radius: 5)
            LifeArcMarker(progress: progress)
        }
    }
}

struct LifeArcCard: View {
    let entry: SimpleEntry

    var body: some View {
        let data = entry.lifeData
        let totalYears = max(1, Int(round(Double(data.yearsRemaining) / max((data.percentageRemaining ?? (100 - data.percentageLived)) / 100, 0.01))))
        let yearsCompleted = max(0, totalYears - data.yearsRemaining)
        let completed = Int(data.percentageLived.rounded())

        ChromeCard(padding: 10) {
            VStack(spacing: 5) {
                SmoothLifeArc(percentage: data.percentageLived)
                    .frame(height: 46)
                    .padding(.horizontal, 4)
                    .padding(.top, 2)

                VStack(spacing: 0) {
                    Text("AGE")
                        .font(.system(size: 8, weight: .bold))
                        .kerning(1.2)
                        .foregroundColor(WidgetPalette.dim)
                    Text("\(yearsCompleted)")
                        .font(.system(size: 32, weight: .light))
                        .foregroundColor(WidgetPalette.text)
                        .lineLimit(1)
                        .minimumScaleFactor(0.8)
                    Text("of \(totalYears) years")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(WidgetPalette.dim)
                        .lineLimit(1)
                        .minimumScaleFactor(0.78)
                }

                Rectangle()
                    .fill(WidgetPalette.track.opacity(0.9))
                    .frame(height: 1)

                HStack(spacing: 0) {
                    VStack(spacing: 2) {
                        Text("\(completed)%")
                            .font(.system(size: 17, weight: .bold))
                            .foregroundColor(WidgetPalette.green)
                        Text("completed")
                            .font(.system(size: 8, weight: .medium))
                            .foregroundColor(WidgetPalette.dim)
                    }
                    .frame(maxWidth: .infinity)

                    Rectangle()
                        .fill(WidgetPalette.track.opacity(0.9))
                        .frame(width: 1, height: 28)

                    VStack(spacing: 2) {
                        Text("\(data.yearsRemaining)")
                            .font(.system(size: 17, weight: .bold))
                            .foregroundColor(WidgetPalette.green)
                        Text("years left")
                            .font(.system(size: 8, weight: .medium))
                            .foregroundColor(WidgetPalette.dim)
                    }
                    .frame(maxWidth: .infinity)
                }
            }
        }
    }
}

struct TodayLeftCard: View {
    let entry: SimpleEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        let today = todayCountdown(from: entry.date)
        let compact = family == .systemSmall
        let quote = entry.lifeData.dailyQuote

        ChromeCard(padding: compact ? 14 : 18) {
            VStack(alignment: .center, spacing: compact ? 9 : 13) {
                Text(today.label)
                    .font(.system(size: compact ? 31 : 39, weight: .bold))
                    .foregroundColor(WidgetPalette.amber)
                    .lineLimit(1)
                    .minimumScaleFactor(0.72)

                Text("left until midnight")
                    .font(.system(size: compact ? 13 : 16, weight: .medium))
                    .foregroundColor(WidgetPalette.text)

                GeometryReader { proxy in
                    ZStack(alignment: .leading) {
                        Capsule().fill(WidgetPalette.track)
                        Capsule()
                            .fill(LinearGradient(colors: [WidgetPalette.amber, WidgetPalette.gold], startPoint: .leading, endPoint: .trailing))
                            .frame(width: max(6, proxy.size.width * today.elapsed / 100))
                            .shadow(color: WidgetPalette.amber.opacity(0.5), radius: 6)
                    }
                }
                .frame(height: 3)
                .padding(.bottom, compact ? 2 : 5)

                SunGlyph()
                    .frame(width: compact ? 22 : 28, height: compact ? 22 : 28)

                Text(quote)
                    .font(.system(size: compact ? 11 : 13, weight: .regular))
                    .italic()
                    .foregroundColor(WidgetPalette.dim)
                    .multilineTextAlignment(.center)
                    .lineLimit(1)
                    .truncationMode(.tail)
            }
        }
    }
}

struct SunGlyph: View {
    var body: some View {
        ZStack {
            Circle().stroke(WidgetPalette.amber, lineWidth: 2)
            ForEach(0..<8, id: \.self) { index in
                Capsule()
                    .fill(WidgetPalette.amber)
                    .frame(width: 2, height: 6)
                    .offset(y: -18)
                    .rotationEffect(.degrees(Double(index) * 45))
            }
        }
    }
}

struct MilestoneCountdownCard: View {
    let entry: SimpleEntry

    var body: some View {
        let milestones = entry.lifeData.milestones ?? LifeData.placeholder.milestones!
        let visibleCount = 3

        ChromeCard(padding: 12) {
            VStack(alignment: .leading, spacing: 5) {
                Text("Upcoming Milestones")
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(WidgetPalette.text)
                    .lineLimit(1)

                Rectangle()
                    .fill(WidgetPalette.track)
                    .frame(height: 1)

                ForEach(Array(milestones.prefix(visibleCount).enumerated()), id: \.offset) { index, milestone in
                    HStack(spacing: 12) {
                        let color = milestoneColor(milestone.tone)

                        RoundedRectangle(cornerRadius: 7)
                            .stroke(color, lineWidth: 1.5)
                            .background(RoundedRectangle(cornerRadius: 7).fill(color.opacity(0.08)))
                            .overlay(
                                Image(systemName: milestoneSymbol(for: milestone.title))
                                    .font(.system(size: 17, weight: .semibold))
                                    .foregroundColor(color)
                            )
                            .frame(width: 28, height: 28)

                        Text(milestone.title)
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(WidgetPalette.text)
                            .lineLimit(1)
                            .minimumScaleFactor(0.72)

                        Spacer(minLength: 8)

                        VStack(alignment: .trailing, spacing: -1) {
                            Text(milestone.days.formatted())
                                .font(.system(size: 17, weight: .bold))
                                .foregroundColor(color)
                                .lineLimit(1)
                                .minimumScaleFactor(0.75)
                            Text("days")
                                .font(.system(size: 10, weight: .medium))
                                .foregroundColor(WidgetPalette.dim)
                        }
                    }

                    if index < min(milestones.count, visibleCount) - 1 {
                        Rectangle()
                            .fill(WidgetPalette.track.opacity(0.82))
                            .frame(height: 1)
                    }
                }
            }
        }
    }
}

struct LifeLeftGridWidgetView: View {
    var entry: Provider.Entry
    var body: some View { LifeLeftGridCard(entry: entry) }
}

struct LifeArcWidgetView: View {
    var entry: Provider.Entry
    var body: some View { LifeArcCard(entry: entry) }
}

struct TodayLeftWidgetView: View {
    var entry: Provider.Entry
    var body: some View { TodayLeftCard(entry: entry) }
}

struct MilestoneCountdownWidgetView: View {
    var entry: Provider.Entry
    var body: some View { MilestoneCountdownCard(entry: entry) }
}

struct LifeLeftGridWidget: Widget {
    let kind = "LifeLeftGridWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            LifeLeftGridWidgetView(entry: entry).widgetHostBackground()
        }
        .configurationDisplayName("Life Dots")
        .description("Life dots with lived, current, and remaining periods.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

struct LifeArcWidget: Widget {
    let kind = "LifeArcWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            LifeArcWidgetView(entry: entry).widgetHostBackground()
        }
        .configurationDisplayName("Life Arc")
        .description("Age progress and years remaining.")
        .supportedFamilies([.systemSmall])
    }
}

struct TodayLeftWidget: Widget {
    let kind = "TodayLeftWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            TodayLeftWidgetView(entry: entry).widgetHostBackground()
        }
        .configurationDisplayName("Today Left")
        .description("Countdown to midnight with a daily prompt.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

struct MilestoneCountdownWidget: Widget {
    let kind = "MilestoneCountdownWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            MilestoneCountdownWidgetView(entry: entry).widgetHostBackground()
        }
        .configurationDisplayName("Milestones")
        .description("Countdowns to meaningful life milestones.")
        .supportedFamilies([.systemMedium])
    }
}

@main
struct LifePerspectiveWidgets: WidgetBundle {
    var body: some Widget {
        LifeLeftGridWidget()
        LifeArcWidget()
        TodayLeftWidget()
        MilestoneCountdownWidget()
    }
}
