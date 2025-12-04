'use client';

import { useState } from 'react';
import styles from './ReviewForm.module.css';

export default function ReviewForm({ productId, onReviewSubmitted }: { productId: number, onReviewSubmitted: () => void }) {
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(5);
    const [images, setImages] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        setIsSubmitting(true);

        try {
            const imageArray = images.split(',').map(url => url.trim()).filter(url => url.length > 0);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId,
                    content,
                    rating,
                    images: imageArray,
                }),
            });

            if (res.ok) {
                alert('리뷰가 등록되었습니다.');
                setContent('');
                setRating(5);
                setImages('');
                onReviewSubmitted(); // 부모 컴포넌트에 알림
            } else {
                alert('리뷰 등록에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h4 className={styles.title}>리뷰 작성하기</h4>

            <div className={styles.ratingField}>
                <label>별점</label>
                <div className={styles.stars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={star <= rating ? styles.filledStar : styles.emptyStar}
                            onClick={() => setRating(star)}
                        >
                            ★
                        </span>
                    ))}
                </div>
            </div>

            <textarea
                className={styles.textarea}
                placeholder="상품에 대한 솔직한 리뷰를 남겨주세요."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={3}
            />

            <input
                type="text"
                className={styles.input}
                placeholder="이미지 URL (쉼표로 구분)"
                value={images}
                onChange={(e) => setImages(e.target.value)}
            />

            <div className={styles.optionsGrid}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="구매 옵션 (예: Pink / Free)"
                    name="purchasedOption"
                    value={options.purchasedOption}
                    onChange={handleOptionChange}
                />
                <input
                    type="number"
                    className={styles.input}
                    placeholder="키 (cm)"
                    name="userHeight"
                    value={options.userHeight}
                    onChange={handleOptionChange}
                />
                <input
                    type="number"
                    className={styles.input}
                    placeholder="몸무게 (kg)"
                    name="userWeight"
                    value={options.userWeight}
                    onChange={handleOptionChange}
                />
                <input
                    type="text"
                    className={styles.input}
                    placeholder="상의 사이즈 (예: 55, S)"
                    name="userTopSize"
                    value={options.userTopSize}
                    onChange={handleOptionChange}
                />
                <input
                    type="text"
                    className={styles.input}
                    placeholder="하의 사이즈 (예: 26, S)"
                    name="userBottomSize"
                    value={options.userBottomSize}
                    onChange={handleOptionChange}
                />
            </div>

            <button type="submit" className={styles.button} disabled={isSubmitting}>
                {isSubmitting ? '등록 중...' : '리뷰 등록'}
            </button>
        </form>
    );
}
