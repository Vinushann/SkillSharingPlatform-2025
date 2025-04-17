import axios from 'axios';
// const API_URL = process.env.SPRING_APP_API_URL;

export const getSkillPosts = async () => {
    console.log(' iiiiii');
    // skill-posts/getallposts
    const response = await axios.get(`http://localhost:8080/api/v1/skill-posts/getallposts`);
    return response.data;
};