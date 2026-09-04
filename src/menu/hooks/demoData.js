// Static placeholder payload for design-preview builds (VITE_DEMO_MODE=true)
// only — shaped exactly like GET /api/public/menu. Never used in production;
// see useMenuData.js. No real restaurant data or third-party assets.

export const DEMO_MENU_DATA = {
  settings: {
    restaurantName: "Örnek Restoran",
    menuTitle: "Menü",
    menuDescription: "Bu bir tasarım önizlemesidir — gerçek veriler gerçek bir sunucudan gelir.",
    logo: null,
    currency: "TRY",
    phone: "05001234567",
    address: "Örnek Mahallesi, Örnek Sokak No:1",
    email: "info@example.com",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    tiktok: "https://tiktok.com",
    whatsapp: "905001234567",
    openingHours: "09:00 - 23:00",
  },
  categories: [
    { id: 1, name: "Kahvaltılar", slug: "kahvaltilar", description: null, image: null, productCount: 2 },
    { id: 2, name: "Ana Yemekler", slug: "ana-yemekler", description: null, image: null, productCount: 2 },
    { id: 3, name: "Tatlılar", slug: "tatlilar", description: null, image: null, productCount: 1 },
    { id: 4, name: "İçecekler", slug: "icecekler", description: null, image: null, productCount: 2 },
  ],
  products: [
    { id: 1, categoryId: 1, name: "Serpme Kahvaltı", description: "İki kişilik örnek ürün açıklaması.", price: "450.00", image: null, available: true, featured: true },
    { id: 2, categoryId: 1, name: "Menemen", description: "Örnek ürün açıklaması.", price: "120.00", image: null, available: true, featured: false },
    { id: 3, categoryId: 2, name: "Örnek Ana Yemek", description: "Örnek ürün açıklaması.", price: "220.00", image: null, available: true, featured: false },
    { id: 4, categoryId: 2, name: "Örnek Izgara", description: "Örnek ürün açıklaması.", price: "260.00", image: null, available: false, featured: false },
    { id: 5, categoryId: 3, name: "Örnek Tatlı", description: "Örnek ürün açıklaması.", price: "110.00", image: null, available: true, featured: true },
    { id: 6, categoryId: 4, name: "Taze Sıkma Meyve Suyu", description: "Örnek ürün açıklaması.", price: "80.00", image: null, available: true, featured: false },
    { id: 7, categoryId: 4, name: "Türk Kahvesi", description: "Örnek ürün açıklaması.", price: "65.00", image: null, available: true, featured: false },
  ],
};
