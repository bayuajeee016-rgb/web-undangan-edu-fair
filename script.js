document.addEventListener("DOMContentLoaded", function() {
    const tabelTamuBody = document.querySelector("#tabelTamu tbody");
    if (!tabelTamuBody) return;

    // Menambahkan parameter waktu (?v=...) agar browser selalu mengambil data-tamu.csv versi terbaru (anti-cache)
    const csvUrl = `data-tamu.csv?v=${new Date().getTime()}`;

    Papa.parse(csvUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            const dataTamu = results.data;
            tabelTamuBody.innerHTML = "";

            dataTamu.forEach(tamu => {
                if (!tamu.id || !tamu.nama_tamu) return;

                const nama = tamu.nama_tamu.trim();
                const instansi = tamu.instansi.trim();
                const kategori = tamu.kategori.trim();
                const noWa = tamu.no_whatsapp.trim();

                // Membuat link personalisasi dinamis ke index.html
                const baseUrl = window.location.origin + window.location.pathname.replace("admin.html", "index.html");
                const linkUndangan = `${baseUrl}?to=${encodeURIComponent(nama)}&instansi=${encodeURIComponent(instansi)}&kategori=${encodeURIComponent(kategori)}`;
                
                // Format pesan WhatsApp otomatis
                const pesan = `Halo Yth. *${nama}* (${instansi}),\n\nKami mengundang Bapak/Ibu untuk hadir dalam acara *Edu Fair & Career Day 2026*.\n\nSilakan buka undangan digital eksklusif Anda melalui tautan berikut:\n${linkUndangan}\n\nMerupakan suatu kehormatan bagi kami apabila Bapak/Ibu dapat berkenan hadir. Terima kasih.`;
                
                const whatsappUrl = `https://wa.me/${noWa}?text=${encodeURIComponent(pesan)}`;

                const row = `
                    <tr>
                        <td>${tamu.id}</td>
                        <td><strong>${nama}</strong></td>
                        <td>${instansi}</td>
                        <td><span class="badge-kat">${kategori}</span></td>
                        <td>
                            <a href="${linkUndangan}" target="_blank" class="btn-preview" title="Lihat tampilan undangan">
                                <i class="fas fa-eye"></i> Cek Web
                            </a>
                            <a href="${whatsappUrl}" target="_blank" class="btn-wa">
                                <i class="fab fa-whatsapp"></i> Kirim WA
                            </a>
                        </td>
                    </tr>
                `;
                tabelTamuBody.innerHTML += row;
            });
        },
        error: function(err) {
            tabelTamuBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #ef4444; padding: 20px;">
                <b>Gagal memuat data-tamu.csv!</b><br>Pastikan kamu membuka halaman ini menggunakan <b>Live Server</b> di VS Code atau sudah di-hosting online.
            </td></tr>`;
            console.error(err);
        }
    });
});