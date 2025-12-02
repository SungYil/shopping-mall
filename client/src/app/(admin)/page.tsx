'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface DashboardStats {
    totalOrders: number;
    totalSales: number;
    totalUsers: number;
    totalProducts: number;
    recentOrders: any[];
}

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('관리자 로그인이 필요합니다.');
                router.push('/login');
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setStats(data);
            } else {
                if (res.status === 403) {
                    alert('관리자 권한이 없습니다.');
                    router.push('/');
                } else {
                    console.error('Failed to fetch dashboard');
                }
            }
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="container">Loading...</div>;
    if (!stats) return null;

    return (
        <div className={styles.adminContainer}>
            <h1 className={styles.title}>ADMIN DASHBOARD</h1>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h3>총 매출액</h3>
                    <p className={styles.statValue}>{stats.totalSales.toLocaleString()}원</p>
                </div>
                <div className={styles.statCard}>
                    <h3>총 주문수</h3>
                    <p className={styles.statValue}>{stats.totalOrders}건</p>
                </div>
                <div className={styles.statCard}>
                    <h3>총 회원수</h3>
                    <p className={styles.statValue}>{stats.totalUsers}명</p>
                </div>
                <div className={styles.statCard}>
                    <h3>등록 상품수</h3>
                    <p className={styles.statValue}>{stats.totalProducts}개</p>
                </div>
            </div>

            <div className={styles.section}>
                <h2>최근 주문 내역</h2>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>주문번호</th>
                            <th>주문자</th>
                            <th>금액</th>
                            <th>상태</th>
                            <th>일자</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.recentOrders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.user?.name || 'Unknown'}</td>
                                <td>{order.total.toLocaleString()}원</td>
                                <td>
                                    <span className={`${styles.badge} ${styles[order.status.toLowerCase()]}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
