import { Product, Language } from '../types';

export interface AIAdviceResult {
  replyText: string;
  suggestedProductIds: string[];
  quickReplies: string[];
}

export function generateBeautyAdvice(
  userQuery: string,
  language: Language,
  products: Product[]
): AIAdviceResult {
  const query = userQuery.toLowerCase().trim();
  const isAr = language === 'ar';

  // Helper matching
  const has = (keywords: string[]) => keywords.some((k) => query.includes(k.toLowerCase()));

  // 1. Foundation shade matching
  if (has(['فاونديشن', 'كريم اساس', 'درجة', 'foundation', 'shade', 'لون بشرتي', 'تغطية', 'skin tone', 'undertone'])) {
    if (has(['حنطية', 'قمحية', 'دافئة', 'warm', 'medium', 'wheat', 'عسلية'])) {
      return {
        replyText: isAr
          ? 'لبشرتك الحنطية أو القمحية ذات الإندرتون الدافئ، ننصحك بدرجة **03 Golden Honey (عسلي ذهبي)** من كريم أساس لومينوس سيلك HD من Miss2m! تركيبته التركية الغنية بحمض الهيالورونيك تمنحك تغطية مخملية تدوم 24 ساعة دون أي أكسدة أو تكتل، مع لمسة مشرقة طبيعية.'
          : 'For medium/warm honey skin tones, we strongly recommend shade **03 Golden Honey** of Miss2m Luminous Silk HD Foundation. Infused with Hyaluronic Acid, it provides 24-hour breathable coverage without oxidizing.',
        suggestedProductIds: ['m2m-found-01'],
        quickReplies: isAr
          ? ['ما هو البرايمر المناسب معه؟', 'هل التوصيل متوفر لإربد والزرقاء؟', 'أفضل درجة كونسيلر']
          : ['Best matching primer?', 'Delivery to Amman & Zarqa', 'Concealer recommendations'],
      };
    }

    if (has(['بيضاء', 'فاتحة', 'fair', 'light', 'pale'])) {
      return {
        replyText: isAr
          ? 'للبشرة الفاتحة أو البيضاء، أنسب درجة هي **01 Ivory Fair (عاجي فاتح)** أو **02 Natural Warm (بيج طبيعي دافئ)**. يتميز كريم أساس لومينوس سيلك HD بأنه يوحد لون البشرة بنعومة فائقة ويعكس الضوء لإخفاء الخطوط الدقيقة.'
          : 'For fair to light complexions, shades **01 Ivory Fair** or **02 Natural Warm** of Miss2m Luminous Silk HD Foundation are the perfect fit. Light-reflecting pigments blur imperfections effortlessly.',
        suggestedProductIds: ['m2m-found-01', 'm2m-conc-01'],
        quickReplies: isAr
          ? ['هل يناسب البشرة الجافة؟', 'كيف أثبت الفاونديشن؟', 'روج مناسب للبشرة الفاتحة']
          : ['Is it good for dry skin?', 'How to set makeup?', 'Lipstick for fair skin'],
      };
    }

    if (has(['سمراء', 'داكنة', 'deep', 'tan', 'almond', 'زيتوني', 'olive'])) {
      return {
        replyText: isAr
          ? 'للبشرة السمراء أو الزيتونية الدافئة، ننصحك بدرجة **04 Warm Almond (لوزي دافئ)**. توفر تغطية مخملية دافئة ومتجانسة دون أن تترك أي أثر رمادي، وتدوم طوال اليوم.'
          : 'For tan, deep, or olive skin tones, shade **04 Warm Almond** of Miss2m Luminous Silk HD Foundation provides rich, seamless coverage without looking ashy.',
        suggestedProductIds: ['m2m-found-01'],
        quickReplies: isAr
          ? ['هايلايتر مناسب للبشرة السمراء', 'روج نيود ثابت', 'طرق تثبيت المكياج']
          : ['Highlighter for tan skin', 'Nude lipstick', 'Setting spray advice'],
      };
    }

    return {
      replyText: isAr
        ? 'يتوفر كريم أساس كيرفول إتش دي HD من Miss2m في 4 درجات مختارة بعناية لتناسب مختلف ألوان البشرة في منطقتنا:\n\n• **01 Ivory Fair**: للبشرة البيضاء الفاتحة.\n• **02 Natural Warm**: للبشرة الفاتحة إلى المتوسطة.\n• **03 Golden Honey**: للبشرة الحنطية والقمحية.\n• **04 Warm Almond**: للبشرة السمراء الدافئة.\n\nما هو لون بشرتك أو الإندرتون المعتاد لأساعدك في الاختيار بدقة؟'
        : 'Miss2m Luminous Silk HD Foundation comes in 4 tailored shades:\n\n• **01 Ivory Fair**: Fair/Light\n• **02 Natural Warm**: Light-Medium\n• **03 Golden Honey**: Medium/Olive/Wheat\n• **04 Warm Almond**: Tan/Deep\n\nWhat is your skin tone or undertone?',
      suggestedProductIds: ['m2m-found-01'],
      quickReplies: isAr
        ? ['بشرتي حنطية', 'بشرتي بيضاء فاتحة', 'بشرتي دهنية']
        : ['I have medium/wheat skin', 'I have fair skin', 'I have oily skin'],
    };
  }

  // 2. Oily skin / Pores / Primer
  if (has(['دهنية', 'مسام', 'لمعان', 'oily', 'pores', 'shine', 'برايمر', 'primer'])) {
    return {
      replyText: isAr
        ? 'للبشرة الدهنية أو المختلطة التي تعاني من لمعان في منطقة الـ T-Zone، الخطوة الذهبية هي استخدام **برايمر الحرير المطفي (Poreless Silk Primer)** من Miss2m! يحتوي على النياسيناميد وفيتامين E لتنظيم الإفرازات الدهنية وتنعيم ملمس المسام بنسبة 100%، ثم تثبيت المكياج بـ **مثبت المكياج الندى Dewy Glow Setting Spray** لضمان ثبات مضاعف.'
        : 'For oily or combination skin prone to shine, the ultimate step is Miss2m **Poreless Silk Primer** with Niacinamide & Vitamin E. It blurs pores and regulates sebum for up to 16 hours.',
      suggestedProductIds: ['m2m-prim-01', 'm2m-spray-01'],
      quickReplies: isAr
        ? ['هل يسد المسام؟', 'أفضل فاونديشن للبشرة الدهنية', 'كيف أزيل المكياج بعمق؟']
        : ['Does it clog pores?', 'Foundation for oily skin', 'Cleansing routine'],
    };
  }

  // 3. Dry skin / Hydration
  if (has(['جافة', 'جفاف', 'تقشر', 'dry', 'hydration', 'ترطيب'])) {
return {
      replyText: isAr
        ? 'للبشرة الجافة، السر يكمن في الترطيب المسبق! فاونديشن **كيرفول إتش دي** من Miss2m مدعم بـ **حمض الهيالورونيك** ليوفر ترطيباً مستمراً يمنع أي تقشر. ولتنظيف وترطيب البشرة بعمق في نهاية اليوم، ننصحك بشدة بـ **بلسم التنظيف النباتي Hydra-Infusion Cleansing Balm** الغني بالزيوت المغذية.'
        : 'For dry skin, hydration is key! Miss2m **Careful HD Foundation** contains Hyaluronic Acid to hydrate without flaking. Pair it with our **Hydra-Infusion Cleansing Balm** for deep nourishing cleansing.',
      suggestedProductIds: ['m2m-found-01', 'm2m-balm-01'],
      quickReplies: isAr
        ? ['درجات الفاونديشن', 'هايلايتر طبيعي', 'توصيل خلال 48 ساعة']
        : ['Foundation shades', 'Natural highlighter', 'Delivery in 48 hours'],
    };
  }
  // 4. Lipstick / Lip makeup
  if (has(['روج', 'حمرة', 'شفايف', 'lipstick', 'lips', 'مات', 'ثابت', 'مخملي', 'matte'])) {
    return {
      replyText: isAr
        ? 'مجموعة **أحمر الشفاه السائل المخملي (Velvet Matte Liquid Lipstick)** من Miss2m تتميز بتركيبة تركية خفيفة الوزن لا تجفف الشفاه وتدوم حتى 16 ساعة مع لمسة غير لاصقة:\n\n• **Turkish Rose (01)**: وردي تركي أنيق للمشاوير والعمل اليومي.\n• **Istanbul Crimson (02)**: أحمر كلاسيكي جريء للمناسبات والسهرات.\n• **Cappuccino Nude (03)**: نيود كابتشينو دافئ وناعم جداً.\n• **Velvet Plum (04)**: برغندي مخملي فخم وجذاب.'
        : 'Miss2m **Velvet Matte Liquid Lipsticks** feature an ultra-comfortable Turkish formula that lasts 16 hours without cracking:\n\n• **01 Turkish Rose**: Elegant everyday dusty pink.\n• **02 Istanbul Crimson**: Bold classic red.\n• **03 Cappuccino Nude**: Chic warm nude.\n• **04 Velvet Plum**: Luxurious plum.',
      suggestedProductIds: ['m2m-lip-01'],
      quickReplies: isAr
        ? ['درجة الروج اليومي النيود', 'أحمر شفاه للمناسبات', 'بلش وردي متناسق']
        : ['Everyday nude shade', 'Evening red lipstick', 'Matching blush'],
    };
  }

  // 5. Mascara / Eyes
  if (has(['مسكارا', 'ماسكارا', 'رموش', 'mascara', 'lashes', 'تكثيف', 'تطويل', 'eyes'])) {
    return {
      replyText: isAr
        ? '**مسكارا بانوراميك دراما ثلاثية الأبعاد (3D Panoramic Drama Mascara)** من Miss2m هي الأكثر طلباً! تتميز بفرشاة سيليكون مقوسة ذات ألياف متناهية الصغر تمنح رموشك حجماً مضاعفاً 3 مرات وتطويلاً فورياً مع سواد كربوني فاحم، ومقاومة للتلطخ تدوم طوال اليوم.'
        : 'Miss2m **3D Panoramic Drama Volumizing Mascara** is a customer favorite! The ergonomic curved silicone wand multiplies volume 3x and provides instant lash lift with smudge-proof carbon black pigments.',
      suggestedProductIds: ['m2m-masc-01'],
      quickReplies: isAr
        ? ['هل هي سهلة الإزالة؟', 'أضيفيها إلى السلة', 'بلش متناسق']
        : ['Is it easy to remove?', 'Add to cart', 'Complementary blush'],
    };
  }

  // 6. Highlighter / Glow / Blush
  if (has(['هايلايتر', 'اضاءة', 'إضاءة', 'highlighter', 'glow', 'blush', 'بلاشر', 'بلش', 'خدود'])) {
    return {
      replyText: isAr
        ? 'لإشراقة مخملية ساحرة، نوصي بـ **هايلايتر ستاربلايت المخبوز (Starlight Baked Highlighter)** بدرجة Champagne Glow للمعان ذهبي لؤلؤي، ومزجه مع **أحمر الخدود الحريري (Satin Silk Powder Blush)** بدرجة Soft Peach أو Dusty Rose لمنح وجنتيك حيوية طبيعية تدوم لساعات طويلة.'
        : 'For a radiant luminous glow, pair Miss2m **Starlight Baked Highlighter** in Champagne Glow with our **Satin Silk Powder Blush** in Soft Peach or Dusty Rose for a fresh, dimensional flush.',
      suggestedProductIds: ['m2m-high-01', 'm2m-blush-01'],
      quickReplies: isAr
        ? ['فاونديشن لومينوس سيلك', 'مثبت المكياج', 'سعر الشحن']
        : ['Luminous Silk Foundation', 'Setting Spray', 'Delivery rates'],
    };
  }

  // 7. Star Club / Loyalty / Discount
  if (has(['نجوم', 'نقاط', 'خصم', '20%', 'stars', 'star club', 'مكافآت', 'discount', 'كود', 'قسيمة'])) {
    return {
      replyText: isAr
        ? 'في **نادي نجوم Miss2m**:\n• كل طلب مؤكد ومشحون يمنحك **+1 نجمة بونص**.\n• كل تقييم موثق برقم الطلب يمنحك **+1 نجمة فورية**.\n• عند تجميع **10 نجوم**، تفتحين تلقائياً قسيمة خصم **20% (كود STAR20)** لطلبك القادم!\n\nيمكنك الآن إدخال رقم هاتفك في نافذة النجوم لمتابعة رصيدك الخاص.'
        : 'In **Miss2m Star Club**:\n• Each confirmed order gives **+1 Bonus Star**.\n• Each verified review with your order number gives **+1 Star**.\n• Collecting **10 Stars** automatically unlocks a **20% OFF voucher (code STAR20)** for your next order!\n\nEnter your phone number in Star Club to view your balance.',
      suggestedProductIds: [],
      quickReplies: isAr
        ? ['عرض رصيد نجومي', 'كتابة تقييم جديد', 'تصفح الأكثر مبيعاً']
        : ['Check my star balance', 'Submit review', 'Browse bestsellers'],
    };
  }

  // 8. Shipping / Jordan Delivery
  if (has(['توصيل', 'شحن', 'سعر التوصيل', 'delivery', 'shipping', 'محافظات', 'عمان', 'الزرقاء', 'اربد', 'وقت'])) {
    return {
      replyText: isAr
        ? 'خدمة التوصيل في Miss2m سريعة وموثوقة:\n\n• **مدة التوصيل**: خلال **48 ساعة** لكافة محافظات المملكة الـ 12.\n• **رسوم التوصيل**: 2 د.أ فقط لعمّان والزرقاء، و3 د.أ لباقي المحافظات (إربد، العقبة، السلط، جرش...).\n• **توصيل مجاني**: على جميع الطلبات بقيمة **20 دينار أردني أو أكثر**!\n• **طرق الدفع**: نقدياً عند الاستلام أو فورياً عبر كليك (CliQ).'
        : 'Miss2m Jordan Delivery Policy:\n\n• **Timeframe**: Within **48 hours** across all 12 Jordanian governorates.\n• **Fee**: 2 JOD for Amman & Zarqa, and 3 JOD for all other governorates.\n• **FREE Delivery**: On all orders of **20 JOD or more**!\n• **Payment**: Cash on Delivery (COD) or instant CliQ.',
      suggestedProductIds: [],
      quickReplies: isAr
        ? ['ما هي المنتجات الأكثر مبيعاً؟', 'فاونديشن لومينوس سيلك', 'اسألي عن درجات الروج']
        : ['View Best Sellers', 'Luminous Silk Foundation', 'Lipstick shades'],
    };
  }

  // Default welcome response
  return {
    replyText: isAr
      ? 'يسعدني مساعدتك في كل ما يخص مستحضرات **Miss2m التركية الأصلية** في الأردن! يمكنك سؤالي عن درجات كريم الأساس لومينوس سيلك، ألوان أحمر الشفاه المخملي، الروتين المناسب لبشرتك، أو كيفية كسب النجوم والحصول على خصم 20%.'
      : 'I am thrilled to assist you with authentic **Miss2m Turkish cosmetics** in Jordan! Feel free to ask about foundation shade matching, velvet lipsticks, customized skincare routines, or how to claim your 20% discount through our Star Club.',
    suggestedProductIds: ['m2m-found-01', 'm2m-lip-01', 'm2m-masc-01'],
    quickReplies: isAr
      ? ['ما هي درجة الفاونديشن المناسبة لي؟', 'مستحضرات للبشرة الدهنية', 'كيف أحصل على خصم 20%؟', 'أفضل روج ثابت']
      : ['Foundation shade match', 'Oily skin routine', 'How to get 20% OFF', 'Best long-wear lipstick'],
  };
}
