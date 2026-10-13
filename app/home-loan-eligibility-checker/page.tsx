import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { EligibilityChecker } from "@/components/tools/loan-tools";

export const metadata: Metadata = {
  title: "Home Loan Eligibility Checker Based on Salary",
  description: "Estimate how much home loan you may be eligible for from your monthly income, existing EMIs, tenure and interest rate.",
  alternates: { canonical: "/home-loan-eligibility-checker/" },
};

export default function EligibilityPage() {
  return (
    <>
      <PageHero eyebrow="Tools" title="How much can you borrow?" intro="A quick estimate from your income and existing EMIs, before you speak to a bank." crumbs={[{ label: "Home", href: "/" }, { label: "Loan eligibility" }]} />
      <Container className="py-12 md:py-16"><EligibilityChecker /></Container>
    </>
  );
}
