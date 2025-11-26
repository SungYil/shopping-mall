'use client';

import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
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
          {/* 상품 카드 더미 데이터 */}
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className={styles.card}>
              <div className={styles.imageWrapper}>
                <div className={styles.placeholderImage} />
              </div>
              <div className={styles.cardInfo}>
                <h4 className={styles.productName}>러블리 플라워 원피스</h4>
                <p className={styles.price}>45,000원</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
