/* =============================================================
   1. FLIP THE CARD ON CLICK OR KEYBOARD (Enter / Space)
   ============================================================= */
const card = document.getElementById("card");

function toggleFlip() {
  const isFlipped = card.classList.toggle("is-flipped");
  card.setAttribute("aria-pressed", isFlipped);
}

card.addEventListener("click", toggleFlip);

card.addEventListener("keydown", (event) => {
  // Only react to Enter or Space, and stop the page from scrolling on Space
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggleFlip();
  }
});

/* =============================================================
   2. DARK MODE TOGGLE
   Preference is remembered in localStorage so it persists
   across page reloads.
   ============================================================= */
const themeToggleBtn = document.getElementById("theme-toggle");
const root = document.documentElement;

function applyTheme(theme) {
  if (theme === "dark") {
    root.setAttribute("data-theme", "dark");
    themeToggleBtn.textContent = "☀";
  } else {
    root.removeAttribute("data-theme");
    themeToggleBtn.textContent = "☾";
  }
}

// On load: use saved preference, otherwise fall back to system preference
const savedTheme = localStorage.getItem("vcard-theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (systemPrefersDark ? "dark" : "light"));

themeToggleBtn.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("vcard-theme", next);
});

/* =============================================================
   3. GENERATE AND DOWNLOAD A REAL .VCF (VCARD) FILE
   This is the part that makes it an actual "vCard" project,
   not just a page that looks like a business card.
   The vCard format is plain text following the vCard 3.0 spec.
   ============================================================= */
const saveBtn = document.getElementById("save-btn");

// EDIT these values to match the details shown on the card above
const contactInfo = {
  fullName: "Aditya Kumar",
  role: "B.Tech, Computer Science and Engineering",
  email: "avdadityajha@gmail.com",
  phone: "+918271421003",
  org: "SISTec Bhopal",
  website: "https://github.com/adityajha0312",
};

function buildVCardText(info) {
  // \n line breaks here become real newlines in the downloaded file.
  // VERSION:3.0 is the most widely supported vCard revision.
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${info.fullName}`,
    `TITLE:${info.role}`,
    `ORG:${info.org}`,
    `EMAIL;TYPE=INTERNET:${info.email}`,
    `TEL;TYPE=CELL:${info.phone}`,
    `URL:${info.website}`,
    "END:VCARD",
  ].join("\n");
}

saveBtn.addEventListener("click", () => {
  const vCardText = buildVCardText(contactInfo);

  // Turn the text into a downloadable file in the browser,
  // without needing any server or backend code.
  const blob = new Blob([vCardText], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);

  const tempLink = document.createElement("a");
  tempLink.href = url;
  tempLink.download = `${contactInfo.fullName.replace(/\s+/g, "_")}.vcf`;
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);

  URL.revokeObjectURL(url); // free up memory once the download starts
});
