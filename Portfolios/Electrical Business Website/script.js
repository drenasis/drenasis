const toggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

toggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".section-reveal").forEach((section) => {
  revealObserver.observe(section);
});

const form = document.querySelector(".contact-form");
const status = document.querySelector(".form-status");

const messages = {
  name: "Please enter your name.",
  phone: "Please enter a valid phone number.",
  email: "Please enter a valid email address.",
  service: "Please choose a service.",
  message: "Please add a short message about the job."
};

function setFieldState(field) {
  const label = field.closest("label");
  const error = label.querySelector(".error");
  const customMessage = messages[field.name] || "Please complete this field.";

  if (field.validity.valid) {
    error.textContent = "";
    field.removeAttribute("aria-invalid");
    return true;
  }

  error.textContent = customMessage;
  field.setAttribute("aria-invalid", "true");
  return false;
}

form.querySelectorAll("input, select, textarea").forEach((field) => {
  field.addEventListener("blur", () => setFieldState(field));
  field.addEventListener("input", () => {
    if (field.hasAttribute("aria-invalid")) {
      setFieldState(field);
    }
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = Array.from(form.querySelectorAll("input, select, textarea"));
  const fieldStates = fields.map(setFieldState);
  const isValid = fieldStates.every(Boolean);

  if (!isValid) {
    status.textContent = "";
    fields.find((field) => !field.validity.valid)?.focus();
    return;
  }

  status.textContent = "Thanks. Your enquiry is ready to send and our team will respond shortly.";
  form.reset();
});
