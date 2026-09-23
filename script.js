/* =============================================================
   1. THEME TOGGLE (dark default, light optional)
   Preference remembered in localStorage.
   ============================================================= */
const themeToggleBtn = document.getElementById("theme-toggle");
const root = document.documentElement;

function applyTheme(theme) {
  if (theme === "light") {
    root.setAttribute("data-theme", "light");
    themeToggleBtn.textContent = "☀";
  } else {
    root.removeAttribute("data-theme");
    themeToggleBtn.textContent = "☾";
  }
}

const savedTheme = localStorage.getItem("vcard-theme");
applyTheme(savedTheme || "dark");

themeToggleBtn.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
  const next = current === "light" ? "dark" : "light";
  applyTheme(next);
  localStorage.setItem("vcard-theme", next);
});

/* =============================================================
   2. GENERATE AND DOWNLOAD A REAL .VCF (VCARD) FILE
   ============================================================= */
const saveBtn = document.getElementById("save-btn");

const contactInfo = {
  fullName: "Aditya Kumar",
  role: "B.Tech, Computer Science and Engineering",
  email: "avdadityajha@gmail.com",
  phone: "+918271421003",
  org: "SISTec Bhopal",
  website: "https://github.com/adityajha0312",
};

function buildVCardText(info) {
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
  const blob = new Blob([vCardText], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);

  const tempLink = document.createElement("a");
  tempLink.href = url;
  tempLink.download = `${contactInfo.fullName.replace(/\s+/g, "_")}.vcf`;
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);

  URL.revokeObjectURL(url);
});
