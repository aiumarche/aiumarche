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
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  
  const [activeTabs, setActiveTabs] = useState<string[]>(["学外出店者", "学内出店者", "キッチンカー"]);

  useEffect(() => {
    client.get({ endpoint: "shops", queries: { limit: 100 } })
      .then((res) => {
        // 🌟 修正：出店者データ（categoryがあるもの）だけをカウントの対象にする
        const shopContents = res.contents?.filter((item: any) => item.category) || [];
        setShops(res.contents || []);
        setLoading(false);
      });
  }, []);

  const tabs = [
    { id: "学外出店者", ja: "学外出店者", en: "External" },
    { id: "学内出店者", ja: "学内出店者", en: "AIU Students" },
    { id: "キッチンカー", ja: "キッチンカー", en: "Food Trucks" },
  ];

  const toggleTab = (tabId: string) => {
    if (activeTabs.includes(tabId)) {
      if (activeTabs.length > 1) {
        setActiveTabs(activeTabs.filter(t => t !== tabId));
      }
    } else {
      setActiveTabs([...activeTabs, tabId]);
    }
  };

  // 出店データがあるかどうかを確認
  const hasShops = shops.some(shop => shop.category);

  const eventData = shops.find(s => (s.timetable_img?.length > 0) || (s.map_img?.length > 0));
  const timetableImages = (isEn && eventData?.timetable_img_en?.length > 0) ? eventData.timetable_img_en : (eventData?.timetable_img || []);
  const mapImages = (isEn && eventData?.map_img_en?.length > 0) ? eventData.map_img_en : (eventData?.map_img || []);

  return (
    <div style={{ backgroundColor: '#f9f8f4', minHeight: '100vh', paddingBottom: '100px', fontFamily: 'serif' }}>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .shops-main { padding: 80px 20px; }
        .shops-title { font-size: 2.5rem; }
        .tab-button {
          padding: 10px 25px;
          border-radius: 30px;
          border: 2px solid #2d5a27;
          background: transparent;
          color: #2d5a27;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        .tab-button.active {
          background: #2d5a27;
          color: #fff;
          box-shadow: 0 4px 15px rgba(45, 90, 39, 0.3);
        }
        .coming-soon-box {
          background: #fff;
          border-radius: 20px;
          padding: 80px 40px;
          text-align: center;
          max-width: 600px;
          margin: 40px auto;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          border: 1px solid #eee;
        }
        @media (max-width: 768px) {
          .shops-main { padding: 60px 15px; }
          .coming-soon-box { padding: 60px 20px; margin: 20px auto; }
        }
      `}} />

      <main className="shops-main" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 className="shops-title" style={{ color: '#2d5a27', fontWeight: 'bold', letterSpacing: '0.2em' }}>SHOPS</h1>
          <div style={{ width: '60px', height: '3px', backgroundColor: '#bd5532', margin: '0 auto', marginTop: '15px' }}></div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>
        ) : !hasShops ? (
          /* 🌟 修正：ショップデータが一件もない時の Coming Soon 表示 */
          <div className="coming-soon-box">
            <h2 style={{ fontSize: '2.5rem', color: '#2d5a27', marginBottom: '20px' }}>Coming Soon</h2>
            <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.8' }}>
              {isEn 
                ? "Shop information is currently being prepared.\nPlease stay tuned for updates!" 
                : "出店情報は現在準備中です。\n公開まで今しばらくお待ちください。"}
            </p>
          </div>
        ) : (
          <>
            {/* カテゴリ選択タブ */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '50px', flexWrap: 'wrap' }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTabs.includes(tab.id) ? 'active' : ''}`}
                  onClick={() => toggleTab(tab.id)}
                >
                  {activeTabs.includes(tab.id) ? '✓ ' : ''}
                  {isEn ? tab.en : tab.ja}
                </button>
              ))}
            </div>

            <div style={{ padding: '0 10px' }}>
              {tabs.filter(tab => activeTabs.includes(tab.id)).map(tab => {
                const categoryItems = shops.filter(shop => {
                  const cat = shop.category;
                  if (!cat) return false;
                  return Array.isArray(cat) ? cat.includes(tab.id) : cat === tab.id;
                });

                if (categoryItems.length === 0) return null;

                return (
                  <section key={tab.id} style={{ marginBottom: '80px' }}>
                    <h2 style={{ fontSize: '1.5rem', color: '#2d5a27', fontWeight: 'bold', marginBottom: '30px', borderLeft: '6px solid #bd5532', paddingLeft: '15px' }}>
                      {isEn ? tab.en : tab.ja}
                    </h2>
                    <div className="shop-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                      {categoryItems.map((shop) => (
                        <ShopCard key={shop.id} shop={shop} isEn={isEn} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </>
        )}

        {/* タイムテーブル＆マップはデータがあれば常に表示 */}
        {(timetableImages.length > 0 || mapImages.length > 0) && (
          <div style={{ marginTop: '100px', padding: '0 10px' }}>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              {timetableImages.length > 0 && (
                <div>
                  <h2 style={{ fontSize: '1.3rem', color: '#2d5a27', fontWeight: 'bold', marginBottom: '20px', borderLeft: '5px solid #bd5532', paddingLeft: '12px' }}>
                    {isEn ? "Time Table" : "タイムテーブル"}
                  </h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    {timetableImages.map((img: any, i: number) => (
                      <div key={i} onClick={() => setSelectedImg(img.url)} className="thumb-container" style={thumbContainerStyle}>
                        <img src={img.url} alt="" style={thumbImgStyle} />
                        <div style={zoomOverlayStyle}>Click to Zoom</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {mapImages.length > 0 && (
                <div>
                  <h2 style={{ fontSize: '1.3rem', color: '#2d5a27', fontWeight: 'bold', marginBottom: '20px', borderLeft: '5px solid #bd5532', paddingLeft: '12px' }}>
                    {isEn ? "Venue Map" : "会場マップ"}
                  </h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    {mapImages.map((img: any, i: number) => (
                      <div key={i} onClick={() => setSelectedImg(img.url)} className="thumb-container" style={thumbContainerStyle}>
                        <img src={img.url} alt="" style={thumbImgStyle} />
                        <div style={zoomOverlayStyle}>Click to Zoom</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {selectedImg && (
        <div 
          onClick={() => setSelectedImg(null)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, cursor: 'zoom-out', padding: '20px'
          }}
        >
          <img src={selectedImg} alt="Expanded" style={{ maxWidth: '95%', maxHeight: '95%', objectFit: 'contain', borderRadius: '10px' }} />
        </div>
      )}
    </div>
  );
}

// ... (以下 thumbContainerStyle などの定義と ShopCard 関数は前回と同じ)
const thumbContainerStyle: React.CSSProperties = {
  position: 'relative', width: '100%', maxWidth: '320px', height: '240px',
  borderRadius: '15px', overflow: 'hidden', cursor: 'zoom-in',
  boxShadow: '0 8px 20px rgba(0,0,0,0.08)', backgroundColor: '#fff', border: '1px solid #eee'
};
const thumbImgStyle: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const zoomOverlayStyle: React.CSSProperties = { position: 'absolute', bottom: 0, left: 0, width: '100%', backgroundColor: 'rgba(45, 90, 39, 0.7)', color: '#fff', fontSize: '0.75rem', textAlign: 'center', padding: '5px 0' };

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
  else if (typeValue === 'Performer') { cardBgColor = '#f9f0ff'; labelText = 'Performer'; labelBgColor = '#8e44ad'; }

  return (
    <a 
      href={targetLink || undefined} target={targetLink ? "_blank" : undefined} rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'block', position: 'relative', textDecoration: 'none', color: 'inherit', backgroundColor: cardBgColor,
        borderRadius: '25px', overflow: 'hidden', transition: 'all 0.4s ease',
        transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.1)' : '0 10px 30px rgba(0,0,0,0.03)',
        border: '1px solid #f0f0f0', cursor: targetLink ? 'pointer' : 'default',
      }}
    >
      {labelText && (
        <div style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: labelBgColor, color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', zIndex: 2 }}>
          {labelText}
        </div>
      )}
      <div style={{ width: '100%', height: '220px', overflow: 'hidden' }}>
        <img src={imageUrl || "/no-image.png"} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#2d5a27', fontWeight: 'bold', marginBottom: '10px' }}>{name}</h3>
        <div style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </a>
  );
}