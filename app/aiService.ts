import { ReportData } from "./types";

// Inlined guidelines from docs/VOICE.md to use in prompt
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

// Pre-authored Mock Reports for Instant / Local Mode Fallbacks
export const MOCK_REPORTS: Record<string, ReportData> = {
  pencil: {
    objectName: "Pencil",
    summaryText: "You uploaded a pencil.",
    detailsText: "Yellow, hexagonal, eraser on one end, the word No. 2 stamped along the side. You probably paid fifteen cents for it, or it came in a pack of twelve for less than two dollars, or someone you don't know left it on your desk and you never thought about where it came from.\n\nInside it: wood, graphite, clay, water, wax, glue, brass, rubber, sulfur, pigment, and a thin film of paint in six layers. Eleven materials. Five continents. If you had to make this yourself, alone, with nothing — let's see how long that takes.",
    materialsCount: 11,
    continentsCount: 5,
    dependencyTree: {
      name: "Pencil",
      details: "The finished writing instrument. Stamped with No. 2. A simple tool that is actually a complex union of eleven processed materials.",
      children: [
        {
          name: "Cedar casing",
          details: "Straight-grained incense cedar from California. Soft enough to cut with stone, strong enough to protect the core.",
          children: [
            {
              name: "Forestry",
              details: "Finding and harvesting incense cedar. Requires knowing which trees split clean rather than crooked."
            }
          ]
        },
        {
          name: "Graphite core",
          details: "A kiln-fired mixture of graphite and clay. The line it writes is dark and smooth.",
          children: [
            {
              name: "Graphite mining",
              details: "Sourcing graphite from Sri Lanka or Madagascar. Easy to mistake for other black rocks."
            },
            {
              name: "Clay mining",
              details: "Digging clay from riverbeds, washing out sand, and firing it in a high-temperature kiln."
            }
          ]
        },
        {
          name: "Brass ferrule",
          details: "A rolled metal collar holding the eraser. Made from an alloy of copper and zinc.",
          children: [
            {
              name: "Copper mining & smelting",
              details: "Finding copper ore, smelting at 1085°C to isolate pure copper."
            },
            {
              name: "Zinc mining & smelting",
              details: "Isolating zinc. It boils at a lower temperature than copper, vaporizing if not cooled carefully."
            }
          ]
        },
        {
          name: "Rubber eraser",
          details: "Vulcanized rubber mixed with sulfur to prevent stickiness. The single hardest part of the pencil.",
          children: [
            {
              name: "Latex collection",
              details: "Tapping rubber trees in equatorial regions. Drying latex into raw rubber sheets."
            },
            {
              name: "Vulcanization",
              details: "Heating rubber with sulfur to lock its structure. Discovered in 1839 through ruinous trial and error."
            }
          ]
        }
      ]
    },
    timeline: [
      { years: "Year 1–2", description: "You search the forest. You learn to identify cedar that splits straight, discarding dozens of crooked trunks." },
      { years: "Year 3", description: "You make a wooden stick. It has no lead and cannot write. It is not a pencil." },
      { years: "Year 4–6", description: "You look for graphite. You spend years digging up black rocks, discovering Sri Lankan graphite writes grey on grey." },
      { years: "Year 7", description: "You mix the graphite with clay by accident. It writes darker. You proceed by guessing." },
      { years: "Year 9", description: "You build a ceramic kiln. Fueling it takes six months of work for a single day of firing." },
      { years: "Year 11", description: "You boil hide glue to bond the core into the cedar. You have a pencil. It has no eraser." },
      { years: "Year 14–22", description: "The eraser breaks you. You tap equatorial rubber, discover vulcanization by mixing it with sulfur and fire. It ruins your health." },
      { years: "Year 23–27", description: "Mining copper and zinc, smelting them to make brass. You roll a thin metal sheet and stamp it." },
      { years: "Year 31", description: "Six coats of yellow paint. You stamp No. 2 with a hot iron. You are finished." }
    ],
    skills: [
      { name: "Forestry", description: "Two years to find the cedar and split the logs." },
      { name: "Geology", description: "Three years to find graphite seams and identify clay." },
      { name: "Ceramics", description: "Three years to construct a kiln capable of reaching 1000°C." },
      { name: "Latex Chemistry", description: "Four years to tap, process, and vulcanize rubber." },
      { name: "Metallurgy", description: "Five years to mine, smelt, and alloy copper and zinc into brass." }
    ],
    skillsSummary: "Total acquired skill, sequentially: about thirty-one years. In parallel, with help: still more than a decade. Alone: you do not live long enough.",
    
    // Processing Difficulty metrics (Pencil)
    temperatures: [
      { tempCelsius: 1085, process: "Copper Smelting", description: "Isolating copper from its ore for the ferrule. Requires a stone blast furnace." },
      { tempCelsius: 1000, process: "Clay Vitrification", description: "Firing the clay-graphite leads to render them firm and dark." },
      { tempCelsius: 419, process: "Zinc Smelting", description: "Smelting zinc ore to alloy with copper. Zinc boils at 907°C, vaporizing instantly if unmanaged." },
      { tempCelsius: 145, process: "Rubber Vulcanization", description: "Polymerizing latex with sulfur to solidify the eraser." }
    ],
    prerequisiteTools: [
      { name: "Clay Washing Trough", purpose: "Separating fine clay particles from grit and river muck.", difficulty: "Easy. Requires three weeks of carpentry and digging." },
      { name: "Draft Kiln", purpose: "Reaching temperatures needed to fire writing leads and crucibles.", difficulty: "Medium. Two years of trial to build fireclay walls that resist cracking." },
      { name: "Smelting Bellows", purpose: "Injecting oxygen into coal fires to reach copper melting thresholds.", difficulty: "Hard. Requires trapping animals for leather and wood joinery." },
      { name: "Forging Anvil & Tongs", purpose: "Beating and rolling brass alloy into sheets thin enough to stamp.", difficulty: "Very Hard. Smelted from iron ore over six years of metallurgical trials." }
    ],
    hazards: [
      { name: "Arsenic Gas Toxicity", probabilityPercent: 35, consequence: "Smelting raw copper and lead ores releases toxic gas, causing permanent respiratory damage.", mitigation: "Only forging downwind on windy autumn days." },
      { name: "Lead Rod Shattering", probabilityPercent: 50, consequence: "Fired clay-graphite leads fracture inside the kiln, losing six months of material preparation.", mitigation: "Adding fine silica sand to stabilize thermal expansions." },
      { name: "Latex Rot", probabilityPercent: 40, consequence: "Raw latex coagulates into sticky black tar before sulfur polymerization can take place.", mitigation: "Boiling immediately with dilute organic acids at exactly 140°C." }
    ],
    processingDifficultySummary: "The pencil demands a thermal hierarchy spanning from low-heat rubber curing up to extreme metallurgy alloy temperatures, requiring four intermediate furnace builds and exposure to metal toxins.",
    
    verdictTitle: "This object cannot be made by one person in one lifetime.",
    verdictSubtitle: "It is a monument to the fact that you have never been alone.",
    cheatItem: "a small steel knife.",
    cheatDescription: "The knife collapses the first six years of tree-working. You can sharpen wood without flaking stone, and split cedar cleanly so the graphite sits straight. It saves you the entire detour into stone tools, the longest unmarked side road in the graph. A book would help more, but you cannot read.",
    reflectionParagraphs: [
      "You live in a world where this pencil cost fifteen cents and twelve seconds at a checkout.",
      "Somewhere in the chain that put it in your hand: a forester in Oregon who has not met the geologist in Sri Lanka who has not met the rubber tapper in Malaysia who has not met the smelter in Chile who has not met the truck driver who delivered the box to the store you walked into. They will never meet. None of them know you exist. They built this for you anyway.",
      "We call this normal. It is the most extraordinary thing our species has ever done.",
      "A pencil is not a pencil. A pencil is a quiet agreement, signed by millions of people across two hundred years, that none of them will ever have to make a pencil alone."
    ],
    reflectionEnding: "You are reading these words because that agreement held."
  },
  mug: {
    objectName: "Ceramic Mug",
    summaryText: "You uploaded a ceramic mug.",
    detailsText: "Glazed, heavy, cylindrical, a curved handle on one side. You bought it for three dollars, or it has a company logo you don't care about, or it has been sitting in your cupboard for a decade. \n\nInside it: kaolin clay, ball clay, feldspar, quartz silica, cobalt oxide for the blue glaze, and copper carbonate. Six minerals. Four continents. If you had to mine, shape, glaze, and fire this yourself, alone, with nothing — let's see how long that takes.",
    materialsCount: 6,
    continentsCount: 4,
    dependencyTree: {
      name: "Ceramic Mug",
      details: "A single vitrified piece of clay with an impermeable colored glass glaze. Made from earth, heat, and metal oxides.",
      children: [
        {
          name: "Mug body",
          details: "Formed kaolin and ball clay, fired twice to achieve vitrification.",
          children: [
            {
              name: "Clay mining",
              details: "Sourcing pure kaolin from Cornwall or Georgia. Washing out sand and organic matter."
            },
            {
              name: "Feldspar & Silica",
              details: "Mining quartz and feldspar rocks, crushing them to a fine powder to mix with the clay."
            }
          ]
        },
        {
          name: "Blue cobalt glaze",
          details: "A liquid suspension of silica, flux, and cobalt oxide. Melts into glass at 1200°C.",
          children: [
            {
              name: "Cobalt mining",
              details: "Sourcing cobalt ore from the Katanga Province of Congo. Highly toxic dust."
            },
            {
              name: "Smelting & Oxidation",
              details: "Roasting cobalt ore to extract pure cobalt, then heating in air to form blue cobalt oxide."
            }
          ]
        }
      ]
    },
    timeline: [
      { years: "Year 1", description: "You dig riverbeds. You find grey mud that cracks when it dries. You realize you need pure kaolin." },
      { years: "Year 3", description: "You locate a seam of white kaolin clay. You build a washing trough to separate quartz sand. Your hands are raw." },
      { years: "Year 4", description: "You carve a kickwheel from stone and oak. Centering clay takes eight months of muscle memory." },
      { years: "Year 6", description: "You build a draft kiln using refractory stones. The first four kilns collapse under their own heat." },
      { years: "Year 8", description: "You mine quartz and feldspar, crushing them with a heavy stone pestle for weeks to make glaze powder." },
      { years: "Year 11", description: "You find cobalt ore. Smelting it releases arsenic fumes; you learn to roast it downwind." },
      { years: "Year 13", description: "Your first successful high-fire glaze runs off the mug, fusing it to the kiln floor. You start over." },
      { years: "Year 15", description: "A blue mug. It is watertight. It handles heat without cracking. It took fifteen years." }
    ],
    skills: [
      { name: "Mineralogy", description: "Two years to find kaolin and differentiate quartz from feldspar." },
      { name: "Throwing & Shaping", description: "One year to throw a uniform wall and attach a handle that doesn't crack off." },
      { name: "Pyrometry", description: "Three years to gauge kiln heat (1200°C) by the color of the glowing fire alone." },
      { name: "Chemical Smelting", description: "Four years to roast cobalt and copper ores safely." }
    ],
    skillsSummary: "Total acquired skill, sequentially: about fifteen years. In parallel, with a community: months. Alone: you spend half your life in a mine.",
    
    // Processing Difficulty metrics (Mug)
    temperatures: [
      { tempCelsius: 1200, process: "Glaze Vitrification", description: "Melting silica, flux, and cobalt oxide into an impermeable blue glass shell." },
      { tempCelsius: 950, process: "Bisque Firing", description: "Dehydrating green clay bodies to solidify their crystal structures before glaze slip application." }
    ],
    prerequisiteTools: [
      { name: "Refractory Kiln", purpose: "Withstanding 1200°C kiln environments without collapsing structural arches.", difficulty: "Hard. Five years of trials with fireclay and granite masonry." },
      { name: "Basalt Pestle & Anvil", purpose: "Crushing feldspar crystals into sub-micron powder to create glaze flux.", difficulty: "Medium. Three months of abrasive stone shaping." },
      { name: "Pottery Kickwheel", purpose: "Spinning clay with uniform wall thickness to prevent steam pocket explosions.", difficulty: "Medium. Constructed from oak wood and stone weight blocks." }
    ],
    hazards: [
      { name: "Kiln Dome Collapse", probabilityPercent: 45, consequence: "Heat fractures cause structural arches to collapse, smashing months of dry pottery.", mitigation: "Binding fireclay blocks with hand-forged iron rings." },
      { name: "Silicosis", probabilityPercent: 60, consequence: "Inhaling crushed silica quartz dust permanently scars lung alveoli, causing breathing failure.", mitigation: "Grinding raw minerals in wet slurries or wearing damp wool filters." }
    ],
    processingDifficultySummary: "The mug is a study in heat management: a single temperature overshoot fuses the mug to the kiln floor, while under-firing leaves the clay porous and useless.",
    
    verdictTitle: "This object cannot be made by one person in one lifetime.",
    verdictSubtitle: "It is a monument to the fact that you have never been alone.",
    cheatItem: "a steel shovel.",
    cheatDescription: "The shovel saves your back during the first four years of mining clay, quartz, and feldspar. It turns weeks of digging with stone scrapers into hours. You still have to smelt the cobalt, but you have energy left to build the kiln.",
    reflectionParagraphs: [
      "You live in a world where this mug cost three dollars and sits forgotten on a counter.",
      "Somewhere in the chain: the miner in Congo who loaded the cobalt ore, the sailor who brought it to Rotterdam, the chemist in France who purified the silica, and the potter who formed the clay. None of them know you exist. They built this for you anyway.",
      "A mug is a quiet agreement that we will share our warmth without having to build the hearth ourselves."
    ],
    reflectionEnding: "You are reading these words because that agreement held."
  },
  sandwich: {
    objectName: "Sandwich",
    summaryText: "You uploaded a sandwich.",
    detailsText: "A standard chicken sandwich, layered with fresh lettuce, tomatoes, cheese, and a dollop of fresh mayonnaise. You probably bought it at a deli for six dollars, or built it in three minutes in your kitchen. \n\nInside it: wheat flour, chicken meat, cheese, lettuce, tomato, salt, sunflower oil, egg. Eight base components. Three processing industries. If you had to grow, mill, age, extract, press, and assemble this yourself, alone — let's see how long that takes.",
    materialsCount: 8,
    continentsCount: 1,
    dependencyTree: {
      name: "Sandwich",
      details: "A standard assembled sandwich, requiring components from agriculture, dairy, poultry, and maritime salt gathering.",
      children: [
        {
          name: "Wheat Bread",
          details: "Leavened bread baked from flour, yeast, salt, and water.",
          children: [
            {
              name: "Wheat Farming",
              details: "Clearing land, planting seeds, harvesting grain, and threshing by hand."
            },
            {
              name: "Milling",
              details: "Grinding wheat berries into fine white flour using heavy rotating stones."
            }
          ]
        },
        {
          name: "Chicken",
          details: "Cooked poultry breast.",
          children: [
            {
              name: "Poultry Husbandry",
              details: "Raising chicks, securing feed from wild grains, and preparing the bird."
            }
          ]
        },
        {
          name: "Cheese",
          details: "Aged hard cheese.",
          children: [
            {
              name: "Dairy Farming",
              details: "Milking cows, separating whey, pressing curds, and aging."
            }
          ]
        },
        {
          name: "Mayonnaise",
          details: "Emulsion of oil and egg.",
          children: [
            {
              name: "Oil Pressing",
              details: "Growing sunflowers and pressing seeds with wooden levers to extract oil."
            }
          ]
        }
      ]
    },
    timeline: [
      { years: "Month 1–3", description: "You clear land with stone axes and plant wheat seeds. You grow lettuce, tomatoes, and sunflowers." },
      { years: "Month 4", description: "You raise a calf to milk. It will be years before she yields, so you wait. In the meantime, you milk a sheep." },
      { years: "Month 5", description: "You travel to the sea. You boil seawater for weeks to get a small pouch of sea salt." },
      { years: "Month 6", description: "You press sunflower seeds with heavy logs to extract oil. You harvest wild eggs. You bake bread using hand-milled flour. You assemble the sandwich." }
    ],
    skills: [
      { name: "Agronomy", description: "Three months to plant, weed, protect, and harvest wheat and fresh vegetables." },
      { name: "Dairy Science & Fermentation", description: "Two months to milk, churn butter, separate whey, and age curd into cheese." },
      { name: "Poultry Husbandry", description: "Five months to raise a bird and process the meat." },
      { name: "Evaporative Chemistry", description: "Three weeks of boiling saltwater to extract pure sodium chloride." }
    ],
    skillsSummary: "Total acquired skill, sequentially: about six months. In parallel, with help: ten minutes. Alone: a half-year of hard farm labor for a single lunch.",
    temperatures: [
      { tempCelsius: 220, process: "Bread Baking", description: "Baking leavened dough inside an earthen clay oven." },
      { tempCelsius: 100, process: "Saltwater Boiling", description: "Evaporating sea water in clay pots to extract pure white sea salt crystals." }
    ],
    prerequisiteTools: [
      { name: "Earthen Oven", purpose: "Retaining high heat to bake flatbread or leavened loaves.", difficulty: "Medium. Made from mud, clay, and straw over two weeks." },
      { name: "Sunflower Press", purpose: "Applying hundreds of pounds of pressure to press sunflower seeds into oil.", difficulty: "Medium. Built using oak levers and heavy stones." },
      { name: "Salt Pan", purpose: "Wide, shallow clay trays to dry seawater in the sun.", difficulty: "Easy. Formed from local river clay." }
    ],
    hazards: [
      { name: "Crop Failure", probabilityPercent: 30, consequence: "Insects or rot destroy your wheat, delaying your sandwich by a full year.", mitigation: "Crop rotation and digging drainage ditches." },
      { name: "Latex Coagulation Failure", probabilityPercent: 10, consequence: "The cheese spoils and grows toxic mold during aging.", mitigation: "Strict sanitation of clay storage vessels using boiling water." }
    ],
    processingDifficultySummary: "The sandwich is a test of patience: every ingredient depends on seasons, weather, and the physical limits of a single farmer.",
    verdictTitle: "To make a sandwich from scratch, you must first invent the universe.",
    verdictSubtitle: "A six-month agricultural labor for four bites of bread, fat, and salt.",
    cheatItem: "a pocket of sea salt.",
    cheatDescription: "Saves you a three-week journey to the ocean coast to boil seawater, letting you focus on the harvest.",
    reflectionParagraphs: [
      "You live in a world where this sandwich cost six dollars and was eaten in ten minutes while looking at a phone.",
      "Somewhere in the chain: the wheat farmer in Kansas, the dairy farmer in Wisconsin, the salt harvester in Utah, and the truck driver who brought them to the bakery. They will never meet. They built this for you anyway.",
      "A sandwich is a quiet agreement that we will share our hunger together, without anyone having to farm the earth alone."
    ],
    reflectionEnding: "You are reading these words because that agreement held."
  }
};

