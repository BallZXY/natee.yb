/* =========================================================
   Unique Bangkok — vanilla JS
   Navbar, scroll reveals, interactive 3D map, showcase cards
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 1. Sticky navbar shadow on scroll ---------- */
  var navbar = document.getElementById("navbar");
  function onScroll() {
    if (window.scrollY > 24) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Mobile menu toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  navToggle.addEventListener("click", function () {
    var open = navLinks.classList.toggle("mobile-open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navLinks.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("mobile-open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- 3. Map data ---------- */
  var pins = [
    {
      id: "palace",
      name: "Grand Palace & Wat Phra Kaew",
      type: "attraction",
      category: "Royal Landmark",
      note: "The gilded heart of old Bangkok — spired halls, mirrored mosaics and the revered Emerald Buddha behind glittering walls.",
      hours: "8:30 AM – 3:30 PM",
      height: 88,
      x: 26,
      y: 40,
    },
    {
      id: "arun",
      name: "Wat Arun",
      type: "attraction",
      category: "Riverside Temple",
      note: "The Temple of Dawn rises from the river bend, its porcelain-studded prang catching first and last light.",
      hours: "8:00 AM – 6:00 PM",
      height: 96,
      x: 16,
      y: 58,
    },
    {
      id: "swing",
      name: "Giant Swing (Sao Chingcha)",
      type: "attraction",
      category: "Historic Landmark",
      note: "A towering red teak arch marking centuries of ceremony in the old quarter.",
      hours: "Open 24 hours",
      height: 72,
      x: 42,
      y: 34,
    },
    {
      id: "chatuchak",
      name: "Chatuchak Weekend Market",
      type: "attraction",
      category: "Market",
      note: "Fifteen thousand stalls of vintage, plants, art and everything you did not know you needed.",
      hours: "Sat–Sun 9:00 AM – 6:00 PM",
      height: 46,
      x: 50,
      y: 16,
    },
    {
      id: "nana",
      name: "Nana Coffee Roasters",
      type: "food",
      category: "Specialty Coffee",
      note: "A jungle-wrapped roastery pouring competition-grade single origins in a plant-filled sanctuary.",
      hours: "7:00 AM – 6:00 PM",
      height: 40,
      x: 60,
      y: 30,
    },
    {
      id: "jayfai",
      name: "Jay Fai",
      type: "food",
      category: "Michelin Street Food",
      note: "Goggle-clad Auntie Fai flames her legendary crab omelette over charcoal woks, one order at a time.",
      hours: "9:00 AM – 8:00 PM (Closed Sun–Mon)",
      height: 34,
      x: 48,
      y: 46,
    },
    {
      id: "thipsamai",
      name: "Thipsamai Pad Thai",
      type: "food",
      category: "Iconic Noodles",
      note: "The pad thai institution since 1966 — silky egg-wrapped noodles and fresh orange juice by the queue.",
      hours: "5:00 PM – 12:00 AM",
      height: 30,
      x: 58,
      y: 52,
    },
    {
      id: "yaowarat",
      name: "Yaowarat (Chinatown)",
      type: "food",
      category: "Street Food District",
      note: "After dark the neon signs flare and the whole street becomes an open-air kitchen.",
      hours: "6:00 PM – 12:00 AM",
      height: 58,
      x: 34,
      y: 66,
    },
  ];

  var COLORS = { attraction: "#e0ab48", food: "#f0479f" };

  var mapPlane = document.getElementById("mapPlane");
  var mapPanel = document.getElementById("mapPanel");
  var mapHint = document.getElementById("mapHint");
  var activeId = null;

  function towerStyle(pin, isActive) {
    var accent = COLORS[pin.type];
    var z = isActive ? pin.height + 16 : pin.height;
    return (
      "width:20px;height:20px;transform:translateZ(" +
      z +
      "px);" +
      "background:linear-gradient(135deg," +
      accent +
      ", " +
      accent +
      ");" +
      "box-shadow:0 0 22px " +
      accent +
      (isActive ? "" : "") +
      ",0 " +
      pin.height +
      "px " +
      pin.height / 2 +
      "px -8px rgba(0,0,0,0.4);" +
      "border:1px solid rgba(255,255,255,0.5);"
    );
  }

  function buildPins() {
    pins.forEach(function (pin) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pin";
      btn.style.left = pin.x + "%";
      btn.style.top = pin.y + "%";
      btn.setAttribute("aria-label", pin.name + " — " + pin.category);

      var tower = document.createElement("span");
      tower.className = "pin-tower";
      tower.style.cssText = towerStyle(pin, false);

      var glow = document.createElement("span");
      glow.className = "pin-glow";
      glow.style.width = "24px";
      glow.style.height = "24px";
      glow.style.background = COLORS[pin.type];
      glow.style.opacity = "0.3";

      btn.appendChild(tower);
      btn.appendChild(glow);
      btn._tower = tower;
      btn._glow = glow;
      btn._pin = pin;
      btn.addEventListener("click", function () {
        openPanel(pin.id);
      });
      mapPlane.appendChild(btn);
      pin._btn = btn;
    });
  }

  function refreshPins() {
    pins.forEach(function (pin) {
      var isActive = pin.id === activeId;
      pin._btn._tower.style.cssText = towerStyle(pin, isActive);
      pin._btn._glow.style.width = isActive ? "34px" : "24px";
      pin._btn._glow.style.height = isActive ? "34px" : "24px";
      pin._btn._glow.style.opacity = isActive ? "0.55" : "0.3";
    });
  }

  function clockIcon(color) {
    return (
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="' +
      color +
      '" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>'
    );
  }

  function renderPanel(pin) {
    var accentColor = pin.type === "food" ? "var(--neon-pink)" : "var(--gold)";
    var chips = pins
      .map(function (p) {
        var cls =
          p.id === pin.id
            ? p.type === "food"
              ? "active-food"
              : "active-attraction"
            : "";
        return (
          '<li><button type="button" data-jump="' +
          p.id +
          '" class="' +
          cls +
          '">' +
          p.name.split(" ")[0] +
          "</button></li>"
        );
      })
      .join("");

    mapPanel.innerHTML =
      '<div class="panel-top">' +
      '<span class="panel-cat ' +
      (pin.type === "food" ? "cat-food" : "cat-attraction") +
      '">' +
      pin.category +
      "</span>" +
      '<button type="button" class="panel-close" id="panelClose" aria-label="Close details">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"></path></svg>' +
      "</button>" +
      "</div>" +
      '<div class="panel-img" style="box-shadow:inset 0 0 40px ' +
      accentColor +
      ';">' +
      '<span class="placeholder">' +
      pin.name +
      " — image<br>./images/" +
      pin.id +
      ".png</span>" +
      "</div>" +
      '<h3 class="panel-title">' +
      pin.name +
      "</h3>" +
      '<p class="panel-note">' +
      pin.note +
      "</p>" +
      '<div class="panel-hours">' +
      clockIcon(accentColor) +
      '<div><p class="hours-label">Opening Hours</p><p class="hours-value">' +
      pin.hours +
      "</p></div>" +
      "</div>" +
      '<div class="panel-jump"><p class="jump-label">Jump to</p><ul class="jump-chips">' +
      chips +
      "</ul></div>";

    document.getElementById("panelClose").addEventListener("click", closePanel);
    mapPanel.querySelectorAll("[data-jump]").forEach(function (b) {
      b.addEventListener("click", function () {
        openPanel(b.getAttribute("data-jump"));
      });
    });
  }

  function openPanel(id) {
    activeId = id;
    var pin = pins.find(function (p) {
      return p.id === id;
    });
    if (!pin) return;
    renderPanel(pin);
    mapPanel.classList.add("open");
    mapPanel.setAttribute("aria-hidden", "false");
    mapHint.style.opacity = "0";
    refreshPins();
  }

  function closePanel() {
    activeId = null;
    mapPanel.classList.remove("open");
    mapPanel.setAttribute("aria-hidden", "true");
    mapHint.style.opacity = "1";
    refreshPins();
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && activeId) closePanel();
  });

  buildPins();

  /* ---------- 4. Showcase card data (sections 3–7) ---------- */
  var showcases = [
    {
      id: "ai-image",
      index: "03",
      kicker: "AI Image",
      title: "From tourist snapshot to sci-fi dream",
      description:
        "The same subject, reimagined. We started with a literal Bangkok landscape, then pushed the prompt toward a neon fantasy of flying tuk-tuks and holographic temples.",
      initial: {
        label: "Initial",
        caption:
          "A standard, photoreal Bangkok landscape — accurate but expected. Grand Palace, the river, a clear-sky skyline.",
        src: "./images/bangkok-standard.png",
        alt: "Realistic daytime photo of Bangkok temples and skyline",
      },
      refined: {
        label: "Refined",
        caption:
          'A "Sci-Fi Fantasy Bangkok" — flying tuk-tuks, neon light trails, and cyberpunk temple roofs blending tradition with the future.',
        src: "./images/bangkok-scifi.png",
        alt: "Futuristic neon sci-fi rendering of Bangkok with flying tuk-tuks",
      },
      steps: [
        {
          title: "Baseline prompt",
          detail:
            "Asked for a realistic Bangkok landscape — correct, but visually generic.",
        },
        {
          title: "Add a genre",
          detail:
            'Introduced "sci-fi fantasy" and "cyberpunk" to shift mood and lighting.',
        },
        {
          title: "Add signature detail",
          detail:
            "Specified flying tuk-tuks and neon Thai signage as memorable focal points.",
        },
        {
          title: "Tune the palette",
          detail:
            "Locked in gold + neon pink/cyan to keep the traditional-meets-modern contrast.",
        },
      ],
      bulletsTitle: "What changed",
      bullets: [
        'Concrete nouns ("flying tuk-tuks") beat vague adjectives.',
        "Naming a genre reshaped composition and color instantly.",
        "A fixed palette kept the brand identity coherent.",
        "Iteration, not a single perfect prompt, produced the result.",
      ],
    },
    {
      id: "desmos",
      index: "04",
      kicker: "Desmos",
      title: "Graphing the curve of the Giant Swing",
      description:
        "A math exploration that began with a broken calculus setup and ended with a clean curvature graph modeled on Bangkok\u2019s iconic Sao Chingcha.",
      initial: {
        label: "Initial",
        caption:
          "A basic calculus graph with domain and syntax errors — the equation would not plot correctly.",
        dropPath: "./images/desmos-initial.png",
      },
      refined: {
        label: "Refined",
        caption:
          "A corrected curvature graph tracing the arc of the Giant Swing (Sao Chingcha).",
        dropPath: "./images/desmos-refined.png",
      },
      steps: [
        {
          title: "Define the model",
          detail:
            "Represented the swing\u2019s arc as a parametric curve to study its curvature.",
        },
        {
          title: "Diagnose errors",
          detail:
            "The first attempt failed on domain limits and a malformed derivative.",
        },
        {
          title: "Fix the expression",
          detail:
            "Rewrote the function with correct bounds and the curvature formula.",
        },
        {
          title: "Verify visually",
          detail:
            "Confirmed the plotted curve matched the physical geometry of the landmark.",
        },
      ],
      bulletsTitle: "The math setup",
      bullets: [
        "Curvature measures how sharply a curve bends at each point.",
        "Errors were domain-related, not conceptual.",
        "Clean notation made the graph readable and correct.",
        "Real landmarks make abstract math tangible.",
      ],
    },
    {
      id: "mermaid",
      index: "05",
      kicker: "Mermaid",
      title: "Diagramming Bangkok\u2019s transit web",
      description:
        "From a throwaway flowchart to a full transit map — the MRT Blue Line, BTS, and Airport Rail Link rendered as connected Mermaid nodes.",
      initial: {
        label: "Initial",
        caption:
          "A simple, generic three-node flowchart with no real structure or meaning.",
        dropPath: "./images/mermaid-initial.png",
      },
      refined: {
        label: "Refined",
        caption:
          "A complex transit diagram mapping interchanges between the MRT Blue Line, BTS, and ARL.",
        dropPath: "./images/mermaid-refined.png",
      },
      steps: [
        {
          title: "Pick a direction",
          detail:
            "Switched to graph LR (left-to-right) to mirror a transit map layout.",
        },
        {
          title: "Model the lines",
          detail:
            "Created subgraphs per line so each system reads as its own group.",
        },
        {
          title: "Link interchanges",
          detail:
            "Connected shared stations (e.g. Asok/Sukhumvit) to show transfers.",
        },
        {
          title: "Style by color",
          detail:
            "Applied classDef colors matching each line\u2019s real-world branding.",
        },
      ],
      bulletsTitle: "Reading the code",
      bullets: [
        "Subgraphs keep each transit line visually distinct.",
        "Edges encode real interchange stations.",
        "classDef mirrors official line colors.",
        "Structure emerges from clear node naming.",
      ],
    },
    {
      id: "latex",
      index: "06",
      kicker: "LaTeX",
      title: "Typesetting a polished article",
      description:
        'Raw markup refined into a professionally compiled document titled "Exploring Bangkok: The City of Angels".',
      initial: {
        label: "Initial",
        caption:
          "Basic LaTeX source — a bare document class with unstyled, unstructured text.",
        dropPath: "./images/latex-initial.png",
      },
      refined: {
        label: "Refined",
        caption:
          "The compiled article with title block, sections, figures, and clean two-column typography.",
        dropPath: "./images/latex-refined.png",
      },
      steps: [
        {
          title: "Set the class",
          detail:
            "Chose an article class with a proper title, author, and abstract block.",
        },
        {
          title: "Add structure",
          detail:
            "Broke content into sections and subsections for a logical flow.",
        },
        {
          title: "Insert figures",
          detail:
            "Placed figures with captions and labels for cross-referencing.",
        },
        {
          title: "Compile & refine",
          detail:
            "Adjusted spacing and columns until the output read like a journal piece.",
        },
      ],
      bulletsTitle: "Formatting summary",
      bullets: [
        "Document class defines the entire visual system.",
        "Sectioning commands create automatic hierarchy.",
        "Figures and labels enable clean cross-references.",
        "Compilation turns markup into publication-grade output.",
      ],
    },
    {
      id: "notebooklm",
      index: "07",
      kicker: "NotebookLM",
      title: "From description to strategic analysis",
      description:
        "Feeding sources into NotebookLM, we moved from a descriptive overview of Bangkok to an analytical breakdown of conflicts, trade-offs, and future directions.",
      initial: {
        label: "Initial",
        caption:
          "A descriptive overview — a factual blueprint summarizing what Bangkok is (descriptive data).",
        dropPath: "./images/notebooklm-initial.png",
      },
      refined: {
        label: "Refined",
        caption:
          "A strategic analysis slide outlining conflicts, pros/cons, and future directions (analytical data).",
        dropPath: "./images/notebooklm-refined.png",
      },
      steps: [
        {
          title: "Load the sources",
          detail:
            "Uploaded research notes so the model grounded answers in real material.",
        },
        {
          title: "Summarize first",
          detail:
            "Generated a descriptive overview to establish shared context.",
        },
        {
          title: "Shift the question",
          detail:
            "Asked for tensions and trade-offs instead of facts to force analysis.",
        },
        {
          title: "Structure the output",
          detail:
            "Organized findings into conflicts, pros/cons, and future directions.",
        },
      ],
      bulletsTitle: "The analytical process",
      bullets: [
        "Descriptive answers state facts; analytical answers weigh them.",
        "The prompt\u2019s framing determines the depth of insight.",
        "Grounding in sources keeps analysis credible.",
        "Structure turns raw AI output into a decision tool.",
      ],
    },
  ];

  var IMG_ICON =
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
    '<path d="M4 16l4.5-4.5a2 2 0 0 1 2.8 0L16 16m-2-2 1.5-1.5a2 2 0 0 1 2.8 0L20 14M4 6h16v12H4z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

  function frameHTML(frame, tone) {
    var badge = tone === "accent" ? "badge-gold" : "badge-muted";
    var boxClass = tone === "accent" ? "frame-box accent" : "frame-box";
    var inner;
    if (frame.src) {
      inner =
        '<img src="' +
        frame.src +
        '" alt="' +
        (frame.alt || frame.caption) +
        '" />';
    } else {
      inner =
        '<div class="frame-empty"><div class="icon">' +
        IMG_ICON +
        "</div>" +
        "<p>Screenshot slot</p>" +
        (frame.dropPath ? "<code>" + frame.dropPath + "</code>" : "") +
        "</div>";
    }
    return (
      '<figure class="frame">' +
      '<div class="' +
      boxClass +
      '"><span class="frame-badge ' +
      badge +
      '">' +
      frame.label +
      "</span>" +
      inner +
      "</div>" +
      "<figcaption>" +
      frame.caption +
      "</figcaption>" +
      "</figure>"
    );
  }

  function showcaseHTML(s) {
    var stepsHTML = s.steps
      .map(function (step, i) {
        return (
          '<li><span class="step-num">' +
          (i + 1) +
          "</span>" +
          '<div class="step-body"><strong>' +
          step.title +
          "</strong><span>" +
          step.detail +
          "</span></div></li>"
        );
      })
      .join("");

    var bulletsHTML = s.bullets
      .map(function (b) {
        return "<li>" + b + "</li>";
      })
      .join("");

    return (
      '<section id="' +
      s.id +
      '" class="section">' +
      '<div class="container">' +
      '<div class="section-heading">' +
      '<div class="heading-kicker reveal"><span class="rule"></span><span>' +
      s.index +
      " · " +
      s.kicker +
      '</span><span class="rule"></span></div>' +
      '<h2 class="reveal" data-delay="1">' +
      s.title +
      "</h2>" +
      '<p class="reveal" data-delay="2">' +
      s.description +
      "</p>" +
      "</div>" +
      '<div class="showcase-grid">' +
      '<div class="reveal">' +
      frameHTML(s.initial, "muted") +
      "</div>" +
      '<div class="reveal" data-delay="1">' +
      frameHTML(s.refined, "accent") +
      "</div>" +
      "</div>" +
      '<div class="showcase-lower">' +
      '<div class="reveal"><div class="panel-card"><h3>Prompt evolution &amp; process</h3><ol class="steps">' +
      stepsHTML +
      "</ol></div></div>" +
      '<div class="reveal" data-delay="1"><div class="takeaways"><h3>' +
      s.bulletsTitle +
      "</h3><ul>" +
      bulletsHTML +
      "</ul></div></div>" +
      "</div>" +
      "</div>" +
      "</section>"
    );
  }

  document.getElementById("showcases").innerHTML = showcases
    .map(showcaseHTML)
    .join("");

  /* ---------- 5. Scroll reveal via IntersectionObserver ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- 6. Presentation button — open in new tab if embedded ---------- */
  var pdfBtn = document.getElementById("pdfBtn");
  if (pdfBtn) {
    pdfBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.open("./AI.pdf", "_blank", "noopener,noreferrer");
    });
  }
})();
