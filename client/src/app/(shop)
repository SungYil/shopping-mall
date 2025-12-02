import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

// 상품 데이터 타입 정의
interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  category: {
    name: string;
  };
}

interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    last_page: number;
  };
}

// 데이터 가져오기 (Server Side Fetching)
async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=4`, {
      cache: 'no-store', // 최신 데이터 유지를 위해 캐시 방지 (또는 revalidate 옵션 사용)
    });

    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }

    const json: ProductsResponse = await res.json();
    return json.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className={styles.container}>
      {/* 메인 배너 섹션 */}
      <section className={styles.banner}>
        <div className={styles.bannerContent}>
          <h2>2025 S/S COLLECTION</h2>
          <p>새로운 시즌, 새로운 스타일을 만나보세요.</p>
          <button className={styles.bannerButton}>VIEW MORE</button>
        </div>
      </section>

      {/* 베스트 아이템 섹션 */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>BEST ITEMS</h3>
        <p className={styles.sectionSubtitle}>이번 주 가장 사랑받는 아이템</p>

        <div className={styles.grid}>
          {products.length > 0 ? (
            products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className={styles.cardLink}>
                <div className={styles.card}>
                  <div className={styles.imageWrapper}>
                    {/* 이미지가 있으면 첫 번째 이미지 표시, 없으면 회색 박스 */}
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className={styles.productImage}
                      />
                    ) : (
                      <div className={styles.placeholderImage} />
                    )}
                  </div>
                  <div className={styles.cardInfo}>
                    <h4 className={styles.productName}>{product.name}</h4>
                    <p className={styles.price}>{product.price.toLocaleString()}원</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className={styles.noData}>등록된 상품이 없습니다.</p>
          )}
        </div>
      </section>
    </div>
  );
}
