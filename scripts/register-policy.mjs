import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Node 18+ ha fetch globale → niente node-fetch
const API_BASE = "https://api.webonday.it";


const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
if (!ADMIN_TOKEN) {
  console.error("❌ ADMIN_TOKEN non definito");
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// scegli la policy
const POLICY_FILE = "policy_v1.json";
const policyPath = path.join(__dirname, "../policies/versions", POLICY_FILE);

const payload = JSON.parse(fs.readFileSync(policyPath, "utf-8"));

const res = await fetch(`${API_BASE}/api/policy/version/register`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-admin-token": ADMIN_TOKEN,
  },
  body: JSON.stringify(payload),
});

const json = await res.json();
console.log("✅ POLICY REGISTERED:", json);
