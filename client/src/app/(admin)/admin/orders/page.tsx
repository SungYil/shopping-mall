'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface Order {
    id: number;
    total: number;
    status: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
    items: {
        id: number;
        quantity: number;
        product: {
            name: string;
        };
    }[];
}

const STATUS_OPTIONS = [
    { value: 'PENDING', label: '결제대기' },
    { value: 'PAID', label: '결제완료' },
    { value: 'SHIPPED', label: '배송중' },
    { value: 'DELIVERED', label: '배송완료' },
    { value: 'CANCELLED', label: '주문취소' },
];

export default function AdminOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('관리자 로그인이 필요합니다.');
                router.push('/login');
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/admin/all`, {
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

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                alert('주문 상태가 변경되었습니다.');
                fetchOrders(); // 목록 새로고침
            } else {
                alert('상태 변경에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('오류가 발생했습니다.');
        }
    };

    if (loading) return <div className={styles.container}>Loading...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>주문 관리</h1>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>주문번호</th>
                            <th>주문자</th>
                            <th>주문상품</th>
                            <th>총 결제금액</th>
                            <th>주문일시</th>
                            <th>상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>
                                    {order.user.name}<br />
                                    <span className={styles.email}>({order.user.email})</span>
                                </td>
                                <td>
                                    {order.items.map((item) => (
                                        <div key={item.id} className={styles.item}>
                                            {item.product.name} x {item.quantity}
                                        </div>
                                    ))}
                                </td>
                                <td>{order.total.toLocaleString()}원</td>
                                <td>{new Date(order.createdAt).toLocaleString()}</td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className={styles.statusSelect}
                                        data-status={order.status}
                                    >
                                        {STATUS_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {orders.length === 0 && (
                    <div className={styles.empty}>
                        주문 내역이 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}
