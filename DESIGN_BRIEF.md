# Design Brief — Masjid Aisyah Lawata

Research from 6 well-regarded mosque / Islamic-center sites (Cambridge Central
Mosque, East London Mosque, Sultan Mosque SG, ADAMS Center, Islamic Center of
Southern California, and the Masjidbox/Masjidal prayer-widget conventions).
Distilled to what we apply here — no over-engineering.

## What the best sites do
- **Prayer times are "today-first" and always reachable** — a calm horizontal
  row of prayer cards with the next prayer highlighted + a countdown; often a
  thin sticky next-prayer bar. (Cambridge, the widget ecosystem.)
- **Architecture-forward, mostly-neutral aesthetic** — cream/white dominates,
  one structural dark color, a single sparing accent. Gold/green used only for
  highlights and CTAs. (Cambridge's whites/greys + one accent is the template.)
- **A "quick-paths" triad right after the hero** — About / Plan Your Visit /
  Support as three icon entry points before the long sections. (Cambridge,
  ADAMS, ICSC.)
- **Predictable section order** ending on donation + map/contact.
- **Serif display + sans body** — display serif for hero/headings, clean sans
  for body and especially numerals. (Matches our Cormorant + Plus Jakarta Sans.)
- **Mobile = slide-out drawer nav**, all grids collapse to 1–2 columns, prayer
  info stays reachable.

## 5 Takeaways we apply
1. **Prayer times as their own calm band right under the hero**, with the
   next-prayer highlighted in gold and a live countdown — already our centerpiece;
   keep it prominent and ensure it wraps to a 2-col grid on mobile.
2. **Restraint with color** — let cream dominate, deep-teal anchor structure,
   gold reserved for the next-prayer highlight, dividers, and CTAs. Avoid
   saturating sections.
3. **Facilities as a clean icon grid** (4-col desktop → 2-col mobile), neutral
   icons, short labels, no dense numbers — scannable and "quiet-luxury."
4. **Section order**: Hero → Prayer Times → About → Activities → Schedule →
   Facilities → Gallery → Donation → Location → Contact (front-loads worship +
   orientation, ends on support + visit). Keep as-is; it already matches.
5. **Mobile drawer nav + comfortable tap targets**, hero text legible at 360px,
   prayer grid → 2 cols, schedule → stacked cards, gallery → swipeable carousel,
   honour `prefers-reduced-motion`.
