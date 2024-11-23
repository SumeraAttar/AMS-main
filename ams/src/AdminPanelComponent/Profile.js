import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import snehal from '../assests/Snehal.jpeg';
function Profile() {
    const { email } = useParams();
    const [profile, setProfile] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [activeMenu, setActiveMenu] = useState("Profile");
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch profile data with dynamic email from params
        fetch(`http://localhost:5001/api/profile/${email}`, {
            method: 'GET',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }
            return response.json();
        })
        .then(data => {
            setProfile(data); // Update profile data
            setLoading(false); // Set loading to false after data fetch
        })
        .catch(error => {
            console.error('Fetch error:', error);
            setError('Failed to load profile data');
            setLoading(false); // Set loading to false on error
        });
    }, [email]);

    // Menu navigation handler
    const handleMenuClick = (menu) => {
        setActiveMenu(menu);

        if (menu === "LMS") {
            navigate('/lms');
        } else if (menu === "AMS") {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user.role === "admin") {
                navigate("/admin?token=" + localStorage.getItem("authToken"));
            } else if (user.role === "student") {
                navigate("/student?token=" + localStorage.getItem("authToken"));
            } else {
                navigate("/admin?token=" + localStorage.getItem("authToken"));
            }
        }
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <h2>Dashboard</h2>
                <ul>
                    <li onClick={() => handleMenuClick("Profile")} className={activeMenu === "Profile" ? "active" : ""}>Profile</li>
                    <li onClick={() => handleMenuClick("LMS")} className={activeMenu === "LMS" ? "active" : ""}>LMS</li>
                    <li onClick={() => handleMenuClick("AMS")} className={activeMenu === "AMS" ? "active" : ""}>AMS</li>
                    <li onClick={() => handleMenuClick("Trainers")} className={activeMenu === "Trainers" ? "active" : ""}>Trainers</li>
                    <li onClick={() => handleMenuClick("Placement")} className={activeMenu === "Placement" ? "active" : ""}>Placement</li>
                </ul>
            </div>

            <div className="main-content">
                {loading && <p>Loading profile data...</p>}
                {error && <p className="text-danger">{error}</p>}

                {activeMenu === "Profile" && !loading && !error && (
                    <div className="container mt-5">
                        <h3>Student Profile</h3>
                        {profile.name ? (
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Name: {profile.name}</h5>
                                    <p>Email: {profile.email}</p>
                                    <p>Course: {profile.course}</p>
                                    <p>Role: {profile.role}</p>
                                </div>
                            </div>
                        ) : (
                            <p>No profile information available.</p>
                        )}
                    </div>
                )}

                {activeMenu === "LMS" && (
                    <div>
                        <h3>LMS Content</h3>
                        <p>Details about LMS go here.</p>
                    </div>
                )}
                {activeMenu === "AMS" && (
                    <div>
                        <h3>AMS Content</h3>
                        <p>Details about AMS go here.</p>
                    </div>
                )}
                {activeMenu === "Trainers" && (
    <div className="trainers-content">
        <h3>Meet Our Trainers</h3>
        <div className="trainers-cards-container">
            {[
                {
                    id: 1,
                    name: "John Doe",
                    email: "john.doe@example.com",
                    designation: "Senior Trainer",
                    photo: snehal
                },
                {
                    id: 2,
                    name: "Jane Smith",
                    email: "jane.smith@example.com",
                    designation: "Technical Trainer",
                    photo: snehal
                },
                {
                    id: 3,
                    name: "Alice Johnson",
                    email: "alice.johnson@example.com",
                    designation: "Software Trainer",
                    photo: snehal
                },
                {
                    id: 4,
                    name: "Bob Williams",
                    email: "bob.williams@example.com",
                    designation: "Web Development Trainer",
                    photo: snehal
                },
                {
                    id: 5,
                    name: "Emma Brown",
                    email: "emma.brown@example.com",
                    designation: "Python Trainer",
                    photo: snehal
                },
                {
                    id: 6,
                    name: "Chris Wilson",
                    email: "chris.wilson@example.com",
                    designation: "Data Science Trainer",
                    photo: snehal
                }
            ].map((trainer) => (
                <div key={trainer.id} className="trainer-card">
                    <img
                        src={trainer.photo}
                        alt={`${trainer.name}'s photo`}
                        className="trainer-photo"
                    />
                    <h5 className="trainer-name">{trainer.name}</h5>
                    <p className="trainer-email">{trainer.email}</p>
                    <p className="trainer-designation">{trainer.designation}</p>
                </div>
            ))}
        </div>
    </div>
)}
{activeMenu === "Placement" && (
    <div className="placement-content">
        <h3>Placement Opportunities</h3>
        <div className="placement-cards-container">
            {[
                {
                    id: 1,
                    company: "ABC Tech",
                    role: "Software Developer",
                    location: "New York, NY",
                    description: "We are looking for a software developer proficient in JavaScript and React.",
                    deadline: "2024-12-31"
                },
                {
                    id: 2,
                    company: "XYZ Solutions",
                    role: "Data Scientist",
                    location: "San Francisco, CA",
                    description: "Seeking a Data Scientist with experience in machine learning and Python.",
                    deadline: "2024-11-30"
                },
                {
                    id: 3,
                    company: "WebWorks Inc.",
                    role: "Front-end Developer",
                    location: "Austin, TX",
                    description: "Looking for a front-end developer skilled in HTML, CSS, and JavaScript.",
                    deadline: "2024-12-15"
                },
                {
                    id: 4,
                    company: "Innovate Corp.",
                    role: "Python Developer",
                    location: "Chicago, IL",
                    description: "Hiring Python developers with a passion for data analysis and automation.",
                    deadline: "2024-11-25"
                }
            ].map((placement) => (
                <div key={placement.id} className="placement-card">
                    <h5 className="placement-company">{placement.company}</h5>
                    <p className="placement-role"><strong>Role:</strong> {placement.role}</p>
                    <p className="placement-location"><strong>Location:</strong> {placement.location}</p>
                    <p className="placement-description">{placement.description}</p>
                    <p className="placement-deadline"><strong>Deadline:</strong> {placement.deadline}</p>
                </div>
            ))}
        </div>
    </div>
)}

            </div>
        </div>
    );
}

export default Profile;
