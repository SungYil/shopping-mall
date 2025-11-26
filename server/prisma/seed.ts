import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // 1. 기존 데이터 삭제 (초기화)
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    console.log('🧹 기존 데이터 삭제 완료');

    // 2. 카테고리 생성
    const categories = await Promise.all([
        prisma.category.create({ data: { name: 'TOP' } }),
        prisma.category.create({ data: { name: 'BOTTOM' } }),
        prisma.category.create({ data: { name: 'OUTER' } }),
        prisma.category.create({ data: { name: 'DRESS' } }),
    ]);

    console.log('📂 카테고리 생성 완료:', categories.map((c) => c.name));

    // 3. 상품 데이터 생성
    const products = [
        {
            name: '러블리 플라워 원피스',
            description: '봄날의 화사함을 담은 플라워 패턴 원피스입니다.',
            price: 45000,
            stock: 100,
            categoryId: categories[3].id, // DRESS
            images: ['https://via.placeholder.com/400x500?text=Flower+Dress'],
        },
        {
            name: '데일리 베이직 티셔츠',
            description: '매일 입기 좋은 기본 무지 티셔츠입니다.',
            price: 15000,
            stock: 200,
            categoryId: categories[0].id, // TOP
            images: ['https://via.placeholder.com/400x500?text=Basic+T-Shirt'],
        },
        {
            name: '슬림핏 데님 팬츠',
            description: '다리가 길어보이는 슬림핏 청바지입니다.',
            price: 39000,
            stock: 50,
            categoryId: categories[1].id, // BOTTOM
            images: ['https://via.placeholder.com/400x500?text=Denim+Pants'],
        },
        {
            name: '클래식 트렌치 코트',
            description: '가을 필수 아이템, 클래식한 디자인의 트렌치 코트입니다.',
            price: 89000,
            stock: 30,
            categoryId: categories[2].id, // OUTER
            images: ['https://via.placeholder.com/400x500?text=Trench+Coat'],
        },
        {
            name: '오버핏 후드 집업',
            description: '편안하게 걸치기 좋은 오버핏 후드 집업입니다.',
            price: 32000,
            stock: 80,
            categoryId: categories[2].id, // OUTER
            images: ['https://via.placeholder.com/400x500?text=Hoodie'],
        },
        {
            name: '샤랄라 쉬폰 블라우스',
            description: '여리여리한 분위기를 연출해주는 쉬폰 블라우스입니다.',
            price: 28000,
            stock: 60,
            categoryId: categories[0].id, // TOP
            images: ['https://via.placeholder.com/400x500?text=Chiffon+Blouse'],
        },
    ];

    for (const product of products) {
        await prisma.product.create({ data: product });
    }

    console.log(`✨ 상품 ${products.length}개 생성 완료`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
