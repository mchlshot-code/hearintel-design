// Auth contract mirrors the private frontend: Supabase password sign-in,
// optional MFA, then authenticated GET /auth/me for product authorization.
// This static public prototype never falls back to shared development or production.
const config = window.HEARINTEL_SIGNIN_CONFIG || {};
const form = document.querySelector("#signin-form");
const mfaForm = document.querySelector("#mfa-form");
const recoveryForm = document.querySelector("#recovery-form");
const message = document.querySelector("#signin-status");
const result = document.querySelector("#signin-result");
const availability = document.querySelector("#signin-availability");

function isConfigured() {
  try {
    const auth = new URL(config.supabaseUrl);
    const api = new URL(config.apiBaseUrl);
    return auth.protocol === "https:" && api.protocol === "https:"
      && auth.hostname.endsWith(".supabase.co")
      && api.pathname.replace(/\/+$/, "") === "/api/v1"
      && config.publishableKey?.startsWith("sb_publishable_")
      && auth.origin !== "https://pheepzqdcwouyocvfwmw.supabase.co"
      && api.origin !== "https://hearintel-backend.onrender.com"
      && !api.username && !api.password
      && !auth.username && !auth.password;
  } catch {
    return false;
  }
}

const ready = isConfigured();
availability.textContent = ready
  ? "Secure sign-in uses a separately configured staging identity service."
  : "Public design preview only. Authentication requires a separate, approved staging service. Do not enter real account credentials here.";
for (const button of [form.querySelector('[type="submit"]'),recoveryForm.querySelector('[type="submit"]')]) {
  button.disabled = !ready;
}
let clientPromise;
function client() {
  if (!ready) throw Error("Secure sign-in is not configured for this public prototype.");
  return clientPromise ||= import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.105.3/+esm")
    .then(({ createClient }) => createClient(config.supabaseUrl, config.publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    }));
}
function status(text, error = false) {
  message.textContent = text;
  message.style.color = error ? "var(--error-text)" : "var(--text-secondary)";
  message.setAttribute("role", error ? "alert" : "status");
}
function toggleView(which) {
  form.hidden = which !== "login";
  mfaForm.hidden = which !== "mfa";
  recoveryForm.hidden = which !== "recovery";
  result.hidden = true;
  status("");
}
function setBusy(target, busy) {
  target.disabled = busy;
  target.setAttribute("aria-busy", String(busy));
}
let mfaFactor = null;
let pendingAccessToken = null;

async function completeLogin(supabase) {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.access_token) throw Error("Unable to verify your session.");
  pendingAccessToken = data.session.access_token;
  const response = await fetch(config.apiBaseUrl.replace(/\/+$/, "") + "/auth/me", {
    headers: { Accept: "application/json", Authorization: "Bearer " + pendingAccessToken },
    cache: "no-store",
  });
  if (!response.ok) throw Error("Identity verified, but approved workspace access could not be confirmed.");
  const context = await response.json();
  const roles = [];
  if (context.pms_memberships?.length) roles.push("Clinical PMS");
  if (context.registry_assignments?.length) roles.push("National Registry");
  if (context.platform?.permissions?.length) roles.push("Platform administration");
  if (!roles.length) roles.push("No active workspace assignment");
  toggleView("success");
  result.hidden = false;
  const heading = document.createElement("h3");
  heading.textContent = "Identity verified";
  result.appendChild(heading);
  const desc = document.createElement("p");
  desc.textContent = "Authorized access returned by HearIntel:";
  result.appendChild(desc);
  const list = document.createElement("ul");
  roles.forEach(role => {
    const item = document.createElement("li");
    item.textContent = role;
    list.appendChild(item);
  });
  result.appendChild(list);
  const info = document.createElement("p");
  info.textContent = "This public prototype does not open real clinical records. Continue through the deployed HearIntel application to use an authorized workspace.";
  result.appendChild(info);
  status("Your identity and approved access were verified.");
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (!ready) return status("Secure authentication is not configured here.", true);
  const submit = document.querySelector("#signin-submit");
  setBusy(submit, true);
  status("Checking your credentials…");
  try {
    const email = String(form.elements.email.value).trim();
    const password = form.elements.password.value;
    const supabase = await client();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    form.elements.password.value = "";
    if (error) throw Error(error.message === "Invalid login credentials"
      ? "The email or password is incorrect." : error.message);
    const { data: assurance, error: assuranceError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assuranceError) throw assuranceError;
    if (assurance?.nextLevel === "aal2" && assurance.currentLevel !== "aal2") {
      const { data: factors, error: factorError } = await supabase.auth.mfa.listFactors();
      if (factorError) throw factorError;
      mfaFactor = factors.all.find(f => f.status === "verified" && f.factor_type === "totp");
      if (!mfaFactor) throw Error("Your account requires a supported authenticator method.");
      toggleView("mfa");
      document.querySelector("#mfa-code").focus();
      return;
    }
    await completeLogin(supabase);
  } catch (error) {
    status(error.message || "Unable to sign in.", true);
  } finally {
    setBusy(submit, false);
  }
});

mfaForm.addEventListener("submit", async event => {
  event.preventDefault();
  const btn = document.querySelector("#mfa-submit");
  setBusy(btn, true);
  status("Verifying your authenticator…");
  try {
    const supabase = await client();
    if (!mfaFactor) throw Error("Please sign in again.");
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId: mfaFactor.id, code: mfaForm.elements.code.value,
    });
    if (error) throw error;
    await completeLogin(supabase);
  } catch (error) {
    status(error.message || "Authenticator verification failed.", true);
  } finally {
    setBusy(btn, false);
  }
});
document.querySelector("#mfa-cancel").addEventListener("click", async () => {
  if (clientPromise) (await clientPromise).auth.signOut({ scope: "local" }).catch(() => {});
  mfaFactor = null;
  pendingAccessToken = null;
  mfaForm.reset();
  toggleView("login");
});
document.querySelector("#toggle-password").addEventListener("click", event => {
  const input = document.querySelector("#signin-password");
  const reveal = input.type === "password";
  input.type = reveal ? "text" : "password";
  event.currentTarget.textContent = reveal ? "Hide" : "Show";
  event.currentTarget.setAttribute("aria-label", reveal ? "Hide password" : "Show password");
});
document.querySelector("#show-recovery").addEventListener("click", () => {
  toggleView("recovery");
  recoveryForm.elements.email.value = form.elements.email.value;
});
document.querySelector("#recovery-cancel").addEventListener("click", () => toggleView("login"));
recoveryForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (!ready) return status("Recovery is not configured on this public preview.", true);
  const btn = document.querySelector("#recovery-submit");
  setBusy(btn, true);
  try {
    await fetch(config.apiBaseUrl.replace(/\/+$/, "") + "/auth/password-recovery", {
      method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email: recoveryForm.elements.email.value.trim() }),
    });
    status("If an active account exists, a recovery email will be sent.");
  } catch {
    status("If an active account exists, a recovery email will be sent.");
  } finally {
    setBusy(btn, false);
  }
});
