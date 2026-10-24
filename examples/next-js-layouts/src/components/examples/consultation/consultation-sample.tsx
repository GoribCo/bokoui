"use client";

import { useRef, useState, type ComponentProps, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  Activity,
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock,
  Droplets,
  FileText,
  FlaskConical,
  Hash,
  History,
  MapPin,
  Phone,
  Pencil,
  Pill,
  Plus,
  Printer,
  Ruler,
  Save,
  Send,
  ShieldCheck,
  Stethoscope,
  Store,
  Thermometer,
  Weight,
  Wind,
  X,
} from "lucide-react";
import { Avatar, Badge, Button, Card, CardHeader, FormField, Heading, Input, Select, Tag, Text, Textarea } from "bokoui/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "bokoui/react/blocks";

const booking = { reference: "CON-2026-00482", date: "October 15, 2026", time: "10:30 AM" };

const patient = {
  name: "Rafiul Islam",
  patientId: "PT-2022-0315",
  age: 31,
  gender: "Male",
  blood: "AB+",
  phone: "+880 1711-500600",
  address: "House 15, Road 7, Dhanmondi, Dhaka 1209",
  allergies: ["Penicillin", "Shellfish"],
  chronicConditions: ["Hypertension (Stage 1)"],
};

const doctor = {
  name: "Dr. Nusrat Jahan",
  specialty: "Interventional Cardiology",
  hospital: "RxProfile General Hospital",
  licenseNo: "MD-2018-04521",
};

const history = [
  { title: "Hypertension follow-up — medication adjusted", meta: "Dr. Nusrat Jahan · Cardiology · Sep 20, 2026", status: "completed" as const },
  { title: "Annual physical examination — all clear", meta: "Dr. Farida Yasmin · General Medicine · Aug 5, 2026", status: "completed" as const },
  { title: "Initial hypertension diagnosis — Metformin started", meta: "Dr. Nusrat Jahan · Cardiology · Jun 12, 2026", status: "followUp" as const },
  { title: "Migraine assessment — prescribed preventive therapy", meta: "Dr. Imran Kabir · Neurology · Mar 3, 2026", status: "completed" as const },
  { title: "Eczema flare-up — topical treatment prescribed", meta: "Dr. Shirin Akhter · Dermatology · Jan 18, 2026", status: "completed" as const },
];

// shortcut: Temperature drops the Celsius-equivalent parenthetical ("(37°C)") that the single-string version
// had — there's no live unit conversion here, and editing just the Fahrenheit number would leave it stale.
const vitals = [
  { label: "BP", value: "142/88", unit: "mmHg", icon: Activity },
  { label: "Heart Rate", value: "82", unit: "bpm", icon: Activity },
  { label: "Temperature", value: "98.6", unit: "°F", icon: Thermometer },
  { label: "Resp. Rate", value: "18", unit: "/min", icon: Wind },
  { label: "O2 Sat", value: "97", unit: "%", icon: Droplets },
  { label: "Weight", value: "78", unit: "kg", icon: Weight },
  { label: "Height", value: "175", unit: "cm", icon: Ruler },
];

let rowCounter = 0;
const nextKey = (prefix: string) => `${prefix}-${++rowCounter}`;

interface DiagnosisRow {
  key: string;
  name: string;
  code: string;
  note: string;
}

const initialDiagnoses: DiagnosisRow[] = [
  { key: nextKey("dx"), name: "Stable Angina Pectoris", code: "I20.8", note: "Exertional chest pain consistent with stable angina. Recommend cardiac catheterization for definitive evaluation." },
  { key: nextKey("dx"), name: "Essential Hypertension, Stage 1", code: "I10", note: "Blood pressure elevated at 142/88. Adjust current medication regimen and add lifestyle modifications." },
];

interface TestRow {
  key: string;
  testName: string;
  note: string;
  /** Lab-assigned, not doctor-entered — present on seeded tests, absent on a freshly ordered one. */
  category?: string;
  priority?: "stat" | "urgent" | "routine";
  status?: string;
}

const initialTests: TestRow[] = [
  { key: nextKey("test"), testName: "ECG (Electrocardiogram)", note: "12-lead ECG to assess for ischemic changes, arrhythmias.", category: "Cardiac", priority: "stat", status: "Completed" },
  { key: nextKey("test"), testName: "Echocardiogram", note: "Transthoracic echo to evaluate valve function and ejection fraction.", category: "Cardiac Imaging", priority: "urgent", status: "Ordered" },
  { key: nextKey("test"), testName: "Lipid Panel", note: "Fasting lipid profile to assess cholesterol levels.", category: "Laboratory", priority: "routine", status: "Sample collected" },
  { key: nextKey("test"), testName: "Troponin I", note: "Cardiac biomarker to rule out acute coronary syndrome.", category: "Laboratory", priority: "stat", status: "Completed" },
];

interface Medication {
  id: string;
  name: string;
  strength: string;
  quantity: string;
  dose: string;
  frequency: string;
  timing: string;
  duration: string;
  route: string;
  instructions: string;
}

