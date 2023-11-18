import { useRef, useState, useEffect, useCallback } from "react";
import "./index.css";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { motion } from "framer-motion";

// Unsplash API config
const API_URL = "https://api.unsplash.com/search/photos";
const IMAGES_PER_PAGE = 18;

const App = () => {
  // State management
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

  // Fetch images with AXIOS
  const fetchImages = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}?query=${
          searchInput.current.value
        }&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${
          import.meta.env.VITE_API_KEY
        }`
      );
      console.log("data", data);
      setImages(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.log(error);
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Reset
  const resetSearch = () => {
    setPage(1);
    fetchImages();
  };

  // Handle search submit
  const handleSubmit = (e) => {
    e.preventDefault();
    resetSearch();
  };

  // Handle selected filters
  const handleSelect = (selection) => {
    searchInput.current.value = selection;
    resetSearch();
  };

  return (
    <div className="container">
      <motion.h1
        className="title display-3"
        initial={{ y: -250, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring", stiffness: 100 }}
      >
        What Would You
        <br />
        <motion.span
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Like To See?
        </motion.span>
      </motion.h1>
      <div className="search-section">
        <Form onSubmit={handleSubmit}>
          <Form.Control
            type="search"
            placeholder="I want to see.."
            className="search-input"
            ref={searchInput}
          />
        </Form>
      </div>
      <div className="filters">
        <div onClick={() => handleSelect("nature")}>#Nature</div>
        <div onClick={() => handleSelect("dogs")}>#Dogs</div>
        <div onClick={() => handleSelect("cats")}>#Cats</div>
        <div onClick={() => handleSelect("home")}>#Home</div>
      </div>
      <div className="images">
        {images.map((image) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <img
              src={image.urls.small}
              alt={image.alt_description}
              className="image"
            />
          </motion.div>
        ))}
      </div>
      <div className="buttons">
        {page > 1 && (
          <Button onClick={() => setPage(page - 1)}>Previous</Button>
        )}
        {page < totalPages && (
          <Button onClick={() => setPage(page + 1)}>Next</Button>
        )}
      </div>
    </div>
  );
};

export default App;
