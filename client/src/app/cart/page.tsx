'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

interface CartItem {
    id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        price: number;
        images: string[];
    };
}

interface Cart {
    id: number;
    items: CartItem[];
}

export default function CartPage() {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('token'); // TODO: 실제 토큰 관리 방식에 맞게 수정 필요
            // 현재는 토큰 없이 요청하거나, 쿠키 기반이라면 credentials: 'include' 필요
            // 여기서는 일단 로컬 스토리지에 토큰이 있다고 가정하고 헤더에 추가하는 예시입니다.
            // 실제 구현에서는 로그인 시 토큰을 저장하는 로직이 선행되어야 합니다.
            // 만약 쿠키 기반 인증이라면 headers 설정 없이 credentials: 'include'를 사용해야 합니다.

            if (!token) {
                // 토큰이 없으면 로그인 페이지로 리다이렉트하거나 빈 장바구니 보여주기
                setLoading(false);
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setCart(data);
            } else {
                console.error('Failed to fetch cart');
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });

            if (res.ok) {
                fetchCart(); // 재조회
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const removeItem = async (itemId: number) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.ok) {
                fetchCart();
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const calculateTotal = () => {
        if (!cart) return 0;
        return cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    };

    if (loading) return <div className="container">Loading...</div>;

    if (!cart || cart.items.length === 0) {
        return (
            <div className="container">
                <div className={styles.emptyCart}>
                    <p>장바구니가 비어있습니다.</p>
                    <Link href="/" className={styles.continueButton}>
                        쇼핑 계속하기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <h1 className={styles.title}>SHOPPING CART</h1>

            <div className={styles.cartGrid}>
                <div className={styles.cartItems}>
                    {cart.items.map((item) => (
                        <div key={item.id} className={styles.item}>
                            <div className={styles.imageWrapper}>
                                {item.product.images && item.product.images.length > 0 ? (
                                    <img
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        className={styles.image}
                                    />
                                ) : (
                                    <div className={styles.placeholder} />
                                )}
                            </div>

                            <div className={styles.itemInfo}>
                                <Link href={`/products/${item.product.id}`} className={styles.productName}>
                                    {item.product.name}
                                </Link>
                                <p className={styles.price}>{item.product.price.toLocaleString()}원</p>
                            </div>

                            <div className={styles.quantityControl}>
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                            </div>

                            <div className={styles.itemTotal}>
                                {(item.product.price * item.quantity).toLocaleString()}원
                            </div>

                            <button onClick={() => removeItem(item.id)} className={styles.removeButton}>
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                <div className={styles.summary}>
                    <div className={styles.summaryRow}>
                        <span>상품 금액</span>
                        <span>{calculateTotal().toLocaleString()}원</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>배송비</span>
                        <span>0원</span>
                    </div>
                    <div className={`${styles.summaryRow} ${styles.total}`}>
                        <span>결제 예정 금액</span>
                        <span>{calculateTotal().toLocaleString()}원</span>
                    </div>
                    <button className={styles.checkoutButton}>주문하기</button>
                </div>
            </div>
        </div>
    );
}