const initialMedications: Medication[] = [
  { id: "atorvastatin", name: "Atorvastatin", strength: "20 mg", quantity: "30", dose: "1 tablet", frequency: "Once daily", timing: "At bedtime", duration: "30 days", route: "Oral", instructions: "Take with water. Avoid grapefruit juice." },
  { id: "amlodipine", name: "Amlodipine", strength: "5 mg", quantity: "30", dose: "1 tablet", frequency: "Once daily", timing: "Morning", duration: "30 days", route: "Oral", instructions: "Monitor blood pressure regularly. Report dizziness." },
  { id: "aspirin", name: "Aspirin", strength: "81 mg", quantity: "90", dose: "1 tablet", frequency: "Once daily", timing: "After meals", duration: "90 days", route: "Oral", instructions: "Low-dose antiplatelet therapy. Take with food." },
  { id: "nitroglycerin", name: "Nitroglycerin (Sublingual)", strength: "0.4 mg", quantity: "25", dose: "1 tablet", frequency: "As needed", timing: "At onset of chest pain", duration: "PRN", route: "Sublingual", instructions: "Place under tongue at first sign of chest pain. May repeat every 5 min (max 3 doses). Seek ER if pain persists." },
];

const blankMedication = (id: string): Medication => ({
  id,
  name: "",
  strength: "",
  quantity: "1",
  dose: "",
  frequency: "",
  timing: "",
  duration: "",
  route: "",
  instructions: "",
});

const followUpTypeOptions = [
  { value: "NONE", label: "No follow-up" },
  { value: "REVISIT", label: "Scheduled revisit" },
  { value: "CONDITIONAL", label: "Come back if symptoms persist" },
  { value: "STATUS_CHECK", label: "Status check-in" },
  { value: "ADMISSION", label: "Suggest hospital admission" },
  { value: "REFERRAL", label: "Refer to another doctor" },
];

const hospitalOptions = ["RxProfile General Hospital", "Square Hospital", "United Hospital", "Apollo Hospitals Dhaka", "Evercare Hospital"];
const referralDoctorOptions = ["Dr. Imran Kabir — Neurology", "Dr. Farida Yasmin — General Medicine", "Dr. Shirin Akhter — Dermatology", "Dr. Nusrat Jahan — Interventional Cardiology"];

const suggestedPharmacies = [
  { shopCode: "DHK-0142", name: "LifeCare Pharmacy", branch: "Dhanmondi 27", area: "Dhanmondi, Dhaka" },
  { shopCode: "DHK-0098", name: "MedPlus", branch: "Jigatola", area: "Dhanmondi, Dhaka" },
];

const suggestedDiagnosticCenters = [
  { shopCode: "DHK-DX-21", name: "LabAid Diagnostics", branch: "Dhanmondi", area: "Dhanmondi, Dhaka" },
  { shopCode: "DHK-DX-09", name: "Popular Diagnostic Centre", branch: "Shyamoli", area: "Shyamoli, Dhaka" },
];

const testNameOptions = [
  "ECG (Electrocardiogram)",
  "Echocardiogram",
  "Lipid Panel",
  "Troponin I",
  "Complete Blood Count (CBC)",
  "Chest X-Ray",
  "CT Scan",
  "MRI",
  "Urinalysis",
  "Fasting Blood Glucose",
  "HbA1c",
  "Thyroid Function Test (TFT)",
];

const strengthOptions = ["5 mg", "10 mg", "20 mg", "25 mg", "40 mg", "50 mg", "81 mg", "100 mg", "250 mg", "500 mg"];
const doseOptions = ["1 tablet", "2 tablets", "1/2 tablet", "1 capsule", "5 ml", "10 ml", "1 puff", "1 drop"];
const frequencyOptions = ["Once daily", "Twice daily", "Three times daily", "Four times daily", "Every 6 hours", "Every 8 hours", "Every 12 hours", "As needed"];
const timingOptions = ["Morning", "Morning and night", "At bedtime", "Before meals", "After meals", "At onset of symptoms"];
const durationOptions = ["3 days", "5 days", "7 days", "14 days", "30 days", "60 days", "90 days", "PRN", "Ongoing"];
const routeOptions = ["Oral", "Sublingual", "Topical", "Intravenous", "Intramuscular", "Subcutaneous", "Inhaled", "Rectal", "Intradermally", "Muscular"];

function SectionHeader({ icon: Icon, title, action }: { icon: typeof FileText; title: string; action?: ReactNode }) {
  return (
    <CardHeader className="flex-row items-center justify-between gap-3">
      <Heading as="h2" size="sm" className="flex items-center gap-2">
        <Icon className="size-5 text-(--tone-ink)" data-tone="primary" aria-hidden="true" />
        {title}
      </Heading>
      {action}
    </CardHeader>
  );
}

/**
 * Sits right under the list it adds to, so the next click is where the mouse already is instead of a
 * top-right button the doctor has to travel back to after every row.
 */
function AddRowButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="solid"
      size="sm"
      fullWidth
      leftIcon={<Plus className="size-4" />}
      className="border-dashed hover:text-foreground"
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

/** A single long-text field: a plain paragraph until clicked, then an {@link AutoGrowTextarea}; "Done" or clicking away reverts it. */
function EditableParagraph({ defaultValue, maxLength, ariaLabel }: { defaultValue: string; maxLength: number; ariaLabel: string }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(defaultValue);

  if (editing) {
    return (
      <div className="flex flex-col gap-2" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setEditing(false); }}>
        <AutoGrowTextarea autoFocus value={value} onChange={(event) => setValue(event.target.value)} maxLength={maxLength} aria-label={ariaLabel} />
        <Button type="button" variant="outline" size="sm" className="self-end" onClick={() => setEditing(false)}>
          Done
        </Button>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setEditing(true)}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        setEditing(true);
      }}
      className="-mx-2 flex cursor-pointer items-start justify-between gap-2 rounded-control px-2 py-2 hover:bg-muted focus-ring"
    >
      <Text className={value ? undefined : "text-muted-foreground"}>{value || "Click to add"}</Text>
      <Pencil className="mt-1 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
    </div>
  );
}

