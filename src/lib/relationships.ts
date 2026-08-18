import { allProjects } from "@/data/projects";
import { experiencesById } from "@/data/journey";
import type { ProjectCard } from "@/types/conversation";
import type { ExperienceEntry } from "@/types/journey";

/** A project's linked contexts, resolved from its stored experienceIds. */
export function getExperiencesForProject(project: ProjectCard): ExperienceEntry[] {
  return (project.experienceIds ?? [])
    .map((id) => experiencesById[id])
    .filter((entry): entry is ExperienceEntry => Boolean(entry));
}

/** Derived reverse lookup — never stored, always computed from project data. */
export function getProjectsForExperience(experienceId: string): ProjectCard[] {
  return allProjects.filter((project) => project.experienceIds?.includes(experienceId));
}
