import { useState, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import Header from '../components/Header';
import SkillPostsSection from '../components/SkillPostsSection';
import Footer from '../components/Footer';
import { getSkillPosts } from '../services/skillPostService';

function HomePage() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getSkillPosts()
            .then(response => {
                setPosts(response.content || []);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <>
            <Header />
            <Container sx={{ mt: 4, mb: 8 }}>
                <Box sx={{ mt: 8 }}>
                    <SkillPostsSection posts={posts} />
                </Box>
            </Container>
            <Footer />
        </>
    );
}

export default HomePage;