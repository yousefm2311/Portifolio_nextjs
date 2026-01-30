import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db';
import { AdminUser } from '@/models/AdminUser';
import { Media } from '@/models/Media';
import { App } from '@/models/App';

async function seed() {
  await connectToDatabase();

  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (email && password) {
    const normalizedEmail = email.toLowerCase();
    const exists = await AdminUser.findOne({ email: normalizedEmail });
    if (!exists) {
      const hash = await bcrypt.hash(password, 10);
      await AdminUser.create({ email: normalizedEmail, passwordHash: hash, name: 'Admin' });
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️ Admin user exists');
    }
  } else {
    console.log('ℹ️ ADMIN_SEED_EMAIL or ADMIN_SEED_PASSWORD not set');
  }

  const mediaCount = await Media.countDocuments();
  if (mediaCount === 0) {
    const demoMedia = await Media.insertMany([
      {
        type: 'image',
        provider: 'cloudinary',
        url: 'https://images.unsplash.com/photo-1487014679447-9f8336841d58',
        thumbnailUrl: 'https://images.unsplash.com/photo-1487014679447-9f8336841d58',
        size: 120000,
        alt: 'Cover'
      },
      {
        type: 'image',
        provider: 'cloudinary',
        url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
        thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
        size: 120000,
        alt: 'Screenshot'
      },
      {
        type: 'image',
        provider: 'cloudinary',
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
        thumbnailUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
        size: 120000,
        alt: 'Screenshot'
      }
    ]);

    await App.create({
      title: 'تطبيق الطلبات الذكية',
      titleEn: 'Smart Orders',
      slug: 'smart-orders',
      shortDesc: 'تجربة طلبات متعددة الأدوار مع تتبع لحظي.',
      description: '### أبرز النقاط\n- تجربة عميل وسائق وإدارة.\n- خرائط وتتبّع مباشر.\n- واجهة عربية كاملة.',
      category: 'Flutter',
      tags: ['delivery', 'maps', 'real-time'],
      roleVariants: [
        { key: 'customer', label: 'Customer' },
        { key: 'driver', label: 'Driver' },
        { key: 'admin', label: 'Admin' }
      ],
      techStack: ['Flutter', 'Node.js', 'MongoDB', 'Socket.io'],
      features: [
        { title: 'Tracking', details: 'تتبّع لحظي للطلبات على الخريطة.' },
        { title: 'Chat', details: 'مراسلات فورية بين الأطراف.' }
      ],
      kpis: [
        { label: 'Delivery time', value: '-32%' },
        { label: 'Retention', value: '+18%' }
      ],
      links: {
        liveDemoUrl: 'https://example.com',
        githubUrl: 'https://github.com/example',
        apkUrl: 'https://example.com/app.apk'
      },
      demo: {
        type: 'video',
        videoId: demoMedia[0]._id
      },
      media: {
        iconId: demoMedia[0]._id,
        coverId: demoMedia[0]._id,
        galleryIds: [demoMedia[1]._id, demoMedia[2]._id]
      },
      caseStudy: {
        problem: 'تنظيم العمليات المعقدة بين العميل والسائق والإدارة.',
        solution: 'بناء تجربة متعددة الأدوار مع لوحة تحكم مباشرة.',
        architecture: 'Flutter + Node.js + MongoDB مع Socket.io.',
        challenges: 'الحفاظ على التزامن اللحظي والتجربة العربية.',
        results: 'خفض زمن التسليم وتحسين رضا العملاء.'
      },
      status: 'published',
      publishedAt: new Date()
    });

    console.log('✅ Sample media and app created');
  } else {
    console.log('ℹ️ Media already exists, skipping sample data');
  }

  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
