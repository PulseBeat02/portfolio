import type {SectionDefinition} from "@/data/sections";

export function filterSections(sections: readonly SectionDefinition[], searchQuery: string): readonly SectionDefinition[] {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return sections;
    return sections.filter((section) => `${section.title} ${section.searchKeywords}`.toLowerCase().includes(normalizedQuery));
}

export function wrapIndex(index: number, length: number): number {
    return length === 0 ? 0 : (index + length) % length;
}
