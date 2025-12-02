'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    category: {
        id: number;
        name: string;
    };
}

export default function AdminProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('관리자 로그인이 필요합니다.');
                router.push('/login');
                return;
            }

            // 전체 상품 조회 (페이징 제거, limit을 크게 설정)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=1000`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const { data } = await res.json();
                setProducts(data);
            } else {
                console.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('정말로 이 상품을 삭제하시겠습니까?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.ok) {
                alert('상품이 삭제되었습니다.');
                fetchProducts(); // 목록 새로고침
            } else {
                alert('상품 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('오류가 발생했습니다.');
        }
    };

    if (loading) return <div className={styles.container}>Loading...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>상품 관리</h1>
                <button
                    className={styles.addButton}
                    onClick={() => router.push('/admin/products/new')}
                >
                    + 새 상품 등록
                </button>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>상품명</th>
                            <th>카테고리</th>
                            <th>가격</th>
                            <th>재고</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.category.name}</td>
                                <td>{product.price.toLocaleString()}원</td>
                                <td>{product.stock}</td>
                                <td>
                                    <button
                                        className={styles.editButton}
                                        onClick={() => router.push(`/admin/products/${product.id}`)}
                                    >
                                        수정
                                    </button>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {products.length === 0 && (
                    <div className={styles.empty}>
                        등록된 상품이 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}
