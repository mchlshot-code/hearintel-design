const menuButton = document.querySelector("[data-menu]");
const header = menuButton?.closest("header");
function closeNavigation() {
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "Open navigation");
  header?.classList.remove("mobile-open");
}
menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
  header.classList.toggle("mobile-open", open);
});
header?.querySelector(".e-links")?.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeNavigation();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && header?.classList.contains("mobile-open")) {
    closeNavigation();
    menuButton.focus();
  }
});
