(function () {
  "use strict";

  const STORE = window.STORE || {};
  const WA = `https://wa.me/${STORE.phone || "5514998081793"}`;
  const FALLBACK_PHOTO = "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&h=400&fit=crop&q=80";

  let activeFilter = "todas";

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/\"/g, """)
      .replace(/'/g, "&#039;");
  }

  function money(value) {
    if (typeof value !== "number" || !Number.isFinite(value)) return null;
    return "R$ " + value.toFixed(2).replace(".", ",");
  }

  function waLink(text) {
    return WA + "?text=" + encodeURIComponent(text);
  }

  function orderMsg(product) {
    const price = money(product.price);
    let msg = "Oi! Quero pedir:\n\n*" + product.name + "*";
    if (product.desc) msg += "\n" + product.desc;
    msg += price ? "\n" + price : "\n(consultar valor)";
    return msg + "\n\nA TOCA";
  }

  function filtered() {
    const products = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
    if (activeFilter === "todas") return products.slice();
    return products.filter((product) => product.category === activeFilter);
  }

  function renderFilters() {
    const el = document.getElementById("filters");
    const categories = Array.isArray(window.CATEGORIES) ? window.CATEGORIES : [];
    if (!el) return;

    el.innerHTML = categories.map((category) => {
      const active = category.id === activeFilter;
      return `<button type="button" class="filter-btn ${active ? "active" : ""}" data-filter="${escapeHTML(category.id)}" role="tab" aria-selected="${active}">${escapeHTML(category.label)}</button>`;
    }).join("");
  }

  function renderMenu() {
    const grid = document.getElementById("menu-grid");
    if (!grid) return;

    grid.innerHTML = filtered().map((product) => {
      const price = money(product.price);
      const photo = product.img || FALLBACK_PHOTO;
      const tag = product.highlight ? '<span class="menu-tag">Destaque</span>' : "";
      const name = escapeHTML(product.name);

      return `<article class="menu-card">
        <div class="menu-card-img">${tag}
          <img src="${escapeHTML(photo)}" alt="${name}" width="600" height="400" loading="lazy" decoding="async" onerror="this.onerror=null;this.style.display='none';this.parentElement.insertAdjacentHTML('beforeend','<div class=\'img-fallback\'>${name}</div>');">
        </div>
        <div class="menu-card-body">
          <h3 class="menu-card-name">${name}</h3>
          <p class="menu-card-desc">${escapeHTML(product.desc)}</p>
          <div class="menu-card-foot">
            <span class="menu-price ${price ? "" : "consult"}">${price || "Consultar"}</span>
            <a class="btn-order" href="${waLink(orderMsg(product))}" target="_blank" rel="noopener noreferrer">Pedir</a>
          </div>
        </div>
      </article>`;
    }).join("");
  }

  function closeMenu(toggle, nav) {
    nav?.classList.remove("open");
    toggle?.classList.remove("active");
    toggle?.setAttribute("aria-expanded", "false");
  }

  function bind() {
    const filters = document.getElementById("filters");
    const toggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("nav");
    const header = document.getElementById("header");

    filters?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;
      activeFilter = button.dataset.filter || "todas";
      renderFilters();
      renderMenu();
    });

    toggle?.setAttribute("aria-controls", "nav");
    toggle?.addEventListener("click", () => {
      const open = nav?.classList.toggle("open") || false;
      toggle.classList.toggle("active", open);
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeMenu(toggle, nav));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav?.classList.contains("open")) {
        closeMenu(toggle, nav);
        toggle?.focus();
      }
    });

    window.addEventListener("scroll", () => {
      header?.classList.toggle("scrolled", window.scrollY > 20);
    }, { passive: true });

    const year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function init() {
    renderFilters();
    renderMenu();
    bind();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
