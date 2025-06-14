import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { AuthContext } from '../App';

function Index() {
    const { user } = useContext(AuthContext);
    const [materials, setMaterials] = useState([]);
    const [title, setTitle] = useState('');
    const [type, setType] = useState('notes');
    const [file, setFile] = useState(null);
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(1);

    useEffect(() => {
        axios.get('http://localhost:5000/materials')
            .then(res => setMaterials(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('type', type);
        formData.append('userId', user.userId);
        await axios.post('http://localhost:5000/upload', formData);
        alert('File uploaded');
        window.location.reload();
    };

    const handleReview = async (materialId) => {
        await axios.post(`http://localhost:5000/materials/${materialId}/review`, {
            userId: user.userId,
            review,
            rating
        });
        alert('Review submitted');
        window.location.reload();
    };

    if (!user) {
        return <Redirect to="/login" />;
    }

    return (
        <div className="container">
            <nav>
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
                <Link to="/logout">Logout</Link>
            </nav>
            <h1>Edumate</h1>
            <h2>Welcome, {user.name}</h2>
            <h2>Upload Material</h2>
            <form onSubmit={handleUpload}>
                <input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} required />
                <select onChange={(e) => setType(e.target.value)} required>
                    <option value="notes">Notes</option>
                    <option value="question_paper">Question Paper</option>
                    <option value="study_material">Study Material</option>
                </select>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
                <button type="submit">Upload</button>
            </form>
            <h2>Materials</h2>
            {materials.map(material => (
                <div className="material-card" key={material._id}>
                    <h3>{material.title} ({material.type})</h3>
                    <p>Uploaded by: {material.uploadedBy.name}</p>
                    <a href={`http://localhost:5000/${material.filePath}`} download>Download</a>
                    <div className="review-section">
                        <h4>Reviews</h4>
                        {material.reviews.map((rev, idx) => (
                            <p key={idx}>{rev.review} (Rating: {rev.rating}/5)</p>
                        ))}
                        <input type="text" placeholder="Write review" onChange={(e) => setReview(e.target.value)} />
                        <input type="number" min="1" max="5" onChange={(e) => setRating(e.target.value)} />
                        <button onClick={() => handleReview(material._id)}>Submit Review</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Index;
