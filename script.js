"use strict";

document.documentElement.classList.add("js-ready");

const BUSINESS = {
  whatsapp: "",
  phone: "",
};

const portfolioProjects = [];

const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const homePage = document.querySelector("#home-page");
const eventDetail = document.querySelector("#event-detail");
const portfolioGrid = document.querySelector("#portfolio-grid");
const portfolioEmpty = document.querySelector("#portfolio-empty");
const portfolioFilters = document.querySelector(".portfolio-filters");
const form = document.querySelector("#enquiry-form");
const formStatus = document.querySelector("#form-status");

document.querySelector("#current-year").textContent = new Date().getFullYear();

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  siteNav.classList.toggle("is-open", !isOpen);
});

siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
    siteNav.classList.remove("is-open");
  }
});

function whatsappUrl(message) {
  const number = BUSINESS.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  link.href = whatsappUrl("Hello Sweet Memories Prestige Event, I would like to discuss planning an event.");
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

document.querySelectorAll("[data-call]").forEach((link) => {
  if (BUSINESS.phone) {
    link.href = `tel:${BUSINESS.phone.replace(/[^\d+]/g, "")}`;
  } else {
    link.href = "#inquiry";
    link.setAttribute("aria-label", "Call details are being added. Send an event enquiry instead.");
  }
});

function renderProjects(filter = "all") {
  const projects = portfolioProjects.filter((project) => filter === "all" || project.type === filter);
  portfolioGrid.replaceChildren();
  portfolioEmpty.hidden = projects.length > 0;
  portfolioFilters.hidden = portfolioProjects.length === 0;

  projects.forEach((project) => {
    const card = document.createElement("a");
    card.className = "project-card";
    card.href = `?event=${encodeURIComponent(project.slug)}`;
    card.setAttribute("aria-label", `${project.type}: ${project.title}, ${project.location}`);

    const image = document.createElement("span");
    image.className = "project-image";
    const photo = document.createElement("img");
    photo.src = project.cover;
    photo.alt = project.imageAlt;
    photo.loading = "lazy";
    photo.decoding = "async";
    image.append(photo);

    const meta = document.createElement("span");
    meta.className = "project-meta";
    meta.innerHTML = `<span>${escapeHtml(project.type)}</span><span>${escapeHtml(project.year || "")}</span>`;

    const title = document.createElement("h3");
    title.className = "project-title";
    title.textContent = project.title;
    const location = document.createElement("p");
    location.className = "project-location";
    location.textContent = project.location;

    card.append(image, meta, title, location);
    portfolioGrid.append(card);
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function renderEventPage(slug) {
  const project = portfolioProjects.find((item) => item.slug === slug);
  if (!project) return;

  homePage.hidden = true;
  eventDetail.hidden = false;
  document.title = `${project.title} | Sweet Memories Prestige Event`;
  const description = document.querySelector('meta[name="description"]');
  description.content = `${project.type} in ${project.location}, planned and coordinated by Sweet Memories Prestige Event.`;

  const back = document.createElement("a");
  back.className = "detail-back";
  back.href = "./#portfolio";
  back.textContent = "← All events";
  const copy = document.createElement("div");
  copy.className = "detail-copy";
  copy.innerHTML = `<p class="eyebrow">${escapeHtml(project.type)} · ${escapeHtml(project.location)}</p><h1>${escapeHtml(project.title)}</h1><p>${escapeHtml(project.description)}</p>`;
  const cover = document.createElement("img");
  cover.className = "detail-image";
  cover.src = project.cover;
  cover.alt = project.imageAlt;
  cover.fetchPriority = "high";
  eventDetail.append(back, copy, cover);

  if (Array.isArray(project.images) && project.images.length) {
    const gallery = document.createElement("div");
    gallery.className = "detail-gallery";
    project.images.forEach((item) => {
      const image = document.createElement("img");
      image.src = item.src;
      image.alt = item.alt;
      image.loading = "lazy";
      image.decoding = "async";
      gallery.append(image);
    });
    eventDetail.append(gallery);
  }
}

portfolioFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  portfolioFilters.querySelector(".is-active").classList.remove("is-active");
  button.classList.add("is-active");
  renderProjects(button.dataset.filter);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const message = [
    "Hello Sweet Memories Prestige Event, I would like to start planning an event.",
    "",
    `Name: ${data.get("name")}`,
    `Phone / WhatsApp: ${data.get("phone")}`,
    data.get("email") ? `Email: ${data.get("email")}` : "",
    `Event type: ${data.get("eventType")}`,
    data.get("date") ? `Event date: ${data.get("date")}` : "",
    data.get("location") ? `Event location: ${data.get("location")}` : "",
    data.get("guests") ? `Estimated guests: ${data.get("guests")}` : "",
    data.get("budget") ? `Budget range: ${data.get("budget")}` : "",
    data.get("details") ? `About the event: ${data.get("details")}` : "",
  ].filter(Boolean).join("\n");

  formStatus.textContent = "Your event details are ready in WhatsApp. Send the message to complete your enquiry.";
  window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
});

renderProjects();
const eventSlug = new URLSearchParams(window.location.search).get("event");
if (eventSlug) renderEventPage(eventSlug);