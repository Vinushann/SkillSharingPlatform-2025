import {
    Grid,
    Card,
    CardContent,
    Typography,
} from '@mui/material';

function SkillPostsSection({ posts }) {
    return (
        <>
            <Typography variant="h4" gutterBottom>
                Explore Skill Posts
            </Typography>
            <Grid container spacing={3}>
                {posts.length > 0 ? (
                    posts.map(post => (
                        <Grid item xs={12} sm={6} md={4} key={post.postId}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{post.title}</Typography>
                                    <Typography variant="body2">{post.description}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1">No posts available.</Typography>
                )}
            </Grid>
        </>
    );
}

export default SkillPostsSection;