"use client";

import { useMemo, useState } from "react";

import { createNdisReportCheckoutSession } from "@/actions/stripe";

type Question = {
  id: string;
  label: string;
  placeholder: string;
};

const QUESTIONS: Question[] = [
  {
    id: "participantName",
    label: "1) Participant full name",
    placeholder: "Client name",
  },
  {
    id: "ndisNumber",
    label: "2) NDIS number",
    placeholder: "Optional identifier",
  },
  {
    id: "serviceDate",
    label: "3) Service date and time",
    placeholder: "e.g. 2026-03-01, 9:00am–1:00pm",
  },
  {
    id: "location",
    label: "4) Where did support occur?",
    placeholder: "Home, community, appointment, etc.",
  },
  {
    id: "goalsAddressed",
    label: "5) Which NDIS goals were addressed?",
    placeholder: "List plan goals targeted during shift",
  },
  {
    id: "supportsProvided",
    label: "6) What supports were provided?",
    placeholder: "Describe support tasks and activities",
  },
  {
    id: "participantResponse",
    label: "7) How did the participant engage/respond?",
    placeholder: "Mood, participation, cooperation, communication",
  },
  {
    id: "outcomesAchieved",
    label: "8) What outcomes or progress were observed?",
    placeholder: "Skills, independence, social outcomes",
  },
  {
    id: "incidentsRisk",
    label: "9) Any incidents, risk, or behavioural concerns?",
    placeholder: "Include actions taken and who was notified",
  },
  {
    id: "medicationHealth",
    label: "10) Medication or health updates",
    placeholder: "Medication prompts/admin, symptoms, appointments",
  },
  {
    id: "safeguarding",
    label: "11) Safeguarding / duty-of-care actions",
    placeholder: "How safety, dignity, choice and control were supported",
  },
  {
    id: "followUp",
    label: "12) Follow-up actions for next shift/team",
    placeholder: "Recommendations, handover notes, next steps",
  },
];

const INITIAL_ANSWERS = Object.fromEntries(QUESTIONS.map(({ id }) => [id, ""]));

export default function NdisCaseNotesForm(): JSX.Element {
  const [answers, setAnswers] = useState<Record<string, string>>(INITIAL_ANSWERS);
  const [error, setError] = useState<string>("");
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const report = useMemo(() => {
    const serviceSummary = [
      `Service delivered on ${answers.serviceDate || "[service date/time]"} at ${answers.location || "[location]"}.`,
      `Supports provided: ${answers.supportsProvided || "[supports provided]"}.`,
      `NDIS goals addressed: ${answers.goalsAddressed || "[goals addressed]"}.`,
    ].join(" ");

    const progressSummary = [
      `Participant engagement and response: ${answers.participantResponse || "[participant response]"}.`,
      `Observed outcomes/progress: ${answers.outcomesAchieved || "[outcomes achieved]"}.`,
      `Medication/health updates: ${answers.medicationHealth || "[medication and health updates]"}.`,
    ].join(" ");

    const complianceSummary = [
      `Incidents and risk: ${answers.incidentsRisk || "No incidents reported."}.`,
      `Safeguarding and duty of care: ${answers.safeguarding || "[safeguarding actions]"}.`,
      `Follow-up actions: ${answers.followUp || "[follow-up actions]"}.`,
    ].join(" ");

    return `NDIS CASE NOTE\n\nParticipant: ${answers.participantName || "[participant name]"}\nNDIS Number: ${answers.ndisNumber || "[ndis number]"}\n\n1. Service Summary\n${serviceSummary}\n\n2. Participant Progress and Wellbeing\n${progressSummary}\n\n3. Risk, Safeguarding and Handover\n${complianceSummary}`;
  }, [answers]);

  async function handleCheckout(): Promise<void> {
    setError("");

    const requiredFields = [
      "participantName",
      "serviceDate",
      "location",
      "goalsAddressed",
      "supportsProvided",
      "participantResponse",
      "outcomesAchieved",
      "incidentsRisk",
      "followUp",
    ];

    const missing = requiredFields.filter((field) => !answers[field]?.trim());

    if (missing.length > 0) {
      setError("Please answer the key case-note questions before continuing to payment.");
      return;
    }

    setIsRedirecting(true);

    const data = new FormData();
    data.set("reportText", report);

    const { url } = await createNdisReportCheckoutSession(data);

    if (!url) {
      setIsRedirecting(false);
      setError("Unable to start checkout. Please verify Stripe environment variables.");
      return;
    }

    window.location.assign(url);
  }

  return (
    <div className="ndis-wrapper">
      <h2>NDIS Case Notes Automation</h2>
      <p>
        Answer 12 quick questions. We will generate a professional, compliant case note
        draft, then redirect you to pay <strong>$2.00</strong> to finalize the report.
      </p>

      <div className="ndis-grid">
        {QUESTIONS.map((question) => (
          <label key={question.id} className="ndis-field">
            <span>{question.label}</span>
            <textarea
              rows={3}
              placeholder={question.placeholder}
              value={answers[question.id]}
              onChange={(event) =>
                setAnswers((current) => ({
                  ...current,
                  [question.id]: event.target.value,
                }))
              }
            />
          </label>
        ))}
      </div>

      <h3>Generated case note preview</h3>
      <pre>{report}</pre>

      {error ? <p className="error-message">{error}</p> : null}

      <button
        className="checkout-style-background"
        type="button"
        onClick={() => void handleCheckout()}
        disabled={isRedirecting}
      >
        {isRedirecting ? "Redirecting to secure $2 checkout..." : "Pay $2 and finalize report"}
      </button>
    </div>
  );
}
