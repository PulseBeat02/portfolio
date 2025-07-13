import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {MDXRemoteSerializeResult} from 'next-mdx-remote';

export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    description: string;
    tags: string[];
    readingTime?: string;
    content?: string;
    mdxSource?: MDXRemoteSerializeResult;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
    const directory = path.join(process.cwd(), 'public/blog');
    const files = fs.readdirSync(directory);
    const allPostsData = files
        .filter(file => file.endsWith('.mdx'))
        .map(file => {
            const slug = file.replace(/\.mdx$/, '');
            const fullPath = path.join(directory, file);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const {data, content} = matter(fileContents);
            return {
                slug,
                title: data.title,
                date: data.date || new Date().toISOString(),
                description: data.description,
                tags: data.tags || [],
                readingTime: data.readingTime,
                content
            };
        });
    return allPostsData.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime());
}