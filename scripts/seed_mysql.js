const { db } = require('../src/config/database');

const seedData = () => {
    console.log('Seeding data...');

    // 1. Cabang (Branches)
    const branches = [
        {
            name: 'Kantor Pusat Makassar',
            address: 'Jl. Jend. Sudirman No. 5, Makassar, Sulawesi Selatan',
            phone: '(0411) 873-555',
            email: 'pusat@bbi.co.id',
            map_embed: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.805844853032!2d119.4109!3d-5.1356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMDgnMDguMiJTIDExOcKwMjQnMzkuMiJF!5e0!3m2!1sen!2sid!4v1635748291000!5m2!1sen!2sid" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
        },
        {
            name: 'Kantor Cabang Balikpapan',
            address: 'Jl. Jend. Sudirman No. 23, Klandasan Ulu, Balikpapan Kota',
            phone: '(0542) 732-123',
            email: 'balikpapan@bbi.co.id',
            map_embed: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127669.75549006456!2d116.76442655380186!3d-1.246479782481335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2df14736f120155b%3A0x4a22c54ba29c54e0!2sBalikpapan%2C%20Balikpapan%20City%2C%20East%20Kalimantan!5e0!3m2!1sen!2sid!4v1709292839281!5m2!1sen!2sid" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
        },
        {
            name: 'Kantor Cabang Banjarmasin',
            address: 'Jl. Barito Hilir No. 8, Banjarmasin, Kalimantan Selatan',
            phone: '(0511) 441-890',
            email: 'banjarmasin@bbi.co.id',
            map_embed: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.187311746244!2d114.567!3d-3.3186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMTknMDcuMCJTIDExNMKwMzQnMDEuMiJF!5e0!3m2!1sen!2sid!4v1635748291000!5m2!1sen!2sid" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
        },
        {
            name: 'Kantor Perwakilan Jakarta',
            address: 'Menara Bosowa Lt. 15, Jl. Jend. Gatot Subroto Kav. 53, Jakarta Selatan',
            phone: '(021) 529-001',
            email: 'jakarta@bbi.co.id',
            map_embed: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.277498765432!2d106.818!3d-6.2271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTMnMzcuNiJTIDEwNsKwNDknMDQuOCJF!5e0!3m2!1sen!2sid!4v1635748291000!5m2!1sen!2sid" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
        }
    ];

    branches.forEach(b => {
        db.run('INSERT INTO cabang (name, address, phone, email, map_embed) VALUES (?, ?, ?, ?, ?)',
            [b.name, b.address, b.phone, b.email, b.map_embed],
            (err) => {
                if (err) console.error(`Error inserting branch ${b.name}:`, err);
                else console.log(`Inserted branch: ${b.name}`);
            }
        );
    });

    // 2. Berita (News)
    const news = [
        {
            title: 'BBI Perkuat Armada Kapal untuk 2024',
            slug: 'bbi-perkuat-armada-kapal-2024',
            summary: 'Bosowa Bandar Indonesia (BBI) menambah armada kapal tunda baru untuk meningkatkan kapasitas layanan di pelabuhan utama.',
            content: '<p><strong>Makassar</strong> - PT Bosowa Bandar Indonesia (BBI) terus berkomitmen mengembangkan layanan kepelabuhanan dengan mendatangkan dua unit kapal tunda (tug boat) baru. Penambahan armada ini bertujuan untuk mendukung efisiensi operasional bongkar muat dan pelayanan sandar kapal di wilayah operasional Indonesia Timur.</p><p>Direktur Utama BBI menyatakan, "Investasi ini adalah langkah strategis kami untuk menyongsong pertumbuhan ekonomi yang positif di tahun 2024."</p>',
            published: 1,
            image: '/uploads/berita/sample1.jpg'
        },
        {
            title: 'Kunjungan Kerja Direksi ke Cabang Balikpapan',
            slug: 'kunjungan-kerja-direksi-balikpapan',
            summary: 'Jajaran direksi melakukan peninjauan langsung fasilitas operasional di cabang Balikpapan.',
            content: '<p>Dalam rangka memastikan standar K3 (Kesehatan dan Keselamatan Kerja) serta operasional yang prima, jajaran direksi Bosowa Bandar Indonesia melakukan kunjungan kerja ke kantor cabang Balikpapan pada pekan lalu.</p><ul><li>Peninjauan alat berat</li><li>Meeting koordinasi dengan staf lokal</li><li>Evaluasi kinerja kuartal I</li></ul>',
            published: 1,
            image: '/uploads/berita/sample2.jpg'
        },
        {
            title: 'BBI Raih Penghargaan Zero Accident 2023',
            slug: 'bbi-raih-penghargaan-zero-accident',
            summary: 'Prestasi membanggakan kembali diraih BBI dengan mempertahankan rekor tanpa kecelakaan kerja selama tahun berjalan.',
            content: '<p>Keselamatan adalah prioritas utama kami. Penghargaan Zero Accident dari Kementerian Ketenagakerjaan ini menjadi bukti nyata komitmen seluruh insan BBI dalam menerapkan prosedur kerja aman.</p>',
            published: 1,
            image: '/uploads/berita/sample3.jpg'
        },
        {
            title: 'Draft: Rencana Ekspansi ke Indonesia Barat',
            slug: 'rencana-ekspansi-indonesia-barat',
            summary: 'BBI sedang mengkaji potensi pembukaan cabang baru di wilayah Sumatera.',
            content: '<p>Ini adalah konten draft yang belum dipublikasikan. Hanya admin yang bisa melihat ini.</p>',
            published: 0,
            image: null // No image
        }
    ];

    news.forEach(n => {
        db.run('INSERT INTO berita (title, slug, summary, content, published, image) VALUES (?, ?, ?, ?, ?, ?)',
            [n.title, n.slug, n.summary, n.content, n.published, n.image],
            function(err) {
                if (err) {
                    console.error(`Error inserting news ${n.title}:`, err.message);
                } else {
                    console.log(`Inserted news: ${n.title}`);
                    const newNewsId = this.lastID;

                    // 3. Comments (Linked to News) - Only if news insert succeeded
                    // Add comments to the first news item (ID likely 1 or newNewsId)
                    if (n.slug === 'bbi-perkuat-armada-kapal-2024') {
                         insertComments(newNewsId || 1); 
                    }
                }
            }
        );
    });
    
    // Helper to insert comments
    function insertComments(beritaId) {
        const comments = [
            { name: 'Budi Santoso', email: 'budi@gmail.com', content: 'Luar biasa kemajuannya BBI!', approved: 1 },
            { name: 'Siti Aminah', email: 'siti@yahoo.com', content: 'Semoga makin sukses dan jaya.', approved: 1 },
            { name: 'Spammer', email: 'spam@bot.com', content: 'Klik link ini untuk menang.', approved: 0 }
        ];
        
        comments.forEach(c => {
            db.run('INSERT INTO comments (berita_id, name, email, content, approved) VALUES (?, ?, ?, ?, ?)',
                [beritaId, c.name, c.email, c.content, c.approved],
                (err) => {
                    if(!err) console.log(`Inserted comment from ${c.name}`);
                }
            );
        });
    }

    // Wait a bit then exit (simple timeout as db.run is async but pool keeps process alive)
    setTimeout(() => {
        console.log('Seeding completed. Press Ctrl+C if not exits.');
        process.exit(0);
    }, 3000);
};

seedData();
