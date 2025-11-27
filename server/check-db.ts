import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.product.count();
        console.log(`\n📊 총 상품 개수: ${count}개`);

        if (count > 0) {
            const products = await prisma.product.findMany({
                take: 5,
                include: { category: true },
            });
            console.log('\n--- 상품 데이터 미리보기 (최대 5개) ---');
            console.dir(products, { depth: null });
        } else {
            console.log('\n⚠️ 데이터가 없습니다. seed를 실행해야 합니다.');
        }
    } catch (error) {
        console.error('\n❌ DB 연결 실패:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
