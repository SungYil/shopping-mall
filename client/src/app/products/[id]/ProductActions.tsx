'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface ProductActionsProps {
    productId: number;
}

export default function ProductActions({ productId }: ProductActionsProps) {
    const [quantity, setQuantity] = useState(1);
    const router = useRouter();

    const addToCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            if (confirm('로그인이 필요한 서비스입니다. 로그인 하시겠습니까?')) {
                router.push('/login');
            }
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId,
                    quantity,
                }),
            });

            if (res.ok) {
                if (confirm('장바구니에 상품을 담았습니다. 장바구니로 이동하시겠습니까?')) {
                    router.push('/cart');
                }
            } else {
                alert('장바구니 담기에 실패했습니다.');
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            alert('오류가 발생했습니다.');
        }
    };

    const buyNow = () => {
        alert('구매 기능은 준비 중입니다.');
    };

    return (
        <div className={styles.actions}>
            <div className={styles.quantity}>
                <span>수량</span>
                <select
                    className={styles.select}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                >
                    {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.buttons}>
                <button
                    className={`${styles.button} ${styles.cartButton}`}
                    onClick={addToCart}
                >
                    장바구니 담기
                </button>
                <button
                    className={`${styles.button} ${styles.buyButton}`}
                    onClick={buyNow}
                >
                    바로 구매하기
                </button>
            </div>
        </div>
    );
}
