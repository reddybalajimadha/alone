-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "objectName" TEXT NOT NULL,
    "imageB64" TEXT NOT NULL,
    "summaryText" TEXT NOT NULL,
    "detailsText" TEXT NOT NULL,
    "materialsCount" INTEGER NOT NULL,
    "continentsCount" INTEGER NOT NULL,
    "dependencyTree" TEXT NOT NULL,
    "timeline" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "skillsSummary" TEXT NOT NULL,
    "temperatures" TEXT NOT NULL,
    "prerequisiteTools" TEXT NOT NULL,
    "hazards" TEXT NOT NULL,
    "processingDifficultySummary" TEXT NOT NULL,
    "verdictTitle" TEXT NOT NULL,
    "verdictSubtitle" TEXT NOT NULL,
    "cheatItem" TEXT NOT NULL,
    "cheatDescription" TEXT NOT NULL,
    "reflectionParagraphs" TEXT NOT NULL,
    "reflectionEnding" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Report_slug_key" ON "Report"("slug");
