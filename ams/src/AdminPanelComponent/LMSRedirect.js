import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LMSRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLMSUrl = async () => {
            try {
                const email = localStorage.getItem("userEmail");
                if (!email) {
                    console.error("User email not found in localStorage");
                    navigate("/login");  // Redirect to login if email is missing
                    return;
                }
                const response = await fetch(`http://localhost:5001/lms/${email}`);
                if (response.ok) {
                    const data = await response.json();
                    window.location.href = data.url;  // Redirect to LMS URL
                } else {
                    console.error("Failed to fetch LMS URL");
                }
            } catch (error) {
                console.error("Error fetching LMS URL:", error);
            }
        };

        fetchLMSUrl();
    }, [navigate]);

    return <div>Redirecting to LMS...</div>;
}

export default LMSRedirect;
