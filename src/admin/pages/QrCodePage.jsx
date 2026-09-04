import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { useToast } from "../context/ToastContext";

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const QrCodePage = () => {
  const showToast = useToast();
  const canvasRef = useRef(null);
  const [svgMarkup, setSvgMarkup] = useState("");
  const menuUrl = `${window.location.origin}/`;

  useEffect(() => {
    QRCode.toCanvas(canvasRef.current, menuUrl, { width: 240, margin: 1 });
    QRCode.toString(menuUrl, { type: "svg", margin: 1 }).then(setSvgMarkup);
  }, [menuUrl]);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(menuUrl);
      showToast("Bağlantı kopyalandı.");
    } catch {
      showToast("Kopyalanamadı, elle kopyalayın.", "error");
    }
  };

  const downloadPng = () => {
    canvasRef.current.toBlob((blob) => downloadBlob(blob, "menu-qr.png"));
  };

  const downloadSvg = () => {
    downloadBlob(new Blob([svgMarkup], { type: "image/svg+xml" }), "menu-qr.svg");
  };

  return (
    <div className="flex max-w-sm flex-col items-center gap-4 rounded-xl border border-neutral-200 bg-white p-6 text-center">
      <canvas ref={canvasRef} className="rounded-lg" />
      <p className="break-all text-sm text-neutral-500">{menuUrl}</p>

      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={copyUrl}
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700"
        >
          Bağlantıyı Kopyala
        </button>
        <button
          type="button"
          onClick={downloadPng}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
        >
          PNG İndir
        </button>
        <button
          type="button"
          onClick={downloadSvg}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
        >
          SVG İndir
        </button>
      </div>

      <p className="text-xs text-neutral-400">
        Ürün veya kategori değişiklikleri bu QR kodu geçersiz kılmaz — kod her zaman aynı menü
        adresini gösterir.
      </p>
    </div>
  );
};

export default QrCodePage;
