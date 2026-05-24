import { db } from "../../../lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import DependencyTree from "../DependencyTree";
import TemperatureGauge from "../TemperatureGauge";
import ToolingChain from "../ToolingChain";
import HazardsLog from "../HazardsLog";
import { ReportData } from "../../types";
import AdminDeleteButton from "../AdminDeleteButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Sourced by either unique UUID or slug
  const report = await db.report.findFirst({
    where: {
      OR: [{ id: id }, { slug: id }],
    },
  });

  if (!report) {
    notFound();
  }

  // Parse JSON fields from DB columns
  const reportData: ReportData = {
    objectName: report.objectName,
    summaryText: report.summaryText,
    detailsText: report.detailsText,
    materialsCount: report.materialsCount,
    continentsCount: report.continentsCount,
    dependencyTree: JSON.parse(report.dependencyTree),
    timeline: JSON.parse(report.timeline),
    skills: JSON.parse(report.skills),
    skillsSummary: report.skillsSummary,
    temperatures: JSON.parse(report.temperatures),
    prerequisiteTools: JSON.parse(report.prerequisiteTools),
    hazards: JSON.parse(report.hazards),
    processingDifficultySummary: report.processingDifficultySummary,
    verdictTitle: report.verdictTitle,
    verdictSubtitle: report.verdictSubtitle,
    cheatItem: report.cheatItem,
    cheatDescription: report.cheatDescription,
    reflectionParagraphs: JSON.parse(report.reflectionParagraphs),
    reflectionEnding: report.reflectionEnding,
  };

  const isSandwich = reportData.objectName.toLowerCase().includes("sandwich") || 
                     reportData.objectName.toLowerCase().includes("blt") || 
                     reportData.objectName.toLowerCase().includes("burger") || 
                     reportData.objectName.toLowerCase().includes("panini");

  return (
    <main className="mx-auto max-w-[68ch] px-6 py-12 sm:py-24">
      {/* Return Navigation */}
      <nav className="mb-16 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2 font-serif text-sm italic text-ink-faint hover:text-ink transition-colors"
        >
          <span className="inline-block translate-y-[-1px] group-hover:-translate-x-1 transition-transform">
            &larr;
          </span>{" "}
          Back to the library
        </Link>
        <AdminDeleteButton reportId={report.id} reportName={report.objectName} />
      </nav>

      {/* Hero Header */}
      <header className="mb-24 text-center">
        <p className="mb-10 text-sm uppercase tracking-[0.3em] text-ink-faint">
          Alone
        </p>
        <p className="text-balance text-2xl italic leading-snug text-ink-soft sm:text-3xl">
          What would it take to make this &mdash; alone, with nothing, in your
          lifetime?
        </p>
        {report.imageB64 && (
          <div className="mt-12 flex justify-center">
            <div className="relative rounded-sm border border-rule p-2 bg-paper/30">
              <img
                src={report.imageB64}
                alt={report.objectName}
                className="max-h-40 max-w-full object-contain grayscale opacity-80"
              />
            </div>
          </div>
        )}
        <h1 className="mt-12 text-5xl font-medium tracking-tight sm:text-6xl text-ink">
          {reportData.objectName}
        </h1>
      </header>

      {/* Sagan's Paradox / Sandwich Easter Egg Callout */}
      {isSandwich && (
        <div className="mb-24 p-6 rounded-sm border border-rule bg-ink/[0.02] text-left">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-faint mb-3 font-semibold">
            &sect; Sagan&rsquo;s Paradox
          </p>
          <blockquote className="font-serif italic text-lg text-ink-soft pl-4 border-l border-rule mb-4 leading-relaxed">
            &ldquo;If you wish to make an apple pie &mdash; or in this case, a sandwich &mdash; from scratch, you must first invent the universe.&rdquo;
            <cite className="block text-xs uppercase tracking-wider text-ink-faint not-italic mt-2">
              &mdash; Carl Sagan, Cosmos
            </cite>
          </blockquote>
          <p className="font-serif text-sm text-ink-soft leading-relaxed">
            In 2015, a researcher spent six months and $1,500 to create a single chicken sandwich entirely from scratch. He grew his own vegetables, milled wheat for bread, milked a cow for cheese, slaughtered a chicken, and traveled to the ocean to harvest salt.
          </p>
          <p className="font-serif text-sm text-ink-soft leading-relaxed mt-2">
            The result was a brief, four-bite meal. A physical lesson in the staggering depth of human cooperation. We buy it for six dollars and eat it in minutes, forgetting the centuries of collective knowledge layered between the slices.
          </p>
        </div>
      )}

      {/* Report sections */}
      <ObjectSection report={reportData} />
      <DependencyTreeSection report={reportData} />
      <TimeEstimateSection report={reportData} />
      <SkillsSection report={reportData} />

      {/* Process Difficulty Sections (Replaced Map) */}
      <TemperatureSection report={reportData} />
      <ToolingSection report={reportData} />
      <HazardsSection report={reportData} />

      <VerdictSection report={reportData} />
      <CheatSection report={reportData} />
      <ReflectionSection report={reportData} />
    </main>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-24 border-t border-rule pt-10 text-sm uppercase tracking-[0.25em] text-ink-faint">
      {children}
    </h2>
  );
}

