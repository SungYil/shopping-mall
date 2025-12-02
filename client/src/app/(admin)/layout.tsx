import Link from "next/link";
import styles from "./layout.module.css";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Link href="/admin">ADMIN</Link>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navItem}>대시보드</Link>
          <Link href="/admin/products" className={styles.navItem}>상품 관리</Link>
          <Link href="/admin/orders" className={styles.navItem}>주문 관리</Link>
          <Link href="/admin/users" className={styles.navItem}>회원 관리</Link>
          <div className={styles.divider} />
          <Link href="/" className={styles.navItem}>쇼핑몰로 돌아가기</Link>
        </nav>
      </aside>
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