/** One vital-sign tile: its value until clicked, then a compact input; Enter, blur, or clicking away reverts it. */
/** `unit` is fixed, shown as a non-editable suffix inside the field — editing only ever changes the measurement itself. */
function VitalTile({ label, icon: Icon, defaultValue, unit }: { label: string; icon: typeof Activity; defaultValue: string; unit: string }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="flex flex-col gap-1 rounded-control border border-border p-3">
      <Text muted className="flex items-center gap-1.5 text-xs">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </Text>
      {editing ? (
        <Input
          autoFocus
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onBlur={() => setEditing(false)}
          onKeyDown={(event) => { if (event.key === "Enter") setEditing(false); }}
          aria-label={`${label} value`}
          endAdornment={<span className="text-xs text-muted-foreground">{unit}</span>}
          className="h-7 px-1.5 text-sm"
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-control text-start text-sm font-medium decoration-dotted underline-offset-4 hover:underline focus-ring"
        >
          {value} {unit}
        </button>
      )}
    </div>
  );
}

/**
 * Reads as a plain label (name, ICD badge, note) until clicked; clicking turns that one row into its input
 * fields, and clicking away or "Done" turns it back into a label showing whatever was just typed. A freshly
 * added row starts in edit mode since it has nothing to show yet. Each row owns its own text locally — the
 * parent list only needs the row's identity (for add/remove), not its live value.
 */