function ObjectSection({ report }: { report: ReportData }) {
  const paragraphs = report.detailsText.split("\n\n");
  return (
    <section>
      <SectionHeader>&sect; The Object</SectionHeader>
      <div className="mt-8 space-y-6">
        <p className="font-semibold">{report.summaryText}</p>
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}

function DependencyTreeSection({ report }: { report: ReportData }) {
  return (
    <section>
      <SectionHeader>&sect; The Dependency Tree</SectionHeader>
      <DependencyTree tree={report.dependencyTree} />
      <div className="space-y-6">
        <p>The surprises are not where you think.</p>
        <p>
          Each branch above traces the tools and extraction needed to produce a single element. Hover or click the layers to examine the scale of preparation required for raw assembly.
        </p>
      </div>
    </section>
  );
}

function TimeEstimateSection({ report }: { report: ReportData }) {
  return (
    <section>
      <SectionHeader>&sect; The Time Estimate</SectionHeader>
      <div className="mt-8 space-y-6">
        {report.timeline.map((m, i) => (
          <p key={i}>
            <strong className="font-semibold">{m.years}.</strong> {m.description}
          </p>
        ))}
      </div>
    </section>
  );
}

function SkillsSection({ report }: { report: ReportData }) {
  return (
    <section>
      <SectionHeader>&sect; The Skills You&rsquo;d Need</SectionHeader>
      <ul className="mt-8 space-y-3">
        {report.skills.map((s) => (
          <li key={s.name} className="leading-relaxed">
            <span className="font-semibold">{s.name}.</span> {s.description}
          </li>
        ))}
      </ul>
      <p className="mt-10 italic text-ink-soft">
        {report.skillsSummary}
      </p>
    </section>
  );
}

function TemperatureSection({ report }: { report: ReportData }) {
  return (
    <section>
      <SectionHeader>&sect; The Heat</SectionHeader>
      <TemperatureGauge milestones={report.temperatures || []} />
      <div className="space-y-6">
        <p>
          Achieving and controlling these thermal thresholds requires specialized draft furnace structures, hand-worked bellows, and precise fuel preparation.
        </p>
      </div>
    </section>
  );
}

function ToolingSection({ report }: { report: ReportData }) {
  return (
    <section>
      <SectionHeader>&sect; The Tooling Stack</SectionHeader>
      <ToolingChain tools={report.prerequisiteTools || []} />
      <div className="space-y-6">
        <p>
          Before the final object can be assembled, you must first construct the tools that make the tools. Every step is a gatekeeper.
        </p>
      </div>
    </section>
  );
}

function HazardsSection({ report }: { report: ReportData }) {
  return (
    <section>
      <SectionHeader>&sect; The Hazards</SectionHeader>
      <HazardsLog hazards={report.hazards || []} />
      <div className="space-y-6">
        <p>{report.processingDifficultySummary}</p>
      </div>
    </section>
  );
}

function VerdictSection({ report }: { report: ReportData }) {
  return (
    <section className="my-24 text-center border-y border-rule py-16 bg-ink/[0.01]">
      <h2 className="mb-6 text-sm uppercase tracking-[0.25em] text-ink-faint">
        &sect; The Verdict
      </h2>
      <p className="text-balance text-3xl leading-snug sm:text-4xl text-ink font-medium">
        {report.verdictTitle}
      </p>
      <p className="mx-auto mt-6 max-w-[40ch] text-balance text-xl italic leading-snug text-ink-soft">
        {report.verdictSubtitle}
      </p>
    </section>
  );
}

function CheatSection({ report }: { report: ReportData }) {
  return (
    <section>
      <SectionHeader>&sect; The Cheat</SectionHeader>
      <div className="mt-8 space-y-6">
        <p>If you could bring one thing with you into this life:</p>
        <p>
          Bring <strong className="font-semibold">{report.cheatItem}</strong>{" "}
          {report.cheatDescription}
        </p>
      </div>
    </section>
  );
}

function ReflectionSection({ report }: { report: ReportData }) {
  return (
    <section className="mt-32">
      <SectionHeader>&sect; The Reflection</SectionHeader>
      <div className="mt-8 space-y-6">
        {report.reflectionParagraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <p className="mt-16 text-center text-xl italic text-ink-soft font-medium">
          {report.reflectionEnding}
        </p>
      </div>
    </section>
  );
}
