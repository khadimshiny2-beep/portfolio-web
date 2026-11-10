"use strict";
/* Sécurité : contenu externe inséré via textContent uniquement ; URLs validées ; aucun innerHTML. */
const $ = (s) => document.querySelector(s);
const mk = (t, c, x) => {
  const e = document.createElement(t);
  if (c) e.className = c;
  if (x) e.textContent = x;
  return e;
};
const USER = "khadimshiny2-beep",
  KEY = "gh-repos-v2",
  TTL = 6e5;
/* Dépôts épinglés sur github.com/khadimshiny2-beep, dans l'ordre d'affichage.
   shortcut: l'API REST publique n'expose pas les épinglés, donc liste maintenue à la main, à mettre à jour si les épingles changent. */
const PINNED = [
  "portfolio-web",
  "Project_survey",
  "Project_Python1_LDIA",
  "Cool-python-stuff",
  "Nix-Config",
];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* Révélation au défilement (décoratif : sans JS le contenu reste visible) */
if (!reduce && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
    { rootMargin: "0px 0px -8% 0px" },
  );
  document.querySelectorAll("main > *").forEach((el) => {
    if (el.getBoundingClientRect().top > innerHeight * 0.92) {
      el.classList.add("reveal");
      io.observe(el);
    }
  });
}

/* Horloge (accueil) */
const clk = $("#clk");
if (clk) {
  const t = () => {
    clk.textContent = new Date().toISOString().slice(11, 19);
  };
  t();
  setInterval(t, 1000);
}

/* Machine à écrire (accueil) */
const tw = $("#tw");
if (tw)
  (async () => {
    const lines = [
      "Linux enjoyer & CLI warrior",
      "Data Analyst Junior",
      "Website Maker",
      "Aspiring Cybersecurity 'expert'",
      "'just one more rice before I sleep'",
      "'still not fully connected'",
    ];
    if (reduce) {
      tw.textContent = lines[0];
      return;
    }
    await sleep(2600);
    for (let i = 0; ; i = (i + 1) % lines.length) {
      for (const ch of lines[i]) {
        tw.textContent += ch;
        await sleep(55);
      }
      await sleep(1800);
      while (tw.textContent) {
        tw.textContent = tw.textContent.slice(0, -1);
        await sleep(25);
      }
      await sleep(300);
    }
  })();

/* Image Lain optionnelle : images/lain.png */
const lain = $("#lain");
if (lain) {
  if (lain.complete && lain.naturalWidth) lain.hidden = false;
  lain.addEventListener("load", () => {
    lain.hidden = false;
  });
  lain.addEventListener("error", () => lain.remove());
}

/* Email assemblé côté client (anti-scraping basique) */
const addr = ["khadimparsine2", "gmail.com"].join("@");
const mail = $("#mail");
if (mail) {
  mail.href = "mailto:" + addr;
  mail.textContent = addr;
}

/* Projets GitHub */
const repos = $("#repos");
if (repos) {
  const FALLBACK = [
    {
      name: "portfolio-web",
      desc: "Mon portfolio (français).",
      lang: "HTML",
      stars: 2,
      url: "https://github.com/khadimshiny2-beep/portfolio-web",
      date: "",
    },
    {
      name: "Project_survey",
      desc: "Projet d'algèbre linéaire donné par mon université.",
      lang: "Jupyter Notebook",
      stars: 1,
      url: "https://github.com/khadimshiny2-beep/Project_survey",
      date: "",
    },
    {
      name: "Cool-python-stuff",
      desc: "Petits projets Python intéressants trouvés en ligne.",
      lang: "Python",
      stars: 1,
      url: "https://github.com/khadimshiny2-beep/Cool-python-stuff",
      date: "",
    },
    {
      name: "Nix-Config",
      desc: "Ma configuration Nix.",
      lang: "Nix",
      stars: 1,
      url: "https://github.com/khadimshiny2-beep/Nix-Config",
      date: "",
    },
    {
      name: "Project_Python1_LDIA",
      desc: "Prétraitement et nettoyage de données médicales en Python pur.",
      lang: "Python",
      stars: 2,
      url: "https://github.com/khadimshiny2-beep/Project_Python1_LDIA",
      date: "",
    },
  ];
  const valid = (u) => {
    try {
      const x = new URL(u);
      return (
        x.protocol === "https:" &&
        x.hostname === "github.com" &&
        x.pathname.startsWith("/" + USER + "/")
      );
    } catch {
      return false;
    }
  };
  const load = async () => {
    try {
      const c = JSON.parse(sessionStorage.getItem(KEY) || "null");
      if (c && Array.isArray(c.d) && Date.now() - c.t < TTL) return c.d;
    } catch {}
    const res = await fetch(
      "https://api.github.com/users/" +
        USER +
        "/repos?sort=pushed&per_page=100",
      {
        headers: { Accept: "application/vnd.github+json" },
        referrerPolicy: "no-referrer",
        credentials: "omit",
      },
    );
    if (!res.ok) throw new Error("http " + res.status);
    const raw = await res.json();
    if (!Array.isArray(raw)) throw new Error("format");
    const d = PINNED.map((n) => raw.find((r) => r.name === n))
      .filter(Boolean)
      .map((r) => ({
        name: String(r.name).slice(0, 60),
        desc: String(r.description || "").slice(0, 160),
        lang: String(r.language || "").slice(0, 24),
        stars: Number(r.stargazers_count) || 0,
        url: String(r.html_url),
        date: String(r.pushed_at || "").slice(0, 10),
      }));
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now(), d }));
    } catch {}
    return d;
  };
  const render = (list, live) => {
    repos.textContent = "";
    list
      .filter((r) => valid(r.url))
      .forEach((r) => {
        const a = mk("a", "card");
        a.href = r.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        const m = mk("div", "meta");
        m.append(
          mk("span", 0, r.lang || "n/a"),
          mk("span", 0, "★ " + r.stars + (r.date ? " · " + r.date : "")),
        );
        a.append(
          mk("h3", 0, r.name),
          mk("p", 0, r.desc || "Pas de description."),
          m,
        );
        repos.append(a);
      });
    $("#st").textContent = live
      ? "signal : GitHub en direct"
      : "signal perdu : données locales";
  };
  load()
    .then((d) => render(d.length ? d : FALLBACK, d.length > 0))
    .catch(() => render(FALLBACK, false));
}

/* Formulaire de contact : ouvre le client mail (aucune donnée envoyée à un tiers) */
const f = $("#f");
if (f)
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = $("#msg"),
      v = (n) => f.elements[n].value.trim();
    const ok =
      ["nom", "prenom", "email", "sujet", "message"].every((n) => v(n)) &&
      f.elements.email.checkValidity();
    msg.className = ok ? "" : "err";
    if (!ok) {
      msg.textContent =
        "Remplissez tous les champs avec une adresse e-mail valide.";
      return;
    }
    const subject = "[Portfolio] " + v("sujet").replace(/[\r\n]+/g, " ");
    const body =
      v("message") + "\n\n" + v("prenom") + " " + v("nom") + "\n" + v("email");
    location.href =
      "mailto:" +
      addr +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body);
    msg.textContent =
      "Votre application mail va s'ouvrir. Il ne reste qu'à envoyer.";
  });
