import type { Metadata } from "next";

import NdisCaseNotesForm from "@/components/NdisCaseNotesForm";

export const metadata: Metadata = {
  title: "NDIS Case Notes Automation",
};

export default function NdisCaseNotesPage(): JSX.Element {
  return (
    <>
      <h1>NDIS Support Worker Case Notes</h1>
      <NdisCaseNotesForm />
    </>
  );
}
