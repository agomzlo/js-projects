export type Project = {
    id: number,
    slug: string,
    title: string,
    description: string,
    learnings: string[],
    links: Links
}

export type Links = {
    cover: string,
    github: string,
    demo: string
}