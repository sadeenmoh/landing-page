import { Product } from '../types';
import { PRODUCTS } from '../data/products';

export function getOrders() {
  try { return JSON.parse(localStorage.getItem('orders') || '[]') } 
  catch { return [] }
}

const OWNER_PHONE = "962796555952" // 0796555952 - رقم صاحب المتجر
const PRODUCTS_STOCK_KEY = 'miss2m_products_stock';

// ================== دوال المخزون الجديدة ==================

// جلب المنتجات مع المخزون المحفوظ
function getProductsWithStock(): Product[] {
  try {
    const saved = localStorage.getItem(PRODUCTS_STOCK_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {}
  // أول مرة - كل المنتجات 35
  return PRODUCTS.map(p => ({
    ...p,
    stock: (p as any).stock ?? 35,
    inStock: ((p as any).stock ?? 35) > 0
  }));
}

// حفظ المخزون
function saveProductsStock(products: Product[]) {
  localStorage.setItem(PRODUCTS_STOCK_KEY, JSON.stringify(products));
}

// خصم الكمية عند الطلب - هاي أهم function
export function decreaseStockAfterOrder(items: any[]) {
  const products = getProductsWithStock();
  
  items.forEach((orderItem: any) => {
    const product = products.find(p => p.id === orderItem.productId);
    if (product) {
      const currentStock = product.stock ?? 35;
      product.stock = Math.max(0, currentStock - (orderItem.quantity || 1));
      product.inStock = product.stock > 0;
    }
  });
  
  saveProductsStock(products);
  return products;
}

// إرجاع الكمية عند حذف الطلب (لو لغيتي طلب)
export function restoreStockAfterDelete(items: any[]) {
  const products = getProductsWithStock();
  
  items.forEach((orderItem: any) => {
    const product = products.find(p => p.id === orderItem.productId);
    if (product) {
      product.stock = (product.stock ?? 0) + (orderItem.quantity || 1);
      product.inStock = product.stock > 0;
    }
  });
  
  saveProductsStock(products);
  return products;
}

// تحديث كمية منتج من لوحة الإدارة
export function updateProductStock(productId: string, newStock: number) {
  const products = getProductsWithStock();
  const product = products.find(p => p.id === productId);
  if (product) {
    product.stock = newStock;
    product.inStock = newStock > 0;
    saveProductsStock(products);
  }
  return products;
}

// جلب منتج واحد مع كميته الحالية
export function getProductStock(productId: string): number {
  const products = getProductsWithStock();
  const product = products.find(p => p.id === productId);
  return product?.stock ?? 35;
}

// ================== دوال الطلبات القديمة + التعديل ==================

function sendOrderToWhatsAppFree(order: any) {
  const city = order.governorateNameAr || order.governorateNameEn || order.governorate || order.city || 'غير محدد'
  const address = order.areaAndStreet || order.address || 'غير محدد'
  const name = order.customerName || order.name || 'زبون'
  const phone = order.phone || order.customerPhone || 'غير محدد'

  const itemsText = order.items?.map((i: any) => {
    const productName = i.productNameAr || i.productNameEn || i.name || 'منتج'
    const shade = i.shadeNameAr ? ` (${i.shadeNameAr})` : (i.shadeNameEn ? ` (${i.shadeNameEn})` : '')
    const qty = i.quantity || 1
    const price = i.price || 0
    return `• ${productName}${shade} × ${qty} - ${price} JD`
  }).join('\n') || 'لا يوجد'

  const msg = `🔥 طلب جديد - Miss2M 🔥

👤 الاسم: ${name}
📞 رقم الزبون: ${phone}
🏙 المدينة: ${city}
📍 العنوان: ${address}
${order.notes ? `📝 ملاحظات: ${order.notes}\n` : ''}
🛍 الطلب:
${itemsText}

💰 المجموع: ${order.total} JD
🆔 رقم الطلب: ${order.id}
⏰ ${new Date().toLocaleString('ar-JO')}`

  const url = `https://wa.me/${OWNER_PHONE}?text=${encodeURIComponent(msg)}`
  window.open(url, '_blank')
}

export function addOrder(newOrder: any) {
  const orders = getOrders()
  const finalOrder = { 
    ...newOrder, 
    id: newOrder.id || `ORD-${Date.now()}`,
    createdAt: new Date().toISOString()
  }

  // 1. أهم خطوة: اخصمي الكمية قبل حفظ الطلب
  decreaseStockAfterOrder(finalOrder.items);

  const updated = [finalOrder, ...orders]
  localStorage.setItem('orders', JSON.stringify(updated))
  
  sendOrderToWhatsAppFree(finalOrder)
  
  return updated
}

export function deleteOrder(orderId: string) {
  const orders = getOrders();
  const orderToDelete = orders.find((o:any) => o.id === orderId);
  
  // 2. رجعي الكمية اذا حذفتي الطلب (اختياري - اذا بدك ترجع)
  if (orderToDelete) {
    restoreStockAfterDelete(orderToDelete.items);
  }

  const filtered = orders.filter((o:any) => o.id !== orderId)
  localStorage.setItem('orders', JSON.stringify(filtered))
  return filtered
}

export function updateOrderStatus(orderId: string, status: 'pending' | 'delivered') {
  const orders = getOrders().map((o:any) => o.id === orderId ? {...o, status} : o)
  localStorage.setItem('orders', JSON.stringify(orders))
  return orders
}