const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav-links a");

if (menuButton && header) {
  menuButton.addEventListener("click", () => {
    header.classList.toggle("nav-open");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (header) {
      header.classList.remove("nav-open");
    }
  });
});

const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const revealItems = document.querySelectorAll(".reveal");

if (revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
    },
  );

  revealItems.forEach((item) => observer.observe(item));
}
