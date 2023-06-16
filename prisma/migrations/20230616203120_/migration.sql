-- CreateEnum
CREATE TYPE "ServiceKeyType" AS ENUM ('openai');

-- CreateEnum
CREATE TYPE "PromptType" AS ENUM ('plaintext', 'LMQL');

-- CreateEnum
CREATE TYPE "ReportingType" AS ENUM ('approval', 'numeric');

-- CreateEnum
CREATE TYPE "OutputGenerationStatus" AS ENUM ('ready', 'inProgress', 'complete', 'failed');

-- CreateTable
CREATE TABLE "ServiceKey" (
    "service" "ServiceKeyType" NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ServiceKey_pkey" PRIMARY KEY ("service","projectId")
);

-- CreateTable
CREATE TABLE "Prompt" (
    "id" VARCHAR(11) NOT NULL DEFAULT nanoid(11),
    "name" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL,
    "projectId" VARCHAR(11) NOT NULL,
    "type" "PromptType" NOT NULL,

    CONSTRAINT "Prompt_pkey" PRIMARY KEY ("id","version")
);

-- CreateTable
CREATE TABLE "PromptVariableDescriptions" (
    "key" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "promptVersion" INTEGER NOT NULL,

    CONSTRAINT "PromptVariableDescriptions_pkey" PRIMARY KEY ("promptId","promptVersion","key")
);

-- CreateTable
CREATE TABLE "Experiment" (
    "id" VARCHAR(11) NOT NULL DEFAULT nanoid(11),
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "didLaunch" BOOLEAN NOT NULL,
    "nResponseVariations" INTEGER NOT NULL,
    "nVariableVariations" INTEGER NOT NULL,
    "reportingType" "ReportingType" NOT NULL,

    CONSTRAINT "Experiment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperimentVariable" (
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "variation" INTEGER NOT NULL,
    "experimentId" TEXT NOT NULL,

    CONSTRAINT "ExperimentVariable_pkey" PRIMARY KEY ("experimentId","name","variation")
);

-- CreateTable
CREATE TABLE "ExperimentPrompt" (
    "id" VARCHAR(11) NOT NULL DEFAULT nanoid(11),
    "promptId" TEXT NOT NULL,
    "promptVersion" INTEGER NOT NULL,
    "experimentId" TEXT NOT NULL,
    "variableVariation" INTEGER NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "topP" DOUBLE PRECISION NOT NULL,
    "frequencyPenalty" DOUBLE PRECISION NOT NULL,
    "presencePenalty" DOUBLE PRECISION NOT NULL,
    "maxTokens" INTEGER,
    "model" TEXT NOT NULL,
    "outputGenerationStatus" "OutputGenerationStatus" NOT NULL,
    "output" TEXT,

    CONSTRAINT "ExperimentPrompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperimentPromptRating" (
    "score" INTEGER NOT NULL,
    "experimentPromptId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ExperimentPromptRating_pkey" PRIMARY KEY ("experimentPromptId","projectId")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" VARCHAR(11) NOT NULL DEFAULT nanoid(11),
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Prompt_version_idx" ON "Prompt"("version" DESC);

-- CreateIndex
CREATE INDEX "ExperimentVariable_experimentId_idx" ON "ExperimentVariable"("experimentId");

-- AddForeignKey
ALTER TABLE "ServiceKey" ADD CONSTRAINT "ServiceKey_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptVariableDescriptions" ADD CONSTRAINT "PromptVariableDescriptions_promptId_promptVersion_fkey" FOREIGN KEY ("promptId", "promptVersion") REFERENCES "Prompt"("id", "version") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experiment" ADD CONSTRAINT "Experiment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperimentVariable" ADD CONSTRAINT "ExperimentVariable_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperimentPrompt" ADD CONSTRAINT "ExperimentPrompt_promptId_promptVersion_fkey" FOREIGN KEY ("promptId", "promptVersion") REFERENCES "Prompt"("id", "version") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperimentPrompt" ADD CONSTRAINT "ExperimentPrompt_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperimentPromptRating" ADD CONSTRAINT "ExperimentPromptRating_experimentPromptId_fkey" FOREIGN KEY ("experimentPromptId") REFERENCES "ExperimentPrompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperimentPromptRating" ADD CONSTRAINT "ExperimentPromptRating_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
