import React, { useState, useEffect } from 'react';

const App = () => {
    const [images, setImages] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
      const fetchImages = async () => {
        setIsLoading(true);
        const response = await fetch(`/images?page=${page}&per_page=6`);
        const data = await response.json();
        const imageUrls = data.data.map((image) => image.imageUrl);
        setImages(prevImages => [...prevImages, ...imageUrls]);
        setPage(page + 1);
        setHasMore(data.total > images.length + imageUrls.length);
        setIsLoading(false);
    };

        fetchImages();
    }, [page]);

    const handleScroll = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        if (scrollTop + clientHeight >= scrollHeight - 50 && hasMore) {
            fetchImages();
        }
    };

    return (
        <div onScroll={handleScroll}>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="image-grid">
                    {images.map((imageUrl) => (
                        <img key={imageUrl} src={imageUrl} alt="Image" />
                    ))}
                </div>
            )}
            {hasMore && !isLoading && <p>Loading more images...</p>}
        </div>
    );
};

export default App;