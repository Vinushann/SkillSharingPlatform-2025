import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useProfileNavigate = (userId: string | undefined) => {
    const navigate = useNavigate();
    const currentUserId = localStorage.getItem('userId');

    useEffect(() => {
        if (!userId) return;

        if (userId === currentUserId) {
            navigate('/profile');
        } else {
            navigate(`/profile/${userId}`);
        }
    }, [userId, currentUserId, navigate]);
};