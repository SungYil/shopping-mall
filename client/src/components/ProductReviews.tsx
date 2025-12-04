'use client';

import { useState } from 'react';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

export default function ProductReviews({ productId }: { productId: number }) {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleReviewSubmitted = () => {
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <div style={{ marginTop: '4rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>상품 리뷰</h2>
            <ReviewForm productId={productId} onReviewSubmitted={handleReviewSubmitted} />
            <ReviewList key={refreshKey} productId={productId} />
        </div>
    );
}
