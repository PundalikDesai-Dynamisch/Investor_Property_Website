import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { EmiCalculator } from "@/components/tools/loan-tools";

export const metadata: Metadata = {
  title: "Home Loan EMI Calculator for Pune Property",
  description: "Work out your monthly EMI from property price, down payment, tenure and interest rate, then talk to an advisor about projects in your budget.",
  alternates: { canonical: "/emi-calculator/" },
};

export default function EmiPage() {
  return (
    <>
      <PageHero eyebrow="Tools" title="What will the EMI be?" intro="Enter the price and loan terms. The result updates as you type." crumbs={[{ label: "Home", href: "/" }, { label: "EMI calculator" }]} />
      <Container className="py-12 md:py-16"><EmiCalculator /></Container>
    </>
  );
}
