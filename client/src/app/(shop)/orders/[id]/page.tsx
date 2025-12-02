'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    product: {
        id: number;
        name: string;
        images: string[];
    };
}

interface Order {
    id: number;
    total: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetail();
    }, [id]);

    const fetchOrderDetail = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요합니다.');
                router.push('/login');
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setOrder(data);
            } else {
                alert('주문 정보를 불러오는데 실패했습니다.');
                router.push('/orders');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            alert('오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="container">Loading...</div>;
    if (!order) return <div className="container">주문을 찾을 수 없습니다.</div>;

    return (
        <div className="container">
            <h1 className={styles.title}>ORDER DETAIL</h1>

            <div className={styles.orderContainer}>
                <div className={styles.header}>
                    <div className={styles.headerRow}>
                        <span className={styles.label}>주문번호</span>
                        <span className={styles.value}>{order.id}</span>
                    </div>
                    <div className={styles.headerRow}>
                        <span className={styles.label}>주문일자</span>
                        <span className={styles.value}>
                            {new Date(order.createdAt).toLocaleString()}
                        </span>
                    </div>
                    <div className={styles.headerRow}>
                        <span className={styles.label}>주문상태</span>
                        <span className={styles.status}>
                            {order.status === 'PENDING' ? '결제완료' : order.status}
                        </span>
                    </div>
                </div>

                <div className={styles.items}>
                    <h3>주문 상품 정보</h3>
                    {order.items.map((item) => (
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
                                <div className={styles.priceInfo}>
                                    <span>{item.price.toLocaleString()}원</span>
                                    <span className={styles.quantity}>x {item.quantity}개</span>
                                </div>
                            </div>
                            <div className={styles.itemTotal}>
                                {(item.price * item.quantity).toLocaleString()}원
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.footer}>
                    <div className={styles.totalRow}>
                        <span>총 결제금액</span>
                        <span className={styles.totalPrice}>
                            {order.total.toLocaleString()}원
                        </span>
                    </div>
                </div>

                <div className={styles.actions}>
                    <Link href="/orders" className={styles.backButton}>
                        목록으로 돌아가기
                    </Link>
                </div>
            </div>
        </div>
    );
}
