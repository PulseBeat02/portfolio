export interface SectionDefinition {
    id: string;
    title: string;
    searchKeywords: string;
}

export const SECTIONS = {
    about: {id: "about", title: "About Me", searchKeywords: "bio"},
    experience: {id: "experience", title: "Experience", searchKeywords: "work jobs internships"},
    projects: {id: "projects", title: "Projects", searchKeywords: "github code"},
    videos: {id: "videos", title: "Videos", searchKeywords: "youtube"},
} as const satisfies Record<string, SectionDefinition>;

export const NAVIGABLE_SECTIONS: readonly SectionDefinition[] = Object.values(SECTIONS);
