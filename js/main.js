// Renders the portfolio from /data/profile.json.
(function () {
  "use strict";

  function el(tag, attrs, text) {
    const node = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    if (text != null) node.textContent = text;
    return node;
  }

  // Small inline icons for the hero's "Follow me" row; unknown sites get a generic link icon.
  const ICONS = {
    github: '<svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.886v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z"/></svg>',
    email: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></g></svg>',
    link: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1 1"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1-1"/></g></svg>',
  };
  function socialIcon(link) {
    if (link.url.startsWith("mailto:")) return ICONS.email;
    if (/github\.com/i.test(link.url)) return ICONS.github;
    if (/tiktok\.com/i.test(link.url)) return ICONS.tiktok;
    if (/\/\/(www\.)?(x|twitter)\.com/i.test(link.url)) return ICONS.x;
    if (/facebook\.com|fb\.com/i.test(link.url)) return ICONS.facebook;
    return ICONS.link;
  }

  function render(p) {
    document.title = p.name ? `${p.name} — ${p.role || "Portfolio"}` : "Portfolio";
    document.querySelectorAll("[data-field]").forEach((node) => {
      const value = p[node.dataset.field];
      if (value) node.textContent = value;
    });

    // Skills are groups ({ group, column, items }). "middle" groups show as logo tiles,
    // "right" groups as a list in the side panel. A plain string list still works as one group.
    const groups = (p.skills || []).some((s) => typeof s === "string")
      ? [{ group: "Skills", items: p.skills.filter((s) => typeof s === "string") }]
      : p.skills || [];
    const icons = window.SKILL_ICONS || {};
    const skillGroup = (g) => {
      const items = g.items || [];
      const block = el("section", { class: "skill-group" });
      const head = el("header", { class: "skill-group-head" });
      head.append(el("h3", null, g.group || "Skills"), el("span", { class: "skill-count" }, String(items.length)));
      const list = el("ul", { class: "skill-list" });
      list.append(
        ...items.map((name) => {
          const svg = icons[name.toLowerCase()];
          const icon = el("span", { class: `skill-icon${svg && !svg.includes("stroke=") ? " is-brand" : ""}`, "aria-hidden": "true" });
          if (svg) icon.innerHTML = svg;
          else icon.textContent = name.charAt(0).toUpperCase(); // no icon yet: show the initial
          const li = el("li", { class: "skill" });
          li.append(icon, el("span", { class: "skill-name" }, name));
          return li;
        })
      );
      block.append(head, list);
      return block;
    };
    document.getElementById("skills-tech").replaceChildren(...groups.filter((g) => g.column !== "right").map(skillGroup));
    document.getElementById("skills-practice").replaceChildren(...groups.filter((g) => g.column === "right").map(skillGroup));

    const total = groups.reduce((n, g) => n + (g.items || []).length, 0);
    const stats = document.getElementById("skills-stats");
    stats.replaceChildren(
      ...[[total, "Skills"], [groups.length, "Areas"]].map(([value, label]) => {
        const row = el("div");
        row.append(el("dt", null, label), el("dd", null, String(value))); // CSS shows the number first
        return row;
      })
    );

    // Keep each word of the hero role whole, so "Full-stack" never breaks at its hyphen.
    const role = document.querySelector(".hero-role");
    if (role && p.role) {
      const words = p.role.split(/\s+/).map((w) => el("span", { class: "nowrap" }, w));
      role.replaceChildren(...words.flatMap((w, i) => (i ? [" ", w] : [w])));
    }

    const social = document.getElementById("social-links");
    if (social) {
      social.replaceChildren(
        ...(p.links || []).map((l) => {
          const li = el("li");
          const a = el("a", { href: l.url, "aria-label": l.label, title: l.label });
          if (!l.url.startsWith("mailto:")) Object.assign(a, { target: "_blank", rel: "noopener" });
          a.innerHTML = socialIcon(l);
          li.append(a);
          return li;
        })
      );
    }

    // The big hero name is split into first name and the rest (two layered lines).
    if (p.name) {
      const [first, ...rest] = p.name.trim().split(/\s+/);
      document.querySelectorAll('[data-name-part="first"]').forEach((n) => (n.textContent = first));
      document.querySelectorAll('[data-name-part="last"]').forEach((n) => (n.textContent = rest.join(" ")));
      const photo = document.querySelector(".hero-figure");
      if (photo) photo.alt = `Portrait of ${p.name}`;
    }

    const projects = document.getElementById("project-list");
    projects.replaceChildren(
      ...(p.projects || []).map((proj) => {
        const card = el("article", { class: "project-card" });
        if (proj.image?.src) {
          card.append(
            el("img", {
              class: "project-cover",
              src: proj.image.src,
              ...(proj.image.srcset && { srcset: proj.image.srcset, sizes: "(max-width: 760px) 100vw, 600px" }),
              width: "1600",
              height: "1200",
              alt: proj.image.alt || `${proj.name} screenshots`,
              loading: "lazy",
              decoding: "async",
            })
          );
        }
        if (proj.type) card.append(el("p", { class: "project-type" }, proj.type));
        card.append(el("h3", null, proj.name), el("p", null, proj.description));
        if (proj.highlights?.length) {
          const list = el("ul", { class: "highlights" });
          proj.highlights.forEach((h) => list.append(el("li", null, h)));
          card.append(list);
        }
        if (proj.tech?.length) {
          const tech = el("ul", { class: "tech", "aria-label": "Technologies" });
          proj.tech.forEach((t) => tech.append(el("li", null, t)));
          card.append(tech);
        }
        const links = [];
        if (proj.liveUrl) links.push(el("a", { class: "card-link", href: proj.liveUrl, target: "_blank", rel: "noopener" }, "Visit live site ↗"));
        if (proj.url) links.push(el("a", { class: "card-link", href: proj.url, target: "_blank", rel: "noopener" }, "View on GitHub →"));
        if (links.length) {
          const row = el("div", { class: "card-links" });
          row.append(...links);
          card.append(row);
        }
        return card;
      })
    );

    // Certifications: certificate image beside its details, with a link to verify it.
    const certs = document.getElementById("cert-list");
    const certSection = document.getElementById("certifications");
    if (certs) {
      const list = p.certifications || [];
      certSection.hidden = list.length === 0;
      certs.replaceChildren(
        ...list.map((c) => {
          const card = el("article", { class: "cert-card" });
          if (c.image?.src) {
            const img = el("img", {
              src: c.image.src,
              ...(c.image.srcset && { srcset: c.image.srcset, sizes: "(max-width: 700px) 100vw, 520px" }),
              width: "1600",
              height: "1190",
              alt: c.image.alt || `${c.title} certificate`,
              loading: "lazy",
              decoding: "async",
            });
            const thumb = c.url ? el("a", { class: "cert-thumb", href: c.url, target: "_blank", rel: "noopener", tabindex: "-1" }) : el("div", { class: "cert-thumb" });
            thumb.append(img);
            card.append(thumb);
          }
          const body = el("div", { class: "cert-body" });
          body.append(el("p", { class: "project-type" }, "Certificate of completion"), el("h3", null, c.title));
          const meta = el("dl", { class: "cert-meta" });
          const date = c.date ? new Date(`${c.date}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }) : "";
          for (const [label, value] of [["Issued by", c.issuer], ["Instructor", c.instructor], ["Completed", date], ["Length", c.length]]) {
            if (!value) continue;
            const row = el("div");
            row.append(el("dt", null, label), el("dd", null, value));
            meta.append(row);
          }
          body.append(meta);
          if (c.url) body.append(el("a", { class: "card-link", href: c.url, target: "_blank", rel: "noopener" }, "View certificate ↗"));
          card.append(body);
          return card;
        })
      );
    }

    // Contact is the formal channel: email only. Social profiles live in the hero's "Follow me".
    const contact = document.getElementById("contact-links");
    contact.replaceChildren();
    if (p.email) {
      const li = el("li");
      li.append(el("span", { class: "contact-email" }, p.email));
      contact.append(li);
    }
  }

  document.getElementById("year").textContent = new Date().getFullYear();
  fetch("/data/profile.json")
    .then((r) => {
      if (!r.ok) throw new Error(`profile ${r.status}`);
      return r.json();
    })
    .then(render)
    .catch((err) => console.error("[portfolio] could not load profile", err));
})();
