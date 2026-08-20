"use client";

import { useParams, useRouter } from "next/navigation";
import { getCaseById } from "@/cases";
import CaseBriefing from "@/components/case/CaseBriefing";

export default function CasePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const caseData = getCaseById(id);

  if (!caseData) {
    return (
      <div className="min-h-screen bg-detective-surface flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-mono text-white mb-2">CASE NOT FOUND</h1>
          <p className="text-sm font-mono text-detective-muted mb-4">
            The case {id} does not exist.
          </p>
          <button
            onClick={() => router.push("/cases")}
            className="px-4 py-2 border border-white/10 text-xs font-mono text-detective-muted hover:text-white/70 transition-colors"
          >
            BACK TO CASES
          </button>
        </div>
      </div>
    );
  }

  return <CaseBriefing caseData={caseData} />;
}
