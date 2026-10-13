"use client";
import { useId, useMemo, useState } from "react";
import { LeadButton } from "@/components/lead/lead-provider";
import { cn } from "@/lib/utils";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const lakhCr = (n: number) => (n >= 1e7 ? `₹${+(n / 1e7).toFixed(2)} Cr` : `₹${+(n / 1e5).toFixed(2)} L`);
const emiOf = (p: number, annual: number, years: number) => { const r = annual / 1200, n = years * 12; return r === 0 ? p / n : (p * r * (1 + r) ** n) / ((1 + r) ** n - 1); };
const input = "h-11 w-full rounded-sm border border-line-2 bg-card px-3 text-[0.9375rem] tnum outline-none focus:border-brand";

function Field({ label, value, onChange, suffix }: { label: string; value: number; onChange: (n: number) => void; suffix: string }) {
  const id = useId();
  return (
    <div><label htmlFor={id} className="label mb-1.5 block">{label}</label>
      <div className="flex"><input id={id} type="number" inputMode="decimal" min={0} value={Number.isFinite(value) ? value : ""} onChange={(e) => onChange(parseFloat(e.target.value))} className={cn(input, "rounded-r-none")} />
        <span className="grid h-11 min-w-16 place-items-center rounded-r-sm border border-l-0 border-line-2 bg-wash px-3 text-sm font-semibold">{suffix}</span></div></div>
  );
}

function Result({ rows, note }: { rows: [string, string, boolean?][]; note: string }) {
  return (
    <div className="rounded-md bg-night p-6 text-paper sm:p-8">
      <dl className="grid gap-5">{rows.map(([k, v, big]) => <div key={k}><dt className="label !text-paper/65">{k}</dt><dd className={cn("tnum mt-1 font-display", big ? "text-[2.75rem] leading-none" : "text-2xl")}>{v}</dd></div>)}</dl>
      <p className="mt-6 text-[0.8125rem] text-paper/65">{note}</p>
      <LeadButton intent="advisor" variant="light" className="mt-6">Discuss with an advisor</LeadButton>
    </div>
  );
}

export function EmiCalculator() {
  const [price, setPrice] = useState(100), [down, setDown] = useState(20), [years, setYears] = useState(20), [rate, setRate] = useState(8.5);
  const r = useMemo(() => { const loan = price * 1e5 * (1 - down / 100), emi = emiOf(loan, rate, years); return { loan, emi, interest: emi * years * 12 - loan }; }, [price, down, years, rate]);
  const ok = [price, down, years, rate].every(Number.isFinite) && price > 0 && years > 0;
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <div className="grid gap-5 rounded-md border border-line bg-card p-6 sm:grid-cols-2 sm:p-8">
        <Field label="Property price" value={price} onChange={setPrice} suffix="lakh" />
        <Field label="Down payment" value={down} onChange={setDown} suffix="%" />
        <Field label="Loan tenure" value={years} onChange={setYears} suffix="years" />
        <Field label="Interest rate" value={rate} onChange={setRate} suffix="% p.a." />
      </div>
      {ok && <Result rows={[["Monthly EMI", inr(r.emi), true], ["Loan amount", lakhCr(r.loan)], ["Total interest", lakhCr(r.interest)]]} note="Indicative figures for planning. Your bank’s offer will depend on your profile." />}
    </div>
  );
}

// Rates are as listed on the current site and must be reviewed before launch.
const BANKS = [["HDFC", 8.25], ["SBI", 8.5], ["ICICI", 8.75], ["Axis Bank", 9]] as const;

export function EligibilityChecker() {
  const [income, setIncome] = useState(100000), [emis, setEmis] = useState(0), [years, setYears] = useState(20), [rate, setRate] = useState<number>(8.5);
  const id = useId();
  const loan = useMemo(() => { const room = Math.max(0, income * 0.5 - emis); const r = rate / 1200, n = years * 12; return r === 0 ? room * n : (room * (1 - (1 + r) ** -n)) / r; }, [income, emis, years, rate]);
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <div className="grid gap-5 rounded-md border border-line bg-card p-6 sm:grid-cols-2 sm:p-8">
        <Field label="Monthly income" value={income} onChange={setIncome} suffix="₹" />
        <Field label="Existing EMIs" value={emis} onChange={setEmis} suffix="₹ / month" />
        <Field label="Loan tenure" value={years} onChange={setYears} suffix="years" />
        <div><label htmlFor={id} className="label mb-1.5 block">Interest rate</label>
          <select id={id} className={input} value={rate} onChange={(e) => setRate(parseFloat(e.target.value))}>{BANKS.map(([b, r]) => <option key={b} value={r}>{b} · {r}%</option>)}</select></div>
      </div>
      <Result rows={[["Indicative loan eligibility", lakhCr(loan), true], ["Affordable monthly EMI", inr(Math.max(0, income * 0.5 - emis))]]} note="Assumes up to 50% of monthly income can go to EMIs. Banks apply their own rules, so treat this as a starting point." />
    </div>
  );
}
