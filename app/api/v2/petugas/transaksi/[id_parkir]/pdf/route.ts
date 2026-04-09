import puppeteer from "puppeteer";
import { supabase } from "@/app/lib/supabase";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id_parkir: string }> },
) {
  try {
    const { id_parkir } = await params;

    // ambil detail transaksi menggunakan Supabase
    const { data: trx, error } = await supabase
      .from("tb_transaksi")
      .select("*")
      .eq("id_parkir", id_parkir)
      .maybeSingle();

    if (error || !trx) {
      console.error("PDF Fetch Error:", error);
      return new Response("Data transaksi tidak ditemukan", { status: 404 });
    }

    const formatRupiah = (angka: number) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(angka);
    };

    const html = `
      <html>
        <head>
          <style>
            body { font-family: sans-serif; padding: 40px; }
            .receipt-container { 
              max-width: 600px; 
              margin: auto; 
              border: 1px solid #ddd; 
              padding: 20px; 
              border-radius: 8px; 
            }
            h1 { text-align: center; margin-bottom: 20px; font-size: 24px; }
            .info-group { display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px dashed #ccc; padding-bottom: 8px; }
            .label { font-weight: bold; color: #555; }
            .value { color: #000; }
            .total { 
              font-size: 20px; 
              font-weight: bold; 
              color: #d9534f; 
              text-align: right; 
              margin-top: 20px; 
              padding-top: 10px;
              border-top: 2px dashed #000;
            }
            .footer { text-align: center; font-size: 14px; margin-top: 40px; color: #888; }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <h1>Struk Pembayaran Parkir</h1>
            <div class="info-group">
              <span class="label">ID Parkir:</span>
              <span class="value">${trx.id_parkir}</span>
            </div>
            <div class="info-group">
              <span class="label">ID Kendaraan:</span>
              <span class="value">${trx.id_kendaraan}</span>
            </div>
            <div class="info-group">
              <span class="label">Waktu Masuk:</span>
              <span class="value">${new Date(trx.waktu_masuk).toLocaleString("id-ID")}</span>
            </div>
            <div class="info-group">
              <span class="label">Waktu Keluar:</span>
              <span class="value">${trx.waktu_keluar ? new Date(trx.waktu_keluar).toLocaleString("id-ID") : "-"}</span>
            </div>
            <div class="info-group">
              <span class="label">Durasi:</span>
              <span class="value">${trx.durasi_jam ? trx.durasi_jam + " Jam" : "-"}</span>
            </div>
            <div class="info-group">
              <span class="label">Status:</span>
              <span class="value">${trx.status}</span>
            </div>
            <div class="info-group">
              <span class="label">Petugas (ID):</span>
              <span class="value">${trx.id_user}</span>
            </div>
            <div class="info-group" style="border-bottom: none;">
              <span class="label">Area (ID):</span>
              <span class="value">${trx.id_area || "-"}</span>
            </div>

            <div class="total">
              Total Biaya: ${trx.biaya_total ? formatRupiah(trx.biaya_total) : "-"}
            </div>

            <div class="footer">
              Terima kasih telah menggunakan layanan parkir kami.
            </div>
          </div>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html);

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    return new Response(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=transaksi-${id_parkir}.pdf`,
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
