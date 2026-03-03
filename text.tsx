import { useState, useEffect, useRef } from "react";

const COLORS = {
  blue: "#165CFF",
  navy: "#001851",
  yellow: "#FFCD38",
  lightBlue: "#ECF8FF",
  navyTint: "#E5E7ED",
  white: "#FFFFFF",
};

const breeds = [
  "Labrador Retriever",
  "Golden Retriever",
  "French Bulldog",
  "German Shepherd",
  "Poodle",
  "Bulldog",
  "Beagle",
  "Rottweiler",
  "Dachshund",
  "Boxer",
  "Shih Tzu",
  "Siberian Husky",
  "Great Dane",
  "Doberman",
  "Border Collie",
  "Cocker Spaniel",
  "Cavalier King Charles",
  "Maltipoo",
  "Cane Corso",
  "Mixed Breed",
  "Other",
];
const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

const SCREENS = [
  "onboard1",
  "onboard2",
  "onboard3",
  "welcome",
  "dog_name",
  "breed",
  "age",
  "gender",
  "microchip",
  "spayed",
  "location",
  "medical_intro",
  "medical_history",
  "preexisting",
  "chronic",
  "behavioral",
  "medications",
  "surgery",
  "approval",
  "coverage",
  "quote",
  "payment",
  "success",
  "login",
  "profile",
  "claims",
];

const calcPremium = (data, overrides = {}) => {
  const d = { ...data, ...overrides };
  let base = 600;
  const br = {
    "French Bulldog": 1.4,
    Bulldog: 1.35,
    "Great Dane": 1.3,
    Rottweiler: 1.25,
    Boxer: 1.2,
    Dachshund: 1.2,
    "Siberian Husky": 1.1,
    "German Shepherd": 1.1,
    "Cane Corso": 1.25,
    Doberman: 1.2,
  };
  base *= br[d.breed] || 1.0;
  const age = parseInt(d.age) || 2;
  if (age <= 1) base *= 0.9;
  else if (age <= 3) base *= 1.0;
  else if (age <= 6) base *= 1.15;
  else if (age <= 9) base *= 1.35;
  else base *= 1.6;
  if (!d.spayed) base *= 1.1;
  if (!d.microchipped) base *= 1.05;
  const lim = parseInt(d.coverageLimit) || 10000;
  if (lim === 10000) base *= 1.0;
  else if (lim === 15000) base *= 1.18;
  else if (lim === 20000) base *= 1.35;
  base *= Math.max(0.7, 1 - ((parseInt(d.deductible) || 250) / 2000) * 0.3);
  base *= 0.5 + ((parseInt(d.reimbursement) || 80) / 100) * 0.7;
  if (d.preexisting) base *= 1.2;
  if (d.chronic) base *= 1.3;
  if (d.behavioral) base *= 1.1;
  if (d.medications) base *= 1.15;
  if (d.surgery) base *= 1.25;
  return Math.round(base);
};

const getApprovalStatus = (data) => {
  const flags = [
    data.preexisting,
    data.chronic,
    data.behavioral,
    data.medications,
    data.surgery,
  ].filter(Boolean).length;
  if (flags >= 3 && parseInt(data.age || 2) >= 9) return "referred";
  if (flags >= 4) return "referred";
  return "approved";
};

const DogIcon = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="32" fill={COLORS.blue} />
    <path d="M20 26c0-8 24-8 24 0v10c0 8-24 8-24 0V26z" fill="white" />
    <ellipse cx="32" cy="38" rx="6" ry="4" fill="#FFB347" />
    <circle cx="26" cy="28" r="3" fill={COLORS.navy} />
    <circle cx="38" cy="28" r="3" fill={COLORS.navy} />
    <circle cx="27" cy="27" r="1" fill="white" />
    <circle cx="39" cy="27" r="1" fill="white" />
    <ellipse cx="32" cy="34" rx="3" ry="2" fill="#FF8FAB" />
    <path
      d="M15 20 Q12 14 18 16"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M49 20 Q52 14 46 16"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const Btn = ({ children, onClick, disabled, yellow }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      background: disabled ? "#ccc" : yellow ? COLORS.yellow : COLORS.blue,
      color: yellow ? COLORS.navy : "white",
      border: "none",
      borderRadius: 50,
      padding: "16px 32px",
      fontSize: 16,
      fontWeight: 700,
      cursor: disabled ? "not-allowed" : "pointer",
      width: "100%",
      fontFamily: "inherit",
      transition: "all 0.2s",
      opacity: disabled ? 0.5 : 1,
    }}
  >
    {children}
  </button>
);

const Input = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  maxLength,
}) => (
  <div style={{ marginBottom: 14 }}>
    {label && (
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: COLORS.navy,
          marginBottom: 5,
        }}
      >
        {label}
      </div>
    )}
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type={type}
      placeholder={placeholder}
      maxLength={maxLength}
      style={{
        width: "100%",
        padding: "13px 14px",
        borderRadius: 10,
        border: `2px solid ${COLORS.navyTint}`,
        fontSize: 15,
        fontFamily: "inherit",
        outline: "none",
        boxSizing: "border-box",
        color: COLORS.navy,
        background: "white",
      }}
    />
  </div>
);

const SelectInput = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: 14 }}>
    {label && (
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: COLORS.navy,
          marginBottom: 5,
        }}
      >
        {label}
      </div>
    )}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "13px 14px",
        borderRadius: 10,
        border: `2px solid ${COLORS.navyTint}`,
        fontSize: 15,
        fontFamily: "inherit",
        outline: "none",
        boxSizing: "border-box",
        color: value ? "#001851" : "#999",
        background: "white",
        appearance: "none",
      }}
    >
      <option value="">Select...</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);

const YesNo = ({ value, onChange, onBack }) => (
  <div>
    <div style={{ display: "flex", gap: 10, marginBottom: 4 }}>
      {["Yes", "No"].map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt === "Yes")}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 16,
            fontFamily: "inherit",
            cursor: "pointer",
            transition: "all 0.2s",
            border: `2px solid ${value === (opt === "Yes") ? COLORS.blue : COLORS.navyTint}`,
            background: value === (opt === "Yes") ? "#EEF3FF" : "white",
            color: COLORS.navy,
          }}
        >
          {opt}
        </button>
      ))}
    </div>
    {onBack && (
      <button
        onClick={onBack}
        style={{
          marginTop: 16,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#999",
          fontSize: 14,
          fontFamily: "inherit",
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "8px 0",
        }}
      >
        ← Go back
      </button>
    )}
  </div>
);

const TwoCard = ({ options, value, onChange, onBack }) => (
  <div>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        marginBottom: 4,
      }}
    >
      {options.map(({ l, v }) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          style={{
            padding: "24px 16px",
            borderRadius: 16,
            fontWeight: 700,
            fontSize: 17,
            fontFamily: "inherit",
            cursor: "pointer",
            transition: "all 0.2s",
            textAlign: "center",
            border: `2px solid ${value === v ? COLORS.blue : COLORS.navyTint}`,
            background: value === v ? "#EEF3FF" : "white",
            color: COLORS.navy,
          }}
        >
          {l}
        </button>
      ))}
    </div>
    {onBack && (
      <button
        onClick={onBack}
        style={{
          marginTop: 16,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#999",
          fontSize: 14,
          fontFamily: "inherit",
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "8px 0",
        }}
      >
        ← Go back
      </button>
    )}
  </div>
);

const ProgressDots = ({ current, total }) => (
  <div
    style={{
      display: "flex",
      gap: 4,
      justifyContent: "center",
      marginBottom: 8,
    }}
  >
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        style={{
          width: i === current ? 20 : 6,
          height: 6,
          borderRadius: 3,
          background: i <= current ? COLORS.blue : COLORS.navyTint,
          transition: "all 0.3s",
        }}
      />
    ))}
  </div>
);

