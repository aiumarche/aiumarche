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
  
  // 🌟 変更：配列にして、複数を同時保持できるようにします
  const [activeTabs, setActiveTabs] = useState<string[]>(["学外出店者", "学内出店者", "キッチンカー"]);

  useEffect(() => {
    client.get({ endpoint: "shops", queries: { limit: 100 } })
      .then((res) => {
        setShops(res.contents || []);
        setLoading(false);
      });
  }, []);

  const tabs = [
    { id: "学外出店者", ja: "学外出店者", en: "External" },
    { id: "学内出店者", ja: "学内出店者", en: "AIU Students" },
    { id: "キッチンカー", ja: "キッチンカー", en: "Food Trucks" },
  ];

  // 🌟 変更：クリックした時の処理（既にあれば消す、なければ追加する）
  const toggleTab = (tabId: string) => {
    if (activeTabs.includes(tabId)) {
      // 1つだけは必ず選択されている状態にする（全部消えるのを防ぐ）
      if (activeTabs.length > 1) {
        setActiveTabs(activeTabs.filter(t => t !== tabId));
      }
    } else {
      setActiveTabs([...activeTabs, tabId]);
    }
  };

  // 🌟 変更：選択されている全てのカテゴリのショップをまとめる
  const filteredShops = shops.filter(shop => {
    const cat = shop.category;
    if (!cat) return false;
    const shopCats = Array.isArray(cat) ? cat : [cat];
    return shopCats.some(c => activeTabs.includes(c));
  });

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
        @media (max-width: 768px) {
          .shops-main { padding: 60px 15px; }
          .tab-button { padding: 8px 15px; font-size: 0.8rem; }
        }
      `}} />

      <main className="shops-main" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 className="shops-title" style={{ color: '#2d5a27', fontWeight: 'bold', letterSpacing: '0.2em' }}>SHOPS</h1>
          <div style={{ width: '60px', height: '3px', backgroundColor: '#bd5532', margin: '0 auto', marginTop: '15px' }}></div>
        </div>

        {/* 複数選択タブ */}
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
          
          {/* 🌟 全選択/解除を簡単にするためのボタン */}
          <button 
            onClick={() => setActiveTabs(tabs.map(t => t.id))}
            style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}
          >
            {isEn ? "Select All" : "全選択"}
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>
        ) : (
          <div style={{ padding: '0 10px' }}>
            <div className="shop-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
              {filteredShops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} isEn={isEn} />
              ))}
            </div>
            {filteredShops.length === 0 && (
              <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>{isEn ? "No items selected" : "表示する項目がありません"}</p>
            )}
          </div>
        )}
        
        {/* タイムテーブル・マップセクションはそのまま下に表示 */}
        {/* ... (中略：以前のコードと同じため、ファイル全体に貼り付ける際は上のコードを参考にしてください) ... */}

      </main>
      
      {/* 画像拡大モーダルもそのまま保持 */}
      {/* ... */}
    </div>
  );
}

// ShopSectionを介さず直接Gridを出す形にスッキリさせました
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