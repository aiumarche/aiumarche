"use client";

import { use, useState, useEffect } from "react";
import { createClient } from "microcms-js-sdk";

const client = createClient({
  serviceDomain: "aiumarche",
  apiKey: "F8ms5r1H7MEOHCcR3DiwONlbqOmvlnLMQig4", 
});

export default function ShopsPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = use(params);
  const isEn = resolvedParams.lang === 'en';
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 🌟 拡大画像用のステート
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    client.get({ endpoint: "shops", queries: { limit: 100 } })
      .then((res) => {
        setShops(res.contents || []);
        setLoading(false);
      });
  }, []);

  const getByCategory = (catName: string) => shops.filter(shop => {
    const cat = shop.category;
    if (!cat) return false;
    return Array.isArray(cat) ? cat.includes(catName) : cat === catName;
  });

  const externalShops = getByCategory("学外出店者");
  const internalShops = getByCategory("学内出店者");
  const kitchenCars = getByCategory("キッチンカー");

  // 言語別の画像取得
  const eventData = shops.find(s => (s.timetable_img?.length > 0) || (s.map_img?.length > 0));
  const timetableImages = (isEn && eventData?.timetable_img_en?.length > 0) ? eventData.timetable_img_en : (eventData?.timetable_img || []);
  const mapImages = (isEn && eventData?.map_img_en?.length > 0) ? eventData.map_img_en : (eventData?.map_img || []);

  return (
    <div style={{ backgroundColor: '#f9f8f4', minHeight: '100vh', paddingBottom: '100px', fontFamily: 'serif' }}>
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#2d5a27', fontWeight: 'bold', letterSpacing: '0.2em' }}>SHOPS</h1>
          <div style={{ width: '60px', height: '3px', backgroundColor: '#bd5532', margin: '0 auto', marginTop: '15px' }}></div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>
        ) : (
          <>
            <div style={{ padding: '0 20px' }}>
              <ShopSection title={isEn ? "External Vendors" : "学外出店者"} items={externalShops} isEn={isEn} />
              <ShopSection title={isEn ? "AIU Student Vendors" : "学内出店者"} items={internalShops} isEn={isEn} />
              <ShopSection title={isEn ? "Food Trucks" : "キッチンカー"} items={kitchenCars} isEn={isEn} />
            </div>

            {/* 🌟 タイムテーブル＆マップ：横並びセクション */}
            {(timetableImages.length > 0 || mapImages.length > 0) && (
              <div style={{ marginTop: '100px', padding: '0 20px' }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                  gap: '30px' 
                }}>
                  
                  {/* タイムテーブル */}
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '1.3rem', color: '#2d5a27', fontWeight: 'bold', marginBottom: '20px', borderLeft: '5px solid #bd5532', paddingLeft: '12px' }}>
                      {isEn ? "Time Table" : "タイムテーブル"}
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                      {timetableImages.map((img: any, i: number) => (
                        <div key={i} onClick={() => setSelectedImg(img.url)} style={thumbContainerStyle}>
                          <img src={img.url} alt="" style={thumbImgStyle} />
                          <div style={zoomOverlayStyle}>Click to Zoom</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 会場マップ */}
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '1.3rem', color: '#2d5a27', fontWeight: 'bold', marginBottom: '20px', borderLeft: '5px solid #bd5532', paddingLeft: '12px' }}>
                      {isEn ? "Venue Map" : "会場マップ"}
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                      {mapImages.map((img: any, i: number) => (
                        <div key={i} onClick={() => setSelectedImg(img.url)} style={thumbContainerStyle}>
                          <img src={img.url} alt="" style={thumbImgStyle} />
                          <div style={zoomOverlayStyle}>Click to Zoom</div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* 🌟 拡大表示用モーダル */}
      {selectedImg && (
        <div 
          onClick={() => setSelectedImg(null)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, cursor: 'zoom-out', padding: '20px'
          }}
        >
          <img 
            src={selectedImg} 
            alt="Expanded" 
            style={{ maxWidth: '95%', maxHeight: '95%', objectFit: 'contain', borderRadius: '10px' }} 
          />
          <div style={{ position: 'absolute', top: '20px', right: '20px', color: '#fff', fontSize: '2rem' }}>×</div>
        </div>
      )}
    </div>
  );
}

// --- スタイル定義 ---
const thumbContainerStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  maxWidth: '320px', // 小さく表示
  height: '240px',
  borderRadius: '15px',
  overflow: 'hidden',
  cursor: 'zoom-in',
  boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
  backgroundColor: '#fff',
  border: '1px solid #eee'
};

const thumbImgStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover', // 枠内に収める
  transition: 'transform 0.3s ease'
};

const zoomOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0, left: 0, width: '100%',
  backgroundColor: 'rgba(45, 90, 39, 0.7)',
  color: '#fff',
  fontSize: '0.75rem',
  textAlign: 'center',
  padding: '5px 0',
  opacity: 0.9
};

// --- ShopSection と ShopCard は以前のコードを維持 ---
function ShopSection({ title, items, isEn }: { title: string, items: any[], isEn: boolean }) {
  if (items.length === 0) return null;
  return (
    <section style={{ marginBottom: '80px' }}>
      <h2 style={{ fontSize: '1.5rem', color: '#2d5a27', fontWeight: 'bold', marginBottom: '30px', borderLeft: '6px solid #bd5532', paddingLeft: '15px' }}>
        {title}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
        {items.map((shop) => (
          <ShopCard key={shop.id} shop={shop} isEn={isEn} />
        ))}
      </div>
    </section>
  );
}

function ShopCard({ shop, isEn }: { shop: any, isEn: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const name = isEn ? (shop.name_en || shop.name) : shop.name;
  const description = isEn ? (shop.description_en || shop.description) : shop.description;
  const imageUrl = Array.isArray(shop.image) ? shop.image[0]?.url : shop.image?.url;
  const targetLink = shop.link || "";
  const typeValue = Array.isArray(shop.type) ? shop.type[0] : shop.type;

  let cardBgColor = '#fff';
  let labelText = '';
  let labelBgColor = '#666';

  if (typeValue === 'Food') { cardBgColor = '#fff9f0'; labelText = 'Food'; labelBgColor = '#bd5532'; } 
  else if (typeValue === 'Art') { cardBgColor = '#f0f7ff'; labelText = 'Art'; labelBgColor = '#3273bd'; } 
  else if (typeValue === 'Workshop') { cardBgColor = '#f0fff4'; labelText = 'Workshop'; labelBgColor = '#2d5a27'; }

  return (
    <a 
      href={targetLink || undefined} target={targetLink ? "_blank" : undefined} rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'block', position: 'relative', textDecoration: 'none', color: 'inherit', backgroundColor: cardBgColor,
        borderRadius: '25px', overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
        transform: isHovered ? 'translateY(-12px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 25px 50px rgba(0,0,0,0.1)' : '0 10px 30px rgba(0,0,0,0.03)',
        border: '1px solid #f0f0f0', cursor: targetLink ? 'pointer' : 'default',
      }}
    >
      {labelText && (
        <div style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: labelBgColor, color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', zIndex: 2 }}>
          {labelText}
        </div>
      )}
      <div style={{ width: '100%', height: '220px', overflow: 'hidden', backgroundColor: '#eee' }}>
        <img src={imageUrl || "/no-image.png"} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease', transform: isHovered ? 'scale(1.05)' : 'scale(1)' }} />
      </div>
      <div style={{ padding: '25px' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#2d5a27', fontWeight: 'bold', marginBottom: '10px' }}>{name}</h3>
        <div style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </a>
  );
}