export type CVLanguage = "en" | "th"

export type CVCategory = "production" | "competition" | "academic" | "personal" | "openSource"

export type LanguageMap<T> = Record<CVLanguage, T>

export type CategoryMap<T> = Record<CVCategory, T>

export interface EducationItem {
  school: string
  period: string
  detail: string
  gpa: string
}

export interface ExperienceItem {
  title: string
  period: string
  points: string[]
}

export interface ProjectItem {
  name: string
  role: string
  description: string
  target: string
  problem: string
  learned: string
  url?: string
}

export interface SelfDevelopmentItem {
  certifications: Array<{
    name: string
    institution: string
  }>
  workshops: Array<{
    name: string
    institution: string
  }>
}

export interface AwardItem {
  competitions: Array<{
    name: string
    rank: string
    theme: string
  }>
  honors: Array<{
    name: string
    institution: string
    detail: string
  }>
}

export interface LeadershipItem {
  title: string
  role: string
  description: string
  softSkills: string[]
  period: string
}

export interface CVCopy {
  pageLabel: string
  name: string
  intro: string
  sectionProf: string
  sectionSelf: string
  sectionAwards: string
  sectionLead: string
  sectionEd: string
  roleLabel: string
  targetLabel: string
  problemLabel: string
  learnedLabel: string
  certLabel: string
  workshopLabel: string
  compLabel: string
  honorLabel: string
  skillLabel: string
  gpaLabel: string
  categories: Record<CVCategory, string>
}

export type EducationMap = LanguageMap<EducationItem[]>
export type ProfessionalExperienceMap = LanguageMap<CategoryMap<ProjectItem[]>>
export type SelfDevelopmentMap = LanguageMap<SelfDevelopmentItem>
export type AwardMap = LanguageMap<AwardItem>
export type LeadershipMap = LanguageMap<LeadershipItem[]>
export type ExperienceMap = LanguageMap<ExperienceItem[]>
export type CVCopyMap = LanguageMap<CVCopy>