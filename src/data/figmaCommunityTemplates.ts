/**
 * Figma Community–style mobile app templates (tiles only).
 * Used by /api/templates for template list; clicking opens Figma in new tab.
 */

export type CommunityTemplateItem = {
  id: string;
  name: string;
  thumbnail: string;
  author: string;
  figmaUrl: string;
  free: boolean;
  category?: string;
};

const FIGMA_COMMUNITY_BASE = 'https://www.figma.com/community/file';

/** Mockup/Frames/Device/UI kit type — show first; rest (app designs) below */
const isMockupOrDevice = (name: string) =>
  /mockup|mockups|templates|frames|assets|status bar|keyboards|splash|app icon/i.test(name);

const ALL_COMMUNITY_TEMPLATES: CommunityTemplateItem[] = [
  {
    id: 'iphone-16-and-16-plus-mockups',
    name: 'iPhone 16 and 16 Plus Mockups',
    thumbnail: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/13fafa142ba50415fcc6c1c420906cb02f3bcab9/resized/800x480/4cc5ada8bac3b306b13b3c0e2b30c6c69a6e0fc6.png',
    author: 'Vali Tronaru',
    figmaUrl: `${FIGMA_COMMUNITY_BASE}/1368235673074107602/iphone-16-and-16-plus-mockups`,
    free: true,
    category: 'Mobile',
  },
  {
    id: 'device-frames',
    name: 'Device Frames',
    thumbnail: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/resized/800x480/776ccd8b44710d0aaa37ee2bc7f4b57f5c4fc33d.png',
    author: 'Gavin McFarland',
    figmaUrl: `${FIGMA_COMMUNITY_BASE}/776921648331857127/device-frames`,
    free: true,
    category: 'Mobile',
  },
  {
    id: 'iphone-17-and-iphone-air-assets',
    name: 'iPhone 17 and iPhone AIR Assets',
    thumbnail: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/8a7173b069c9aa5fbbe75569c815cd1ca3102b6e/resized/800x480/96d5c549669fd5472daedc65d7f0071f93505030.png',
    author: 'Gaurav Kumar',
    figmaUrl: `${FIGMA_COMMUNITY_BASE}/837799145528214755/iphone-17-and-iphone-air-assets`,
    free: true,
    category: 'Mobile',
  },
  {
    id: 'iphone-templates',
    name: 'iPhone Templates',
    thumbnail: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/resized/800x480/6d23af0c10b365e9adb0c5c77f8bc832d1f733fa.png',
    author: 'Erik Kennedy',
    figmaUrl: `${FIGMA_COMMUNITY_BASE}/1058935264266302409/iphone-templates`,
    free: true,
    category: 'Mobile',
  },
  {
    id: 'ios-status-bar',
    name: 'iOS Status Bar',
    thumbnail: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/6ce253a80ee6f46c6011f9cd9eb2eda92415112e/resized/800x480/9d0c6ef78a40dd88c98a257bcc8126916fe22c57.png',
    author: 'Denis Rojčyk',
    figmaUrl: `${FIGMA_COMMUNITY_BASE}/831970552583056395/ios-status-bar`,
    free: true,
    category: 'Mobile',
  },
  {
    id: 'ios-keyboards',
    name: 'iOS Keyboards',
    thumbnail: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/e2aac0107ea9813c0f73578a14f1ea6820ef8b38/resized/800x480/79ef7625fc4130c17f8af72054f47baf73d058ae.png',
    author: 'Denis Rojčyk',
    figmaUrl: `${FIGMA_COMMUNITY_BASE}/768726574016795759/ios-keyboards`,
    free: true,
    category: 'Mobile',
  },
  {
    id: 'ios-26-safari-ui-keyboards',
    name: 'iOS 26 Safari UI + Keyboards',
    thumbnail: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/51a72ba32247b69b20dd1457a1ab329f5e1ffa06/resized/800x480/a6b7c00ce42f4336370438f67bcb09b69c47bd08.png',
    author: 'Andreas Storm',
    figmaUrl: `${FIGMA_COMMUNITY_BASE}/922738986195002030/ios-26-safari-ui-keyboards`,
    free: true,
    category: 'Mobile',
  },
  {
    id: 'status-bar-navigation-bar-iphone-android',
    name: 'Status bar/navigation bar for iPhone and Android',
    thumbnail: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/resized/800x480/3ffe99935c0443ee3f5c8e4b530e9b33a27fe836.png',
    author: 'Marcin',
    figmaUrl: `${FIGMA_COMMUNITY_BASE}/1071178715314305157/status-bar-navigation-bar-for-iphone-and-android`,
    free: true,
    category: 'Mobile',
  },
  {
    id: 'expo-app-icon-splash-v2-community',
    name: 'Expo App Icon & Splash v2 (Community)',
    thumbnail: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/4b36b4dc80a7e0be629cf2bd5badd65ca79d3022/resized/800x480/4ccc7b04d4e8cb28600d6242ee2c6f0c9edea70c.png',
    author: 'Expo',
    figmaUrl: `${FIGMA_COMMUNITY_BASE}/1466490409418563617/expo-app-icon-splash-v2-community`,
    free: true,
    category: 'Mobile',
  },
  {
    id: 'online-bike-shopping-app',
    name: 'Online Bike Shopping App',
    thumbnail: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/resized/800x480/25ce5514ee2b1378274c65b48ef0d61e5841695a.png',
    author: 'Sourasith',
    figmaUrl: `${FIGMA_COMMUNITY_BASE}/1149336740234053658/online-bike-shopping-app`,
    free: true,
    category: 'Mobile',
  },
  {
    id: 'mobile-apps-prototyping-kit',
    name: 'Mobile Apps – Prototyping Kit',
    thumbnail: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/resized/800x480/ebcb14d3e4b99177d1dab0064c50ec42932fd390.png',
    author: 'Renata Pôrto',
    figmaUrl: `${FIGMA_COMMUNITY_BASE}/1129468881607079432/mobile-apps-prototyping-kit`,
    free: true,
    category: 'Mobile',
  },
  {
    id: 'coinpay-fintech-finance-mobile-app-ui-kit',
    name: 'Coinpay Fintech Finance Mobile App UI kit (Community)',
    thumbnail: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/resized/800x480/8bf8aad01240ee19cf7197f343e0186901bbcc48.png',
    author: 'Mehedi Hasan',
    figmaUrl: `${FIGMA_COMMUNITY_BASE}/1195417779279692347/coinpay-fintech-finance-mobile-app-ui-kit-community`,
    free: false,
    category: 'Mobile',
  },
  {
    id: 'coffee-shop-mobile-app-design',
    name: 'Coffee Shop Mobile App Design',
    thumbnail: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/resized/800x480/1531cdbdd76fa9a3a3c30f4167e82f2f936c98b0.png',
    author: 'Bony Fasius Gultom',
    figmaUrl: `${FIGMA_COMMUNITY_BASE}/1116708627748807811/coffee-shop-mobile-app-design`,
    free: true,
    category: 'Mobile',
  },
  {
    id: 'whatsapp-ui-screens',
    name: 'WhatsApp UI Screens',
    thumbnail: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/resized/800x480/c597de372922c861a9349bf657c28b4be7488cfe.png',
    author: 'Pixsellz',
    figmaUrl: `${FIGMA_COMMUNITY_BASE}/874576344344319149/whatsapp-ui-screens`,
    free: true,
    category: 'Mobile',
  },
  {
    id: 'food-delivery-app',
    name: 'Food Delivery App',
    thumbnail: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/resized/800x480/325cf20eb0fedb7051587b61dc82e3583e4c609e.png',
    author: 'Yamesh_SB',
    figmaUrl: `${FIGMA_COMMUNITY_BASE}/1231521889522325040/food-delivery-app`,
    free: true,
    category: 'Mobile',
  },
  {
    id: 'task-management-to-do-list-app',
    name: 'Task management & to-do list app',
    thumbnail: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/resized/800x480/4c44cb56abf87d88ebdc02b201c83b76fe2a97e4.png',
    author: 'Neser U.',
    figmaUrl: `${FIGMA_COMMUNITY_BASE}/1143575071825582037/task-management-to-do-list-app`,
    free: true,
    category: 'Mobile',
  },
  {
    id: 'weather-app-ui-design',
    name: 'Weather App UI Design',
    thumbnail: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/resized/800x480/eac290b17e167fcab2507f9871831e1522ddf532.png',
    author: 'Aksonvady',
    figmaUrl: `${FIGMA_COMMUNITY_BASE}/1100826294536456295/weather-app-ui-design`,
    free: true,
    category: 'Mobile',
  },
  {
    id: 'ecommerce-app-ui-kit-case-study',
    name: 'eCommerce App UI Kit - Case Study Ecommerce Mobile App UI kit',
    thumbnail: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/resized/800x480/9952b51ea06364785b995b181e4ca897bf42faef.png',
    author: 'UI-UX Expert (Aashifa)',
    figmaUrl: `${FIGMA_COMMUNITY_BASE}/1264098337558102933/ecommerce-app-ui-kit-case-study-ecommerce-mobile-app-ui-kit`,
    free: true,
    category: 'Mobile',
  },
  {
    id: 'online-groceries-app-ui',
    name: 'Online Groceries App UI',
    thumbnail: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/resized/800x480/a20a775b7069a17154f22a8837cfae7ce0ee9907.png',
    author: 'Afsar',
    figmaUrl: `${FIGMA_COMMUNITY_BASE}/882645007956337261/online-groceries-app-ui`,
    free: true,
    category: 'Mobile',
  },
  {
    id: 'meditation-app-ui',
    name: 'Meditation app UI',
    thumbnail: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/resized/800x480/296f64072e0cc751b611a03dfcd1368fc85856f5.png',
    author: 'Afsar',
    figmaUrl: `${FIGMA_COMMUNITY_BASE}/882888114457713282/meditation-app-ui`,
    free: true,
    category: 'Mobile',
  },
  {
    id: 'open-fashion-free-ecommerce-ui-kit',
    name: 'Open Fashion - Free eCommerce UI Kit',
    thumbnail: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/resized/800x480/972ad5818aed9bc8efb9c67c98c70c3ed5a715d6.png',
    author: 'UI Store Design',
    figmaUrl: `${FIGMA_COMMUNITY_BASE}/1055151140671808467/open-fashion-free-ecommerce-ui-kit`,
    free: true,
    category: 'Mobile',
  },
  {
    id: 'tiktok-ui-screens',
    name: 'TikTok UI Screens',
    thumbnail: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/resized/800x480/c442c145c7ce8c274b98c0a08ffb0f646d5e6b2e.png',
    author: 'Pixsellz',
    figmaUrl: `${FIGMA_COMMUNITY_BASE}/874598319834758320/tiktok-ui-screens`,
    free: true,
    category: 'Mobile',
  },
  {
    id: 'telegram-ui-screens',
    name: 'Telegram UI Screens',
    thumbnail: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/resized/800x480/69807c12c4a0984cab189c418718f4249538064e.png',
    author: 'Pixsellz',
    figmaUrl: `${FIGMA_COMMUNITY_BASE}/874574404452104362/telegram-ui-screens`,
    free: true,
    category: 'Mobile',
  },
  {
    id: 'nucleus-ui-mobile-app-ui-component-library',
    name: 'Nucleus UI: Mobile App UI Component Library – LITE',
    thumbnail: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/resized/800x480/43b9594d7340aa1016f89a9b574d764c0ef6ec90.png',
    author: 'Nucleus UI',
    figmaUrl: `${FIGMA_COMMUNITY_BASE}/967227093809940846/nucleus-ui-mobile-app-ui-component-library-lite`,
    free: true,
    category: 'Mobile',
  },
  {
    id: 'dokterian-doctor-appointment-mobile-app',
    name: 'Dokterian - Doctor Appointment Mobile App',
    thumbnail: 'https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/resized/800x480/c825b39d2f2207a23ebdf98dbd4182f999252f84.png',
    author: 'Lokanaka Studio',
    figmaUrl: `${FIGMA_COMMUNITY_BASE}/1106038596434269509/dokterian-doctor-appointment-mobile-app`,
    free: true,
    category: 'Mobile',
  },
];

/** Mockup/Frames/Device/Assets first, then rest */
export const FIGMA_COMMUNITY_TEMPLATES: CommunityTemplateItem[] = [
  ...ALL_COMMUNITY_TEMPLATES.filter((t) => isMockupOrDevice(t.name)),
  ...ALL_COMMUNITY_TEMPLATES.filter((t) => !isMockupOrDevice(t.name)),
];
