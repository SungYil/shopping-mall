'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요합니다.');
                window.location.href = '/login';
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            } else {
                console.error('Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    if (orders.length === 0) {
        return (
            <div className="container">
                <div className={styles.empty}>
                    <p>주문 내역이 없습니다.</p>
                    <Link href="/" className={styles.continueButton}>
                        쇼핑하러 가기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <h1 className={styles.title}>ORDER HISTORY</h1>

            <div className={styles.orderList}>
                {orders.map((order) => (
                    <div key={order.id} className={styles.orderCard}>
                        <div className={styles.orderHeader}>
                            <div className={styles.orderInfo}>
                                <span className={styles.date}>
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                                <span className={styles.orderId}>주문번호: {order.id}</span>
                            </div>
                            <Link href={`/orders/${order.id}`} className={styles.detailLink}>
                                상세보기 &gt;
                            </Link>
                        </div>

                        <div className={styles.orderItems}>
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
                                        <p className={styles.productName}>{item.product.name}</p>
                                        <p className={styles.itemMeta}>
                                            {item.price.toLocaleString()}원 / {item.quantity}개
                                        </p>
                                    </div>
                                    <div className={styles.itemStatus}>
                                        {order.status === 'PENDING' ? '결제완료' : order.status}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.orderFooter}>
                            <span className={styles.totalLabel}>총 결제금액</span>
                            <span className={styles.totalPrice}>
                                {order.total.toLocaleString()}원
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
