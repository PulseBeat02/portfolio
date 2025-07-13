import {Dialog} from '@headlessui/react';
import {useState, useEffect} from 'react';
import {MDXRemote, MDXRemoteSerializeResult} from 'next-mdx-remote';
import Link from 'next/link';

interface BlogModalProps {
    isOpen: boolean;
    onClose: () => void;
    slug: string;
}

export default function BlogModal({isOpen, onClose, slug}: BlogModalProps) {
    const [content, setContent] = useState<MDXRemoteSerializeResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        if (!isOpen || !slug) return;
        setIsLoading(true);
        fetch(`/api/blog/${slug}`)
            .then(res => res.json())
            .then(data => {
                setContent(data.mdxSource);
                setIsLoading(false);
            })
    }, [isOpen, slug]);
    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
            <div className="min-h-screen flex items-center justify-center p-4">
                <div
                    className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    <div className="mt-2">
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <div
                                    className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                            </div>
                        ) : content ? (
                            <div className="prose prose-lg max-w-none">
                                <MDXRemote {...content} components={{Link}}/>
                            </div>
                        ) : (
                            <p className="text-center py-12">Failed to load blog content.</p>
                        )}
                    </div>
                </div>
            </div>
        </Dialog>
    );
}