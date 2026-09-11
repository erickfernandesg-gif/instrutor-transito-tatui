(() => {
  "use strict";

  const config = window.SITE_CONFIG || {};
  const digitsOnly = (value = "") => String(value).replace(/\D/g, "");
  const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);

  const whatsappNumber = digitsOnly(config.whatsapp || config.phone);
  const whatsappUrl = (message = config.whatsappMessage) => {
    if (!whatsappNumber) return "";
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message || "")}`;
  };

  document.querySelectorAll("[data-config]").forEach((element) => {
    const key = element.dataset.config;
    const value = config[key];
    if (value) element.textContent = value;
  });

  document.querySelectorAll("svg:not(.svg-sprite)").forEach((icon) => {
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("focusable", "false");
  });

  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    const url = whatsappUrl(link.dataset.message || config.whatsappMessage);
    if (url) {
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      link.href = "#contato";
      link.setAttribute("aria-label", `${link.textContent.trim()}. WhatsApp ainda não configurado.`);
      link.dataset.unconfigured = "true";
    }
  });

  const phoneLink = document.querySelector("[data-phone-link]");
  if (phoneLink) {
    const phone = config.phone || config.whatsapp;
    if (phone) {
      phoneLink.href = `tel:+${digitsOnly(phone)}`;
      phoneLink.textContent = phone;
    } else {
      phoneLink.closest("li")?.remove();
    }
  }

  const instagramLink = document.querySelector("[data-instagram-link]");
  if (instagramLink) {
    if (config.instagram) {
      const handle = config.instagram.replace(/^@/, "");
      instagramLink.href = config.instagram.startsWith("http") ? config.instagram : `https://instagram.com/${handle}`;
      instagramLink.textContent = config.instagramLabel || `@${handle}`;
    } else {
      instagramLink.closest("li")?.remove();
    }
  }

  const price = document.querySelector("[data-price]");
  if (price) {
    price.textContent = config.lessonPrice || "Consulte valores e disponibilidade pelo WhatsApp.";
    price.classList.toggle("price-card__value--contact", !config.lessonPrice);
  }

  const duration = document.querySelector("[data-duration]");
  if (duration) {
    if (config.lessonDuration) duration.textContent = config.lessonDuration;
    else duration.remove();
  }

  const credential = document.querySelector("[data-credential]");
  if (credential) {
    if (config.credentialStatus === true) {
      const number = config.credentialNumber ? ` · Credenciamento nº ${config.credentialNumber}` : "";
      credential.textContent = `Instrutor de Trânsito Autônomo credenciado pelo Detran-SP${number}`;
      credential.hidden = false;
    } else {
      credential.remove();
    }
  }

  const hours = document.querySelector("[data-hours]");
  if (hours) {
    if (config.openingHours) hours.textContent = config.openingHours;
    else hours.closest("li")?.remove();
  }

  const setImage = (selector, source, alt) => {
    const wrapper = document.querySelector(selector);
    if (!wrapper || !source) return;
    const image = document.createElement("img");
    image.src = source;
    image.alt = config.illustrativePhoto ? "Imagem ilustrativa temporária de um instrutor de trânsito ao lado de um veículo" : alt;
    image.width = 760;
    image.height = 880;
    image.loading = selector.includes("hero") ? "eager" : "lazy";
    if (selector.includes("hero")) image.fetchPriority = "high";
    image.decoding = "async";
    wrapper.replaceChildren(image);
    if (config.illustrativePhoto) {
      const badge = document.createElement("span");
      badge.className = "media-frame__illustrative";
      badge.textContent = "Imagem ilustrativa";
      wrapper.append(badge);
    }
    wrapper.classList.add("media-frame--has-image");
  };

  setImage("[data-hero-media]", config.heroPhoto, `Instrutor de trânsito ao lado do ${config.vehicle || "veículo"}`);
  setImage("[data-instructor-media]", config.instructorPhoto, `Foto de ${config.instructorName || "instrutor de trânsito"}`);

  if (Array.isArray(config.vehiclePhotos) && config.vehiclePhotos.length) {
    const gallery = document.querySelector("[data-vehicle-gallery]");
    if (gallery) {
      gallery.replaceChildren(...config.vehiclePhotos.slice(0, 3).map((source, index) => {
        const figure = document.createElement("figure");
        figure.className = `media-frame media-frame--vehicle ${index === 0 ? "media-frame--wide" : ""}`;
        const image = document.createElement("img");
        image.src = source;
        image.alt = `${config.vehicle || "Veículo das aulas"} — foto ${index + 1}`;
        image.width = index === 0 ? 900 : 440;
        image.height = 520;
        image.loading = "lazy";
        image.decoding = "async";
        figure.append(image);
        return figure;
      }));
    }
  }

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    if (config.siteUrl) canonical.href = config.siteUrl.replace(/\/$/, "") + "/";
    else canonical.remove();
  }

  const mobileToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const closeMenu = () => {
    if (!mobileToggle || !mobileMenu) return;
    mobileToggle.setAttribute("aria-expanded", "false");
    mobileToggle.setAttribute("aria-label", "Abrir menu");
    mobileMenu.hidden = true;
    document.body.classList.remove("menu-open");
  };
  mobileToggle?.addEventListener("click", () => {
    const open = mobileToggle.getAttribute("aria-expanded") === "true";
    mobileToggle.setAttribute("aria-expanded", String(!open));
    mobileToggle.setAttribute("aria-label", open ? "Abrir menu" : "Fechar menu");
    mobileMenu.hidden = open;
    document.body.classList.toggle("menu-open", !open);
  });
  mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.querySelectorAll(".faq__question").forEach((button) => {
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      button.setAttribute("aria-expanded", String(!expanded));
      if (panel) panel.hidden = expanded;
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  document.querySelector("[data-contact-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const contact = String(data.get("contact") || "").trim();
    const message = String(data.get("message") || "").trim();
    const text = `Olá, meu nome é ${name}.\n\nEstou interessado nas aulas práticas.\n\nMeu WhatsApp: ${contact}\n\nMensagem:\n${message}`;
    const url = whatsappUrl(text);
    const status = form.querySelector("[data-form-status]");
    if (!url) {
      status.textContent = "Configure o número de WhatsApp em js/config.js para enviar a mensagem.";
      status.focus();
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
    status.textContent = "Mensagem preparada. Continue o envio no WhatsApp.";
  });

  const currentYear = document.querySelector("[data-current-year]");
  if (currentYear) currentYear.textContent = new Date().getFullYear();

  const revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Integrações opcionais: adicione os scripts oficiais apenas quando houver IDs reais.
  // Google Analytics 4: config.analytics.googleAnalyticsId
  // Google Tag Manager: config.analytics.googleTagManagerId
  // Meta Pixel: config.analytics.metaPixelId

  window.siteWhatsAppUrl = whatsappUrl;
  window.siteEscapeHtml = escapeHtml;
})();
