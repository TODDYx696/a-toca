(function () {
  "use strict";
  const WA = "https://wa.me/5514998081793";
  function money(v) {
    if (v == null || Number.isNaN(v)) return null;
    return "R$ " + v.toFixed(2).replace(".", ",");
  }
  function waLink(text) {
    return WA + "?text=" + encodeURIComponent(text);
  }
  function orderMsg(product) {
    const price = money(product.price);
    let msg = "Olá! Gostaria de pedir:\n\n*" + product.name + "*";
    if (product.desc) msg += "\n" + product.desc;
    if (price) msg += "\n" + price;
    else msg += "\n(consultar valor)";
    msg += "\n\nA TOCA";
    return msg;
  }
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
  function filtered() {
    if (activeFilter === "todas") return window.PRODUCTS.slice();
    return window.PRODUCTS.filter((p) => p.category === activeFilter);
  }
  function renderFilters() {
    const el = document.getElementById("filters");
    if (!el) return;
    el.innerHTML = window.CATEGORIES.map(
      (c) => `<button type="button" class="filter-btn ${c.id === activeFilter ? "active" : ""}" data-filter="${c.id}">${c.label}</button>`
    ).join("");
  }
  function renderMenu() {
    const grid = document.getElementById("menu-grid");
    if (!grid) return;
    const list = filtered();
    grid.innerHTML = list.map((p) => {
      const price = money(p.price);
      const photo = PHOTOS[(p.id - 1) % PHOTOS.length];
      const tag = p.highlight ? `<span class="menu-tag">Destaque</span>` : "";
      return `<article class="menu-card">
        <div class="menu-card-img">${tag}
          <img src="${photo}" alt="${p.name}" width="600" height="400" loading="lazy">
        </div>
        <div class="menu-card-body">
          <h3 class="menu-card-name">${p.name}</h3>
          <p class="menu-card-desc">${p.desc}</p>
          <div class="menu-card-foot">
            <span class="menu-price ${price ? "" : "consult"}">${price || "Consultar"}</span>
            <a class="btn-order" href="${waLink(orderMsg(p))}" target="_blank" rel="noopener">Pedir</a>
          </div>
        </div></article>`;
    }).join("");
  }
  function bind() {
    document.getElementById("filters")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn) return;
      activeFilter = btn.dataset.filter;
      renderFilters(); renderMenu();
    });
    const toggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("nav");
    toggle?.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.classList.toggle("active", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav?.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle?.classList.remove("active");
        toggle?.setAttribute("aria-expanded", "false");
      });
    });
    const header = document.getElementById("header");
    window.addEventListener("scroll", () => {
      header?.classList.toggle("scrolled", window.scrollY > 20);
    }, { passive: true });
    const y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());
  }
  function init() { renderFilters(); renderMenu(); bind(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