// VLM API Client wrapper
export async function generateReport(
  imageBase64: string,
  apiKey: string,
  brain: "local" | "cloud"
): Promise<ReportData> {
  // If local, we fall back to a mock report based on image classification or prompt.
  if (brain === "local" || !apiKey) {
    await new Promise((resolve) => setTimeout(resolve, 3500));
    
    const lowercaseBase64 = imageBase64.toLowerCase();
    if (lowercaseBase64.includes("mug") || lowercaseBase64.includes("cup") || Math.random() > 0.5) {
      return MOCK_REPORTS.mug;
    }
    return MOCK_REPORTS.pencil;
  }

  // Cloud API request to Gemini 2.5 Flash
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

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
  process: string; // The physical or chemical process (e.g. "Iron Smelting", "Wood Seasoning")
  description: string; // Description of difficulty to reach/maintain it
}

interface PrerequisiteTool {
  name: string; // E.g., "Stone Hammer", "Clay Kiln"
  purpose: string; // Why it is needed
  difficulty: string; // How hard it is to create this prerequisite
}

interface HazardItem {
  name: string; // E.g., "Silicosis", "Metal Splattering"
  probabilityPercent: number; // 0 to 100
  consequence: string; // What happens if this hazard occurs
  mitigation: string; // How you try to avoid it
}

