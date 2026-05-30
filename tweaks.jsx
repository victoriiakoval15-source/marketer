// tweaks.jsx — Tweaks panel for Victoria Koval landing page.
// Drives CSS custom properties on :root so the vanilla HTML reflows live.

const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "sunny-rose",
  "displayFont": "Instrument Serif",
  "radius": 22,
  "stickers": true,
  "marquee": true
}/*EDITMODE-END*/;

// curated yellow + pink palettes
const PALETTES = {
  "sunny-rose": { cream: "#FDF4DC", creamDeep: "#FAE9BE", pink: "#EB7C9A", pinkDeep: "#D84874", pinkSoft: "#FBE0E6", yellow: "#F6C84C" },
  "peony":      { cream: "#FDEFE6", creamDeep: "#FADFD0", pink: "#E96A93", pinkDeep: "#C8366A", pinkSoft: "#FAD9E2", yellow: "#F4B65E" },
  "lemonade":   { cream: "#FCF6D4", creamDeep: "#F7EAA8", pink: "#F08DA6", pinkDeep: "#DC5C82", pinkSoft: "#FCE4E9", yellow: "#F2C73E" },
};

const FONT_STACK = {
  "Instrument Serif": "'Instrument Serif', Georgia, serif",
  "Playfair Display": "'Playfair Display', Georgia, serif",
  "Hanken Grotesk":   "'Hanken Grotesk', system-ui, sans-serif",
};

// ensure Playfair is available when chosen
function ensureFont(name) {
  if (name === "Playfair Display" && !document.getElementById("pf-font")) {
    const l = document.createElement("link");
    l.id = "pf-font";
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..800;1,400..700&display=swap";
    document.head.appendChild(l);
  }
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    const r = document.documentElement.style;
    const p = PALETTES[t.palette] || PALETTES["sunny-rose"];
    r.setProperty("--cream", p.cream);
    r.setProperty("--cream-deep", p.creamDeep);
    r.setProperty("--pink", p.pink);
    r.setProperty("--pink-deep", p.pinkDeep);
    r.setProperty("--pink-soft", p.pinkSoft);
    r.setProperty("--yellow", p.yellow);
  }, [t.palette]);

  useEffect(() => {
    ensureFont(t.displayFont);
    document.documentElement.style.setProperty("--serif", FONT_STACK[t.displayFont] || FONT_STACK["Instrument Serif"]);
  }, [t.displayFont]);

  useEffect(() => {
    document.documentElement.style.setProperty("--radius", t.radius + "px");
  }, [t.radius]);

  useEffect(() => {
    document.querySelectorAll(".sticker").forEach((s) => {
      s.style.display = t.stickers ? "" : "none";
    });
  }, [t.stickers]);

  useEffect(() => {
    const band = document.querySelector(".marquee-band");
    if (band) band.style.display = t.marquee ? "" : "none";
  }, [t.marquee]);

  return (
    <TweaksPanel>
      <TweakSection label="Color theme" />
      <TweakColor
        label="Palette"
        value={PALETTES[t.palette] ? [PALETTES[t.palette].yellow, PALETTES[t.palette].pink, PALETTES[t.palette].pinkDeep] : []}
        options={Object.keys(PALETTES).map((k) => [PALETTES[k].yellow, PALETTES[k].pink, PALETTES[k].pinkDeep])}
        onChange={(arr) => {
          const key = Object.keys(PALETTES).find((k) => PALETTES[k].pink === arr[1]) || "sunny-rose";
          setTweak("palette", key);
        }}
      />

      <TweakSection label="Typography" />
      <TweakSelect
        label="Display font"
        value={t.displayFont}
        options={["Instrument Serif", "Playfair Display", "Hanken Grotesk"]}
        onChange={(v) => setTweak("displayFont", v)}
      />

      <TweakSection label="Shape" />
      <TweakSlider label="Corner radius" value={t.radius} min={6} max={36} unit="px" onChange={(v) => setTweak("radius", v)} />

      <TweakSection label="Personality" />
      <TweakToggle label="Floating stickers" value={t.stickers} onChange={(v) => setTweak("stickers", v)} />
      <TweakToggle label="Services marquee" value={t.marquee} onChange={(v) => setTweak("marquee", v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<App />);
