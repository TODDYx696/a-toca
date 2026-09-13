(function () {
  "use strict";

  const STORE = window.STORE || {};
  const WA = `https://wa.me/${STORE.phone || "5514998081793"}`;
  const PHOTOS = [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1615297928064-24977384ce0c?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1596662951482-0c1aa5317eae?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&h=400&fit=crop"
  ];

  let activeFilter = "todas";

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
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
    let msg = "Olá! Gostaria de pedir:\n\n*" + product.name + "*";
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
      const id = Number(product.id);
      const photo = PHOTOS[(Number.isFinite(id) && id > 0 ? id - 1 : 0) % PHOTOS.length];
      const tag = product.highlight ? '<span class="menu-tag">Destaque</span>' : "";

      return `<article class="menu-card">
        <div class="menu-card-img">${tag}
          <img src="${photo}" alt="${escapeHTML(product.name)}" width="600" height="400" loading="lazy" decoding="async">
        </div>
        <div class="menu-card-body">
          <h3 class="menu-card-name">${escapeHTML(product.name)}</h3>
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
