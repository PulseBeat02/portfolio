import {NextResponse} from 'next/server';
import {getBlogPosts} from '@/lib/blog';
import {serialize} from 'next-mdx-remote/serialize';

export async function GET() {
    const postsData = await getBlogPosts();
    const posts = await Promise.all(
        postsData.map(async (post) => {
            if (post.content) {
                const mdxSource = await serialize(post.content);
                return {...post, mdxSource};
            }
            return post;
        })
    );
    return NextResponse.json(posts);
}