function DiagnosisRowItem({ row, startEditing, onRemove }: { row: DiagnosisRow; startEditing: boolean; onRemove: () => void }) {
  const [editing, setEditing] = useState(startEditing);
  const [name, setName] = useState(row.name);
  const [code, setCode] = useState(row.code);
  const [note, setNote] = useState(row.note);

  if (editing) {
    return (
      <div
        className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0"
        onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setEditing(false); }}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <Input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Diagnosis name" aria-label="Diagnosis name" className="flex-1" />
          <Input value={code} onChange={(event) => setCode(event.target.value)} placeholder="ICD code" aria-label="ICD code" className="sm:w-28" />
          <Button type="button" variant="ghost" size="sm" iconOnly aria-label="Remove diagnosis" onClick={onRemove}>
            <X className="size-4" />
          </Button>
        </div>
        <AutoGrowTextarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Notes" aria-label="Diagnosis notes" maxLength={1000} />
        <Button type="button" variant="outline" size="sm" className="self-end" onClick={() => setEditing(false)}>
          Done
        </Button>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setEditing(true)}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        setEditing(true);
      }}
      className="-mx-2 flex cursor-pointer items-start justify-between gap-3 rounded-control px-2 py-3 text-start first:pt-0 last:pb-0 hover:bg-muted focus-ring"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Text className="font-medium">{name || "Untitled diagnosis"}</Text>
          {code ? (
            <Badge size="sm" variant="outline" color="neutral">
              ICD: {code}
            </Badge>
          ) : null}
        </div>
        {note ? (
          <Text muted className="text-sm">
            {note}
          </Text>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Pencil className="size-3.5 text-muted-foreground" aria-hidden="true" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          iconOnly
          aria-label="Remove diagnosis"
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}

/**
 * A text input with a picker panel that always lists every option, however the field is reopened — unlike
 * the native `<input list>`/`<datalist>` pair, which (per browser behavior, not a bug here) narrows its
 * suggestions to whatever already matches the current text, so a field holding "Oral" stops offering
 * "Sublingual" or "Topical" once reopened. Picking an option fills the field; typing anything else is still
 * accepted as-is, same as the real app's medicine-name and pharmacy-search fields.
 *
 * The panel renders through a portal into `document.body`, positioned from the input's own bounding box,
 * instead of sitting absolutely inside the field's own column: several of these fields live inside an
 * accordion panel, and bokoui's accordion keeps its content `overflow-hidden` at all times (it's what clips
 * the open/close height animation), which would otherwise silently clip the dropdown too.
 *
 * `onPick` is optional: uncontrolled callers (a plain `defaultValue`) don't need it, since picking an option
 * sets the DOM input's value directly. A controlled caller (`value`/`onChange`) does need it — setting the
 * DOM value directly doesn't touch React state, and React would just overwrite it back on the next render.
 */
function SuggestInput({
  options,
  className,
  onPick,
  ...props
}: { options: string[]; onPick?: (value: string) => void } & Omit<ComponentProps<typeof Input>, "ref">) {
  const [panelRect, setPanelRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function openPanel() {
    const rect = inputRef.current?.getBoundingClientRect();
    if (!rect) return;
    // shortcut: positioned once on open, not re-measured on scroll/resize — fine for this static mockup.
    setPanelRect({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
  }

  return (
    <div ref={wrapRef} onBlur={(event) => { if (!wrapRef.current?.contains(event.relatedTarget as Node | null)) setPanelRect(null); }}>
      <Input ref={inputRef} className={className} onFocus={openPanel} onClick={openPanel} {...props} />
      {panelRect
        ? createPortal(
            <ul
              style={{ position: "absolute", top: panelRect.top, left: panelRect.left, width: panelRect.width }}
              className="z-50 mt-1 max-h-60 overflow-y-auto rounded-control border-[length:var(--bokoui-border-width)] border-border bg-surface py-1 shadow-button-hover"
            >
              {options.map((option) => (
                <li key={option}>
                  <button
                    type="button"
                    className="block w-full px-3 py-1.5 text-start text-sm hover:bg-muted"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      if (inputRef.current) inputRef.current.value = option;
                      onPick?.(option);
                      setPanelRect(null);
                    }}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>,
            document.body,
          )
        : null}
    </div>
  );
}

/**
 * Starts at exactly one line, however much `defaultValue` it already holds, and grows toward `maxRows` only
 * as the doctor actively edits it — on focus (so clicking in reveals what's already there) and on input
 * (so it keeps growing while typing) — then scrolls past that. `maxLength` caps it like the real API does.
 */
function AutoGrowTextarea({ maxRows = 8, className, onInput, onFocus, ...props }: { maxRows?: number } & ComponentProps<typeof Textarea>) {
  function resize(el: HTMLTextAreaElement) {
    // bokoui's own textarea class sets `height: auto !important`; only an `!important` inline style beats that.
    el.style.setProperty("height", "auto", "important");
    const lineHeight = Number.parseFloat(getComputedStyle(el).lineHeight) || 20;
    const maxHeight = lineHeight * maxRows;
    el.style.setProperty("height", `${Math.min(el.scrollHeight, maxHeight)}px`, "important");
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }

  return (
    <Textarea
      rows={1}
      resize="none"
      // bokoui's textarea also floors at min-h-20 (5rem); override it so a one-line field actually looks like one.
      className={["min-h-10", className].filter(Boolean).join(" ")}
      onFocus={(event) => {
        resize(event.currentTarget);
        onFocus?.(event);
      }}
      onInput={(event) => {
        resize(event.currentTarget);
        onInput?.(event);
      }}
      {...props}
    />
  );
}

const priorityBadge = { stat: { action: "danger" as const, label: "STAT" }, urgent: { action: "warning" as const, label: "Urgent" }, routine: { action: "info" as const, label: "Routine" } };
const testStatusAction = (status: string): "success" | "info" | "warning" => (status === "Completed" ? "success" : status === "Ordered" ? "info" : "warning");

/** Same view/edit toggle as {@link DiagnosisRowItem}; view mode also shows the lab-assigned category/priority/status badges, which stay read-only. */
function TestRowItem({ row, startEditing, onRemove }: { row: TestRow; startEditing: boolean; onRemove: () => void }) {
  const [editing, setEditing] = useState(startEditing);
  const [testName, setTestName] = useState(row.testName);
  const [note, setNote] = useState(row.note);

  if (editing) {
    return (
      <div
        className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0"
        onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setEditing(false); }}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <SuggestInput
            options={testNameOptions}
            autoFocus
            value={testName}
            onChange={(event) => setTestName(event.target.value)}
            onPick={setTestName}
            placeholder="Test name"
            aria-label="Test name"
            className="flex-1"
          />
          <Button type="button" variant="ghost" size="sm" iconOnly aria-label="Remove test" onClick={onRemove}>
            <X className="size-4" />
          </Button>
        </div>
        <AutoGrowTextarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Note" aria-label="Test note" maxLength={500} />
        <Button type="button" variant="outline" size="sm" className="self-end" onClick={() => setEditing(false)}>
          Done
        </Button>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setEditing(true)}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        setEditing(true);
      }}
      className="-mx-2 flex cursor-pointer items-start justify-between gap-3 rounded-control px-2 py-3 text-start first:pt-0 last:pb-0 hover:bg-muted focus-ring"
    >
      <div className="flex flex-1 flex-col gap-1">
        <Text className="font-medium">{testName || "Untitled test"}</Text>
        {note ? (
          <Text muted className="text-sm">
            {note}
          </Text>
        ) : null}
        {row.category || row.priority || row.status ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {row.category ? (
              <Badge size="sm" variant="outline" color="neutral">
                {row.category}
              </Badge>
            ) : null}
            {row.priority ? (
              <Badge size="sm" action={priorityBadge[row.priority].action}>
                {priorityBadge[row.priority].label}
              </Badge>
            ) : null}
            {row.status ? (
              <Badge size="sm" action={testStatusAction(row.status)} variant="outline">
                {row.status}
              </Badge>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Pencil className="size-3.5 text-muted-foreground" aria-hidden="true" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          iconOnly
          aria-label="Remove test"
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}

const medicationFieldLabels: [key: keyof Pick<Medication, "strength" | "quantity" | "dose" | "frequency" | "timing" | "duration" | "route">, label: string][] = [
  ["strength", "Strength"],
  ["quantity", "Quantity"],
  ["dose", "Dose"],
  ["frequency", "Frequency"],
  ["timing", "Timing"],
  ["duration", "Duration"],
  ["route", "Route"],
];

/**
 * One medication's accordion item. The trigger (name + quick summary) always reflects whatever's currently
 * typed. The panel itself has its own view/edit toggle, same idea as {@link DiagnosisRowItem}: a read-only
 * field grid until clicked, then the full input form.
 */
function MedicationRowItem({ medication, startEditing, onRemove }: { medication: Medication; startEditing: boolean; onRemove: () => void }) {
  const [editing, setEditing] = useState(startEditing);
  const [name, setName] = useState(medication.name);
  const [strength, setStrength] = useState(medication.strength);
  const [quantity, setQuantity] = useState(medication.quantity);
  const [dose, setDose] = useState(medication.dose);
  const [frequency, setFrequency] = useState(medication.frequency);
  const [timing, setTiming] = useState(medication.timing);
  const [duration, setDuration] = useState(medication.duration);
  const [route, setRoute] = useState(medication.route);
  const [instructions, setInstructions] = useState(medication.instructions);

  const values: Record<string, string> = { strength, quantity, dose, frequency, timing, duration, route };

  return (
    <AccordionItem value={medication.id}>
      <AccordionTrigger>
        <span className="flex min-w-0 flex-col gap-0.5 text-start">
          <span className="font-medium">{name ? `${name} ${strength}`.trim() : "New medication"}</span>
          <span className="text-xs font-normal text-muted-foreground">
            {dose || frequency || duration ? [dose, frequency, duration].filter(Boolean).join(" · ") : "Not filled in yet"}
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent>
        {editing ? (
          <div
            className="flex flex-col gap-3"
            onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setEditing(false); }}
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <Input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Medicine name" aria-label="Medicine name" />
              <SuggestInput options={strengthOptions} value={strength} onChange={(event) => setStrength(event.target.value)} onPick={setStrength} placeholder="Strength" aria-label="Strength" />
              <Input value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="Quantity" aria-label="Quantity" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <SuggestInput options={doseOptions} value={dose} onChange={(event) => setDose(event.target.value)} onPick={setDose} placeholder="Dose, e.g. 1 tablet" aria-label="Dose" />
              <SuggestInput
                options={frequencyOptions}
                value={frequency}
                onChange={(event) => setFrequency(event.target.value)}
                onPick={setFrequency}
                placeholder="Frequency, e.g. Once daily"
                aria-label="Frequency"
              />
              <SuggestInput options={timingOptions} value={timing} onChange={(event) => setTiming(event.target.value)} onPick={setTiming} placeholder="Timing, e.g. After meals" aria-label="Timing" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <SuggestInput
                options={durationOptions}
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                onPick={setDuration}
                placeholder="Duration, e.g. 30 days"
                aria-label="Duration"
              />
              <SuggestInput options={routeOptions} value={route} onChange={(event) => setRoute(event.target.value)} onPick={setRoute} placeholder="Route, e.g. Oral" aria-label="Route" />
            </div>
            <AutoGrowTextarea
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              placeholder="Instructions for the patient"
              maxLength={500}
              aria-label="Instructions"
            />
            <div className="flex items-center justify-between">
              <Button type="button" variant="ghost" size="sm" iconOnly aria-label="Remove medication" onClick={onRemove}>
                <X className="size-4" />
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setEditing(false)}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={() => setEditing(true)}
            onKeyDown={(event) => {
              if (event.key !== "Enter" && event.key !== " ") return;
              event.preventDefault();
              setEditing(true);
            }}
            className="-mx-2 flex cursor-pointer items-start justify-between gap-3 rounded-control px-2 py-2 hover:bg-muted focus-ring"
          >
            <dl className="grid flex-1 grid-cols-2 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-3">
              {medicationFieldLabels.map(([key, label]) => (
                <div key={key}>
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd>{values[key] || "—"}</dd>
                </div>
              ))}
              {instructions ? (
                <div className="col-span-2 sm:col-span-3">
                  <dt className="text-xs text-muted-foreground">Instructions</dt>
                  <dd>{instructions}</dd>
                </div>
              ) : null}
            </dl>
            <div className="flex shrink-0 items-start gap-1">
              <Pencil className="mt-0.5 size-3.5 text-muted-foreground" aria-hidden="true" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                iconOnly
                aria-label="Remove medication"
                onClick={(event) => {
                  event.stopPropagation();
                  onRemove();
                }}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

/**
 * Collapsed by default, summarizing "No follow-up" until a type is picked — matches
 * `apps/web/src/components/doctor/follow-up-section.tsx`'s six-way branch (revisit / conditional /
 * status-check / admission / referral), condensed into one mockup: picking a type reveals only the fields
 * that type needs, same as the real page's conditional rendering on `value.type`.
 */
function FollowUpSection() {
  const [type, setType] = useState("NONE");
  const [date, setDate] = useState("");
  const [period, setPeriod] = useState("");
  const [notes, setNotes] = useState("");
  const [hospital, setHospital] = useState("");
  const [admissionNote, setAdmissionNote] = useState("");
  const [referredDoctor, setReferredDoctor] = useState("");
  const [booked, setBooked] = useState(false);

  const typeLabel = followUpTypeOptions.find((option) => option.value === type)?.label ?? "No follow-up";

  return (
    <Card padding="none">
      <Accordion type="single" collapsible className="px-4 sm:px-5">
        <AccordionItem value="follow-up">
          <AccordionTrigger>
            <span className="flex flex-1 flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-base">
                <CalendarClock className="size-5 text-(--tone-ink)" data-tone="primary" aria-hidden="true" />
                Follow-up
              </span>
              {type === "NONE" ? (
                <Badge size="sm" variant="outline" color="neutral">
                  No follow-up
                </Badge>
              ) : (
                <Badge size="sm" action="warning">
                  {typeLabel}
                </Badge>
              )}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-3">
              <FormField label="Follow-up Type" className="max-w-xs">
                <Select options={followUpTypeOptions} value={type} onValueChange={setType} aria-label="Follow-up type" />
              </FormField>

              {type === "REVISIT" ? (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <FormField label="Follow-up Date">
                      <Input type="date" value={date} onChange={(event) => { setDate(event.target.value); setBooked(false); }} aria-label="Follow-up date" />
                    </FormField>
                    <FormField label="Interval" hint='Optional, e.g. "2 weeks"'>
                      <Input value={period} onChange={(event) => setPeriod(event.target.value)} placeholder="e.g. 2 weeks" aria-label="Follow-up interval" />
                    </FormField>
                  </div>
                  <AutoGrowTextarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Notes for the follow-up visit" maxLength={1000} aria-label="Follow-up notes" />
                  {booked ? (
                    <Text className="text-sm text-(--tone-ink)" data-tone="success">
                      Follow-up booked for {date || "the selected date"}.
                    </Text>
                  ) : null}
                  <Button type="button" size="sm" className="self-start" disabled={!date} onClick={() => setBooked(true)}>
                    Book Follow-up
                  </Button>
                </>
              ) : null}

              {type === "CONDITIONAL" || type === "STATUS_CHECK" ? (
                <>
                  <Text muted className="text-sm">
                    {type === "CONDITIONAL"
                      ? "Patient should come back only if symptoms persist or worsen — no visit is booked now."
                      : "A quick check-in to confirm the patient is improving, not a full revisit."}
                  </Text>
                  <FormField label="Period" hint='Optional, e.g. "1 week"'>
                    <Input value={period} onChange={(event) => setPeriod(event.target.value)} placeholder="e.g. 1 week" aria-label="Follow-up period" />
                  </FormField>
                  <AutoGrowTextarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Notes" maxLength={1000} aria-label="Follow-up notes" />
                </>
              ) : null}

              {type === "ADMISSION" ? (
                <>
                  <FormField label="Hospital">
                    <SuggestInput
                      options={hospitalOptions}
                      value={hospital}
                      onChange={(event) => setHospital(event.target.value)}
                      onPick={setHospital}
                      placeholder="Search hospital…"
                      aria-label="Hospital"
                    />
                  </FormField>
                  <AutoGrowTextarea
                    value={admissionNote}
                    onChange={(event) => setAdmissionNote(event.target.value)}
                    placeholder="Note for the admitting team"
                    maxLength={500}
                    aria-label="Admission note"
                  />
                  <Button type="button" size="sm" variant="outline" className="self-start" disabled={!hospital}>
                    Suggest Admission
                  </Button>
                </>
              ) : null}

              {type === "REFERRAL" ? (
                <>
                  <FormField label="Referred Doctor">
                    <SuggestInput
                      options={referralDoctorOptions}
                      value={referredDoctor}
                      onChange={(event) => setReferredDoctor(event.target.value)}
                      onPick={setReferredDoctor}
                      placeholder="Search doctor by name or specialty…"
                      aria-label="Referred doctor"
                    />
                  </FormField>
                  <AutoGrowTextarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Reason for referral" maxLength={1000} aria-label="Referral notes" />
                </>
              ) : null}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}

export function ConsultationSample() {
  const [submitState, setSubmitState] = useState<"idle" | "saved" | "submitted">("idle");
  const [diagnoses, setDiagnoses] = useState<DiagnosisRow[]>(initialDiagnoses);
  const [tests, setTests] = useState<TestRow[]>(initialTests);
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [openMedications, setOpenMedications] = useState<string[]>(["atorvastatin", "amlodipine"]);
  const [suggestionType, setSuggestionType] = useState<"pharmacy" | "diagnostic">("pharmacy");

  const [justAddedDiagnosis, setJustAddedDiagnosis] = useState<string | null>(null);
  const addDiagnosis = () => {
    const key = nextKey("dx");
    setDiagnoses((rows) => [...rows, { key, name: "", code: "", note: "" }]);
    setJustAddedDiagnosis(key);
  };
  const removeDiagnosis = (key: string) => setDiagnoses((rows) => rows.filter((row) => row.key !== key));

  const [justAddedTest, setJustAddedTest] = useState<string | null>(null);
  const addTest = () => {
    const key = nextKey("test");
    setTests((rows) => [...rows, { key, testName: "", note: "" }]);
    setJustAddedTest(key);
  };
  const removeTest = (key: string) => setTests((rows) => rows.filter((row) => row.key !== key));

  const [justAddedMedication, setJustAddedMedication] = useState<string | null>(null);
  const addMedication = () => {
    const id = nextKey("med");
    setMedications((rows) => [...rows, blankMedication(id)]);
    setOpenMedications((open) => [...open, id]);
    setJustAddedMedication(id);
  };
  const removeMedication = (id: string) => {
    setMedications((rows) => rows.filter((row) => row.id !== id));
    setOpenMedications((open) => open.filter((value) => value !== id));
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 pt-6 pb-6 md:px-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Heading as="h1" className="text-title">
            Patient Consultation
          </Heading>
          <Text muted className="text-sm">
            Booking {booking.reference} · {booking.date} at {booking.time}
          </Text>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Printer className="size-4" />} onClick={() => window.print()}>
            Print
          </Button>
          <Button leftIcon={<Send className="size-4" />} onClick={() => setSubmitState("submitted")}>
            Submit
          </Button>
        </div>
      </header>

      <Card padding="none">
        <Accordion type="single" collapsible className="px-4 sm:px-5">
          <AccordionItem value="doctor">
            <AccordionTrigger>
              <span className="flex flex-1 flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-base">
                  <Stethoscope className="size-5 text-(--tone-ink)" data-tone="primary" aria-hidden="true" />
                  Consulting Doctor
                </span>
                <span className="text-sm font-normal text-muted-foreground">{doctor.name}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
                <div className="flex items-start gap-3">
                  <Avatar name={doctor.name} color="secondary" size="lg" />
                  <div className="flex flex-col gap-0.5">
                    <Text className="font-medium">{doctor.name}</Text>
                    <Text muted className="text-sm">
                      {doctor.specialty}
                    </Text>
                    <Text className="text-sm font-medium text-(--tone-ink)" data-tone="primary">
                      {doctor.hospital}
                    </Text>
                  </div>
                </div>
                <dl className="flex flex-col gap-1.5 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <dt className="flex items-center gap-2 text-muted-foreground">
                      <Hash className="size-4" aria-hidden="true" />
                      License No.
                    </dt>
                    <dd className="font-medium">{doctor.licenseNo}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="flex items-center gap-2 text-muted-foreground">
                      <CalendarClock className="size-4" aria-hidden="true" />
                      Date
                    </dt>
                    <dd className="font-medium">{booking.date}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="size-4" aria-hidden="true" />
                      Time
                    </dt>
                    <dd className="font-medium">{booking.time}</dd>
                  </div>
                </dl>
                <div className="flex min-w-48 flex-1 items-center justify-between gap-2 rounded-control bg-muted p-3">
                  <div className="flex flex-col gap-0.5">
                    <Text muted className="text-xs">
                      Booking Number
                    </Text>
                    <Text className="font-medium text-(--tone-ink)" data-tone="primary">
                      {booking.reference}
                    </Text>
                  </div>
                  <CheckCircle2 className="size-5 text-(--tone-ink)" data-tone="success" aria-hidden="true" />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      <Card>
        <SectionHeader icon={Stethoscope} title="Patient Information" />
        <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
          <div className="flex items-start gap-3">
            <Avatar name={patient.name} color="primary" size="lg" />
            <div className="flex flex-col gap-0.5">
              <Text className="font-medium">{patient.name}</Text>
              <Text muted className="text-sm">
                {patient.patientId} · {patient.age} yrs · {patient.gender}
              </Text>
              <Badge size="sm" action="danger" className="mt-1 w-fit">
                Blood: {patient.blood}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Text className="flex items-center gap-2 text-sm">
              <Phone className="size-4 text-muted-foreground" aria-hidden="true" />
              {patient.phone}
            </Text>
            <Text className="flex items-center gap-2 text-sm">
              <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              {patient.address}
            </Text>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-control bg-(--tone-soft) p-3" data-tone="danger">
          <Text className="flex items-center gap-2 text-sm font-medium text-(--tone-ink)">
            <AlertTriangle className="size-4" aria-hidden="true" />
            Allergies
          </Text>
          <div className="flex flex-wrap justify-end gap-1.5">
            {patient.allergies.map((allergy) => (
              <Tag key={allergy} variant="solid" size="sm" action="danger">
                {allergy}
              </Tag>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-control bg-(--tone-soft) p-3" data-tone="warning">
          <Text className="flex items-center gap-2 text-sm font-medium text-(--tone-ink)">
            <Activity className="size-4" aria-hidden="true" />
            Chronic Conditions
          </Text>
          <div className="flex flex-wrap justify-end gap-1.5">
            {patient.chronicConditions.map((condition) => (
              <Tag key={condition} variant="solid" size="sm" action="warning">
                {condition}
              </Tag>
            ))}
          </div>
        </div>
      </Card>

      <Card padding="none">
        <Accordion type="single" collapsible className="px-4 sm:px-5">
          <AccordionItem value="history">
            <AccordionTrigger>
              <span className="flex flex-1 flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-base">
                  <History className="size-5 text-(--tone-ink)" data-tone="primary" aria-hidden="true" />
                  Consultation History
                </span>
                <span className="flex items-center gap-2">
                  <Badge size="sm" action="success" variant="outline">
                    <ShieldCheck className="size-3.5" aria-hidden="true" />
                    Access granted
                  </Badge>
                  <Badge size="sm" variant="outline" color="neutral">
                    {history.length} visits
                  </Badge>
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="flex flex-col divide-y divide-border">
                {history.map((item) => (
                  <li key={item.title} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <div className="flex flex-col gap-0.5">
                        <Text className="text-sm font-medium">{item.title}</Text>
                        <Text muted className="text-xs">
                          {item.meta}
                        </Text>
                      </div>
                    </div>
                    <Badge size="sm" action={item.status === "completed" ? "success" : "warning"} className="shrink-0">
                      {item.status === "completed" ? "Completed" : "Follow-up Required"}
                    </Badge>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <SectionHeader icon={FileText} title="Chief Complaint" />
          <EditableParagraph
            defaultValue="Patient reports recurrent chest tightness and shortness of breath over the past 2 weeks, especially during physical exertion. Episodes last 10-15 minutes and resolve with rest."
            maxLength={2000}
            ariaLabel="Chief complaint"
          />
        </Card>
        <Card>
          <SectionHeader icon={ClipboardList} title="Clinical Notes" />
          <EditableParagraph
            defaultValue="Patient presents with exertional chest discomfort. No radiation to left arm or jaw. No associated sweating or nausea. Symptoms worsen with climbing stairs. Patient has a history of stage 1 hypertension, currently on Metformin 850mg. Non-smoker, occasional alcohol consumption. Family history of coronary artery disease (father). On examination, cardiovascular system reveals regular rate and rhythm, no murmurs. Lungs clear to auscultation."
            maxLength={4000}
            ariaLabel="Clinical notes"
          />
        </Card>
      </div>

      <Card>
        <SectionHeader icon={Activity} title="Vital Signs" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {vitals.map(({ label, value, unit, icon }) => (
            <VitalTile key={label} label={label} icon={icon} defaultValue={value} unit={unit} />
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeader icon={Activity} title="Diagnosis" />
        <div className="flex flex-col divide-y divide-border">
          {diagnoses.length === 0 ? (
            <Text muted className="py-3 text-sm">
              No diagnoses yet.
            </Text>
          ) : null}
          {diagnoses.map((row) => (
            <DiagnosisRowItem key={row.key} row={row} startEditing={row.key === justAddedDiagnosis} onRemove={() => removeDiagnosis(row.key)} />
          ))}
        </div>
        <AddRowButton label="Add Diagnosis" onClick={addDiagnosis} />
      </Card>

      <Card>
        <SectionHeader icon={FlaskConical} title="Tests Ordered" />
        <div className="flex flex-col divide-y divide-border">
          {tests.length === 0 ? (
            <Text muted className="py-3 text-sm">
              No tests ordered yet.
            </Text>
          ) : null}
          {tests.map((row) => (
            <TestRowItem key={row.key} row={row} startEditing={row.key === justAddedTest} onRemove={() => removeTest(row.key)} />
          ))}
        </div>
        <AddRowButton label="Order Test" onClick={addTest} />
      </Card>

      <Card padding="none">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Heading as="h2" size="sm" className="flex items-center gap-2">
              <Pill className="size-5 text-(--tone-ink)" data-tone="primary" aria-hidden="true" />
              Prescriptions
            </Heading>
            <Badge size="sm" action="success">
              Finalized
            </Badge>
          </div>
          <Button size="sm" variant="outline" leftIcon={<Printer className="size-4" />}>
            Mark as Printed
          </Button>
        </div>
        <Text muted className="px-4 text-sm sm:px-5">
          Click any medication to expand it, then click its details to edit them. Strength, dose, frequency,
          timing, duration and route all suggest from a list but take free text too.
        </Text>
        {medications.length === 0 ? (
          <Text muted className="px-4 text-sm sm:px-5">
            No medications yet.
          </Text>
        ) : null}
        <Accordion type="multiple" value={openMedications} onValueChange={setOpenMedications} className="px-4 sm:px-5">
          {medications.map((medication) => (
            <MedicationRowItem key={medication.id} medication={medication} startEditing={medication.id === justAddedMedication} onRemove={() => removeMedication(medication.id)} />
          ))}
        </Accordion>
        <div className="flex flex-col gap-3 px-4 pb-4 sm:px-5 sm:pb-5">
          <AddRowButton label="Add Medication" onClick={addMedication} />
          <FormField label="Prescription Notes" hint="General notes for the whole prescription, separate from per-medicine instructions.">
            <AutoGrowTextarea defaultValue="Avoid strenuous activity until cardiology follow-up. Resume exercise only after echocardiogram clears." maxLength={2000} />
          </FormField>
        </div>
      </Card>

      <Card padding="none">
        <Accordion type="single" collapsible className="px-4 sm:px-5">
          <AccordionItem value="suggestions">
            <AccordionTrigger>
              <span className="flex flex-1 flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-base">
                  <Store className="size-5 text-(--tone-ink)" data-tone="primary" aria-hidden="true" />
                  Suggested Pharmacy or Diagnostic Center
                </span>
                <Badge size="sm" variant="outline" color="neutral">
                  Optional
                </Badge>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-3">
                <Text muted className="text-sm">
                  Entirely optional — only suggest a {suggestionType === "pharmacy" ? "pharmacy" : "diagnostic center"} if you want to steer the patient
                  somewhere specific; up to 3 show ranked first when they buy or book.
                </Text>
                <div className="flex gap-2">
                  <Button type="button" size="sm" variant={suggestionType === "pharmacy" ? "solid" : "outline"} onClick={() => setSuggestionType("pharmacy")}>
                    Pharmacy
                  </Button>
                  <Button type="button" size="sm" variant={suggestionType === "diagnostic" ? "solid" : "outline"} onClick={() => setSuggestionType("diagnostic")}>
                    Diagnostic Center
                  </Button>
                </div>
                <Input
                  placeholder={`Search ${suggestionType === "pharmacy" ? "pharmacy" : "diagnostic center"} by name or area…`}
                  aria-label={`Search ${suggestionType === "pharmacy" ? "pharmacy" : "diagnostic center"}`}
                />
                <div className="flex flex-wrap gap-2">
                  {(suggestionType === "pharmacy" ? suggestedPharmacies : suggestedDiagnosticCenters).map((shop) => (
                    <Tag key={shop.shopCode} size="md" onRemove={() => {}}>
                      {shop.name} — {shop.branch}, {shop.area}
                    </Tag>
                  ))}
                </div>
                <FormField label="Note for patient">
                  <AutoGrowTextarea defaultValue="Nearest in-network option with the full prescription in stock." maxLength={500} />
                </FormField>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      <FollowUpSection />

      <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-between gap-3 border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
        <Text muted className="flex items-center gap-1.5 text-xs">
          <Save className="size-3.5" aria-hidden="true" />
          {submitState === "submitted" ? "Consultation submitted" : "Auto-saved draft"}
        </Text>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSubmitState("saved")}>
            Save Draft
          </Button>
          <Button leftIcon={<Send className="size-4" />} onClick={() => setSubmitState("submitted")}>
            Submit Consultation
          </Button>
        </div>
      </div>
    </div>
  );
}
