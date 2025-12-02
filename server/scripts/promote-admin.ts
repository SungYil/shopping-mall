import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // 커맨드 라인 인자에서 이메일을 가져옵니다. (예: node script.js test@test.com)
    const email = process.argv[2];

    if (!email) {
        console.error('사용법: npx ts-node scripts/promote-admin.ts <이메일>');
        process.exit(1);
    }

    try {
        // 해당 이메일을 가진 유저를 찾아 역할을 'ADMIN'으로 업데이트합니다.
        const user = await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' },
        });
        console.log(`✅ ${user.name}(${user.email}) 님이 관리자로 승격되었습니다.`);
    } catch (error) {
        console.error('❌ 사용자를 찾을 수 없거나 오류가 발생했습니다.');
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
