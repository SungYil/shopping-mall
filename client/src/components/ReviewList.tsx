'use client';

import { useState, useEffect } from 'react';
import styles from './ReviewList.module.css';

interface Review {
    id: number;
    content: string;
    rating: number;
    images: string[];
    user: {
        name: string;
    };
    createdAt: string;
}

export default function ReviewList({ productId }: { productId: number }) {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/product/${productId}`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>구매 후기 ({reviews.length})</h3>

            {reviews.length === 0 ? (
                <p className={styles.empty}>아직 작성된 후기가 없습니다.</p>
            ) : (
                <ul className={styles.list}>
                    {reviews.map((review) => (
                        <li key={review.id} className={styles.item}>
                            <div className={styles.header}>
                                <span className={styles.rating}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                                <span className={styles.user}>{review.user.name}</span>
                                <span className={styles.date}>{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className={styles.content}>{review.content}</p>
                            {review.images && review.images.length > 0 && (
                                <div className={styles.images}>
                                    {review.images.map((img, index) => (
                                        <img key={index} src={img} alt={`Review ${index}`} className={styles.image} />
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
