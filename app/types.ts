export interface DependencyNode {
  name: string;
  children?: DependencyNode[];
  details?: string;
}

export interface TimeMilestone {
  years: string;
  description: string;
}

export interface SkillItem {
  name: string;
  description: string;
}

export interface TemperatureMilestone {
  tempCelsius: number;
  process: string;
  description: string;
}

export interface PrerequisiteTool {
  name: string;
  purpose: string;
  difficulty: string;
}

export interface HazardItem {
  name: string;
  probabilityPercent: number;
  consequence: string;
  mitigation: string;
}

export interface ReportData {
  objectName: string;
  summaryText: string;
  detailsText: string;
  materialsCount: number;
  continentsCount: number;
  dependencyTree: DependencyNode;
  timeline: TimeMilestone[];
  skills: SkillItem[];
  skillsSummary: string;
  
  // Custom Processing Difficulty metrics (Replacing the Map)
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
