//this lengthy file seeds the database with laptop products.
const User = require("../models/user");
const Category = require("../models/category");
const Sub = require("../models/sub");
const Brand = require("../models/brand");
const Product = require("../models/product");

const createProducts = async () => {
  const adminUser = await User.findOne({ role: "admin" });
  const testUser = await User.findOne({ role: "subscriber" });

  const windows = await Category.findOne({ slug: "windows-os" });
  const mac = await Category.findOne({ slug: "macos" });
  const chrome = await Category.findOne({ slug: "chrome-os" });

  const businessSub = await Sub.findOne({ slug: "business-laptops" });
  const gamingSub = await Sub.findOne({ slug: "gaming-laptops" });
  const MacBookAirSub = await Sub.findOne({ slug: "macbook-air" });
  const MacBookProSub = await Sub.findOne({ slug: "macbook-pro" });

  const dellBrand = await Brand.findOne({ slug: "dell" });
  const msiBrand = await Brand.findOne({ slug: "msi" });
  const appleBrand = await Brand.findOne({ slug: "apple" });
  const alienBrand = await Brand.findOne({ slug: "alienware" });
  const hpBrand = await Brand.findOne({ slug: "hp" });
  const acerBrand = await Brand.findOne({ slug: "acer" });
  const asusBrand = await Brand.findOne({ slug: "asus" });

  await new Product({
    brand: dellBrand,
    category: windows,
    colors: ["Black"],
    description:
      '<p>Level-up your productivity with this 14" smart laptop. Customize to fit your needs with a vast array of options and speed your work with Dell Optimizer, now with ExpressConnect.</p><p><br></p><p><strong>Windows 10 Pro</strong></p><p>Built for business. Protect your data with enterprise-grade security, login from any device anywhere, and boost productivity with powerful management tools.</p><p><br></p><p><strong>14" Display</strong></p><p>Anti-glare Screen reduces eyestrain and widens the field of view. The 1920 x 1080 resolution boasts impressive color and clarity</p><p><br></p><p><strong>11th Gen Intel® Core? i5-1145G7 processor</strong></p><p>Smart Quad-core (4 Core) processing performance. Intel Turbo Boost Technology delivers dynamic extra power when you need it, while increasing energy efficiency when you don\'t.</p><p><br></p><p><strong>8GB system memory for advanced multitasking</strong></p><p>Substantial high-bandwidth RAM to smoothly run your games and photo- and video-editing applications, as well as multiple programs and browser tabs all at once.</p><p><br></p><p><strong>256 GB solid state drive (SSD)</strong></p><p>While offering less storage space than a hard drive, a flash-based SSD has no moving parts, resulting in faster start-up times and data access, no noise, and reduced heat production and power draw on the battery.</p><p><br></p><p><strong>Intel Iris Xe Shared graphics</strong></p><p>Intel Iris Xe graphics for regular office work, web browsing, watching videos and playing games</p><p><br></p><p><strong>Weighs 3.35 lbs and measures 0.69" thin</strong></p><p>Lightweight design, featuring a slightly smaller screen and omitting the DVD/CD drive for improved portability. 4-cell battery.</p><p><br></p><p><strong>HDMI output expands your viewing options</strong></p><p>Connect to an HDTV or high-def monitor to set up two screens side by side or just see more of the big picture.</p><p><br></p><p><strong>Wireless/Wired connectivity (WiFi 6 - 802.11 ax)</strong></p><p>Flexible, dual-band connectivity w/ greater reliability thanks to two data streams and antennas. Connect to a Wi-Fi router to experience GB Wi-Fi speeds nearly 3X faster vs. standard Wi-Fi 5 w/ improved responsiveness for even more devices.</p><p><br></p><p><strong>Backlit keyboard</strong></p><p>Backlit keyboard For easy typing in dim or dark conditions.</p>',
    images: [
      {
        public_id: "1_nzkitk",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638843854/ecomm_seeds/Dell_Latitude/1_nzkitk.jpg",
      },
      {
        public_id: "2_ctxacz",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638843854/ecomm_seeds/Dell_Latitude/2_ctxacz.jpg",
      },
      {
        public_id: "3_em9ixf",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638843854/ecomm_seeds/Dell_Latitude/3_em9ixf.jpg",
      },
    ],
    price: 1049.99,
    quantity: 25,
    ratings: [],
    slug: "dell-latitude-3000",
    sold: 0,
    subs: [businessSub],
    title: "Dell Latitude 3000",
  }).save();

  await new Product({
    brand: acerBrand,
    category: windows,
    colors: ["Black"],
    description:
      '<p>With the TravelMate P2, it has never been easier to work away from the office. Step up your productivity through a combination of increased processing power, portability, and durability bundled with a wide range of handy business features and advanced connectivity options. For the professional on the road, there\'s no better choice.</p><p><br></p><p><strong>Windows 10 Pro</strong></p><p>Built for business. Protect your data with enterprise-grade security, login from any device anywhere, and boost productivity with powerful management tools.</p><p><br></p><p><strong>14" Display</strong></p><p>IPS technology offers wide viewing angles. The 1920 x 1080 resolution boasts impressive color and clarity LED backlight.</p><p><br></p><p><strong>8GB system memory for advanced multitasking</strong></p><p>Substantial high-bandwidth RAM to smoothly run your games and photo- and video-editing applications, as well as multiple programs and browser tabs all at once.</p><p><br></p><p><strong>Solid State Drive (PCI-e)</strong></p><p>Save files fast and store more data. With massive amounts of storage and advanced communication power, PCI-e SSDs are great for major gaming applications, multiple servers, daily backups, and more.</p><p><br></p><p><strong>Intel Iris Xe Shared graphics</strong></p><p>Intel Iris Xe graphics for regular office work, web browsing, watching videos and playing games</p><p><br></p><p><strong>Weighs 3.53 lbs and measures 0.78" thin</strong></p><p>Lightweight design, featuring a slightly smaller screen and omitting the DVD/CD drive for improved portability. 3-cell Lithium Ion (Li-Ion) battery.</p><p><br></p><p><strong>HDMI output expands your viewing options</strong></p><p>Connect to an HDTV or high-def monitor to set up two screens side by side or just see more of the big picture. HDCP support.</p><p><br></p><p><strong>Wireless/Wired connectivity (WiFi 6 - 802.11 ax)</strong></p><p>Flexible, dual-band connectivity w/ greater reliability thanks to two data streams and antennas. Connect to a Wi-Fi router to experience GB Wi-Fi speeds nearly 3X faster vs. standard Wi-Fi 5 w/ improved responsiveness for even more devices.</p><p><br></p><p><strong>Backlit keyboard</strong></p><p>Backlit keyboard For easy typing in dim or dark conditions.</p><p><br></p><p><strong>Additional ports</strong></p><p>Microphone-in/headphone-out combo jack, VGA port (D-sub)</p>',
    images: [
      {
        public_id: "2_yusrlm",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638849154/ecomm_seeds/Acer_Travel/2_yusrlm.jpg",
      },
      {
        public_id: "1_ozl6ni",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638849155/ecomm_seeds/Acer_Travel/1_ozl6ni.jpg",
      },
      {
        public_id: "3_rn3nvy",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638849153/ecomm_seeds/Acer_Travel/3_rn3nvy.jpg",
      },
    ],
    price: 899.99,
    quantity: 12,
    ratings: [
      {
        star: 4,
        postedBy: adminUser,
      },
      {
        star: 3,
        postedBy: testUser,
      },
    ],
    slug: "travelmate-p2",
    sold: 4,
    subs: [businessSub],
    title: "TravelMate P2",
  }).save();

  await new Product({
    brand: hpBrand,
    category: chrome,
    colors: ["Blue"],
    description:
      "&lt;p&gt;&lt;strong style=&quot;color: rgb(4, 12, 19);&quot;&gt;Powered up:&lt;&#x2F;strong&gt;&lt;span style=&quot;color: rgb(4, 12, 19);&quot;&gt; The Chromebook x360 is powered by an Intel® processor and packed full of the features you have to have, like a long battery life, and a full-size keyboard. An entertainment experience that adapts to you: With the versatility of a 360° hinge, the beauty of a micro-edge, HD touch display and Audio by B&amp;amp;O, your entertainment experience looks as good as it sounds. Apps for everything: Redefine how you work and play with the seamless integration of your favorite Chrome browser, always secure and up to date, and access to a huge selection of apps in the Google Play Store.&lt;&#x2F;span&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Chrome&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;This easy-to-use operating system was designed to be fast in every possible way, while keeping you safe and more secure on the web.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;14&quot; High-definition display&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Enjoy your entertainment with the great quality and highdefinition detail of 1 million pixels&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Intel® Pentium® Silver N6000&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;With an Intel® Pentium® processor in your laptop, you can effortlessly multitask with multi-screen capabilities, communicate easily with friends and family, and take all your favorite entertainment to go.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;4GB system memory for basic multitasking&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Adequate high-bandwidth RAM to smoothly run multiple applications and browser tabs all at once.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;64 GB eMMC storage&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;An embedded multimedia card provides reliable flash-based storage.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Wi-Fi 5 (2x2) &amp;amp; Bluetooth® 5.0&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;With a Wi-Fi 5 (2x2) (802.11a&#x2F;b&#x2F;g&#x2F;n&#x2F;ac) WLAN adapter and Bluetooth® 5.0, all your connections are rock solid.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Intel® UHD Graphics&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Smoothly stream 4K content and play your favorite games.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;A truly powerful audio experience&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;HP Dual Speakers, custom-tuned by experts at B&amp;amp;O, deliver rich, authentic audio.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;HP Wide Vision HD Camera&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;The 88-degree, wide-angle field of view lets you video chat with the entire family or group of friends in crystal clear detail.&lt;&#x2F;p&gt;",
    images: [
      {
        public_id: "1_j1xiur",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638934857/ecomm_seeds/2-in-1_chromebook/1_j1xiur.jpg",
      },
      {
        public_id: "3_unkiv5",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638934857/ecomm_seeds/2-in-1_chromebook/3_unkiv5.jpg",
      },
      {
        public_id: "2_mno8tc",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638934857/ecomm_seeds/2-in-1_chromebook/2_mno8tc.jpg",
      },
    ],
    price: 359.0,
    quantity: 19,
    ratings: [
      {
        star: 4,
        postedBy: adminUser,
      },
    ],
    slug: "2-in-1-chromebook",
    sold: 9,
    subs: [],
    title: "2-In-1 Chromebook",
  }).save();

  await new Product({
    brand: asusBrand,
    category: chrome,
    colors: ["Red"],
    description:
      "&lt;p&gt;Enjoy a smooth web browsing experience with this 11.6-inch ASUS Chromebook computer. The Intel Celeron dual-core processor and 4GB of on-board memory provide quick access to your favorite apps, and the 32GB storage capacity lets you save photos, music and other media. This ASUS Chromebook computer has a built-in HD webcam and microphone for video calls.&lt;&#x2F;span&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Google Chrome OS&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Chrome OS is the speedy, simple and secure OS that powers every Chromebook. Chrome OS updates automatically every 6 weeks with the latest software and virus protection.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;11.6&quot; display&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Typical 1366 x 768 HD resolution. Energy-efficient LED backlight.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Intel® Celeron® processor N3350&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Entry-level dual-core processor for general e-mail, Internet and productivity tasks.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;4GB system memory for basic multitasking&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Adequate high-bandwidth RAM to smoothly run multiple applications and browser tabs all at once.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;32GB eMMC flash memory&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;This ultracompact memory system is ideal for mobile devices and applications, providing enhanced storage capabilities, streamlined data management, quick boot-up times and support for high-definition video playback.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Built-in cloud support&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Easily save your files to your Google Drive account for secure access wherever you go. You can also sync with your other devices running Chrome and even work offline when needed. Fees may apply.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Intel® HD Graphics 500&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;On-processor graphics with shared video memory provide everyday image quality for Internet use, basic photo editing and casual gaming.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Weighs 2.20 lbs. and measures 0.7&quot; thin&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Ultrathin and ultralight for maximum portability, featuring a smaller screen size and omitting the DVD&#x2F;CD drive to achieve the compact form factor. 2-cell lithium-polymer battery.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Built-in media reader for simple photo transfer&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Supports microSD, microSDHC and microSDXC memory card formats.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Next-generation wireless connectivity&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Connects to your network or hotspots on all current Wi-Fi standards. Connect to a Wireless-AC router for speed nearly 3x faster than Wireless-N.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Built-in HD webcam with microphone&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Makes it easy to video chat with family and friends or teleconference with colleagues over Google Hangouts or other popular applications.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Built-in virus protection and Google products&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Work, play and do right out of the box with Search, Gmail, Talk, YouTube and Hangouts, then personalize with the Chrome Web Store. Multiple layers of protection defend against viruses and malware.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Additional port&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Headphone&#x2F;microphone combo jack.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Note: This Chromebook does not include a built-in DVD&#x2F;CD drive.&lt;&#x2F;p&gt;",
    images: [
      {
        public_id: "1_pa7j1i",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638935874/ecomm_seeds/asus_chromebook/1_pa7j1i.jpg",
      },
      {
        public_id: "2_rsgfrp",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638935874/ecomm_seeds/asus_chromebook/2_rsgfrp.jpg",
      },
      {
        public_id: "3_th4pk7",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638935874/ecomm_seeds/asus_chromebook/3_th4pk7.jpg",
      },
    ],
    price: 249.99,
    quantity: 11,
    ratings: [
      {
        star: 3,
        postedBy: adminUser,
      },
      {
        star: 4,
        postedBy: testUser,
      },
    ],
    slug: "asus-chromebook",
    sold: 2,
    subs: [],
    title: "Asus Chromebook",
  }).save();

  await new Product({
    brand: appleBrand,
    category: mac,
    colors: ["Gray", "Silver"],
    description:
      "&lt;p&gt;The new MacBook Pro delivers game-changing performance for pro users. Choose the powerful M1 Pro or the even more powerful M1 Max to supercharge pro-level workflows while getting amazing battery life. And with an immersive 16-inch Liquid Retina XDR display and an array of pro ports, you can do more than ever with MacBook Pro. Apple M1 Pro or M1 Max chip for a massive leap in CPU, GPU, and machine learning performance&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Up to 10-core CPU delivers up to 2x faster performance to fly through pro workflows quicker than ever³&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Up to 32-core GPU with up to 4x faster performance for graphics-intensive apps and games³&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;16-core Neural Engine for up to 5x faster machine learning performance³&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Longer battery life, up to 21 hours¹&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Up to 64GB of unified memory so everything you do is fast and fluid&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Up to 8TB of superfast SSD storage launches apps and opens files in an instant&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Stunning 16-inch Liquid Retina XDR display with extreme dynamic range and contrast ratio²&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;1080p FaceTime HD camera with advanced image signal processor for sharper video calls&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Six-speaker sound system with force-cancelling woofers&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Studio-quality three-microphone array captures your voice more clearly&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Three Thunderbolt 4 ports, HDMI port, SDXC card slot, headphone jack, MagSafe 3 port&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Next-generation Wi-Fi 6 for faster connectivity&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Backlit Magic Keyboard with Touch ID for secure unlock and payments&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;macOS Monterey lets you connect, share, and create like never before, with exciting new FaceTime updates and a redesigned Safari&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Available in space gray and silver&lt;&#x2F;p&gt;",
    images: [
      {
        public_id: "1_vin5no",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638937536/ecomm_seeds/macBook_Pro/1_vin5no.jpg",
      },
      {
        public_id: "2_ab9oef",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638937536/ecomm_seeds/macBook_Pro/2_ab9oef.jpg",
      },
      {
        public_id: "3_fqlsrc",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638937536/ecomm_seeds/macBook_Pro/3_fqlsrc.jpg",
      },
    ],
    price: 2699.0,
    quantity: 62,
    ratings: [
      {
        star: 5,
        postedBy: adminUser,
      },
      {
        star: 4,
        postedBy: testUser,
      },
    ],
    slug: "apple-m1-16gb-macbook-pro",
    sold: 7,
    subs: [MacBookProSub],
    title: "Apple M1 16GB MacBook Pro",
  }).save();

  await new Product({
    brand: appleBrand,
    category: mac,
    colors: ["Gray", "Silver"],
    description:
      "&lt;p&gt;MacBook Pro has a tenth-generation quad-core Intel processor with Turbo Boost up to 3.8GHz. A brilliant and colorful Retina display with True Tone technology for a more true-to-life viewing experience. A backlit Magic Keyboard and Touch ID. Fast integrated graphics. And the versatile Touch Bar for more ways to be productive. It&#x27;s Apple&#x27;s most powerful 13-inch notebook. Pushed even further.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Tenth-generation quad-core Intel Core i5 processor&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Brilliant Retina display with True Tone technology&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Backlit Magic Keyboard&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Touch Bar and Touch ID&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Intel Iris Plus Graphics&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Ultrafast SSD&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Four Thunderbolt 3 (USB Type-C) ports&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Up to 10 hours of battery life*&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;802.11ac Wi-Fi&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Force Touch trackpad&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Available in space gray and silver&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;The latest version of macOS&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Configurable processor, memory, and storage options are available&lt;&#x2F;p&gt;",
    images: [
      {
        public_id: "1_yxpbyk",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638938094/ecomm_seeds/macbook_pro_cheaper/1_yxpbyk.jpg",
      },
      {
        public_id: "3_fuzqpg",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638938094/ecomm_seeds/macbook_pro_cheaper/3_fuzqpg.webp",
      },
      {
        public_id: "2_gmzryd",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638938094/ecomm_seeds/macbook_pro_cheaper/2_gmzryd.webp",
      },
    ],
    price: 1299.99,
    quantity: 101,
    ratings: [
      {
        star: 5,
        postedBy: adminUser,
      },
      {
        star: 5,
        postedBy: testUser,
      },
    ],
    slug: "macbook-pro",
    sold: 43,
    subs: [MacBookProSub],
    title: "MacBook Pro",
  }).save();

  await new Product({
    brand: appleBrand,
    category: mac,
    colors: ["Silver", "Gold", "Gray"],
    description:
      "&lt;p&gt;Apple’s thinnest and lightest notebook gets supercharged with the Apple M1 chip. Tackle your projects with the blazing-fast 8-core CPU. Take graphics-intensive apps and games to the next level with the 7-core GPU. And accelerate machine learning tasks with the 16-core Neural Engine. All with a silent, fanless design and the longest battery life ever — up to 18 hours. MacBook Air. Still perfectly portable. Just a lot more powerful.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Apple-designed M1 chip for a giant leap in CPU, GPU, and machine learning performance&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Go longer than ever with up to 18 hours of battery life¹&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;8-core CPU delivers up to 3.5x faster performance to tackle projects faster than ever²&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Seven GPU cores with up to 5x faster graphics for graphics-intensive apps and games²&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;16-core Neural Engine for advanced machine learning&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;8GB of unified memory so everything you do is fast and fluid&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Superfast SSD storage launches apps and opens files in an instant&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Fanless design for silent operation&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;13.3-inch Retina display with P3 wide color for vibrant images and incredible detail³&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;FaceTime HD camera with advanced image signal processor for clearer, sharper video calls&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Three-microphone array focuses on your voice instead of what’s going on around you&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Next-generation Wi-Fi 6 for faster connectivity&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Two Thunderbolt &#x2F; USB 4 ports for charging and accessories&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Backlit Magic Keyboard and Touch ID for secure unlock and payments&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;macOS Big Sur introduces a bold new design and major app updates for Safari, Messages, and Maps&lt;&#x2F;p&gt;",
    images: [
      {
        public_id: "1_f1oi6o",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638938811/ecomm_seeds/macBook_air/1_f1oi6o.jpg",
      },
      {
        public_id: "2_xm7wdx",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638938812/ecomm_seeds/macBook_air/2_xm7wdx.jpg",
      },
      {
        public_id: "3_hmu1hh",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638938811/ecomm_seeds/macBook_air/3_hmu1hh.jpg",
      },
    ],
    price: 899.99,
    quantity: 101,
    ratings: [
      {
        star: 5,
        postedBy: adminUser,
      },
      {
        star: 3,
        postedBy: testUser,
      },
    ],
    slug: "apple-m1-8gb-macbook-air",
    sold: 62,
    subs: [MacBookAirSub],
    title: "Apple M1 8GB MacBook Air",
  }).save();

  await new Product({
    brand: alienBrand,
    category: windows,
    colors: ["Black", "White"],
    description:
      "&lt;p&gt;The new Alienware x17 is super thin, extremely light laptop . Now’s your chance to game with gear that knows no boundaries. The Alienware x17 gaming laptops with advanced Alienware Cryo-Tech™ cooling defy boundaries. Introducing Element 31 thermal interface material and a Quad-Fan Design. We are incorporating more fan blades, more copper materials, and vapor chambers to deliver ample power while dissipating the heat more efficiently and allowing the fans to run less resulting in reduced noise. The x17 features five tailored power states, and grants access to thousands of games with Windows. Alienware laptops will bring your favorite games into hyper-reality with Windows DirectX 12 Ultimate. Constructed with magnesium alloy and aluminum parts gamers can experience the evolved Legend Industrial Design that reimagines the way you game. The Alienware x17 is equipped with 11th Gen Intel processors, has more storage options with dual drives featuring SSD and includes powerful NVIDIA® GeForce® RTX 30-series discrete graphics.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Windows 11&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Windows 11 has all the power and security of Windows 10 with a redesigned and refreshed look. It also comes with new tools, sounds, and apps. Every detail has been considered. All of it comes together to bring you a refreshing experience on your PC&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;17.3&quot; 360Hz FHD Display&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;1920 x 1080 resolution with native 1080p support to showcase your games and HD movies with impressive color and clarity. Energy-efficient LED backlight.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;1TB M.2 PCIe NVMe Solid State Drive&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;While offering less storage space than a hard drive, a flash-based SSD has no moving parts, resulting in faster start-up times and data access, no noise, and reduced heat production and power draw on the battery.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;16GB system memory for intense multitasking and gaming&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Reams of high-bandwidth DDR4 RAM to smoothly run your graphics-heavy PC games and video-editing applications, as well as numerous programs and browser tabs all at once.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;NVIDIA GeForce RTX 3070 graphics&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Backed by 8GB GDDR6 dedicated video memory for a fast, advanced GPU to fuel your games.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;11th Generation Intel Core i7 Processor&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;The perfect combination of performance and responsiveness. Enjoy boundary-breaking performance with the 11th Gen Intel Core i7 processor. Stay productive with fast-charging, long-lasting battery.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Alienware Cryo-Tech™ cooling technology&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Four intelligently controlled, uniquely programmable fans to help dissipate heat. Game for longer periods of time thanks to Element 31, a gallium-silicone thermal interface material.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Alienware Command Center&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Gamers can set, activate and manage five unique power states in the Alienware Command Center.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Legend 2.0 Industrial Design&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;A fresh new evolution in design with a high-endurance finish and customizable AlienFX lighting.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Xbox Game Pass Ultimate - Discover your next favorite game.&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;1 month of Xbox Game Pass Ultimate included. Play over 100 high-quality games on Windows 10, console and mobile. Includes new day one titles, iconic Bethesda games and EA Play on PC.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Note: this laptop does not include a DVD drive.&lt;&#x2F;p&gt;",
    images: [
      {
        public_id: "1_xcqnfz",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638940058/ecomm_seeds/alienware/1_xcqnfz.jpg",
      },
      {
        public_id: "2_z6jfb6",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638940058/ecomm_seeds/alienware/2_z6jfb6.jpg",
      },
      {
        public_id: "3_jhercw",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638940058/ecomm_seeds/alienware/3_jhercw.jpg",
      },
      {
        public_id: "4_k30vzy",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638940058/ecomm_seeds/alienware/4_k30vzy.jpg",
      },
    ],
    price: 2549.99,
    quantity: 12,
    ratings: [
      {
        star: 4,
        postedBy: adminUser,
      },
      {
        star: 3,
        postedBy: testUser,
      },
    ],
    slug: "alienware-x17-r1",
    sold: 4,
    subs: [gamingSub],
    title: "Alienware x17 R1",
  }).save();

  await new Product({
    brand: msiBrand,
    category: windows,
    colors: ["Gray", "Black"],
    description:
      "&lt;p&gt;Unexpected. Unseen. Unreal. The Delta 15 AMD Advantage™ Edition uses the latest AMD Ryzen™ 7 5800H processor and Radeon™ RX 6700M graphics. Coming in at 4.19lbs light and 0.75in thin, the Delta 15 supports SmartShift, Smart Access Memory and Wi-Fi 6E for powerful performance inside a premium chassis. Break through and set off a new standard in gaming with the Delta 15.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;&#x2F;p&gt;&lt;p&gt;Free Upgrade to Windows 11&lt;&#x2F;p&gt;&lt;p&gt;Upgrade rollout plan is being finalized and is scheduled to begin late in 2021 and continue into 2022. Specific timing will vary by device. Certain features require specific hardware, see https:&#x2F;&#x2F;www.microsoft.com&#x2F;en-us&#x2F;windows&#x2F;windows-11-specifications.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Windows 10 operating system&lt;&#x2F;p&gt;&lt;p&gt;Windows 10 brings back the Start Menu from Windows 7 and introduces new features, like the Edge Web browser that lets you markup Web pages on your scree&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;15.6&quot; FHD display&lt;&#x2F;p&gt;&lt;p&gt;The 1920x1080 resolution with 240hz refresh and 3ms response time boasts impressive color and clarity. Energy-efficient LED backlight.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;16GB system memory for intense multitasking and gaming&lt;&#x2F;p&gt;&lt;p&gt;Reams of high-bandwidth DDR4 RAM to smoothly run your graphics-heavy PC games and video-editing applications, as well as numerous programs and browser tabs all at once.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;1TB solid-state drive (PCI-e)&lt;&#x2F;p&gt;&lt;p&gt;Save files fast and store more data. With massive amounts of storage and advanced communication power, PCI-e NVMe SSDs are great for major gaming applications, multiple servers, daily backups, and more.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;AMD Radeon RX6700M graphics&lt;&#x2F;p&gt;&lt;p&gt;Backed by 10GB GDDR6 dedicated video memory for an ultrafast, advanced GPU to fuel your games.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;Xbox Game Pass Ultimate - Discover your next favorite game.&lt;&#x2F;p&gt;&lt;p&gt;1 month of Xbox Game Pass Ultimate included. Play over 100 high-quality games on Windows 10, console and mobile. Includes new day one titles, iconic Bethesda games and EA Play on PC.&lt;&#x2F;p&gt;",
    images: [
      {
        public_id: "1_vzbc2b",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638941027/ecomm_seeds/msi_delta/1_vzbc2b.jpg",
      },
      {
        public_id: "2_n38wam",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638941027/ecomm_seeds/msi_delta/2_n38wam.jpg",
      },
      {
        public_id: "3_vk5k5p",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638941027/ecomm_seeds/msi_delta/3_vk5k5p.jpg",
      },
      {
        public_id: "4_f0qn6v",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1638941027/ecomm_seeds/msi_delta/4_f0qn6v.jpg",
      },
    ],
    price: 1599.99,
    quantity: 0,
    ratings: [
      {
        star: 4,
        postedBy: adminUser,
      },
    ],
    slug: "msi-delta-15",
    sold: 9,
    subs: [gamingSub],
    title: "MSI Delta 15",
  }).save();

  await new Product({
    brand: dellBrand,
    category: windows,
    colors: ["Gray"],
    description:
      "&lt;p&gt;Experience the thrill of the game with the new Dell G15 gaming laptop. Featuring AMD® Ryzen processors, NVIDIA® GeForce® graphics, improved thermal design and Game Shift technology.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Windows 11&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Windows 11 has all the power and security of Windows 10 with a redesigned and refreshed look. It also comes with new tools, sounds, and apps. Every detail has been considered. All of it comes together to bring you a refreshing experience on your PC&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;15.6&quot; FHD Display&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;1920 x 1080 resolution showcases your games and HD movies with impressive color and clarity. Antireflective finish reduces eyestrain and widens the field of view.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;AMD Ryzen 7 5800H&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Imagine, design and create without boundaries. The powerful AMD Ryzen tm 7 processor features machine intelligence that anticipates your needs. Discover true responsiveness with 8 cores and 16 threads for ultimate performance.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;8GB system memory for advanced multitasking&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Substantial high-bandwidth RAM to smoothly run your games and photo- and video-editing applications, as well as multiple programs and browser tabs all at once.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;512GB solid state drive (SSD)&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;While offering less storage space than a hard drive, a flash-based SSD has no moving parts, resulting in faster start-up times and data access, no noise, and reduced heat production and power draw on the battery.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;NVIDIA GeForce RTX 3050 Ti graphics&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Backed by 4GB GDDR6 dedicated video memory for a fast, advanced GPU to fuel your games. NVIDIA Optimus technology optimizes the laptop for both graphics performance and battery life conservation.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Improved Thermal Design with Dual Fans&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Dual air intake flowing into dual fans expelling through 4 vents - 2 on the back and 2 on the sides.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Wireless&#x2F;Wired connectivity&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Flexible, dual-band connectivity w&#x2F; greater reliability thanks to two data streams and antennas.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Built-in HD webcam with microphone&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Makes it easy to video chat with family and friends or teleconference with colleagues over Skype or other popular applications.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Backlit keyboard&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;The streamlined design embeds a fingerprint reader in the power button and a new keyboard.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Game Shift technology&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Game Shift triggers a dynamic performance mode within the Alienware Command Center with one press of the Game Shift key.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Basic software package included&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;1-month trial of Microsoft Office 365 and McAfee LiveSafe 30 Day Trial&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Xbox Game Pass Ultimate - Discover your next favorite game.&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;1 month of Xbox Game Pass Ultimate included. Play over 100 high-quality games on Windows 10, console and mobile. Includes new day one titles, iconic Bethesda games and EA Play on PC.&lt;&#x2F;p&gt;",
    images: [
      {
        public_id: "1_yvaf52",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1639163056/ecomm_seeds/Dell_G15/1_yvaf52.jpg",
      },
      {
        public_id: "2_fk8p7t",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1639163056/ecomm_seeds/Dell_G15/2_fk8p7t.jpg",
      },
      {
        public_id: "3_hyflzl",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1639163056/ecomm_seeds/Dell_G15/3_hyflzl.jpg",
      },
      {
        public_id: "4_lv0wie",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1639163056/ecomm_seeds/Dell_G15/4_lv0wie.jpg",
      },
    ],
    price: 1149.99,
    quantity: 38,
    ratings: [
      {
        star: 5,
        postedBy: adminUser,
      },
      {
        star: 3,
        postedBy: testUser,
      },
    ],
    slug: "dell-g15",
    sold: 17,
    subs: [gamingSub],
    title: "Dell G15",
  }).save();

  await new Product({
    brand: asusBrand,
    category: windows,
    colors: ["Gray"],
    description:
      "&lt;p&gt;&lt;span style=&quot;color: rgb(4, 12, 19);&quot;&gt;ASUS ROG Zephyrus Gaming Laptop. Enjoy everyday gaming with this ASUS notebook PC. The AMD Ryzen 9-5900HS processor and 16GB of RAM let you run graphics-heavy games smoothly, while the potent NVIDIA GeForce RTX 3080 graphics produce high-quality visuals on the fast 15.6-inch 165hz QHD display. This ASUS ROG notebook PC has 1TB SSD that shortens load times and offers ample storage.&lt;&#x2F;span&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Windows 10 operating system&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Windows 10 brings back the Start Menu from Windows 7 and introduces new features, like the Edge Web browser that lets you markup Web pages on your screen.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;15.6&quot; QHD display with 165Hz refresh rate and 3ms response time&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;2560 x 1440 resolution with DCI-P3 boasts impressive color and clarity. Energy-efficient LED backlight.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;16GB system memory for intense multitasking and gaming&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Reams of high-bandwidth DDR4 RAM to smoothly run your graphics-heavy PC games and video-editing applications, as well as numerous programs and browser tabs all at once.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;1TB Solid State Drive (PCIe)&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Save files fast and store more data. With massive amounts of storage and advanced communication power, PCIe SSDs are great for major gaming applications, multiple servers, daily backups, and more.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;NVIDIA GeForce RTX 3080 graphics&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Backed by 8GB GDDR6 dedicated video memory for an ultrafast, advanced GPU to fuel your games.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Virtual Reality Ready&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;This computer has the required specs to run Virtual Reality hardware and software and is compatible with Oculus Rift, HTC Vive, and Windows Mixed Reality Ultra.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Six speakers powered by Dolby Atmos technology&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Lush Dolby Atmos audio from six speakers with force cancelling woofers put you in the center of the action.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Weighs 4.19 lbs. and measures 0.78&quot; thin&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Thin and light for maximum portability, featuring a 15.6&quot; screen size and omitting the DVD&#x2F;CD drive to achieve the compact form factor. 4-cell 90WHr lithium-ion battery.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;HDMI 2.0b output expands your viewing options&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Connect to an HDTV or high-def monitor to set up two screens side by side or just see more of the big picture.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Wireless&#x2F;Wired connectivity (WiFi 6 - 802.11 ax)&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Flexible, dual-band connectivity w&#x2F; greater reliability thanks to two data streams and antennas. Connect to a Wi-Fi router to experience GB Wi-Fi speeds nearly 3X faster vs. standard Wi-Fi 5 w&#x2F; improved responsiveness for even more devices.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Single-zone RGB Keyboard Backlight&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Allows you to enjoy comfortable and accurate typing, even in dim lighting.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Basic software package included&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;30-days trial of Microsoft Office 365.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Additional ports&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Headphone&#x2F;microphone combo jack. Note: This laptop does not include a built-in DVD&#x2F;CD drive.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Two-Way AI Noise Cancelation with 3D Mic Array&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Two-Way AI Noise Cancelation clarifies upstream and downstream audio, filtering out unwanted noise to make voice communication clearer.&lt;&#x2F;p&gt;&lt;p&gt;&lt;br&gt;&lt;&#x2F;p&gt;&lt;p&gt;&lt;strong&gt;Built-in fingerprint reader&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;&lt;p&gt;Streamlines security settings for quick, typo-free access.&lt;&#x2F;p&gt;",
    images: [
      {
        public_id: "1_nbarpc",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1639163761/ecomm_seeds/Asus_rog/1_nbarpc.jpg",
      },
      {
        public_id: "2_jae2w3",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1639163761/ecomm_seeds/Asus_rog/2_jae2w3.jpg",
      },
      {
        public_id: "3_wf4ngl",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1639163761/ecomm_seeds/Asus_rog/3_wf4ngl.jpg",
      },
      {
        public_id: "4_lqwyur",
        url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1639163762/ecomm_seeds/Asus_rog/4_lqwyur.jpg",
      },
    ],
    price: 2199.9,
    quantity: 14,
    ratings: [
      {
        star: 3,
        postedBy: adminUser,
      },
      {
        star: 5,
        postedBy: testUser,
      },
    ],
    slug: "asus-rog-zephyrus",
    sold: 4,
    subs: [gamingSub],
    title: "ASUS ROG Zephyrus",
  }).save();
};

module.exports = createProducts;
