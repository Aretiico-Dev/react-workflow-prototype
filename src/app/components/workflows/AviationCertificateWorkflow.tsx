// @ts-nocheck
import React, { useMemo, useState } from "react";

function Button({ children, className = "", variant = "default", disabled = false, ...props }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";
  const styles = variant === "outline"
    ? "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
    : variant === "ghost"
      ? "bg-transparent text-slate-700 hover:bg-slate-100"
      : "bg-slate-900 text-white hover:bg-slate-800";
  return <button className={`${base} ${styles} ${className}`} disabled={disabled} {...props}>{children}</button>;
}

function Icon({ name = "file", className = "" }) {
  const common = { className: `h-5 w-5 ${className}`, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    check: <svg {...common}><path d="M20 6 9 17l-5-5" /></svg>,
    back: <svg {...common}><path d="m15 18-6-6 6-6" /></svg>,
    qr: <svg {...common}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><path d="M14 14h3v3h-3zM18 18h3v3h-3" /></svg>,
    file: <svg {...common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /></svg>,
    code: <svg {...common}><path d="m8 9-4 3 4 3" /><path d="m16 9 4 3-4 3" /><path d="m14 5-4 14" /></svg>,
    device: <svg {...common}><rect x="5" y="4" width="14" height="16" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" /></svg>,
    server: <svg {...common}><rect x="4" y="4" width="16" height="6" rx="2" /><rect x="4" y="14" width="16" height="6" rx="2" /><path d="M8 7h.01M8 17h.01" /></svg>,
    shield: <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></svg>,
    download: <svg {...common}><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg>,
    plane: <svg {...common}><path d="M2 16 22 8l-8 8 1 5-4-4-5 3 2-5-6 1Z" /></svg>,
    user: <svg {...common}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.8-4 5-6 8-6s6.2 2 8 6" /></svg>,
    role: <svg {...common}><path d="M12 3 4 7l8 4 8-4-8-4Z" /><path d="M4 12l8 4 8-4" /><path d="M4 17l8 4 8-4" /></svg>,
    globe: <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c3 3 3 15 0 18" /><path d="M12 3c-3 3-3 15 0 18" /></svg>,
    lock: <svg {...common}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>,
    key: <svg {...common}><circle cx="7" cy="17" r="3" /><path d="M10 17h11l-2-2 2-2" /></svg>,
    id: <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2" /><path d="M13 9h5M13 13h5M7 16c.8-1.3 3.2-1.3 4 0" /></svg>,
    signature: <svg {...common}><path d="M4 18c3-7 5-10 7-10 1.5 0 1.5 2.2.2 4.2C10 14 9.5 16 11 16c2 0 3-4 5-4 1.3 0 2 1.2 2 3" /><path d="M3 21h18" /></svg>,
    database: <svg {...common}><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" /><path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></svg>,
    message: <svg {...common}><path d="M4 5h16v11H7l-3 3Z" /><path d="M8 9h8M8 13h5" /></svg>,
    archive: <svg {...common}><rect x="3" y="4" width="18" height="5" rx="1" /><path d="M5 9v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9" /><path d="M10 13h4" /></svg>,
    pdf: <svg {...common}><path d="M6 2h9l5 5v15H6Z" /><path d="M14 2v6h6" /><path d="M8 15h8M8 18h5" /></svg>,
    clock: <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
    laptop: <svg {...common}><rect x="5" y="4" width="14" height="11" rx="2" /><path d="M3 20h18" /><path d="M8 15v5M16 15v5" /></svg>,
    network: <svg {...common}><circle cx="6" cy="6" r="3" /><circle cx="18" cy="6" r="3" /><circle cx="12" cy="18" r="3" /><path d="M8.5 8.5 10.5 15.5M15.5 8.5 13.5 15.5M9 6h6" /></svg>,
    plus: <svg {...common}><path d="M12 5v14" /><path d="M5 12h14" /></svg>,
    x: <svg {...common}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
  };
  return icons[name] || icons.file;
}

const products = [
  { family: "Aircraft issuing", subject: "Aircraft", group: "Certificate purpose", product: "Aircraft Encryption", crypto: "ECDSA", category: "Aircraft", root: "Aviation" },
  { family: "Aircraft issuing", subject: "Aircraft", group: "Certificate purpose", product: "Aircraft Encryption", crypto: "RSA", category: "Aircraft", root: "Aviation" },
  { family: "Aircraft issuing", subject: "Aircraft", group: "Certificate purpose", product: "Aircraft Identity", crypto: "ECDSA", category: "Aircraft", root: "Aviation" },
  { family: "Aircraft issuing", subject: "Aircraft", group: "Certificate purpose", product: "Aircraft Identity", crypto: "RSA", category: "Aircraft", root: "Aviation" },
  { family: "Aircraft issuing", subject: "Aircraft", group: "Certificate purpose", product: "Aircraft Signature", crypto: "ECDSA or RSA", category: "Aircraft", root: "Aviation" },
  { family: "Aviation Device Issuing", subject: "Device", group: "Code signing", product: "Device Code Signing - Boarding pass", crypto: "ECDSA or RSA", category: "Device Code Signing", root: "Aviation" },
  { family: "Aviation Device Issuing", subject: "Device", group: "Code signing", product: "Device Code Signing - Standard", crypto: "ECDSA or RSA", category: "Device Code Signing", root: "Aviation" },
  { family: "Aviation Device Issuing", subject: "Device", group: "Code signing", product: "Device Code Signing - Lifetime", crypto: "ECDSA or RSA", category: "Device Code Signing", root: "Aviation" },
  { family: "Aviation Device Issuing", subject: "Device", group: "Document signing", product: "Device Document Signing - Microsoft", crypto: "ECDSA or RSA", category: "Device Document Signing", root: "Aviation" },
  { family: "Aviation Device Issuing", subject: "Device", group: "Document signing", product: "Device Document Signing - PDF", crypto: "ECDSA or RSA", category: "Device Document Signing", root: "Aviation" },
  { family: "Aviation Device Issuing", subject: "Device", group: "Device Encryption", product: "Archive Encryption", crypto: "ECDSA", category: "Device Encryption", root: "Aviation" },
  { family: "Aviation Device Issuing", subject: "Device", group: "Device Encryption", product: "Archive Encryption", crypto: "RSA", category: "Device Encryption", root: "Aviation" },
  { family: "Aviation Device Issuing", subject: "Device", group: "Device Encryption", product: "Database Encryption", crypto: "ECDSA", category: "Device Encryption", root: "Aviation" },
  { family: "Aviation Device Issuing", subject: "Device", group: "Device Encryption", product: "Database Encryption", crypto: "RSA", category: "Device Encryption", root: "Aviation" },
  { family: "Aviation Device Issuing", subject: "Device", group: "Device Encryption", product: "Message Encryption", crypto: "ECDSA", category: "Device Encryption", root: "Aviation" },
  { family: "Aviation Device Issuing", subject: "Device", group: "Device Encryption", product: "Message Encryption", crypto: "RSA", category: "Device Encryption", root: "Aviation" },
  { family: "Aviation Device Issuing", subject: "Device", group: "Device Identity", product: "Device Identity - Domain Controller", crypto: "ECDSA or RSA", category: "Device Identity", root: "Aviation" },
  { family: "Aviation Device Issuing", subject: "Device", group: "Device Identity", product: "Device Identity - VPN Client", crypto: "ECDSA or RSA", category: "Device Identity", root: "Aviation" },
  { family: "Aviation Device Issuing", subject: "Device", group: "Device Identity", product: "Device Identity - VPN Server", crypto: "ECDSA or RSA", category: "Device Identity", root: "Aviation" },
  { family: "Aviation Device Issuing", subject: "Device", group: "Device Identity", product: "Device Identity - Web Client", crypto: "ECDSA or RSA", category: "Device Identity", root: "Aviation" },
  { family: "Aviation Device Issuing", subject: "Device", group: "Device Identity", product: "Device Identity - Web Server", crypto: "ECDSA or RSA", category: "Device Identity", root: "Aviation" },
  { family: "Aviation Device Issuing", subject: "Device", group: "Device Identity", product: "Device Identity - Workstation", crypto: "ECDSA or RSA", category: "Device Identity", root: "Aviation" },
  { family: "Aviation Device Issuing", subject: "Device", group: "Device Signature", product: "Device Signature - Archive", crypto: "ECDSA or RSA", category: "Device Signature", root: "Aviation" },
  { family: "Aviation Device Issuing", subject: "Device", group: "Device Signature", product: "Device Signature - Assertion", crypto: "ECDSA or RSA", category: "Device Signature", root: "Aviation" },
  { family: "Aviation Device Issuing", subject: "Device", group: "Device Signature", product: "Device Signature - Message", crypto: "ECDSA or RSA", category: "Device Signature", root: "Aviation" },
  { family: "Aviation Device Issuing", subject: "Server", group: "Server role", product: "Server - SCVP Server", crypto: "ECDSA or RSA", category: "Server", root: "Aviation" },
  { family: "Aviation Device Issuing", subject: "Server", group: "Server role", product: "Server - TSA Server", crypto: "ECDSA or RSA", category: "Server", root: "Aviation" },
  { family: "Aviation Role Issuing", subject: "Role", group: "Certificate purpose", product: "Role Encryption", crypto: "ECDSA", category: "Role", root: "Aviation" },
  { family: "Aviation Role Issuing", subject: "Role", group: "Certificate purpose", product: "Role Encryption", crypto: "RSA", category: "Role", root: "Aviation" },
  { family: "Aviation Role Issuing", subject: "Role", group: "Certificate purpose", product: "Role Signature", crypto: "ECDSA or RSA", category: "Role", root: "Aviation" },
  { family: "Aviation Subscriber Issuing", subject: "Subscriber", group: "Certificate purpose", product: "Subscriber Encryption", crypto: "ECDSA", category: "Subscriber", root: "Aviation" },
  { family: "Aviation Subscriber Issuing", subject: "Subscriber", group: "Certificate purpose", product: "Subscriber Encryption", crypto: "RSA", category: "Subscriber", root: "Aviation" },
  { family: "Aviation Subscriber Issuing", subject: "Subscriber", group: "Certificate purpose", product: "Subscriber Identity", crypto: "ECDSA", category: "Subscriber", root: "Aviation", assumed: true },
  { family: "Aviation Subscriber Issuing", subject: "Subscriber", group: "Certificate purpose", product: "Subscriber Signature", crypto: "ECDSA or RSA", category: "Subscriber", root: "Aviation" },
  { family: "Aviation Subscriber Issuing", subject: "Subscriber document signing", group: "Document signing", product: "Subscriber Document Signing - Microsoft", crypto: "ECDSA or RSA", category: "Subscriber", root: "Aviation", assumed: true },
  { family: "Aviation Subscriber Issuing", subject: "Subscriber document signing", group: "Document signing", product: "Subscriber Document Signing - PDF", crypto: "ECDSA or RSA", category: "Subscriber", root: "Aviation", assumed: true },
  { family: "ATN-IPS", subject: "Aircraft", group: "ATN-IPS identity", product: "ATN-IPS Aircraft Identity", crypto: "ECDSA", category: "Aircraft", root: "ATN-IPS" },
  { family: "ATN-IPS", subject: "Ground Device", group: "Ground device identity", product: "Ground Device Identity - ANSP", crypto: "ECDSA", category: "Ground Device Identity", root: "ATN-IPS" },
  { family: "ATN-IPS", subject: "Ground Device", group: "Ground device identity", product: "Ground Device Identity - AOC", crypto: "ECDSA", category: "Ground Device Identity", root: "ATN-IPS" },
  { family: "ATN-IPS", subject: "Ground Device", group: "Ground device identity", product: "Ground Device Identity - Content Provider", crypto: "ECDSA", category: "Ground Device Identity", root: "ATN-IPS" },
  { family: "ATN-IPS", subject: "Ground Device", group: "Ground device identity", product: "Ground Device Identity - IPS GW", crypto: "ECDSA", category: "Ground Device Identity", root: "ATN-IPS" }
];

const steps = ["family", "subject", "group", "product", "crypto"];
const labels = { family: "Issuing family", subject: "Subject type", group: "Use case group", product: "Product", crypto: "Cryptography" };
const ouOptions = { Operations: ["Security", "Compliance"], Engineering: ["Avionics", "Certification"], Corporate: ["Legal", "Finance"] };
const enrollmentOptions = [
  { key: "manual", title: "Manual (Upload CSR)", desc: "Paste a Certificate Signing Request and download the issued certificate.", icon: "file" },
  { key: "acme", title: "Automated (ACME)", desc: "Use ACME with External Account Binding credentials.", icon: "code" },
  { key: "scep", title: "Device Enrollment (SCEP)", desc: "Download a mobileconfig or scan a QR code from the device.", icon: "device" },
  { key: "mdm", title: "Enterprise (MDM / Intune)", desc: "Install a management profile through MDM/Intune.", icon: "server" }
];

function inferIconName(option, key, index = 0) {
  const text = (option || "").toLowerCase();
  if (key === "crypto") return index % 2 === 0 ? "key" : "shield";
  const explicit = {
    "aircraft issuing": "plane", "aviation device issuing": "device", "aviation role issuing": "role", "aviation subscriber issuing": "user", "atn-ips": "globe", aircraft: "plane", device: "device", server: "server", role: "role", subscriber: "user", "subscriber document signing": "pdf", "ground device": "network", "certificate purpose": "id", "code signing": "code", "document signing": "pdf", "device encryption": "lock", "device identity": "id", "device signature": "signature", "server role": "server", "atn-ips identity": "globe", "ground device identity": "network", "aircraft encryption": "lock", "aircraft identity": "id", "aircraft signature": "signature", "archive encryption": "archive", "database encryption": "database", "message encryption": "message", "role encryption": "lock", "role signature": "signature", "subscriber encryption": "lock", "subscriber identity": "id", "subscriber signature": "signature", "device code signing - boarding pass": "qr", "device code signing - standard": "code", "device code signing - lifetime": "clock", "device document signing - microsoft": "file", "device document signing - pdf": "pdf", "device identity - domain controller": "network", "device identity - vpn client": "key", "device identity - vpn server": "shield", "device identity - web client": "laptop", "device identity - web server": "server", "device identity - workstation": "device", "device signature - archive": "archive", "device signature - assertion": "check", "device signature - message": "message", "server - scvp server": "server", "server - tsa server": "clock", "ground device identity - ansp": "network", "ground device identity - aoc": "globe", "ground device identity - content provider": "file", "ground device identity - ips gw": "server"
  };
  if (explicit[text]) return explicit[text];
  if (text.includes("aircraft")) return "plane";
  if (text.includes("device")) return "device";
  if (text.includes("server")) return "server";
  if (text.includes("encryption")) return "lock";
  if (text.includes("identity")) return "id";
  if (text.includes("signature")) return "signature";
  if (text.includes("signing")) return "code";
  if (text.includes("document")) return "pdf";
  if (text.includes("database")) return "database";
  if (text.includes("message")) return "message";
  return ["file", "code", "shield", "device", "server", "globe"][index % 6];
}
function iconMapForOptions(options, key) {
  const fallbackPool = ["file", "code", "device", "server", "shield", "plane", "user", "role", "globe", "lock", "key", "id", "signature", "database", "message", "archive", "pdf", "clock", "laptop", "network", "qr"];
  const used = new Set();
  const map = {};
  options.forEach((option, index) => {
    let icon = inferIconName(option, key, index);
    if (used.has(icon)) icon = fallbackPool.find(candidate => !used.has(candidate)) || icon;
    used.add(icon);
    map[option] = icon;
  });
  return map;
}
function unique(values) { return [...new Set(values.filter(Boolean))]; }
function cryptoOptions(value) { return value === "ECDSA or RSA" ? ["ECDSA", "RSA"] : [value]; }
function filterProducts(selection, untilKey) {
  return products.filter(row => {
    for (const key of steps) {
      if (key === untilKey) break;
      if (selection[key] && row[key] !== selection[key]) return false;
    }
    return true;
  });
}
function optionsFor(key, selection) {
  const scoped = filterProducts(selection, key);
  if (key === "crypto") return unique(scoped.flatMap(row => cryptoOptions(row.crypto)));
  return unique(scoped.map(row => row[key]));
}
function autoResolve(selection, start = 0) {
  const next = { ...selection };
  const auto = {};
  for (let i = start; i < steps.length; i++) {
    const opts = optionsFor(steps[i], next);
    if (opts.length === 1) { next[steps[i]] = opts[0]; auto[steps[i]] = true; continue; }
    return { selection: next, auto, index: i };
  }
  return { selection: next, auto, index: steps.length };
}
function selectedProduct(selection) { return products.find(row => steps.every(key => !selection[key] || row[key] === selection[key])); }
function subjectRules(product) {
  if (!product) return { cn: "Common Name", sanType: "none", sanLabel: "", sanMax: 0, sanHelp: "Select a product to see subject requirements" };
  const text = product.product.toLowerCase();
  if (text.includes("scvp") || text.includes("tsa")) return { cn: "Host Name | Host IP Address | Host URI", sanType: "dNSName", sanLabel: "dNSName", sanMax: 1, sanHelp: "Server certificates require a DNS name." };
  if (product.category === "Device Identity" || product.root === "ATN-IPS") return { cn: "Host Name | Host IP Address | Host URI", sanType: "multi", sanLabel: "dNSName or Microsoft GUID", sanMax: 5, sanHelp: "Add up to five SAN entries (domain or GUID)." };
  if (text.includes("aircraft identity")) return { cn: "Aircraft ID | Aircraft Equipment ID", sanType: "registeredID", sanLabel: "registeredID", sanMax: 1, sanHelp: "Aircraft identity requires a registered identifier." };
  if (text.includes("identity")) return { cn: "Device ID | Serial Number | Host Name", sanType: "dNSName", sanLabel: "dNSName", sanMax: 1, sanHelp: "Provide a hostname or identifier." };
  return { cn: "Device ID", sanType: "none", sanLabel: "", sanMax: 0, sanHelp: "No SAN required for this certificate" };
}
function validateCn(value) { return value.trim().length > 1; }
function validateSan(value) { return value.trim().length > 1; }
const tests = [
  { name: "has enrolment options", pass: enrollmentOptions.length === 4 },
  { name: "SCEP and MDM options exist", pass: ["scep", "mdm"].every(k => enrollmentOptions.some(o => o.key === k)) },
  { name: "ATN-IPS allows five SAN entries", pass: subjectRules(products.find(p => p.root === "ATN-IPS")).sanMax === 5 },
  { name: "QR modal state can be represented", pass: true }
];
function DetailRows({ rows }) {
  return <div className="mt-3 grid gap-2 text-sm">{rows.map(([k, v]) => <div key={k} className="flex justify-between gap-4 border-b border-slate-200 pb-2 last:border-0"><span className="text-slate-500">{k}</span><span className="max-w-[260px] text-right font-medium">{v}</span></div>)}</div>;
}
function RealisticQrCode() {
  const size = 25;
  const filled = new Set(["0,0","0,1","0,2","0,3","0,4","0,5","0,6","1,0","1,6","2,0","2,2","2,3","2,4","2,6","3,0","3,2","3,3","3,4","3,6","4,0","4,2","4,3","4,4","4,6","5,0","5,6","6,0","6,1","6,2","6,3","6,4","6,5","6,6","0,18","0,19","0,20","0,21","0,22","0,23","0,24","1,18","1,24","2,18","2,20","2,21","2,22","2,24","3,18","3,20","3,21","3,22","3,24","4,18","4,20","4,21","4,22","4,24","5,18","5,24","6,18","6,19","6,20","6,21","6,22","6,23","6,24","18,0","18,1","18,2","18,3","18,4","18,5","18,6","19,0","19,6","20,0","20,2","20,3","20,4","20,6","21,0","21,2","21,3","21,4","21,6","22,0","22,2","22,3","22,4","22,6","23,0","23,6","24,0","24,1","24,2","24,3","24,4","24,5","24,6","8,2","8,4","8,7","8,8","8,10","8,14","8,16","8,17","8,20","9,0","9,3","9,5","9,9","9,11","9,12","9,15","9,19","9,22","10,1","10,4","10,8","10,9","10,13","10,17","10,18","10,21","11,2","11,6","11,7","11,10","11,12","11,16","11,20","11,23","12,0","12,5","12,8","12,11","12,14","12,15","12,18","12,22","13,3","13,4","13,7","13,9","13,13","13,17","13,19","13,24","14,1","14,6","14,10","14,12","14,16","14,21","15,0","15,2","15,5","15,8","15,11","15,15","15,18","15,20","15,23","16,4","16,7","16,9","16,14","16,17","16,19","16,22","17,1","17,5","17,8","17,12","17,13","17,16","17,21","18,9","18,11","18,15","18,18","18,20","18,24","19,8","19,10","19,14","19,17","19,19","19,22","20,9","20,12","20,13","20,16","20,21","21,8","21,11","21,15","21,18","21,20","21,23","22,10","22,14","22,17","22,19","22,22","23,8","23,12","23,16","23,21","24,9","24,11","24,15","24,18","24,20","24,23"]);
  return <div className="mx-auto my-5 rounded-2xl bg-white p-4 shadow-inner ring-1 ring-slate-200"><div className="grid h-56 w-56 gap-0.5" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>{Array.from({ length: size * size }).map((_, index) => { const row = Math.floor(index / size); const col = index % size; return <div key={index} className={filled.has(`${row},${col}`) ? "bg-slate-950" : "bg-white"} />; })}</div></div>;
}
function QrModal({ onClose }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl"><h3 className="text-lg font-semibold">Scan QR code</h3><p className="mt-1 text-sm text-slate-500">Mock QR for https://www.example.com</p><RealisticQrCode /><div className="mb-4 rounded-2xl bg-slate-50 px-3 py-2 font-mono text-xs text-slate-600">https://www.example.com</div><Button variant="outline" onClick={onClose}>Close</Button></div></div>;
}

export default function AviationProductWizardSpec() {
  const initial = autoResolve({}, 0);
  const [selection, setSelection] = useState(initial.selection);
  const [autoSelected, setAutoSelected] = useState(initial.auto);
  const [stepIndex, setStepIndex] = useState(initial.index);
  const [flow, setFlow] = useState("select");
  const [ou1, setOu1] = useState("");
  const [ou2, setOu2] = useState("");
  const [cn, setCn] = useState("");
  const [sanInput, setSanInput] = useState("");
  const [sans, setSans] = useState([]);
  const [enrollment, setEnrollment] = useState("");
  const [csr, setCsr] = useState("");
  const [showQrModal, setShowQrModal] = useState(false);
  const [showTests, setShowTests] = useState(false);

  const currentKey = steps[stepIndex];
  const product = selectedProduct(selection);
  const rules = subjectRules(product);
  const opts = currentKey ? optionsFor(currentKey, selection) : [];
  const optionIconMap = useMemo(() => iconMapForOptions(opts, currentKey), [opts, currentKey]);
  const validCn = validateCn(cn);
  const validSans = sans.every(validateSan);
  const canContinueSubject = validCn && validSans;
  const orderRows = [["Product", selection.product || "-"], ["Issuing family", selection.family || "-"], ["Cryptography", selection.crypto || "-"], ["Common name", cn || "required"], ["OU1", ou1 || "not included"], ["OU2", ou2 || "not included"], ["SAN", rules.sanType === "none" ? "not present" : sans.length ? sans.join(", ") : "not entered"], ["Enrolment", enrollmentOptions.find(o => o.key === enrollment)?.title || "not selected"]];

  function choose(value) {
    const next = { ...selection, [currentKey]: value };
    const auto = { ...autoSelected };
    const pos = steps.indexOf(currentKey);
    delete auto[currentKey];
    steps.slice(pos + 1).forEach(k => { delete next[k]; delete auto[k]; });
    const resolved = autoResolve(next, pos + 1);
    setSelection(resolved.selection);
    setAutoSelected({ ...auto, ...resolved.auto });
    setStepIndex(resolved.index);
    setFlow(resolved.index >= steps.length ? "subject" : "select");
  }
  function addSan() { if (sanInput.trim() && sans.length < rules.sanMax && validateSan(sanInput)) { setSans([...sans, sanInput.trim()]); setSanInput(""); } }
  function reset() { const r = autoResolve({}, 0); setSelection(r.selection); setAutoSelected(r.auto); setStepIndex(r.index); setFlow("select"); setOu1(""); setOu2(""); setCn(""); setSans([]); setEnrollment(""); setCsr(""); }
  function heading() { if (flow === "subject") return "Step 5: Complete subject details"; if (flow === "enrollment") return "Step 6: Choose enrolment method"; if (flow === "manual") return "Step 7: Upload CSR"; if (flow === "ready") return "Step 8: Certificate ready"; if (flow === "acme") return "Step 7: ACME configuration"; if (flow === "scep") return "Step 7: SCEP enrolment ready"; if (flow === "mdm") return "Step 7: MDM enrolment ready"; return labels[currentKey]; }

  return <div className="min-h-screen bg-slate-50 p-6 text-slate-900"><div className="mx-auto max-w-7xl"><div className="mb-6 flex items-end justify-between gap-4"><div><div className="mb-2 inline-flex rounded-full bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">Clickable UI spec</div><h1 className="text-3xl font-semibold">Product selection wizard</h1></div><div className="flex gap-2"><Button variant="outline" onClick={() => setShowTests(!showTests)}>{tests.filter(t => t.pass).length}/{tests.length} tests</Button><Button variant="outline" onClick={reset}>Reset</Button></div></div>{showTests && <div className="mb-6 grid gap-2 rounded-3xl border bg-white p-4 md:grid-cols-2">{tests.map(t => <div key={t.name} className={`rounded-2xl px-3 py-2 text-sm ${t.pass ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{t.pass ? "PASS" : "FAIL"}: {t.name}</div>)}</div>}<div className="grid gap-6 lg:grid-cols-[1fr_360px]"><main className="rounded-3xl border bg-white p-6 shadow-sm"><div className="mb-6 flex flex-wrap gap-2">{steps.map((k, i) => selection[k] && <button key={k} onClick={() => { setFlow("select"); setStepIndex(i); }} className={`rounded-full px-3 py-2 text-xs font-medium ${flow === "select" && stepIndex === i ? "bg-slate-900 text-white" : "bg-emerald-50 text-emerald-700"}`}><Icon name="check" className="mr-1 inline h-3 w-3" />{labels[k]}{autoSelected[k] ? " auto" : ""}</button>)}{stepIndex >= steps.length && <button onClick={() => setFlow("subject")} className={`rounded-full px-3 py-2 text-xs font-medium ${flow === "subject" ? "bg-slate-900 text-white" : "bg-emerald-50 text-emerald-700"}`}>Subject</button>}{enrollment && <button onClick={() => setFlow("enrollment")} className={`rounded-full px-3 py-2 text-xs font-medium ${flow === "enrollment" ? "bg-slate-900 text-white" : "bg-emerald-50 text-emerald-700"}`}>Enrolment</button>}</div><div className="mb-5 flex justify-between gap-4"><div><h2 className="text-2xl font-semibold">{heading()}</h2><p className="mt-1 text-sm text-slate-600">Complete each step to prepare the certificate request.</p></div>{flow !== "select" && <Button variant="ghost" onClick={() => flow === "subject" ? setFlow("select") : setFlow("enrollment")}><Icon name="back" />Back</Button>}</div>{flow === "select" && currentKey ? <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{opts.map(option => <button key={option} onClick={() => choose(option)} className="rounded-3xl border bg-white p-4 text-left shadow-sm hover:shadow-md"><div className="mb-3 rounded-2xl bg-slate-100 p-2 text-slate-700 inline-flex"><Icon name={optionIconMap[option]} /></div><div className="font-semibold">{option}</div><div className="mt-2 text-xs text-slate-500">{filterProducts(selection, currentKey).filter(r => currentKey === "crypto" ? cryptoOptions(r.crypto).includes(option) : r[currentKey] === option).length} matching options</div></button>)}</div> : flow === "subject" ? <div><div className="rounded-3xl border bg-slate-50 p-4"><h3 className="text-lg font-semibold">Subject common name <span className="text-xs text-red-600">required</span></h3><p className="mt-1 text-sm text-slate-600">Allowed CN content: <b>{rules.cn}</b></p><input value={cn} onChange={e => setCn(e.target.value)} placeholder={`Enter one of: ${rules.cn}`} className={`mt-3 w-full rounded-2xl border bg-white px-3 py-3 text-sm outline-none ${validCn ? "border-emerald-300" : "border-red-200"}`} />{!validCn && <div className="mt-2 text-xs font-medium text-red-700">Common name is required.</div>}</div><div className="mt-5 grid gap-5 md:grid-cols-2"><select value={ou1} onChange={e => { setOu1(e.target.value); setOu2(""); }} className="rounded-2xl border px-3 py-3"><option value="">No OU1</option>{Object.keys(ouOptions).map(o => <option key={o}>{o}</option>)}</select><select value={ou2} disabled={!ou1} onChange={e => setOu2(e.target.value)} className="rounded-2xl border px-3 py-3 disabled:bg-slate-100"><option value="">{ou1 ? "No OU2" : "Choose OU1 first"}</option>{(ouOptions[ou1] || []).map(o => <option key={o}>{o}</option>)}</select></div>{rules.sanType !== "none" && <div className="mt-5 rounded-3xl border bg-slate-50 p-4"><h3 className="font-semibold">Subject Alternative Name</h3><p className="mt-1 text-sm text-slate-600">{rules.sanHelp}</p><div className="mt-3 flex gap-2"><input value={sanInput} onChange={e => setSanInput(e.target.value)} placeholder={rules.sanLabel} className="w-full rounded-2xl border px-3 py-3" /><Button variant="outline" disabled={!sanInput.trim() || sans.length >= rules.sanMax} onClick={addSan}><Icon name="plus" /></Button></div><div className="mt-2 text-xs text-slate-500">{sans.length}/{rules.sanMax} SAN entries added</div><div className="mt-3 flex flex-wrap gap-2">{sans.map((s, i) => <span key={`${s}-${i}`} className="rounded-full border bg-white px-3 py-1 text-xs">{s} <button onClick={() => setSans(sans.filter((_, idx) => idx !== i))}>x</button></span>)}</div></div>}<Button className="mt-5" disabled={!canContinueSubject} onClick={() => setFlow("enrollment")}>Choose enrolment method</Button></div> : flow === "enrollment" ? <div className="rounded-3xl border bg-white p-6"><h3 className="text-xl font-semibold">How should this device receive its certificate?</h3><div className="mt-6 space-y-4">{enrollmentOptions.map(o => <button key={o.key} onClick={() => setEnrollment(o.key)} className={`flex w-full gap-4 rounded-2xl border p-4 text-left ${enrollment === o.key ? "border-slate-900 bg-slate-50" : "border-slate-200"}`}><div className="rounded-xl bg-slate-100 p-2"><Icon name={o.icon} /></div><div><div className="font-semibold">{o.title}</div><div className="text-sm text-slate-600">{o.desc}</div></div></button>)}</div><Button className="mt-5" disabled={!enrollment} onClick={() => setFlow(enrollment === "manual" ? "manual" : enrollment)}>Continue</Button></div> : flow === "manual" ? <div className="rounded-3xl border bg-white p-6"><h3 className="text-xl font-semibold">Manual CSR upload</h3><DetailRows rows={orderRows} /><textarea value={csr} onChange={e => setCsr(e.target.value)} rows={10} placeholder={`-----BEGIN CERTIFICATE REQUEST-----\n...paste CSR here...\n-----END CERTIFICATE REQUEST-----`} className="mt-5 w-full rounded-2xl border p-3 font-mono text-xs" /><Button className="mt-5" disabled={csr.trim().length < 40} onClick={() => setFlow("ready")}>Submit CSR</Button></div> : flow === "ready" ? <div className="rounded-3xl border bg-white p-6"><h3 className="text-xl font-semibold">Certificate issued</h3><DetailRows rows={orderRows} /><div className="mt-5 rounded-2xl bg-slate-900 p-4 text-sm text-white">Bundle contents: certificate.pem, chain.pem, ca.pem, order-summary.json</div><Button className="mt-5"><Icon name="download" />Download certificate ZIP</Button></div> : flow === "acme" ? <div className="rounded-3xl border bg-white p-6"><h3 className="text-xl font-semibold">ACME configuration</h3><p className="mt-2 text-sm text-slate-600">Use External Account Binding with your ACME client.</p><DetailRows rows={orderRows} /><div className="mt-5 grid gap-3 text-sm"><div className="rounded-2xl bg-slate-50 p-3"><b>Directory URL:</b> https://acme.example.com/directory</div><div className="rounded-2xl bg-slate-50 p-3"><b>EAB Key ID:</b> abc123</div><div className="rounded-2xl bg-slate-50 p-3"><b>EAB HMAC Key:</b> **************</div></div><div className="mt-5 rounded-2xl bg-slate-900 p-4 font-mono text-xs text-white">certbot --server https://acme.example.com/directory --eab-kid abc123 --eab-hmac-key **************</div></div> : flow === "scep" || flow === "mdm" ? <div className="rounded-3xl border bg-white p-6"><h3 className="text-xl font-semibold">{flow === "scep" ? "SCEP enrolment ready" : "MDM enrolment ready"}</h3><p className="mt-2 text-sm text-slate-600">The portal has generated a short-lived profile URL and enrolment credential.</p><DetailRows rows={orderRows} /><div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><b>Waiting for device to enrol...</b><br />Download the profile or scan the QR code from the device.</div><div className="mt-5 flex flex-wrap gap-3"><Button><Icon name="download" />Download {flow === "scep" ? "mobileconfig" : "MDM profile"}</Button><Button variant="outline" onClick={() => setShowQrModal(true)}><Icon name="qr" />Show QR code</Button></div><div className="mt-3 text-xs text-amber-700">Profile URL expires in 09:48</div></div> : null}</main><aside className="space-y-4"><div className="rounded-3xl border bg-white p-5 shadow-sm"><h3 className="mb-4 text-lg font-semibold">Live configuration</h3><DetailRows rows={orderRows} /></div></aside></div></div>{showQrModal && <QrModal onClose={() => setShowQrModal(false)} />}</div>;
}
