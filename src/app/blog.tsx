"use client";

import {useEffect, useState} from 'react';
import {Grid, Stack, Typography, Box, Chip, Button, Dialog, DialogContent, IconButton} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {SectionHeading} from "@/app/common";
import {BlogPost} from '@/lib/blog';
import {MDXRemote} from 'next-mdx-remote';
import Link from 'next/link';

export default function Blog() {

    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await fetch('/api/blog');
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error("Failed to fetch blog posts:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts().then(() => {
        });
    }, []);

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    const openBlogModal = (post: BlogPost) => {
        setSelectedPost(post);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const components = {
        Link: Link,
    };

    return (
        <div className="flex justify-center">
            <div style={{maxWidth: '600px', width: '100%'}}>
                <SectionHeading number={5} text="Blog"/>
                <Stack spacing={3} sx={{mt: 4}}>
                    {posts && posts.length > 0 ? (
                        posts.map((post, index) => (
                            <Box
                                key={index}
                                sx={{
                                    padding: 3,
                                    borderRadius: 2,
                                    transition: 'all 0.3s ease',
                                    filter: hoveredIndex !== null && hoveredIndex !== index ? 'blur(2px)' : 'none',
                                    opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.7 : 1,
                                    border: '1px solid rgba(57, 255, 20, 0.2)',
                                    '&:hover': {
                                        boxShadow: '0 4px 20px rgba(57, 255, 20, 0.15)',
                                        borderColor: 'rgba(57, 255, 20, 0.3)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <Grid container spacing={2}>
                                    <Grid>
                                        <Typography variant="overline" color="#888888">
                                            {post.date} • {post.readingTime || '5 min read'}
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            fontWeight="bold"
                                            gutterBottom
                                            sx={{cursor: 'pointer'}}
                                            onClick={() => openBlogModal(post)}
                                        >
                                            {post.title}
                                        </Typography>
                                        <Typography variant="body1">
                                            {post.description}
                                        </Typography>
                                        {post.tags && (
                                            <Stack direction="row"
                                                   sx={{flexWrap: 'wrap', gap: 0.5, marginTop: 1}}>
                                                {post.tags.map((tag, tagIndex) => (
                                                    <Chip
                                                        key={tagIndex}
                                                        label={tag}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: 'rgba(57, 255, 20, 0.1)',
                                                            color: '#39FF14',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(57, 255, 20, 0.2)',
                                                            }
                                                        }}
                                                    />
                                                ))}
                                            </Stack>
                                        )}
                                        <Button
                                            onClick={() => openBlogModal(post)}
                                            sx={{
                                                mt: 2,
                                                color: '#39FF14',
                                                borderColor: 'rgba(57, 255, 20, 0.5)',
                                                '&:hover': {
                                                    borderColor: '#39FF14',
                                                    bgcolor: 'rgba(57, 255, 20, 0.1)'
                                                }
                                            }}
                                            variant="outlined"
                                            size="small"
                                        >
                                            Read More
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        ))
                    ) : (
                        <Typography>No blog posts found.</Typography>
                    )}
                </Stack>
            </div>
            <Dialog
                open={modalOpen}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            bgcolor: '#121212',
                            border: '1px solid rgba(57, 255, 20, 0.3)',
                            borderRadius: 2,
                            boxShadow: '0 8px 32px rgba(57, 255, 20, 0.2)',
                            maxHeight: '90vh'
                        }
                    }
                }}
            >
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    p: 1
                }}>
                    <IconButton
                        onClick={handleCloseModal}
                        sx={{color: '#39FF14'}}
                    >
                        <CloseIcon/>
                    </IconButton>
                </Box>
                <DialogContent>
                    {selectedPost && (
                        <Box>
                            <Typography variant="overline" color="#888888">
                                {selectedPost.date} • {selectedPost.readingTime || '5 min read'}
                            </Typography>
                            <Typography variant="h4" fontWeight="bold" gutterBottom color="#ffffff">
                                {selectedPost.title}
                            </Typography>

                            {selectedPost.tags && (
                                <Stack direction="row" spacing={1} sx={{flexWrap: 'wrap', gap: 0.5, mb: 3}}>
                                    {selectedPost.tags.map((tag, tagIndex) => (
                                        <Chip
                                            key={tagIndex}
                                            label={tag}
                                            size="small"
                                            sx={{
                                                bgcolor: 'rgba(57, 255, 20, 0.1)',
                                                color: '#39FF14',
                                            }}
                                        />
                                    ))}
                                </Stack>
                            )}
                            <Box sx={{
                                mt: 3,
                                color: '#ffffff',
                                '& pre': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                    borderRadius: 2,
                                    p: 2,
                                    overflowX: 'auto',
                                },
                                '& code': {
                                    fontFamily: 'monospace',
                                    color: '#39FF14',
                                },
                                '& blockquote': {
                                    borderLeft: '4px solid rgba(57, 255, 20, 0.5)',
                                    pl: 2,
                                    ml: 0,
                                    color: '#cccccc',
                                },
                                '& img': {
                                    maxWidth: '100%',
                                    borderRadius: 2,
                                }
                            }}>
                                {selectedPost.mdxSource ? (
                                    <MDXRemote {...selectedPost.mdxSource} components={components}/>
                                ) : (
                                    <Typography>No content available</Typography>
                                )}
                            </Box>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}