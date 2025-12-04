'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface Category {
    id: number;
    name: string;
}

export default function NewProductPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
        images: '',
        isAttrangsDelivery: false,
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요합니다.');
                router.push('/login');
                return;
            }

            // 이미지 URL을 배열로 변환 (쉼표로 구분)
            const imageArray = formData.images
                .split(',')
                .map((url) => url.trim())
                .filter((url) => url.length > 0);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    price: Number(formData.price),
                    stock: Number(formData.stock),
                    categoryId: Number(formData.categoryId),
                    images: imageArray,
                    isAttrangsDelivery: formData.isAttrangsDelivery,
                }),
            });

            if (res.ok) {
                alert('상품이 등록되었습니다.');
                router.push('/admin/products');
            } else {
                alert('상품 등록에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error creating product:', error);
            alert('오류가 발생했습니다.');
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>새 상품 등록</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label>상품명 *</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div className={styles.field}>
                    <label>설명</label>
                    <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label>가격 *</label>
                        <input
                            type="number"
                            required
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>

                    <div className={styles.field}>
                        <label>재고 *</label>
                        <input
                            type="number"
                            required
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        />
                    </div>
                </div>

                <div className={styles.field}>
                    <label>카테고리 *</label>
                    <select
                        required
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    >
                        <option value="">선택하세요</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.field}>
                    <label>이미지 URL (쉼표로 구분)</label>
                    <input
                        type="text"
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                        value={formData.images}
                        onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    />
                </div>

                <div className={styles.checkboxField}>
                    <label>
                        <input
                            type="checkbox"
                            checked={formData.isAttrangsDelivery}
                            onChange={(e) => setFormData({ ...formData, isAttrangsDelivery: e.target.checked })}
                        />
                        🚀 아뜨배송 (오늘 출발)
                    </label>
                </div>

                <div className={styles.actions}>
                    <button type="button" onClick={() => router.push('/admin/products')} className={styles.cancelButton}>
                        취소
                    </button>
                    <button type="submit" className={styles.submitButton}>
                        등록
                    </button>
                </div>
            </form>
        </div>
    );
}
