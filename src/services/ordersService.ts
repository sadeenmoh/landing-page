export function getOrders() {
  try { return JSON.parse(localStorage.getItem('orders') || '[]') } 
  catch { return [] }
}

async function sendOrderNotification(order: any) {
  try {
    // حطيت رقمك مباشرة هون عشان نضمن يشتغل
    const INSTANCE = "instance192920"
    const TOKEN = "7tqot6d229pa107z"
    const TO = "962791539746"  // هاد رقمك انتي اللي بدك توصلك الرسائل

    const itemsText = order.items?.map((i:any)=> `${i.name} x${i.quantity}`).join(', ') || ''
    const msg = `🔥 طلب جديد - Miss2M 🔥\n\n👤 الاسم: ${order.customerName || order.name}\n📞 تلفون الزبون: ${order.customerPhone || order.phone}\n📍 العنوان: ${order.address || order.city}\n🛍️ المنتجات: ${itemsText}\n💰 المجموع: ${order.total} JD\n🆔 الطلب: ${order.id}`

    console.log("عم ببعت واتساب لـ:", TO)

    const res = await fetch(`https://api.ultramsg.com/${INSTANCE}/messages/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: TOKEN, to: TO, body: msg })
    })
    
    const data = await res.json()
    console.log("رد UltraMsg:", data)
    alert("رد UltraMsg: " + JSON.stringify(data))

  } catch(e) { 
    console.error("خطأ واتساب", e)
    alert("خطأ: " + e)
  }
}

export function addOrder(newOrder: any) {
  const orders = getOrders()
  const updated = [...orders, newOrder]
  localStorage.setItem('orders', JSON.stringify(updated))
  sendOrderNotification(newOrder)
  return updated
}

export function deleteOrder(orderId: string) {
  const orders = getOrders().filter((o:any) => o.id !== orderId)
  localStorage.setItem('orders', JSON.stringify(orders))
  return orders
}

export function updateOrderStatus(orderId: string, status: 'pending' | 'delivered') {
  const orders = getOrders().map((o:any) => o.id === orderId ? {...o, status} : o)
  localStorage.setItem('orders', JSON.stringify(orders))
  return orders
}