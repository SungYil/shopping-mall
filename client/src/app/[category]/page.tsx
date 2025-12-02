'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './page.module.css';

interface Product {
    id: number;
    name: string;
    price: number;
    images: string[];
    category: {
        id: number;
        name: string;
    };
}

// URL 경로와 카테고리 ID 매핑 (seed.ts 기준)
// TOP(1), BOTTOM(2), OUTER(3), DRESS(4)
const CATEGORY_MAP: Record<string, number> = {
    'top': 1,
    'bottom': 2,
    'outer': 3,
    'dress': 4,
};

const CATEGORY_NAMES: Record<string, string> = {
    'top': 'TOP',
    'bottom': 'BOTTOM',
    'outer': 'OUTER',
    'dress': 'DRESS',
    'new': 'NEW ARRIVALS',
    'best': 'BEST ITEMS',
};

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = use(params);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // 유효하지 않은 카테고리 경로인 경우 404 처리
    if (!CATEGORY_NAMES[category]) {
        notFound();
    }

    useEffect(() => {
        fetchProducts();
    }, [category]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/products`;

            // 카테고리 ID가 있는 경우 쿼리 파라미터 추가
            if (CATEGORY_MAP[category]) {
                url += `?categoryId=${CATEGORY_MAP[category]}`;
            }
            // NEW, BEST는 현재 별도 필터링 로직이 없으므로 전체 목록에서 최신순(기본)으로 가져옴
            // 추후 백엔드에 정렬 옵션이 추가되면 ?sort=best 등으로 처리 가능

            const res = await fetch(url);
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

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <h1 className={styles.title}>{CATEGORY_NAMES[category]}</h1>

            {products.length === 0 ? (
                <div className={styles.empty}>
                    <p>등록된 상품이 없습니다.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {products.map((product) => (
                        <Link href={`/products/${product.id}`} key={product.id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className={styles.image}
                                    />
                                ) : (
                                    <div className={styles.placeholder} />
                                )}
                            </div>
                            <div className={styles.info}>
                                <h3 className={styles.name}>{product.name}</h3>
                                <p className={styles.price}>{product.price.toLocaleString()}원</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