const PriceTag = ({ annual }) => (
  <div
    style={{
      background: "#EEF3FF",
      borderRadius: 12,
      padding: "10px 14px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    }}
  >
    <span style={{ fontSize: 13, color: COLORS.navy, fontWeight: 500 }}>
      Estimated premium
    </span>
    <div style={{ textAlign: "right" }}>
      <span style={{ fontSize: 22, fontWeight: 800, color: COLORS.blue }}>
        ${annual.toLocaleString()}
      </span>
      <span style={{ fontSize: 12, color: "#666", marginLeft: 4 }}>/yr</span>
      <div style={{ fontSize: 12, color: "#999" }}>
        ${Math.round(annual / 12)}/mo
      </div>
    </div>
  </div>
);

function ApprovalScreen({ data, onApproved, onReferred }) {
  const [phase, setPhase] = useState("checking");
  const [activeCheck, setActiveCheck] = useState(0);
  const [cv, setCv] = useState([false, false, false, false, false]);
  const checks = [
    { label: "Verifying breed & age profile", duration: 800 },
    { label: "Reviewing health history", duration: 1000 },
    { label: "Checking location & risk factors", duration: 700 },
    { label: "Assessing eligibility criteria", duration: 900 },
    { label: "Calculating your options", duration: 600 },
  ];
  useEffect(() => {
    let i = 0;
    const reveal = () => {
      if (i < checks.length) {
        const idx = i;
        setActiveCheck(idx);
        setCv((p) => {
          const n = [...p];
          n[idx] = true;
          return n;
        });
        i++;
        setTimeout(reveal, checks[idx].duration);
      } else {
        setTimeout(() => setPhase(getApprovalStatus(data)), 600);
      }
    };
    setTimeout(reveal, 400);
  }, []);

  const CM = ({ done, isActive }) => (
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: "50%",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          done && !isActive
            ? COLORS.blue
            : isActive
              ? "#EEF3FF"
              : COLORS.navyTint,
        border: isActive ? `2px solid ${COLORS.blue}` : "none",
        transition: "all 0.4s",
      }}
    >
      {done && !isActive && (
        <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>✓</span>
      )}
      {isActive && (
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: COLORS.blue,
          }}
        />
      )}
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#001851",
        padding: 20,
      }}
    >
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes popIn{0%{transform:scale(0.4);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}`}</style>
      <div
        style={{
          width: 375,
          minHeight: 700,
          borderRadius: 40,
          boxShadow: "0 30px 80px rgba(0,0,20,0.5)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          fontFamily: "system-ui,sans-serif",
          background: phase === "checking" ? "#F0F6FF" : "#001851",
        }}
      >
        {phase === "checking" && (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: 32,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 32,
              }}
            >
              <span
                style={{ fontWeight: 800, fontSize: 18, color: COLORS.blue }}
              >
                Deefa
              </span>
              <span style={{ fontSize: 11, color: COLORS.navy, opacity: 0.6 }}>
                Dog only Insurance
              </span>
            </div>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <svg
                width="56"
                height="56"
                viewBox="0 0 56 56"
                style={{ animation: "spin 1s linear infinite" }}
              >
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  fill="none"
                  stroke="#E5E7ED"
                  strokeWidth="4"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  fill="none"
                  stroke={COLORS.blue}
                  strokeWidth="4"
                  strokeDasharray="138"
                  strokeDashoffset="100"
                  strokeLinecap="round"
                />
              </svg>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: COLORS.navy,
                  marginTop: 20,
                  marginBottom: 6,
                }}
              >
                Checking {data.dogName}
              </div>
              <div style={{ fontSize: 14, color: "#666" }}>
                Running through our eligibility checks…
              </div>
            </div>
            <div
              style={{
                background: "white",
                borderRadius: 20,
                padding: 20,
                flex: 1,
              }}
            >
              {checks.map((c, i) => {
                const isDone = cv[i],
                  isActive =
                    activeCheck === i && isDone && phase === "checking";
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 0",
                      borderBottom:
                        i < 4 ? `1px solid ${COLORS.navyTint}` : "none",
                      opacity: isDone ? 1 : 0.15,
                      transition: "opacity 0.4s",
                    }}
                  >
                    <CM done={isDone} isActive={isActive} />
                    <span
                      style={{
                        fontSize: 14,
                        color: COLORS.navy,
                        fontWeight: isDone ? 500 : 400,
                      }}
                    >
                      {c.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {phase === "approved" && (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 32,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "rgba(34,197,94,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
                animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "#22C55E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 36 }}>✓</span>
              </div>
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: COLORS.yellow,
                marginBottom: 8,
              }}
            >
              {data.dogName}'s approved!
            </div>
            <div
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.7)",
                marginBottom: 48,
                lineHeight: 1.5,
              }}
            >
              Great news — {data.dogName} is eligible for cover.
              <br />
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
                Now let's build the right plan.
              </span>
            </div>
            <div style={{ width: "100%" }}>
              <button
                onClick={onApproved}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: 50,
                  background: COLORS.yellow,
                  color: COLORS.navy,
                  fontWeight: 800,
                  fontSize: 18,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Build {data.dogName}'s plan 🐾
              </button>
            </div>
          </div>
        )}
        {phase === "referred" && (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 32,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "rgba(251,191,36,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: COLORS.yellow,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 34 }}>⏳</span>
              </div>
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: COLORS.yellow,
                marginBottom: 10,
              }}
            >
              We need a little more time
            </div>
            <div
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.75)",
                marginBottom: 16,
                lineHeight: 1.6,
              }}
            >
              Based on {data.dogName}'s health history, a specialist needs to
              review their profile.
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: 18,
                marginBottom: 32,
                textAlign: "left",
                width: "100%",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: COLORS.yellow,
                  marginBottom: 12,
                }}
              >
                What happens next
              </div>
              {[
                {
                  icon: "📋",
                  text: "Our team reviews " + data.dogName + "'s details",
                },
                {
                  icon: "📞",
                  text: "A specialist contacts you within 24 hours",
                },
                {
                  icon: "🐾",
                  text: "We confirm coverage options tailored to them",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    marginBottom: i < 2 ? 12 : 0,
                  }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>
                    {s.icon}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      color: "rgba(255,255,255,0.7)",
                      lineHeight: 1.4,
                    }}
                  >
                    {s.text}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ width: "100%" }}>
              <button
                onClick={onReferred}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: 50,
                  background: COLORS.yellow,
                  color: COLORS.navy,
                  fontWeight: 800,
                  fontSize: 17,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Keep my details for a callback
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const MOCK_MEMBER = {
  name: "Milo Phillips",
  email: "milo@email.com",
  password: "deefa123",
  dogs: [
    {
      name: "Killa",
      breed: "Maltipoo",
      age: "3",
      gender: "female",
      spayed: true,
      microchipped: true,
      coverage: "$15,000",
      deductible: "$250",
      reimbursement: "80%",
      premium: "$89/mo",
      annualPremium: "$1,007",
      status: "Active",
      nextCheckup: "Mar 15, 2026",
      nextPayment: "Mar 1, 2026",
      policyNum: "DEF-2024-0482",
    },
    {
      name: "Honey",
      breed: "Cane Corso",
      age: "5",
      gender: "female",
      spayed: true,
      microchipped: true,
      coverage: "$20,000",
      deductible: "$500",
      reimbursement: "90%",
      premium: "$124/mo",
      annualPremium: "$1,409",
      status: "Active",
      nextCheckup: "Apr 2, 2026",
      nextPayment: "Mar 1, 2026",
      policyNum: "DEF-2024-0483",
    },
  ],
  claims: [
    {
      id: "CLM-9823",
      dog: "Killa",
      type: "Annual Checkup",
      date: "Feb 10, 2026",
      submitted: "Feb 11, 2026",
      amount: "$310",
      reimbursed: "$250",
      status: "Approved",
      note: "Routine annual wellness exam",
    },
    {
      id: "CLM-9841",
      dog: "Honey",
      type: "Dental Cleaning",
      date: "Feb 19, 2026",
      submitted: "Feb 20, 2026",
      amount: "$480",
      reimbursed: null,
      status: "Pending",
      note: "Under review by claims team",
    },
    {
      id: "CLM-9712",
      dog: "Killa",
      type: "Leg Sprain Treatment",
      date: "Jan 5, 2026",
      submitted: "Jan 6, 2026",
      amount: "$220",
      reimbursed: "$176",
      status: "Approved",
      note: "X-ray + treatment, non-surgical",
    },
    {
      id: "CLM-9654",
      dog: "Honey",
      type: "Ear Infection",
      date: "Nov 28, 2025",
      submitted: "Nov 29, 2025",
      amount: "$155",
      reimbursed: "$124",
      status: "Approved",
      note: "Medication prescribed",
    },
  ],
};

export default function App() {
  const [screen, setScreen] = useState(0);
  const [data, setData] = useState({
    dogName: "",
    email: "",
    breed: "",
    age: "",
    gender: "",
    microchipped: null,
    spayed: null,
    zipCode: "",
    state: "",
    medHistoryFlag: null,
    medHistoryDetail: "",
    preexisting: null,
    preexistingDetail: "",
    chronic: null,
    chronicDetail: "",
    behavioral: null,
    behavioralDetail: "",
    medications: null,
    medicationsDetail: "",
    surgery: null,
    surgeryDetail: "",
    coverageLimit: "10000",
    deductible: "250",
    reimbursement: "80",
  });
  const [payFreq, setPayFreq] = useState("monthly");
  const [payInfo, setPayInfo] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    cardNum: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [selectedDog, setSelectedDog] = useState(0);
  const [profileTab, setProfileTab] = useState("overview");
  const [newClaim, setNewClaim] = useState({
    dog: "",
    type: "",
    date: "",
    amount: "",
    notes: "",
  });
  const [addWellness, setAddWellness] = useState(false);
  const [claimStep, setClaimStep] = useState("list");
  const [activeClaim, setActiveClaim] = useState(null);
  const learnMoreRef = useRef(null);

  const set = (k, v) => setData((p) => ({ ...p, [k]: v }));
  const next = () => setScreen((s) => s + 1);
  const back = () => setScreen((s) => Math.max(0, s - 1));
  const go = (n) => setScreen(SCREENS.indexOf(n));
  const sc = SCREENS[screen];
  const signupStart = SCREENS.indexOf("dog_name");
  const signupEnd = SCREENS.indexOf("quote");
  const isSignupFlow = screen >= signupStart && screen <= signupEnd;
  const totalSS = signupEnd - signupStart + 1;
  const spIdx = screen - signupStart;
  const selectAndAdvance = (key, val) => {
    set(key, val);
    setTimeout(() => next(), 180);
  };
  const handleLogin = () => {
    if (
      loginEmail === MOCK_MEMBER.email &&
      loginPassword === MOCK_MEMBER.password
    ) {
      setLoginError("");
      go("profile");
    } else {
      setLoginError(
        "Incorrect email or password. Try milo@email.com / deefa123",
      );
    }
  };

  const ann = calcPremium(data);
  const mon = Math.round(ann / 12);
  const payAmt =
    payFreq === "monthly"
      ? `$${mon}/mo`
      : `$${Math.round(ann * 0.95).toLocaleString()}/yr`;

  const Phone = ({ children, bg = "#F0F6FF" }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        background: "#001851",
        padding: 20,
      }}
    >
      <div
        style={{
          width: 375,
          minHeight: 700,
          background: bg,
          borderRadius: 40,
          boxShadow: "0 30px 80px rgba(0,0,20,0.5)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          fontFamily: "system-ui,sans-serif",
        }}
      >
        {children}
      </div>
    </div>
  );

  const Shell = ({
    children,
    showBack = true,
    showProgress = true,
    bg = "#F0F6FF",
  }) => (
    <Phone bg={bg}>
      <div
        style={{
          padding: "16px 20px 4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        {showBack ? (
          <button
            onClick={back}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              borderRadius: 12,
              color: COLORS.navy,
              fontSize: 20,
            }}
          >
            ←
          </button>
        ) : (
          <div style={{ width: 40 }} />
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontWeight: 800, fontSize: 18, color: COLORS.blue }}>
            Deefa
          </span>
          <span style={{ fontSize: 11, color: COLORS.navy, opacity: 0.6 }}>
            Dog only Insurance
          </span>
        </div>
        <div style={{ width: 40 }} />
      </div>
      {showProgress && isSignupFlow && (
        <div style={{ padding: "0 20px 8px", flexShrink: 0 }}>
          <ProgressDots current={spIdx} total={totalSS} />
        </div>
      )}
      <div style={{ flex: 1, padding: "8px 24px 32px", overflowY: "auto" }}>
        {children}
      </div>
    </Phone>
  );

  const slides = [
    {
      headline: ["Built for dogs.", "Only dogs."],
      sub: null,
      accent: COLORS.yellow,
    },
    {
      headline: ["We know what dog", "ownership actually involves."],
      sub: "The routines. The responsibility.\nAnd the unexpected.",
      accent: COLORS.blue,
    },
    {
      headline: ["So we built insurance", "fit for exactly that."],
      sub: null,
      accent: COLORS.yellow,
      cta: true,
    },
  ];
  if (sc === "onboard1" || sc === "onboard2" || sc === "onboard3") {
    const idx = ["onboard1", "onboard2", "onboard3"].indexOf(sc);
    const slide = slides[idx];
    return (
      <Phone bg={COLORS.navy}>
        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: 36,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: "auto",
              paddingTop: 8,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  height: 4,
                  borderRadius: 2,
                  transition: "all 0.3s",
                  width: i === idx ? 24 : 8,
                  background:
                    i <= idx
                      ? "rgba(255,255,255,0.9)"
                      : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ marginBottom: 32 }}>
              <DogIcon size={idx === 0 ? 72 : 48} />
            </div>
            <div>
              {slide.headline.map((line, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: idx === 0 ? 36 : 30,
                    fontWeight: 800,
                    lineHeight: 1.1,
                    marginBottom: 4,
                    color:
                      i === slide.headline.length - 1 ? slide.accent : "white",
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
            {slide.sub && (
              <div
                style={{
                  fontSize: 17,
                  color: "rgba(255,255,255,0.65)",
                  marginTop: 20,
                  lineHeight: 1.7,
                  whiteSpace: "pre-line",
                }}
              >
                {slide.sub}
              </div>
            )}
          </div>
          <div style={{ paddingBottom: 8 }}>
            {slide.cta ? (
              <button
                onClick={next}
                style={{
                  width: "100%",
                  padding: "18px",
                  borderRadius: 50,
                  background: COLORS.yellow,
                  color: COLORS.navy,
                  fontWeight: 800,
                  fontSize: 18,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Get started 🐾
              </button>
            ) : (
              <button
                onClick={next}
                style={{
                  width: "100%",
                  padding: "18px",
                  borderRadius: 50,
                  background: "rgba(255,255,255,0.12)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 16,
                  border: "1.5px solid rgba(255,255,255,0.2)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Next →
              </button>
            )}
            {idx > 0 && (
              <button
                onClick={back}
                style={{
                  marginTop: 12,
                  width: "100%",
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  padding: "8px 0",
                }}
              >
                ← Back
              </button>
            )}
          </div>
        </div>
      </Phone>
    );
  }

  if (sc === "welcome") {
    const can = data.dogName.trim() && data.email.includes("@");
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          minHeight: "100vh",
          background: "#001851",
          padding: 20,
        }}
      >
        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(5px)}}input::placeholder{color:rgba(255,255,255,0.35)!important}`}</style>
        <div
          style={{
            width: 375,
            background: COLORS.navy,
            borderRadius: 40,
            boxShadow: "0 30px 80px rgba(0,0,20,0.5)",
            overflow: "hidden",
            fontFamily: "system-ui,sans-serif",
          }}
        >
          <div
            style={{
              padding: "40px 32px 36px",
              minHeight: 700,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 36,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <DogIcon size={32} />
                <span style={{ fontWeight: 800, fontSize: 20, color: "white" }}>
                  Deefa
                </span>
              </div>
              <button
                onClick={() => go("login")}
                style={{
                  padding: "8px 18px",
                  borderRadius: 50,
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: 13,
                  border: "1.5px solid rgba(255,255,255,0.2)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Log in
              </button>
            </div>
            <div style={{ marginBottom: 28 }}>
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.45)",
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Dog only Insurance
              </div>
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 800,
                  color: "white",
                  lineHeight: 1.15,
                  marginBottom: 10,
                }}
              >
                For the
                <br />
                <span style={{ color: COLORS.yellow }}>love of Dog.</span>
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.5,
                }}
              >
                Let's get started — tell us about your dog.
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.5)",
                    marginBottom: 6,
                  }}
                >
                  Your dog's name
                </div>
                <input
                  value={data.dogName}
                  onChange={(e) => set("dogName", e.target.value)}
                  placeholder="e.g. Killa, Honey, Max..."
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: "2px solid rgba(255,255,255,0.15)",
                    fontSize: 16,
                    fontFamily: "inherit",
                    outline: "none",
                    boxSizing: "border-box",
                    color: "white",
                    background: "rgba(255,255,255,0.08)",
                    caretColor: "white",
                  }}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.5)",
                    marginBottom: 6,
                  }}
                >
                  Your email
                </div>
                <input
                  value={data.email}
                  onChange={(e) => set("email", e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: "2px solid rgba(255,255,255,0.15)",
                    fontSize: 16,
                    fontFamily: "inherit",
                    outline: "none",
                    boxSizing: "border-box",
                    color: "white",
                    background: "rgba(255,255,255,0.08)",
                    caretColor: "white",
                  }}
                />
              </div>
              <button
                onClick={next}
                disabled={!can}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: 50,
                  background: can ? COLORS.yellow : "rgba(255,255,255,0.12)",
                  color: can ? COLORS.navy : "rgba(255,255,255,0.3)",
                  fontWeight: 800,
                  fontSize: 17,
                  border: "none",
                  cursor: can ? "pointer" : "not-allowed",
                  fontFamily: "inherit",
                  transition: "all 0.25s",
                  marginBottom: 16,
                }}
              >
                Get started
              </button>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.3)",
                  textAlign: "center",
                  marginBottom: 24,
                }}
              >
                Takes about 3 minutes · No spam, ever.
              </div>
              <button
                onClick={() =>
                  learnMoreRef.current?.scrollIntoView({ behavior: "smooth" })
                }
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  padding: "8px 0",
                  fontFamily: "inherit",
                }}
              >
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
                  Learn more
                </span>
                <span style={{ fontSize: 18, color: "rgba(255,255,255,0.25)" }}>
                  ↓
                </span>
              </button>
            </div>
          </div>
          <div ref={learnMoreRef}>
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                padding: "36px 28px",
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "white",
                  lineHeight: 1.2,
                  marginBottom: 6,
                }}
              >
                Trusted by people who{" "}
                <span style={{ color: COLORS.yellow }}>know</span> their dogs.
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.45)",
                  marginBottom: 28,
                  lineHeight: 1.5,
                }}
              >
                We chose focus over volume, because focus is how you get cover
                that actually works.
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                {[
                  { val: "01", label: "Species Covered" },
                  { val: "100%", label: "Dog-first decisions" },
                  { val: "98%", label: "Claims Paid" },
                  { val: "50k", label: "Dogs insured" },
                ].map(({ val, label }) => (
                  <div
                    key={label}
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      borderRadius: 16,
                      padding: "18px 16px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: 800,
                        color: COLORS.blue,
                        marginBottom: 4,
                      }}
                    >
                      {val}
                    </div>
                    <div
                      style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: COLORS.navy, padding: "36px 28px" }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: COLORS.blue,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Why Deefa?
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "white",
                  marginBottom: 6,
                }}
              >
                We're the dog people for dog people.
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.45)",
                  marginBottom: 28,
                  lineHeight: 1.5,
                }}
              >
                Dogs aren't a category to us. They're the reason we exist.
              </div>
              {[
                {
                  icon: "🐕",
                  title: "Built only for dogs",
                  body: "Other insurers cover pets. We cover dogs. When you focus on one thing, you do it properly.",
                },
                {
                  icon: "⚡",
                  title: "AI claims in minutes",
                  body: "Our AI reviews and approves most claims in under 5 minutes. No forms, no waiting, no chasing.",
                },
                {
                  icon: "📞",
                  title: "24-hour vet access",
                  body: "Round-the-clock access to qualified vets via chat or video. For every question, big or small.",
                },
                {
                  icon: "🤝",
                  title: "Partner deals",
                  body: "Exclusive discounts with pet food brands, grooming services, and training providers — just for Deefa members.",
                },
                {
                  icon: "🗣️",
                  title: "Clear, human language",
                  body: "We show you what's covered and what's not. Upfront. No legal jargon, no small print surprises.",
                },
              ].map(({ icon, title, body }, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 14,
                    marginBottom: i < 4 ? 20 : 0,
                    paddingBottom: i < 4 ? 20 : 0,
                    borderBottom:
                      i < 4 ? "1px solid rgba(255,255,255,0.07)" : "none",
                  }}
                >
                  <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>
                    {icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "white",
                        marginBottom: 4,
                      }}
                    >
                      {title}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.5)",
                        lineHeight: 1.5,
                      }}
                    >
                      {body}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                padding: "36px 28px",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: COLORS.blue,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                How it works
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "white",
                  marginBottom: 24,
                }}
              >
                Simple. Three steps.
              </div>
              {[
                {
                  n: "01",
                  title: "Tell us about your dog",
                  body: "Their breed, their age, a few key details.",
                },
                {
                  n: "02",
                  title: "Choose your level of cover",
                  body: "Clear options, clear costs. You decide what works.",
                },
                {
                  n: "03",
                  title: "You're covered",
                  body: "From that point on, we've got you and your dog.",
                },
              ].map(({ n, title, body }, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 16,
                    marginBottom: i < 2 ? 24 : 0,
                  }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: COLORS.blue,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: 13,
                        color: "white",
                      }}
                    >
                      {n}
                    </div>
                    {i < 2 && (
                      <div
                        style={{
                          width: 2,
                          flex: 1,
                          background: "rgba(255,255,255,0.08)",
                          marginTop: 6,
                        }}
                      />
                    )}
                  </div>
                  <div style={{ paddingBottom: i < 2 ? 8 : 0 }}>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "white",
                        marginBottom: 4,
                      }}
                    >
                      {title}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.5)",
                        lineHeight: 1.5,
                      }}
                    >
                      {body}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                background: COLORS.blue,
                padding: "36px 28px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "white",
                  marginBottom: 8,
                  lineHeight: 1.2,
                }}
              >
                If your dog isn't 'just a pet', don't insure them like one.
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: 24,
                  lineHeight: 1.5,
                }}
              >
                Join 50,000 dog owners who chose cover that actually fits.
              </div>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: 50,
                  background: COLORS.yellow,
                  color: COLORS.navy,
                  fontWeight: 800,
                  fontSize: 17,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  marginBottom: 12,
                }}
              >
                Get started 🐾
              </button>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                deefa.com · Dog only Insurance
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (sc === "login")
    return (
      <Shell bg="#F0F6FF" showProgress={false}>
        <div style={{ paddingTop: 16 }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: COLORS.navy,
              marginBottom: 6,
            }}
          >
            Welcome back 👋
          </div>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 28 }}>
            Log in to manage your policies.
          </div>
          <Input
            label="Email"
            value={loginEmail}
            onChange={setLoginEmail}
            type="email"
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            value={loginPassword}
            onChange={setLoginPassword}
            type="password"
            placeholder="••••••••"
          />
          {loginError && (
            <div
              style={{
                background: "#FEE2E2",
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: 13,
                color: "#B91C1C",
                marginBottom: 16,
              }}
            >
              {loginError}
            </div>
          )}
          <div style={{ marginTop: 8, marginBottom: 24 }}>
            <Btn onClick={handleLogin} disabled={!loginEmail || !loginPassword}>
              Log in →
            </Btn>
          </div>
          <div style={{ textAlign: "center", fontSize: 13, color: "#aaa" }}>
            Don't have an account?{" "}
            <span
              onClick={() => go("dog_name")}
              style={{ color: COLORS.blue, fontWeight: 600, cursor: "pointer" }}
            >
              Get a quote
            </span>
          </div>
          <div
            style={{
              marginTop: 24,
              background: "#EEF3FF",
              borderRadius: 12,
              padding: "12px 14px",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: COLORS.navy,
                fontWeight: 600,
                marginBottom: 2,
              }}
            >
              Demo credentials
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>
              Email: milo@email.com / Password: deefa123
            </div>
          </div>
        </div>
      </Shell>
    );

  if (sc === "dog_name")
    return (
      <Shell showBack={false}>
        <div style={{ paddingTop: 24 }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: COLORS.navy,
              marginBottom: 6,
            }}
          >
            What breed is
            <br />
            <span style={{ color: COLORS.blue }}>
              {data.dogName || "your dog"}?
            </span>
          </div>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 24 }}>
            This helps us understand their unique needs.
          </div>
          <SelectInput
            value={data.breed}
            onChange={(v) => set("breed", v)}
            options={breeds}
          />
          <div style={{ marginTop: 16 }}>
            <Btn onClick={next} disabled={!data.breed}>
              Continue →
            </Btn>
          </div>
        </div>
      </Shell>
    );
  if (sc === "breed")
    return (
      <Shell>
        <div style={{ paddingTop: 16 }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: COLORS.navy,
              marginBottom: 6,
            }}
          >
            How old is
            <br />
            <span style={{ color: COLORS.blue }}>{data.dogName}?</span>
          </div>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 24 }}>
            Age affects their care needs.
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
              marginBottom: 8,
            }}
          >
            {[
              "< 1",
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10",
              "11+",
            ].map((a) => {
              const v = a === "< 1" ? "0" : a === "11+" ? "11" : a;
              return (
                <button
                  key={a}
                  onClick={() => set("age", v)}
                  style={{
                    padding: "14px 8px",
                    borderRadius: 12,
                    fontWeight: 600,
                    fontSize: 15,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    border: `2px solid ${data.age === v ? COLORS.blue : COLORS.navyTint}`,
                    background: data.age === v ? "#EEF3FF" : "white",
                    color: COLORS.navy,
                  }}
                >
                  {a}
                </button>
              );
            })}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#999",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            years old
          </div>
          <Btn onClick={next} disabled={!data.age}>
            Continue →
          </Btn>
        </div>
      </Shell>
    );
  if (sc === "age")
    return (
      <Shell>
        <div style={{ paddingTop: 16 }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: COLORS.navy,
              marginBottom: 6,
            }}
          >
            Is <span style={{ color: COLORS.blue }}>{data.dogName}</span> a boy
            or girl?
          </div>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 32 }}>
            Biological sex at birth.
          </div>
          <TwoCard
            options={[
              { l: "Male 🐕", v: "male" },
              { l: "Female 🐩", v: "female" },
            ]}
            value={data.gender}
            onChange={(v) => selectAndAdvance("gender", v)}
            onBack={back}
          />
        </div>
      </Shell>
    );
  if (sc === "gender")
    return (
      <Shell>
        <div style={{ paddingTop: 16 }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: COLORS.navy,
              marginBottom: 8,
            }}
          >
            Is <span style={{ color: COLORS.blue }}>{data.dogName}</span>{" "}
            microchipped?
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#666",
              marginBottom: 32,
              lineHeight: 1.5,
            }}
          >
            Microchipped dogs are easier to identify — we factor this in.
          </div>
          <YesNo
            value={data.microchipped}
            onChange={(v) => selectAndAdvance("microchipped", v)}
            onBack={back}
          />
        </div>
      </Shell>
    );
  if (sc === "microchip")
    return (
      <Shell>
        <div style={{ paddingTop: 16 }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: COLORS.navy,
              marginBottom: 8,
            }}
          >
            Has <span style={{ color: COLORS.blue }}>{data.dogName}</span> been{" "}
            {data.gender === "female" ? "spayed" : "neutered"}?
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#666",
              marginBottom: 32,
              lineHeight: 1.5,
            }}
          >
            {data.gender === "female" ? "Spayed" : "Neutered"} dogs generally
            have fewer complications.
          </div>
          <YesNo
            value={data.spayed}
            onChange={(v) => selectAndAdvance("spayed", v)}
            onBack={back}
          />
        </div>
      </Shell>
    );
  if (sc === "spayed")
    return (
      <Shell>
        <div style={{ paddingTop: 16 }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: COLORS.navy,
              marginBottom: 6,
            }}
          >
            Where do you and{" "}
            <span style={{ color: COLORS.blue }}>{data.dogName}</span> live?
          </div>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 24 }}>
            Vet costs vary by location.
          </div>
          <Input
            label="Zip Code"
            value={data.zipCode}
            onChange={(v) => set("zipCode", v)}
            placeholder="e.g. 90210"
          />
          <SelectInput
            label="State"
            value={data.state}
            onChange={(v) => set("state", v)}
            options={US_STATES}
          />
          <Btn onClick={next} disabled={!data.zipCode || !data.state}>
            Continue →
          </Btn>
        </div>
      </Shell>
    );
  if (sc === "location")
    return (
      <Shell>
        <div style={{ paddingTop: 32, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🩺</div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: COLORS.navy,
              marginBottom: 12,
            }}
          >
            A few health questions about {data.dogName}
          </div>
          <div
            style={{
              fontSize: 15,
              color: "#666",
              marginBottom: 32,
              lineHeight: 1.6,
            }}
          >
            These help us make sure we can cover {data.dogName} properly.
          </div>
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: 16,
              marginBottom: 32,
              border: `1px solid ${COLORS.navyTint}`,
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.blue,
                marginBottom: 8,
              }}
            >
              📋 What we'll ask
            </div>
            {[
              "Medical history",
              "Pre-existing conditions",
              "Chronic conditions",
              "Behavioural issues",
              "Current medications",
              "Past surgeries",
            ].map((t) => (
              <div
                key={t}
                style={{
                  fontSize: 14,
                  color: COLORS.navy,
                  padding: "6px 0",
                  borderBottom: `1px solid ${COLORS.navyTint}`,
                }}
              >
                • {t}
              </div>
            ))}
          </div>
          <Btn onClick={next}>Got it, let's go →</Btn>
        </div>
      </Shell>
    );

  const medScreen = (key, dtKey, title, q) => (
    <Shell>
      <div style={{ paddingTop: 16 }}>
        <div
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: COLORS.navy,
            marginBottom: 6,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 14,
            color: "#666",
            marginBottom: 24,
            lineHeight: 1.5,
          }}
        >
          {q}
        </div>
        <YesNo
          value={data[key]}
          onChange={(v) => {
            set(key, v);
            if (!v) setTimeout(next, 180);
          }}
          onBack={back}
        />
        {data[key] && (
          <>
            <textarea
              value={data[dtKey]}
              onChange={(e) => set(dtKey, e.target.value)}
              placeholder="Please describe..."
              style={{
                width: "100%",
                minHeight: 80,
                padding: 14,
                borderRadius: 12,
                border: `2px solid ${COLORS.blue}`,
                fontSize: 15,
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box",
                resize: "vertical",
                color: COLORS.navy,
                marginTop: 12,
              }}
            />
            <div style={{ marginTop: 12 }}>
              <Btn onClick={next}>Continue →</Btn>
            </div>
          </>
        )}
      </div>
    </Shell>
  );
  if (sc === "medical_intro")
    return medScreen(
      "medHistoryFlag",
      "medHistoryDetail",
      "Medical History",
      `Has ${data.dogName} had any significant medical history?`,
    );
  if (sc === "medical_history")
    return medScreen(
      "preexisting",
      "preexistingDetail",
      "Pre-existing Conditions",
      `Does ${data.dogName} have any pre-existing conditions?`,
    );
  if (sc === "preexisting")
    return medScreen(
      "chronic",
      "chronicDetail",
      "Chronic Conditions",
      `Does ${data.dogName} have any ongoing conditions?`,
    );
  if (sc === "chronic")
    return medScreen(
      "behavioral",
      "behavioralDetail",
      "Behavioural Issues",
      `Has ${data.dogName} been assessed for any behavioural issues?`,
    );
  if (sc === "behavioral")
    return medScreen(
      "medications",
      "medicationsDetail",
      "Current Medications",
      `Is ${data.dogName} on any prescribed medications?`,
    );
  if (sc === "medications")
    return medScreen(
      "surgery",
      "surgeryDetail",
      "Surgery History",
      `Has ${data.dogName} had or been recommended any surgeries?`,
    );
  if (sc === "surgery")
    return (
      <ApprovalScreen
        data={data}
        onApproved={() => go("coverage")}
        onReferred={() => go("welcome")}
      />
    );

  if (sc === "approval") {
    const opts = [
      {
        value: "10000",
        label: "$10,000",
        desc: "Great for everyday accidents & illness",
      },
      {
        value: "15000",
        label: "$15,000",
        desc: "Covers most surgeries & specialist care",
        popular: true,
      },
      {
        value: "20000",
        label: "$20,000",
        desc: "Maximum protection for peace of mind",
      },
    ];
    const deds = ["100", "250", "500", "750", "1000", "1500"],
      reimbs = ["70", "80", "90"];
    return (
      <Shell>
        <div style={{ paddingTop: 8 }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: COLORS.navy,
              marginBottom: 4,
            }}
          >
            Build {data.dogName}'s plan
          </div>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>
            Each selection updates your price instantly.
          </div>
          <PriceTag annual={calcPremium(data)} />
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              border: `1px solid ${COLORS.navyTint}`,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: COLORS.navy,
                marginBottom: 2,
              }}
            >
              Annual Coverage Limit
            </div>
            <div style={{ fontSize: 11, color: "#999", marginBottom: 12 }}>
              Max we'll pay out per year
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {opts.map((opt) => {
                const sel = data.coverageLimit === opt.value,
                  p = calcPremium(data, { coverageLimit: opt.value });
                return (
                  <button
                    key={opt.value}
                    onClick={() => set("coverageLimit", opt.value)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 14px",
                      borderRadius: 12,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.2s",
                      border: `2px solid ${sel ? COLORS.blue : COLORS.navyTint}`,
                      background: sel ? "#EEF3FF" : "#FAFAFA",
                      textAlign: "left",
                      position: "relative",
                    }}
                  >
                    {opt.popular && (
                      <div
                        style={{
                          position: "absolute",
                          top: -8,
                          right: 10,
                          background: COLORS.yellow,
                          color: COLORS.navy,
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 20,
                        }}
                      >
                        MOST POPULAR
                      </div>
                    )}
                    <div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          color: sel ? COLORS.blue : COLORS.navy,
                        }}
                      >
                        {opt.label}
                      </div>
                      <div
                        style={{ fontSize: 11, color: "#999", marginTop: 1 }}
                      >
                        {opt.desc}
                      </div>
                    </div>
                    <div
                      style={{
                        textAlign: "right",
                        flexShrink: 0,
                        marginLeft: 12,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 800,
                          color: sel ? COLORS.blue : COLORS.navy,
                        }}
                      >
                        ${p.toLocaleString()}
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 400,
                            color: "#999",
                          }}
                        >
                          /yr
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: "#999" }}>
                        ${Math.round(p / 12)}/mo
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              border: `1px solid ${COLORS.navyTint}`,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: COLORS.navy,
                marginBottom: 2,
              }}
            >
              Annual Deductible
            </div>
            <div style={{ fontSize: 11, color: "#999", marginBottom: 12 }}>
              You pay this first before we start covering
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 8,
              }}
            >
              {deds.map((v) => {
                const sel = data.deductible === v,
                  p = calcPremium(data, { deductible: v });
                return (
                  <button
                    key={v}
                    onClick={() => set("deductible", v)}
                    style={{
                      padding: "10px 6px",
                      borderRadius: 12,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.2s",
                      border: `2px solid ${sel ? COLORS.blue : COLORS.navyTint}`,
                      background: sel ? "#EEF3FF" : "#FAFAFA",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: sel ? COLORS.blue : COLORS.navy,
                      }}
                    >
                      ${parseInt(v).toLocaleString()}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: sel ? COLORS.blue : "#999",
                        marginTop: 2,
                      }}
                    >
                      ${Math.round(p / 12)}/mo
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: 16,
              marginBottom: 20,
              border: `1px solid ${COLORS.navyTint}`,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: COLORS.navy,
                marginBottom: 2,
              }}
            >
              Reimbursement Rate
            </div>
            <div style={{ fontSize: 11, color: "#999", marginBottom: 12 }}>
              % of eligible vet costs we pay back
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 8,
              }}
            >
              {reimbs.map((v) => {
                const sel = data.reimbursement === v,
                  p = calcPremium(data, { reimbursement: v });
                return (
                  <button
                    key={v}
                    onClick={() => set("reimbursement", v)}
                    style={{
                      padding: "10px 6px",
                      borderRadius: 12,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.2s",
                      border: `2px solid ${sel ? COLORS.blue : COLORS.navyTint}`,
                      background: sel ? "#EEF3FF" : "#FAFAFA",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: sel ? COLORS.blue : COLORS.navy,
                      }}
                    >
                      {v}%
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: sel ? COLORS.blue : "#999",
                        marginTop: 2,
                      }}
                    >
                      ${Math.round(p / 12)}/mo
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <Btn onClick={next}>See {data.dogName}'s full quote →</Btn>
        </div>
      </Shell>
    );
  }

  if (sc === "coverage") {
    const flags = [
      data.preexisting,
      data.chronic,
      data.behavioral,
      data.medications,
      data.surgery,
      data.medHistoryFlag,
    ].some(Boolean);
    return (
      <Shell showProgress={false} bg={COLORS.navy}>
        <div style={{ paddingTop: 8 }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.7)",
                marginBottom: 4,
              }}
            >
              Your quote for
            </div>
            <div
              style={{ fontSize: 30, fontWeight: 800, color: COLORS.yellow }}
            >
              {data.dogName} 🐾
            </div>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: 20,
              marginBottom: 14,
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: "#666", marginBottom: 2 }}>
                Estimated Annual Premium
              </div>
              <div
                style={{
                  fontSize: 52,
                  fontWeight: 800,
                  color: COLORS.blue,
                  lineHeight: 1,
                }}
              >
                ${ann.toLocaleString()}
              </div>
              <div style={{ fontSize: 15, color: "#999" }}>
                / year &nbsp;·&nbsp;{" "}
                <span style={{ color: COLORS.navy, fontWeight: 600 }}>
                  ${mon}/mo
                </span>
              </div>
            </div>
            <div
              style={{
                height: 1,
                background: COLORS.navyTint,
                marginBottom: 14,
              }}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
                textAlign: "center",
              }}
            >
              <div>
                <div
                  style={{ fontSize: 16, fontWeight: 800, color: COLORS.blue }}
                >
                  ${parseInt(data.coverageLimit).toLocaleString()}
                </div>
                <div style={{ fontSize: 11, color: "#999" }}>Annual limit</div>
              </div>
              <div>
                <div
                  style={{ fontSize: 16, fontWeight: 800, color: COLORS.blue }}
                >
                  ${parseInt(data.deductible).toLocaleString()}
                </div>
                <div style={{ fontSize: 11, color: "#999" }}>Deductible</div>
              </div>
              <div>
                <div
                  style={{ fontSize: 16, fontWeight: 800, color: COLORS.blue }}
                >
                  {data.reimbursement}%
                </div>
                <div style={{ fontSize: 11, color: "#999" }}>Reimbursed</div>
              </div>
            </div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: 14,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: COLORS.yellow,
                marginBottom: 10,
              }}
            >
              📋 {data.dogName}'s profile
            </div>
            {[
              ["Breed", data.breed],
              [
                "Age",
                `${data.age === "0" ? "< 1" : data.age} year${data.age === "1" ? "" : "s"} old`,
              ],
              ["Gender", data.gender],
              ["Microchipped", data.microchipped ? "Yes" : "No"],
              [
                data.gender === "female" ? "Spayed" : "Neutered",
                data.spayed ? "Yes" : "No",
              ],
              ["Location", `${data.zipCode}, ${data.state}`],
              ["Email", data.email],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                  {k}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: "white",
                    fontWeight: 600,
                    maxWidth: "55%",
                    textAlign: "right",
                    wordBreak: "break-word",
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
          {flags && (
            <div
              style={{
                background: "#FFF3CD",
                borderRadius: 14,
                padding: 14,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#8B6914",
                  marginBottom: 4,
                }}
              >
                ⚡ Our team will review {data.dogName}'s health details
              </div>
              <div style={{ fontSize: 12, color: "#8B6914", lineHeight: 1.5 }}>
                A Deefa specialist will be in touch to finalise your cover.
              </div>
            </div>
          )}
          <button
            onClick={() => go("payment")}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: 50,
              background: COLORS.yellow,
              color: COLORS.navy,
              fontWeight: 800,
              fontSize: 17,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              marginBottom: 10,
            }}
          >
            Protect {data.dogName} now 🐾
          </button>
          <button
            onClick={() => go("approval")}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 50,
              background: "transparent",
              color: "rgba(255,255,255,0.7)",
              fontWeight: 600,
              fontSize: 14,
              border: "1px solid rgba(255,255,255,0.2)",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Adjust plan
          </button>
        </div>
      </Shell>
    );
  }

  if (sc === "payment") {
    const pi = payInfo;
    const setPi = (k, v) => setPayInfo((p) => ({ ...p, [k]: v }));
    const wellnessMo = 19;
    const wellnessAnn = Math.round(wellnessMo * 12 * 0.9);
    const baseMo = mon;
    const baseAnn = Math.round(ann * 0.95);
    const totalMo = baseMo + (addWellness ? wellnessMo : 0);
    const totalAnn = baseAnn + (addWellness ? wellnessAnn : 0);
    const totalDisplay =
      payFreq === "monthly"
        ? `${totalMo}/mo`
        : `${totalAnn.toLocaleString()}/yr`;
    const canPay =
      pi.firstName &&
      pi.lastName &&
      pi.phone &&
      pi.address &&
      pi.city &&
      pi.zip &&
      pi.cardNum.replace(/\s/g, "").length === 16 &&
      pi.expiry.length === 5 &&
      pi.cvv.length >= 3 &&
      pi.nameOnCard;
    const fmtCard = (v) =>
      v
        .replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(.{4})/g, "$1 ")
        .trim();
    const fmtExp = (v) => {
      const d = v.replace(/\D/g, "").slice(0, 4);
      return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
    };
    return (
      <Shell showProgress={false}>
        <div style={{ paddingTop: 8 }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: COLORS.navy,
              marginBottom: 4,
            }}
          >
            Complete your cover
          </div>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 20 }}>
            One last step — fill in your details below.
          </div>
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
              border: `1px solid ${COLORS.navyTint}`,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: COLORS.navy,
                marginBottom: 12,
              }}
            >
              Payment frequency
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginBottom: 12,
              }}
            >
              {[
                {
                  id: "monthly",
                  label: "Monthly",
                  price: `${totalMo}`,
                  sub: "per month",
                },
                {
                  id: "annual",
                  label: "Annually",
                  price: `${totalAnn.toLocaleString()}`,
                  sub: `save ~${Math.round(totalMo * 12 - totalAnn)}/yr`,
                },
              ].map(({ id, label, price, sub }) => (
                <button
                  key={id}
                  onClick={() => setPayFreq(id)}
                  style={{
                    padding: "14px 10px",
                    borderRadius: 12,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.2s",
                    border: `2px solid ${payFreq === id ? COLORS.blue : COLORS.navyTint}`,
                    background: payFreq === id ? "#EEF3FF" : "#FAFAFA",
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  {id === "annual" && (
                    <div
                      style={{
                        position: "absolute",
                        top: -8,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: COLORS.yellow,
                        color: COLORS.navy,
                        fontSize: 9,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 20,
                        whiteSpace: "nowrap",
                      }}
                    >
                      5% OFF
                    </div>
                  )}
                  <div style={{ fontSize: 13, color: "#999", marginBottom: 2 }}>
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: payFreq === id ? COLORS.blue : COLORS.navy,
                    }}
                  >
                    {price}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: payFreq === id ? COLORS.blue : "#aaa",
                    }}
                  >
                    {sub}
                  </div>
                </button>
              ))}
            </div>
            <div
              style={{
                background: "#F0F6FF",
                borderRadius: 10,
                padding: "10px 12px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 13, color: COLORS.navy }}>
                Total due today
              </span>
              <span
                style={{ fontSize: 15, fontWeight: 800, color: COLORS.blue }}
              >
                {totalDisplay}
              </span>
            </div>
          </div>
          <div
            onClick={() => setAddWellness((w) => !w)}
            style={{
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
              cursor: "pointer",
              transition: "all 0.2s",
              border: `2px solid ${addWellness ? COLORS.blue : COLORS.navyTint}`,
              background: addWellness ? "#EEF3FF" : "white",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -10,
                right: 14,
                background: COLORS.yellow,
                color: COLORS.navy,
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 10px",
                borderRadius: 20,
              }}
            >
              ADD-ON
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 10,
              }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: addWellness ? COLORS.blue : "#F0F0F0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  🌿
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: addWellness ? COLORS.blue : COLORS.navy,
                    }}
                  >
                    Wellness Package
                  </div>
                  <div style={{ fontSize: 11, color: "#999" }}>
                    Preventive care, covered.
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: addWellness ? COLORS.blue : COLORS.navy,
                  }}
                >
                  +${wellnessMo}
                  <span
                    style={{ fontSize: 11, fontWeight: 400, color: "#999" }}
                  >
                    /mo
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "#999" }}>
                  +${wellnessAnn}/yr
                </div>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 6,
                marginBottom: 10,
              }}
            >
              {[
                "Annual wellness exam",
                "Vaccinations & boosters",
                "Flea & tick prevention",
                "Dental cleaning (1x/yr)",
                "Heartworm testing",
                "Nutritional consultation",
              ].map((f) => (
                <div
                  key={f}
                  style={{ display: "flex", gap: 6, alignItems: "center" }}
                >
                  <span
                    style={{ color: "#22C55E", fontSize: 11, flexShrink: 0 }}
                  >
                    ✓
                  </span>
                  <span
                    style={{ fontSize: 11, color: "#666", lineHeight: 1.3 }}
                  >
                    {f}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              border: `1px solid ${COLORS.navyTint}`,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: COLORS.navy,
                marginBottom: 12,
              }}
            >
              Personal information
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <Input
                label="First name"
                value={pi.firstName}
                onChange={(v) => setPi("firstName", v)}
                placeholder="Jane"
              />
              <Input
                label="Last name"
                value={pi.lastName}
                onChange={(v) => setPi("lastName", v)}
                placeholder="Smith"
              />
            </div>
            <Input
              label="Phone number"
              value={pi.phone}
              onChange={(v) => setPi("phone", v)}
              type="tel"
              placeholder="+1 555 000 0000"
            />
            <Input
              label="Address"
              value={pi.address}
              onChange={(v) => setPi("address", v)}
              placeholder="123 Main St"
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <Input
                label="City"
                value={pi.city}
                onChange={(v) => setPi("city", v)}
                placeholder="New York"
              />
              <Input
                label="Zip"
                value={pi.zip}
                onChange={(v) => setPi("zip", v)}
                placeholder="10001"
              />
            </div>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: 16,
              marginBottom: 20,
              border: `1px solid ${COLORS.navyTint}`,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: COLORS.navy,
                marginBottom: 12,
              }}
            >
              💳 Payment details
            </div>
            <Input
              label="Name on card"
              value={pi.nameOnCard}
              onChange={(v) => setPi("nameOnCard", v)}
              placeholder="Jane Smith"
            />
            <Input
              label="Card number"
              value={pi.cardNum}
              onChange={(v) => setPi("cardNum", fmtCard(v))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <Input
                label="Expiry"
                value={pi.expiry}
                onChange={(v) => setPi("expiry", fmtExp(v))}
                placeholder="MM/YY"
                maxLength={5}
              />
              <Input
                label="CVV"
                value={pi.cvv}
                onChange={(v) => setPi("cvv", v.replace(/\D/g, "").slice(0, 4))}
                placeholder="123"
                maxLength={4}
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: 6,
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <span style={{ fontSize: 12, color: "#aaa" }}>
                🔒 Secured with 256-bit encryption
              </span>
            </div>
          </div>
          <Btn yellow onClick={() => go("success")} disabled={!canPay}>
            Pay {totalDisplay} →
          </Btn>
          <div
            style={{
              fontSize: 12,
              color: "#aaa",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            By continuing you agree to Deefa's terms & conditions
          </div>
        </div>
      </Shell>
    );
  }

  if (sc === "success") {
    return (
      <Phone bg={COLORS.navy}>
        <style>{`@keyframes popIn{0%{transform:scale(0.4);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 32,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: "50%",
              background: "rgba(34,197,94,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
              animation: "popIn 0.6s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "#22C55E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 40 }}>🐾</span>
            </div>
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: COLORS.yellow,
              marginBottom: 8,
            }}
          >
            {data.dogName}'s covered!
          </div>
          <div
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.7)",
              marginBottom: 4,
            }}
          >
            Welcome to Deefa.
          </div>
          <div
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.45)",
              marginBottom: 32,
            }}
          >
            Your policy is active. A confirmation has been sent to {data.email}.
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.07)",
              borderRadius: 16,
              padding: 18,
              marginBottom: 32,
              width: "100%",
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: COLORS.yellow,
                marginBottom: 12,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Policy summary
            </div>
            {[
              ["Dog", data.dogName],
              [
                "Coverage limit",
                `$${parseInt(data.coverageLimit).toLocaleString()}`,
              ],
              ["Deductible", `$${parseInt(data.deductible).toLocaleString()}`],
              ["Reimbursement", `${data.reimbursement}%`],
              ["Payment", payAmt],
              ["Policy starts", "Today"],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                  {k}
                </span>
                <span style={{ fontSize: 13, color: "white", fontWeight: 600 }}>
                  {v}
                </span>
              </div>
            ))}
          </div>
          <div style={{ width: "100%" }}>
            <button
              onClick={() => go("profile")}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: 50,
                background: COLORS.yellow,
                color: COLORS.navy,
                fontWeight: 800,
                fontSize: 17,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                marginBottom: 10,
              }}
            >
              Go to my profile →
            </button>
          </div>
        </div>
      </Phone>
    );
  }

  if (sc === "profile") {
    const m = MOCK_MEMBER,
      dog = m.dogs[selectedDog];
    const tabs = [
      { id: "overview", icon: "🏠", label: "Overview" },
      { id: "policy", icon: "🛡️", label: "Policy" },
      { id: "claims", icon: "📋", label: "Claims" },
    ];
    return (
      <Phone bg={COLORS.navy}>
        <div
          style={{
            padding: "20px 24px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
              Welcome back
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "white" }}>
              {m.name.split(" ")[0]} 👋
            </div>
          </div>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: COLORS.blue,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              color: "white",
              fontSize: 15,
            }}
          >
            {m.name[0]}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 4,
            padding: "14px 24px 0",
            flexShrink: 0,
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setProfileTab(t.id)}
              style={{
                flex: 1,
                padding: "8px 4px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
                background:
                  profileTab === t.id ? "rgba(22,92,255,0.25)" : "transparent",
                color:
                  profileTab === t.id ? COLORS.blue : "rgba(255,255,255,0.4)",
                fontSize: 11,
                fontWeight: profileTab === t.id ? 700 : 500,
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px 32px" }}>
          {profileTab === "overview" && (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                {[
                  { label: "Active Policies", val: m.dogs.length, icon: "🛡️" },
                  { label: "Outstanding", val: "$0", icon: "💰" },
                  { label: "Claims Paid", val: "98%", icon: "✅" },
                  { label: "Pending Claims", val: "1", icon: "⏳" },
                ].map(({ label, val, icon }) => (
                  <div
                    key={label}
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: 14,
                      padding: "12px 14px",
                    }}
                  >
                    <div style={{ fontSize: 18 }}>{icon}</div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: "white",
                        marginTop: 4,
                      }}
                    >
                      {val}
                    </div>
                    <div
                      style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.5)",
                    marginBottom: 10,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  My Dogs
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  {m.dogs.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDog(i)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: 14,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.2s",
                        textAlign: "left",
                        border: `2px solid ${selectedDog === i ? COLORS.blue : "rgba(255,255,255,0.1)"}`,
                        background:
                          selectedDog === i
                            ? "rgba(22,92,255,0.2)"
                            : "rgba(255,255,255,0.06)",
                      }}
                    >
                      <div style={{ fontSize: 22, marginBottom: 4 }}>🐕</div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "white",
                        }}
                      >
                        {d.name}
                      </div>
                      <div
                        style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}
                      >
                        {d.breed}
                      </div>
                      <div
                        style={{
                          marginTop: 6,
                          display: "inline-block",
                          background: "#22C55E",
                          color: "white",
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 20,
                        }}
                      >
                        {d.status}
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => go("dog_name")}
                    style={{
                      width: 80,
                      padding: "12px",
                      borderRadius: 14,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      border: "2px dashed rgba(255,255,255,0.15)",
                      background: "transparent",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                    }}
                  >
                    <div
                      style={{ fontSize: 22, color: "rgba(255,255,255,0.4)" }}
                    >
                      +
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.4)",
                        textAlign: "center",
                      }}
                    >
                      Add dog
                    </div>
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.5)",
                    marginBottom: 10,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  Recent Activity
                </div>
                {[
                  {
                    icon: "✅",
                    label: "Claim Approved – Killa's Annual Checkup",
                    date: "Feb 18, 2026",
                    amount: "+$250",
                    color: "#22C55E",
                  },
                  {
                    icon: "⏳",
                    label: "Claim Submitted – Honey's Dental Cleaning",
                    date: "Feb 20, 2026",
                    amount: "Pending",
                    color: COLORS.yellow,
                  },
                  {
                    icon: "💳",
                    label: "Premium Payment Successful",
                    date: "Feb 1, 2026",
                    amount: "$89/mo",
                    color: "#aaa",
                  },
                ].map((a, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      style={{ display: "flex", gap: 10, alignItems: "center" }}
                    >
                      <span style={{ fontSize: 18 }}>{a.icon}</span>
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "white",
                            fontWeight: 500,
                          }}
                        >
                          {a.label}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "rgba(255,255,255,0.4)",
                          }}
                        >
                          {a.date}
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: a.color,
                        flexShrink: 0,
                        marginLeft: 8,
                      }}
                    >
                      {a.amount}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => go("welcome")}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: 50,
                  background: "rgba(255,255,255,0.07)",
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: 600,
                  fontSize: 14,
                  border: "1px solid rgba(255,255,255,0.12)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Log out
              </button>
            </>
          )}
          {profileTab === "policy" && (
            <>
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                {m.dogs.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDog(i)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: 12,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      border: `2px solid ${selectedDog === i ? COLORS.blue : "rgba(255,255,255,0.1)"}`,
                      background:
                        selectedDog === i
                          ? "rgba(22,92,255,0.2)"
                          : "rgba(255,255,255,0.06)",
                      color:
                        selectedDog === i ? "white" : "rgba(255,255,255,0.5)",
                      fontWeight: selectedDog === i ? 700 : 400,
                      fontSize: 13,
                    }}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.4)",
                        marginBottom: 2,
                      }}
                    >
                      Policy number
                    </div>
                    <div
                      style={{ fontSize: 14, fontWeight: 700, color: "white" }}
                    >
                      {dog.policyNum}
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#22C55E",
                      color: "white",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 12px",
                      borderRadius: 20,
                    }}
                  >
                    {dog.status}
                  </div>
                </div>
                {[
                  ["Coverage limit", dog.coverage],
                  ["Annual premium", dog.annualPremium],
                  ["Monthly premium", dog.premium],
                  ["Deductible", dog.deductible],
                  ["Reimbursement", dog.reimbursement],
                  ["Next checkup", dog.nextCheckup],
                  ["Next payment", dog.nextPayment],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span
                      style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}
                    >
                      {k}
                    </span>
                    <span
                      style={{ fontSize: 13, color: "white", fontWeight: 600 }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: COLORS.yellow,
                    marginBottom: 12,
                  }}
                >
                  WHAT'S COVERED
                </div>
                {[
                  "Accidents & injuries",
                  "Illness & disease",
                  "Specialist referrals",
                  "Emergency care",
                  "Prescription medications",
                  "Surgery & hospitalisation",
                ].map((f) => (
                  <div
                    key={f}
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      padding: "6px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <span style={{ color: "#22C55E", fontSize: 13 }}>✓</span>
                    <span
                      style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}
                    >
                      {f}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setProfileTab("claims")}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: 50,
                  background: COLORS.blue,
                  color: "white",
                  fontWeight: 700,
                  fontSize: 15,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                File a claim for {dog.name}
              </button>
            </>
          )}
          {profileTab === "claims" && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 800, color: "white" }}>
                  Claims
                </div>
                <button
                  onClick={() => {
                    setClaimStep("new");
                    setNewClaim({
                      dog: "",
                      type: "",
                      date: "",
                      amount: "",
                      notes: "",
                      vet: "",
                    });
                  }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 50,
                    background: COLORS.blue,
                    color: "white",
                    fontWeight: 700,
                    fontSize: 12,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  + New claim
                </button>
              </div>
              {claimStep === "new" && (
                <div
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "white",
                      marginBottom: 14,
                    }}
                  >
                    File a new claim
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.5)",
                        marginBottom: 6,
                      }}
                    >
                      Which dog?
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {m.dogs.map((d) => (
                        <button
                          key={d.name}
                          onClick={() =>
                            setNewClaim((p) => ({ ...p, dog: d.name }))
                          }
                          style={{
                            flex: 1,
                            padding: "10px",
                            borderRadius: 10,
                            fontFamily: "inherit",
                            cursor: "pointer",
                            border: `2px solid ${newClaim.dog === d.name ? COLORS.blue : "rgba(255,255,255,0.15)"}`,
                            background:
                              newClaim.dog === d.name
                                ? "rgba(22,92,255,0.3)"
                                : "transparent",
                            color:
                              newClaim.dog === d.name
                                ? "white"
                                : "rgba(255,255,255,0.5)",
                            fontWeight: 600,
                            fontSize: 13,
                          }}
                        >
                          {d.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.5)",
                        marginBottom: 6,
                      }}
                    >
                      Claim type
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 6,
                      }}
                    >
                      {[
                        "Accident & Injury",
                        "Illness",
                        "Dental",
                        "Preventive Care",
                        "Specialist Visit",
                        "Surgery",
                        "Emergency",
                        "Prescription",
                      ].map((t) => (
                        <button
                          key={t}
                          onClick={() =>
                            setNewClaim((p) => ({ ...p, type: t }))
                          }
                          style={{
                            padding: "9px 6px",
                            borderRadius: 10,
                            fontFamily: "inherit",
                            cursor: "pointer",
                            border: `2px solid ${newClaim.type === t ? COLORS.blue : "rgba(255,255,255,0.1)"}`,
                            background:
                              newClaim.type === t
                                ? "rgba(22,92,255,0.3)"
                                : "transparent",
                            color:
                              newClaim.type === t
                                ? "white"
                                : "rgba(255,255,255,0.45)",
                            fontSize: 12,
                            fontWeight: newClaim.type === t ? 700 : 400,
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.5)",
                        marginBottom: 6,
                      }}
                    >
                      Date of treatment
                    </div>
                    <input
                      type="date"
                      value={newClaim.date}
                      onChange={(e) =>
                        setNewClaim((p) => ({ ...p, date: e.target.value }))
                      }
                      style={{
                        width: "100%",
                        padding: "11px 12px",
                        borderRadius: 10,
                        border: "2px solid rgba(255,255,255,0.15)",
                        background: "rgba(255,255,255,0.08)",
                        color: "white",
                        fontSize: 14,
                        fontFamily: "inherit",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.5)",
                        marginBottom: 6,
                      }}
                    >
                      Vet / clinic name
                    </div>
                    <input
                      value={newClaim.vet || ""}
                      onChange={(e) =>
                        setNewClaim((p) => ({ ...p, vet: e.target.value }))
                      }
                      placeholder="e.g. City Animal Hospital"
                      style={{
                        width: "100%",
                        padding: "11px 12px",
                        borderRadius: 10,
                        border: "2px solid rgba(255,255,255,0.15)",
                        background: "rgba(255,255,255,0.08)",
                        color: "white",
                        fontSize: 14,
                        fontFamily: "inherit",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.5)",
                        marginBottom: 6,
                      }}
                    >
                      Total invoice amount ($)
                    </div>
                    <input
                      value={newClaim.amount}
                      onChange={(e) =>
                        setNewClaim((p) => ({
                          ...p,
                          amount: e.target.value.replace(/[^0-9.]/g, ""),
                        }))
                      }
                      placeholder="e.g. 350.00"
                      style={{
                        width: "100%",
                        padding: "11px 12px",
                        borderRadius: 10,
                        border: "2px solid rgba(255,255,255,0.15)",
                        background: "rgba(255,255,255,0.08)",
                        color: "white",
                        fontSize: 14,
                        fontFamily: "inherit",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.5)",
                        marginBottom: 6,
                      }}
                    >
                      Notes (optional)
                    </div>
                    <textarea
                      value={newClaim.notes}
                      onChange={(e) =>
                        setNewClaim((p) => ({ ...p, notes: e.target.value }))
                      }
                      placeholder="Brief description of treatment..."
                      style={{
                        width: "100%",
                        minHeight: 70,
                        padding: "11px 12px",
                        borderRadius: 10,
                        border: "2px solid rgba(255,255,255,0.15)",
                        background: "rgba(255,255,255,0.08)",
                        color: "white",
                        fontSize: 14,
                        fontFamily: "inherit",
                        outline: "none",
                        boxSizing: "border-box",
                        resize: "vertical",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      background: "rgba(22,92,255,0.15)",
                      borderRadius: 10,
                      padding: "10px 12px",
                      marginBottom: 16,
                      display: "flex",
                      gap: 8,
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>⚡</span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.65)",
                        lineHeight: 1.4,
                      }}
                    >
                      Our AI will review your claim instantly. Most claims are
                      processed within 5 minutes.
                    </span>
                  </div>
                  <button
                    onClick={() => setClaimStep("submitted")}
                    disabled={
                      !newClaim.dog ||
                      !newClaim.type ||
                      !newClaim.date ||
                      !newClaim.amount
                    }
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: 50,
                      background:
                        newClaim.dog &&
                        newClaim.type &&
                        newClaim.date &&
                        newClaim.amount
                          ? COLORS.yellow
                          : "rgba(255,255,255,0.1)",
                      color:
                        newClaim.dog &&
                        newClaim.type &&
                        newClaim.date &&
                        newClaim.amount
                          ? COLORS.navy
                          : "rgba(255,255,255,0.3)",
                      fontWeight: 800,
                      fontSize: 15,
                      border: "none",
                      cursor:
                        newClaim.dog &&
                        newClaim.type &&
                        newClaim.date &&
                        newClaim.amount
                          ? "pointer"
                          : "not-allowed",
                      fontFamily: "inherit",
                      marginBottom: 8,
                    }}
                  >
                    Submit claim →
                  </button>
                  <button
                    onClick={() => setClaimStep("list")}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: 50,
                      background: "transparent",
                      color: "rgba(255,255,255,0.4)",
                      fontWeight: 600,
                      fontSize: 13,
                      border: "1px solid rgba(255,255,255,0.1)",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
              {claimStep === "submitted" && (
                <div
                  style={{
                    background: "rgba(34,197,94,0.1)",
                    border: "2px solid rgba(34,197,94,0.3)",
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 16,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 36, marginBottom: 8 }}>⚡</div>
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 800,
                      color: "#22C55E",
                      marginBottom: 6,
                    }}
                  >
                    Claim submitted!
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.6)",
                      marginBottom: 4,
                    }}
                  >
                    Our AI is reviewing {newClaim.dog}'s {newClaim.type} claim
                    now.
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.6)",
                      marginBottom: 16,
                    }}
                  >
                    Estimated:{" "}
                    <span style={{ color: COLORS.yellow, fontWeight: 700 }}>
                      under 5 minutes
                    </span>
                  </div>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: 10,
                      padding: "10px 12px",
                      textAlign: "left",
                      marginBottom: 16,
                    }}
                  >
                    {[
                      ["Dog", newClaim.dog],
                      ["Type", newClaim.type],
                      ["Amount claimed", `$${newClaim.amount}`],
                      [
                        "Expected reimbursement",
                        `$${Math.round(parseFloat(newClaim.amount || 0) * 0.8)}`,
                      ],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "5px 0",
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.45)",
                          }}
                        >
                          {k}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: "white",
                            fontWeight: 600,
                          }}
                        >
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setClaimStep("list")}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: 50,
                      background: COLORS.blue,
                      color: "white",
                      fontWeight: 700,
                      fontSize: 14,
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    View all claims
                  </button>
                </div>
              )}
              <div>
                {claimStep !== "new" && (
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.4)",
                      marginBottom: 10,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    Claim history
                  </div>
                )}
                {m.claims.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveClaim(activeClaim === i ? null : i)}
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: 14,
                      padding: 14,
                      marginBottom: 10,
                      cursor: "pointer",
                      border: `1px solid ${activeClaim === i ? "rgba(22,92,255,0.4)" : "transparent"}`,
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "white",
                            marginBottom: 2,
                          }}
                        >
                          {c.type}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.45)",
                          }}
                        >
                          {c.dog} · {c.date}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            padding: "3px 10px",
                            borderRadius: 20,
                            background:
                              c.status === "Approved"
                                ? "rgba(34,197,94,0.15)"
                                : "rgba(255,205,56,0.15)",
                            color:
                              c.status === "Approved"
                                ? "#22C55E"
                                : COLORS.yellow,
                            marginBottom: 4,
                          }}
                        >
                          {c.status}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.5)",
                          }}
                        >
                          {c.amount}
                        </div>
                      </div>
                    </div>
                    {activeClaim === i && (
                      <div
                        style={{
                          marginTop: 12,
                          paddingTop: 12,
                          borderTop: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {[
                          ["Claim ID", c.id],
                          ["Submitted", c.submitted],
                          ["Amount claimed", c.amount],
                          c.reimbursed
                            ? ["Reimbursed", c.reimbursed]
                            : ["Reimbursed", "Pending"],
                          ["Note", c.note],
                        ].map(([k, v]) => (
                          <div
                            key={k}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              padding: "4px 0",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 12,
                                color: "rgba(255,255,255,0.4)",
                              }}
                            >
                              {k}
                            </span>
                            <span
                              style={{
                                fontSize: 12,
                                color: "white",
                                fontWeight: 500,
                                maxWidth: "60%",
                                textAlign: "right",
                              }}
                            >
                              {v}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Phone>
    );
  }

  return null;
}
