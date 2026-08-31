/* =========================================================
   Muhammad Muzamil — Portfolio
   Vanilla JS: nav, reveal, cursor, magnetic, form
   ========================================================= */
(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $  = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  /* ---------- Year ---------- */
  const yearEl = $("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Scroll-driven UI (nav state + progress), one rAF loop ---------- */
  const nav = $("[data-nav]");
  const progress = $(".scroll-progress");
  let scrollTicking = false;
  const onScroll = () => {
    const de = document.documentElement;
    if (nav) nav.classList.toggle("is-scrolled", de.scrollTop > 24);
    if (progress) {
      const max = de.scrollHeight - de.clientHeight;
      const pct = max > 0 ? (de.scrollTop / max) * 100 : 0;
      progress.style.setProperty("--progress", pct.toFixed(2) + "%");
    }
    scrollTicking = false;
  };
  const requestScroll = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(onScroll);
  };
  onScroll();
  window.addEventListener("scroll", requestScroll, { passive: true });
  window.addEventListener("resize", requestScroll);

  /* ---------- Mobile menu ---------- */
  const toggle = $("[data-nav-toggle]");
  const menu = $("[data-menu]");
  const setMenu = (open) => {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  };
  if (toggle && menu) {
    toggle.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
    $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) setMenu(false);
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 860 && menu.classList.contains("is-open")) setMenu(false);
    });
  }

  /* ---------- Active section highlighting ---------- */
  const navLinks = $$("[data-navlink]");
  const sections = navLinks
    .map((l) => document.getElementById(l.getAttribute("href").slice(1)))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((l) =>
              l.classList.toggle("is-active", l.getAttribute("href") === "#" + id)
            );
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Stagger delay for grouped reveals ---------- */
  $$("[data-reveal-group]").forEach((group) => {
    const kids = $$(":scope > [data-reveal]", group);
    kids.forEach((el, i) => el.style.setProperty("--rd", Math.min(i * 70, 350) + "ms"));
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$("[data-reveal], [data-reveal-stagger]");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-in"));
  } else {
    const revealObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );
    revealEls.forEach((el) => revealObs.observe(el));
  }

  /* ---------- Intro preloader → hero reveal ---------- */
  const hero = $(".hero");
  const startHero = () => {
    if (hero) requestAnimationFrame(() => hero.classList.add("is-loaded"));
  };

  const preloader = $("[data-preloader]");
  let seen = false;
  try { seen = sessionStorage.getItem("mm_seen") === "1"; } catch (_) {}

  if (!preloader || prefersReduced || seen) {
    if (preloader) preloader.remove();
    startHero();
  } else {
    document.body.classList.add("is-loading");
    const fill = $("[data-preload-fill]", preloader);
    const pctEl = $("[data-preload-pct]", preloader);
    const t0 = performance.now();
    const dur = 750;
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const v = Math.round(p * 100);
      if (fill) fill.style.width = v + "%";
      if (pctEl) pctEl.textContent = v;
      if (p < 1) { requestAnimationFrame(tick); return; }
      preloader.classList.add("is-done");
      document.body.classList.remove("is-loading");
      try { sessionStorage.setItem("mm_seen", "1"); } catch (_) {}
      startHero();
      setTimeout(() => preloader.remove(), 650);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- Hero glow follows pointer ---------- */
  const glow = $("[data-hero-glow]");
  if (glow && hero && isFinePointer && !prefersReduced) {
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      glow.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
      glow.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
    });
  }

  /* ---------- Count-up stats ---------- */
  const counters = $$("[data-count]");
  if (counters.length && !prefersReduced && "IntersectionObserver" in window) {
    const countObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || "";
          const dur = 1100;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.unobserve(el);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => countObs.observe(c));
  }

  /* ---------- Custom cursor ---------- */
  const cursor = $("[data-cursor]");
  if (cursor && isFinePointer && !prefersReduced) {
    document.body.classList.add("has-cursor");
    const dot = $(".cursor__dot", cursor);
    const ring = $(".cursor__ring", cursor);
    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener("pointermove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();

    const hoverSel = "a, button, input, textarea, [data-magnetic]";
    document.addEventListener("pointerover", (e) => {
      if (e.target.closest("[data-cursor-view]")) cursor.classList.add("is-view");
      else if (e.target.closest(hoverSel)) cursor.classList.add("is-hover");
    });
    document.addEventListener("pointerout", (e) => {
      if (e.target.closest("[data-cursor-view]")) cursor.classList.remove("is-view");
      if (e.target.closest(hoverSel)) cursor.classList.remove("is-hover");
    });
    document.addEventListener("pointerdown", () => cursor.classList.add("is-down"));
    document.addEventListener("pointerup", () => cursor.classList.remove("is-down"));
    document.addEventListener("mouseleave", () => (cursor.style.opacity = "0"));
    document.addEventListener("mouseenter", () => (cursor.style.opacity = "1"));
  }

  /* ---------- Magnetic buttons ---------- */
  if (isFinePointer && !prefersReduced) {
    $$("[data-magnetic]").forEach((el) => {
      const strength = 0.28;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * strength;
        const y = (e.clientY - r.top - r.height / 2) * strength;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* ---------- Portrait tilt ---------- */
  const tilt = $("[data-tilt]");
  if (tilt && isFinePointer && !prefersReduced) {
    tilt.addEventListener("pointermove", (e) => {
      const r = tilt.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${py * -6}deg)`;
    });
    tilt.addEventListener("pointerleave", () => {
      tilt.style.transform = "";
    });
  }

  /* ---------- Neutralise placeholder links (href="#") ---------- */
  $$('a[href="#"]').forEach((a) => {
    a.addEventListener("click", (e) => e.preventDefault());
  });

  /* ---------- Command menu (⌘K / Ctrl K) ---------- */
  const cmdk = $("[data-cmdk]");
  if (cmdk) {
    const input = $("[data-cmdk-input]", cmdk);
    const listEl = $("[data-cmdk-list]", cmdk);
    const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || "");
    $$("[data-kbd-mod]").forEach((k) => (k.textContent = isMac ? "⌘" : "Ctrl"));

    const I = {
      go: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      dl: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      mail: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" stroke-width="2"/><path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
      ext: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M7 17 17 7M17 7H8m9 0v9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    };

    let lastFocus = null;
    const scrollTo = (sel) => {
      close();
      const t = document.querySelector(sel);
      if (t) t.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    };
    const openURL = (url) => { close(); window.open(url, "_blank", "noopener"); };
    const copyEmail = () => {
      const email = "malikmuzamil3889@gmail.com";
      if (navigator.clipboard) navigator.clipboard.writeText(email).catch(() => {});
      close();
    };

    const actions = [
      { label: "Go to About", hint: "01", icon: I.go, run: () => scrollTo("#about") },
      { label: "Go to Skills", hint: "02", icon: I.go, run: () => scrollTo("#skills") },
      { label: "Go to Experience", hint: "03", icon: I.go, run: () => scrollTo("#experience") },
      { label: "Go to Projects", hint: "04", icon: I.go, run: () => scrollTo("#projects") },
      { label: "Go to Services", hint: "05", icon: I.go, run: () => scrollTo("#services") },
      { label: "Go to Contact", hint: "06", icon: I.go, run: () => scrollTo("#contact") },
      { label: "Download résumé (PDF)", icon: I.dl, run: () => openURL("assets/docs/Muhammad_Muzamil_CV.pdf") },
      { label: "Copy email address", icon: I.mail, run: copyEmail },
      { label: "Send a message", icon: I.mail, run: () => scrollTo("#contact") },
      { label: "View Medium Clone source", icon: I.ext, run: () => openURL("https://github.com/MuhammadMuzamil514/Medium-Clone-") },
      { label: "Open GitHub", icon: I.ext, run: () => openURL("https://github.com/MuhammadMuzamil514") },
      { label: "Open LinkedIn", icon: I.ext, run: () => openURL("https://www.linkedin.com/in/muhammad-muzamil-16404b3ba") },
    ];

    let shown = actions.slice();
    let sel = 0;

    const render = () => {
      sel = 0;
      if (!shown.length) {
        listEl.innerHTML = '<li class="cmdk__empty">No matching commands</li>';
        return;
      }
      listEl.innerHTML = shown
        .map(
          (a, i) =>
            `<li class="cmdk__item" role="option" data-i="${i}" aria-selected="${i === 0}">${a.icon}<span>${a.label}</span>${a.hint ? `<span class="cmdk__hint">${a.hint}</span>` : ""}</li>`
        )
        .join("");
    };
    const move = (dir) => {
      const items = $$(".cmdk__item", listEl);
      if (!items.length) return;
      sel = (sel + dir + items.length) % items.length;
      items.forEach((el, i) => el.setAttribute("aria-selected", String(i === sel)));
      items[sel].scrollIntoView({ block: "nearest" });
    };
    const open = () => {
      lastFocus = document.activeElement;
      cmdk.hidden = false;
      document.body.style.overflow = "hidden";
      input.value = "";
      shown = actions.slice();
      render();
      input.focus();
    };
    function close() {
      if (cmdk.hidden) return;
      cmdk.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      shown = q ? actions.filter((a) => a.label.toLowerCase().includes(q)) : actions.slice();
      render();
    });
    cmdk.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
      else if (e.key === "Enter") { e.preventDefault(); if (shown[sel]) shown[sel].run(); }
      else if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "Tab") { e.preventDefault(); input.focus(); }
    });
    listEl.addEventListener("click", (e) => {
      const li = e.target.closest(".cmdk__item");
      if (li && shown[+li.dataset.i]) shown[+li.dataset.i].run();
    });
    listEl.addEventListener("pointermove", (e) => {
      const li = e.target.closest(".cmdk__item");
      if (!li) return;
      const i = +li.dataset.i;
      if (i === sel) return;
      sel = i;
      $$(".cmdk__item", listEl).forEach((el, n) => el.setAttribute("aria-selected", String(n === sel)));
    });
    $("[data-cmdk-close]", cmdk).addEventListener("click", close);
    $$("[data-cmdk-open]").forEach((b) => b.addEventListener("click", open));
    window.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        cmdk.hidden ? open() : close();
      } else if (
        e.key === "/" &&
        cmdk.hidden &&
        !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName || "")
      ) {
        e.preventDefault();
        open();
      }
    });
  }

  /* ---------- Back to top ---------- */
  const topBtn = $("[data-scroll-top]");
  if (topBtn) {
    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    });
  }

  /* ---------- Contact form (no-backend fallback) ----------
     If the <form> has a real `action` (e.g. a Formspree URL), let it submit
     normally. Otherwise, compose a mailto: link so the message is never lost. */
  const form = $("[data-contact-form]");
  const status = $("[data-form-status]");
  if (form) {
    form.addEventListener("submit", (e) => {
      const hasEndpoint = form.getAttribute("action") && /^https?:/i.test(form.getAttribute("action"));
      if (hasEndpoint) return; // native submit to real endpoint

      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const data = new FormData(form);
      const name = (data.get("name") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const subject = (data.get("subject") || "").toString().trim();
      const message = (data.get("message") || "").toString().trim();

      const body = `Hi Muzamil,%0D%0A%0D%0A${encodeURIComponent(message)}%0D%0A%0D%0A— ${encodeURIComponent(name)} (${encodeURIComponent(email)})`;
      const href = `mailto:malikmuzamil3889@gmail.com?subject=${encodeURIComponent(subject || "Portfolio enquiry")}&body=${body}`;

      window.location.href = href;

      if (status) {
        status.textContent = "Opening your email app… if nothing happens, email malikmuzamil3889@gmail.com directly.";
        status.className = "contact__status is-ok";
      }
      form.reset();
    });
  }
})();
