'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

interface OrderDetail {
    id: number;
    total: number;
    status: string;
    createdAt: string;
    items: {
        id: number;
        quantity: number;
        price: number;
        product: {
            id: number;
            name: string;
            images: string[];
        };
    }[];
}

const STATUS_LABELS: Record<string, string> = {
    'PENDING': '결제대기',
    'PAID': '결제완료',
    'SHIPPED': '배송중',
    'DELIVERED': '배송완료',
    'CANCELLED': '주문취소',
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [order, setOrder] = useState<OrderDetail | null>(null);
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
            console.error('Error fetching order detail:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className={styles.container}>Loading...</div>;
    if (!order) return <div className={styles.container}>주문을 찾을 수 없습니다.</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>주문 상세 내역</h1>

            <div className={styles.orderInfo}>
                <div className={styles.infoRow}>
                    <span className={styles.label}>주문번호</span>
                    <span className={styles.value}>{order.id}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.label}>주문일자</span>
                    <span className={styles.value}>{new Date(order.createdAt).toLocaleString()}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.label}>주문상태</span>
                    <span className={`${styles.value} ${styles[order.status]}`}>
                        {STATUS_LABELS[order.status] || order.status}
                    </span>
                </div>
            </div>

            <div className={styles.itemsSection}>
                <h2 className={styles.sectionTitle}>주문 상품</h2>
                <div className={styles.itemsList}>
                    {order.items.map((item) => (
                        <div key={item.id} className={styles.itemCard}>
                            <div className={styles.imageWrapper}>
                                {item.product.images && item.product.images.length > 0 ? (
                                    <img
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        className={styles.productImage}
                                    />
                                ) : (
                                    <div className={styles.placeholderImage} />
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
                                <div className={styles.totalPrice}>
                                    {(item.price * item.quantity).toLocaleString()}원
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.paymentSection}>
                <h2 className={styles.sectionTitle}>결제 정보</h2>
                <div className={styles.paymentRow}>
                    <span>총 결제금액</span>
                    <span className={styles.totalAmount}>{order.total.toLocaleString()}원</span>
                </div>
            </div>

            <div className={styles.actions}>
                <Link href="/orders" className={styles.backButton}>
                    목록으로 돌아가기
                </Link>
            </div>
        </div>
    );
}