interface ReportData {
  objectName: string; // The common name of the object in the image
  summaryText: string; // E.g., "You uploaded a pencil."
  detailsText: string; // A description of the object, its materials, and the setup.
  materialsCount: number; // Count of raw materials
  continentsCount: number; // Count of continents of origin
  dependencyTree: DependencyNode; // Standard nested tree structure representing components down to elements
  timeline: TimeMilestone[]; // Chronological milestones (e.g. "Year 1-2", "Year 3")
  skills: SkillItem[]; // Skills list
  skillsSummary: string; // Sequential time summary paragraph
  
  // Custom Processing Difficulty metrics (Replacing geographic maps)
  temperatures: TemperatureMilestone[]; // Key thermal thresholds required
  prerequisiteTools: PrerequisiteTool[]; // Tools stack needed to make this object
  hazards: HazardItem[]; // Risk/Failure logs
  processingDifficultySummary: string; // Overall summary of processing difficulty

  verdictTitle: string; // Write a custom verdict reflecting object complexity. (e.g. "This object cannot be made by one person in one lifetime." for complex tools, or something custom reflecting difficulty for simpler items). Do NOT repeat the exact same sentence for every single object; make it tailored!
  verdictSubtitle: string; // Write a custom, emotional subtext tailored to the object.
  cheatItem: string; // e.g., "a small steel knife"
  cheatDescription: string; // what the cheat item saves
  reflectionParagraphs: string[]; // Final reflection
  reflectionEnding: string; // The final italicized punchline
}

Make sure to strictly adhere to the voice guide: no exclamation marks, no AI self-reference, Sagan-like tone, specifics over abstractions, ends on connection.
`;

  try {
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

    const report: ReportData = JSON.parse(textContent);
    return report;
  } catch (error) {
    console.error("VLM generation failed, falling back to mock:", error);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return MOCK_REPORTS.pencil;
  }
}
