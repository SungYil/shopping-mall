import Image from 'next/image';
import { notFound } from 'next/navigation';
import styles from './page.module.css';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    category: {
        name: string;
    };
}

async function getProduct(id: string): Promise<Product | null> {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`;
    console.log(`[ProductDetail] Fetching: ${apiUrl}`);

    try {
        const res = await fetch(apiUrl, {
            cache: 'no-store',
        });

        console.log(`[ProductDetail] Response status: ${res.status}`);

        if (!res.ok) {
            console.error(`[ProductDetail] Fetch failed with status: ${res.status}`);
            return null;
        }

        return res.json();
    } catch (error) {
        console.error('[ProductDetail] Error fetching product:', error);
        return null;
    }
}

export default async function ProductDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const product = await getProduct(params.id);

    if (!product) {
        notFound();
    }

    return (
        <div className="container">
            <div className={styles.wrapper}>
                {/* 이미지 섹션 */}
                <div className={styles.imageSection}>
                    <div className={styles.mainImage}>
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
                </div>

                {/* 정보 섹션 */}
                <div className={styles.infoSection}>
                    <div className={styles.header}>
                        <span className={styles.category}>{product.category.name}</span>
                        <h1 className={styles.name}>{product.name}</h1>
                        <p className={styles.price}>{product.price.toLocaleString()}원</p>
                    </div>

                    <div className={styles.description}>
                        <p>{product.description}</p>
                    </div>

                    <div className={styles.actions}>
                        <div className={styles.quantity}>
                            <span>수량</span>
                            <select className={styles.select}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>

                        <div className={styles.buttons}>
                            <button className={`${styles.button} ${styles.cartButton}`}>
                                장바구니 담기
                            </button>
                            <button className={`${styles.button} ${styles.buyButton}`}>
                                바로 구매하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
