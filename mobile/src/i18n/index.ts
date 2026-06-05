const ar = {
  home: 'الرئيسية', products: 'المنتجات', cart: 'السلة', account: 'حسابي',
  search: 'بحث', login: 'تسجيل الدخول', register: 'إنشاء حساب',
  addToCart: 'أضف إلى السلة', buyNow: 'اشترِ الآن', wishlist: 'المفضلة',
  loading: 'جاري التحميل...', error: 'حدث خطأ', noResults: 'لا توجد نتائج',
  categories: 'التصنيفات', men: 'رجال', women: 'نساء', kids: 'أطفال',
  newArrivals: 'وصل حديثاً', bestSelling: 'الأكثر مبيعاً', featured: 'مميز',
  cartEmpty: 'سلة التسوق فارغة', checkout: 'إتمام الشراء', total: 'الإجمالي',
  myOrders: 'طلباتي', settings: 'الإعدادات', logout: 'تسجيل الخروج',
  heroTitle: 'اكتشف أحدث صيحات الموضة', shopNow: 'تسوق الآن',
  email: 'البريد الإلكتروني', password: 'كلمة المرور', name: 'الاسم',
};

const en = {
  home: 'Home', products: 'Products', cart: 'Cart', account: 'Account',
  search: 'Search', login: 'Login', register: 'Register',
  addToCart: 'Add to Cart', buyNow: 'Buy Now', wishlist: 'Wishlist',
  loading: 'Loading...', error: 'An error occurred', noResults: 'No results',
  categories: 'Categories', men: 'Men', women: 'Women', kids: 'Kids',
  newArrivals: 'New Arrivals', bestSelling: 'Best Selling', featured: 'Featured',
  cartEmpty: 'Your cart is empty', checkout: 'Checkout', total: 'Total',
  myOrders: 'My Orders', settings: 'Settings', logout: 'Logout',
  heroTitle: 'Discover the Latest Fashion', shopNow: 'Shop Now',
  email: 'Email', password: 'Password', name: 'Name',
};

export type TranslationKey = keyof typeof ar;

let currentLocale: 'ar' | 'en' = 'ar';

export const setLocale = (locale: 'ar' | 'en') => { currentLocale = locale; };
export const getLocale = () => currentLocale;
export const isRTL = () => currentLocale === 'ar';
export const t = (key: TranslationKey): string => {
  return currentLocale === 'ar' ? ar[key] : en[key];
};

export default { ar, en };
