import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { MOCK_REPORTS } from "../../aiService";
import { ReportData } from "../../types";

const VOICE_GUIDELINES = `
- Never lecture. Show the cost; let the reader feel it.
- Specifics over abstractions. Always. (e.g. "Bauxite from Guinea. Cedar from northern California. Graphite from Sri Lanka.")
- End on connection, not isolation. Bends toward the miner, chemist, truck driver who built it anyway. Sagan, not Schopenhauer.
- Short sentences for impact. Especially at the ends of sections.
- Numbers ground the prose. Use them. (e.g. "40 cents. 44,000 kilometers.")
- No exclamation marks. Not one.
- No emojis in output copy.
- No AI self-reference. Never "as an AI" or "I think".
- Banned words: amazing, incredible, fascinating, remarkable, astonishing, mind-blowing, truly, absolutely, deeply, profoundly, delve, navigate, embark, journey, in today's world, it's worth noting that, complex, multifaceted, nuanced, unlock, leverage, empower, resonate, mindset, moreover, furthermore.
`;

export async function POST(request: Request) {
  try {
    const { imageBase64, brain, apiKey, filename } = await request.json();

    // Use environment variable first, then fallback to user-supplied key
    const activeKey = process.env.GEMINI_API_KEY || apiKey || "";
    
    let reportData: ReportData;

    // Check if uploaded object is a sandwich based on file name
    const filenameLower = (filename || "").toLowerCase();
    const isSandwichFile = filenameLower.includes("sandwich") || 
                           filenameLower.includes("blt") || 
                           filenameLower.includes("burger") || 
                           filenameLower.includes("panini") || 
                           filenameLower.includes("toastie") || 
                           filenameLower.includes("subway") || 
                           filenameLower.includes("hoagie");

    // Check if it's the sandwich Easter egg
    if (isSandwichFile) {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      reportData = MOCK_REPORTS.sandwich;
    } else {
      // If no API key is provided (neither server-side nor client-supplied), return an error
      if (!activeKey) {
        return NextResponse.json(
          { error: "A Gemini API Key is required to analyze custom objects. Please configure one in the settings menu." },
          { status: 400 }
        );
      }

      // Cloud API request to Gemini 2.5 Flash
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeKey}`;

      const systemPrompt = `
You are the narrator of "Alone". You write detailed reports about what it would take to build everyday objects entirely from scratch, by yourself, in one lifetime.

${VOICE_GUIDELINES}

Your output must be a valid JSON object matching the following TypeScript interface. You MUST return ONLY the JSON object, with no markdown code formatting, no backticks, and no extra text.

interface DependencyNode {
  name: string;
  details?: string;
  children?: DependencyNode[];
}

interface TimeMilestone {
  years: string;
  description: string;
}

interface SkillItem {
  name: string;
  description: string;
}

interface TemperatureMilestone {
  tempCelsius: number;
  process: string;
  description: string;
}

interface PrerequisiteTool {
  name: string;
  purpose: string;
  difficulty: string;
}

interface HazardItem {
  name: string;
  probabilityPercent: number;
  consequence: string;
  mitigation: string;
}

interface ReportData {
  objectName: string;
  summaryText: string;
  detailsText: string;
  materialsCount: number;
  continentsCount: number;
  dependencyTree: DependencyNode;
  timeline: TimeMilestone[];
  skills: SkillItem[];
  skillsSummary: string;
  temperatures: TemperatureMilestone[];
  prerequisiteTools: PrerequisiteTool[];
  hazards: HazardItem[];
  processingDifficultySummary: string;
  verdictTitle: string; 
  verdictSubtitle: string; 
  cheatItem: string;
  cheatDescription: string;
  reflectionParagraphs: string[];
  reflectionEnding: string;
}

Make sure to strictly adhere to the voice guide: no exclamation marks, no AI self-reference, Sagan-like tone, specifics over abstractions, ends on connection.
`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
                  },
                },
                {
                  text: "Identify this object, analyze its manufacturing supply chain from scratch, and output the detailed 'Alone' report in JSON format.",
                },
              ],
            },
          ],
          systemInstruction: {
            parts: [
              {
                text: systemPrompt,
              },
            ],
          },
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errText}`);
      }

      const data = await response.json();
      const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textContent) {
        throw new Error("No response text content received from Gemini.");
      }

      reportData = JSON.parse(textContent);
    }

    // Save report in the SQLite database via Prisma
    const baseSlug = reportData.objectName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const uniqueSuffix = Date.now().toString().slice(-4);
    const slug = `${baseSlug}-${uniqueSuffix}`;

    const savedReport = await db.report.create({
      data: {
        slug,
        objectName: reportData.objectName,
        imageB64: imageBase64 || "",
        summaryText: reportData.summaryText,
        detailsText: reportData.detailsText,
        materialsCount: reportData.materialsCount,
        continentsCount: reportData.continentsCount,
        dependencyTree: JSON.stringify(reportData.dependencyTree),
        timeline: JSON.stringify(reportData.timeline),
        skills: JSON.stringify(reportData.skills),
        skillsSummary: reportData.skillsSummary,
        temperatures: JSON.stringify(reportData.temperatures),
        prerequisiteTools: JSON.stringify(reportData.prerequisiteTools),
        hazards: JSON.stringify(reportData.hazards),
        processingDifficultySummary: reportData.processingDifficultySummary,
        verdictTitle: reportData.verdictTitle,
        verdictSubtitle: reportData.verdictSubtitle,
        cheatItem: reportData.cheatItem,
        cheatDescription: reportData.cheatDescription,
        reflectionParagraphs: JSON.stringify(reportData.reflectionParagraphs),
        reflectionEnding: reportData.reflectionEnding,
      },
    });

    return NextResponse.json({ id: savedReport.id, slug: savedReport.slug });
  } catch (error: any) {
    console.error("VLM generation route failed:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process image." },
      { status: 500 }
    );
  }
}
