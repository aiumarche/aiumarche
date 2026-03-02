"use client";

import { useEffect, useState, use } from "react"; // 🌟 use を追加
import Link from "next/link";
import { createClient } from "microcms-js-sdk";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

const client = createClient({
  serviceDomain: "aiumarche",
  apiKey: "F8ms5r1H7MEOHCcR3DiwONlbqOmvlnLMQig4",
});

// 🌟 params を受け取れるように変更
export default function Home({ params }: { params: Promise<{ lang: string }> }) {
  // 🌟 URLの lang (jp または en) を取得
  const resolvedParams = use(params);
  const currentLang = resolvedParams.lang as 'jp' | 'en';
  const isEn = currentLang === 'en';

  const [news, setNews] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [bgImages, setBgImages] = useState<any[]>([]);
  const [navItems, setNavItems] = useState<any[]>([]);

 useEffect(() => {
  client.get({ endpoint: "news" }).then((res) => setNews(res.contents));
  client.get({ endpoint: "eventinfo" }).then((res) => setEvents(res.contents));
  client.get({ endpoint: "nav-menu" }).then((res) => setNavItems(res.contents));

  // 🌟 ここを ABOUT から取得するように修正
  client.get({
    endpoint: "about",
    contentId: "mhror8idq5ov"
  })
  .then((res: any) => {
    // res.eyecatch に画像配列が入っているので、そのままセット
    if (res && res.eyecatch) {
      setBgImages(res.eyecatch);
    }
  })
  .catch((err) => console.error("背景画像の取得に失敗しました:", err));
}, []);

  const priceRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 0',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '1rem',
    color: '#444'
  };

  return (
    <div style={{ position: 'relative', zIndex: 1, backgroundColor: '#fff', minHeight: '100vh' }}>

      {/* 📸 メイン写真 ＆ 🟠 ボタン */}
<section style={{ position: 'relative', width: '100%', height: '70vh', overflow: 'hidden', backgroundColor: '#f9f9f9' }}> {/* 🌟 背景色を薄く付けておく */}
  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
    {bgImages.length > 0 && (
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        style={{ width: '100%', height: '100%' }}
      >
        {bgImages.map((img, index) => (
          <SwiperSlide key={index}>
            <div style={{
              width: '100%',
              height: '100%',
              // 🌟 修正：転送量を減らすために ?w=1400&q=80 を追加
              backgroundImage: `url(${img.url}?w=1400&q=80)`, 
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.6,
              transition: 'opacity 1s ease-in-out'
            }}></div>
          </SwiperSlide>
        ))}
      </Swiper>
    )}
  </div>

        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, textAlign: 'center', width: '100%' }}>
          <h1 style={{
            fontSize: '2.4rem',
            color: '#2d5a27',
            fontWeight: 'bold',
            marginBottom: '20px',
            textShadow: '0 0 10px rgba(255, 255, 255, 1), 0 0 5px rgba(255, 255, 255, 1)',
            fontFamily: '"Shippori Mincho B1", serif'
          }}>
            {/* 🌟 言語によってテキストを切り替え */}
            {isEn ? (
              <>Where AIU Students, International Students,<br />and the Local Community Meet</>
            ) : (
              <>AIU生、留学生、<br />地域の方々が交わる場所</>
            )}
          </h1>
          
          <Link href={`/${currentLang}/about`}>
            <button
              style={{
                backgroundColor: '#ebad4e',
                color: '#fff',
                border: 'none',
                padding: '12px 40px',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                fontFamily: 'serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.backgroundColor = '#d69a3a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = '#ebad4e';
              }}
            >
              {isEn ? "About AIU Marché" : "AIUマルシェについて"}
            </button>
          </Link>
        </div>
      </section>

      <main style={{ padding: '80px 10%', background: '#fff' }}>

       {/* 🔴 NEWS セクション */}
<h2 style={{ textAlign: 'center', color: '#2d5a27', marginBottom: '40px', fontFamily: 'serif', letterSpacing: '0.1em' }}>
  NEWS
</h2>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px', marginBottom: '100px' }}>
  {news.map((item) => {
  const displayTitle = isEn && item.title_en ? item.title_en : item.title;

  // 🌟 画像のURLを取得（"images" というフィールド名の場合）
  // microCMSの画像フィールド名に合わせて item.images[0].url または item.image.url に調整してください
  const imageUrl = item.images?.[0]?.url || item.image?.url;

  const displayDate = new Date(item.publishedAt || item.createdAt).toLocaleDateString(
    isEn ? 'en-US' : 'ja-JP',
    { year: 'numeric', month: isEn ? 'short' : '2-digit', day: '2-digit' }
  );

  return (
  <Link 
    // 🌟 カテゴリ（item.category）が存在すればそれを利用し、なければ 'blog' を使う設定
    href={`/${currentLang}/${item.category || 'blog'}/${item.id}`} 
    key={item.id} 
    style={{ textDecoration: 'none', color: 'inherit' }}
  >
    <div
      style={{
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          border: '1px solid #f0f0f0',
          height: '100%',
          overflow: 'hidden', // 画像の角を丸めるために必要
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-10px)';
          e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
        }}
      >
        {/* 🌟 画像がある場合に表示 */}
        {imageUrl && (
          <div style={{ width: '100%', height: '180px', overflow: 'hidden' }}>
            <img 
              src={imageUrl} 
              alt="" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        )}

        <div style={{ padding: '20px' }}>
          <p style={{ color: '#bd5532', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px' }}>
            {displayDate}
          </p>
          <h3 style={{ 
            fontSize: '1rem', 
            color: '#2d5a27', 
            lineHeight: '1.5',
            margin: 0,
            fontFamily: 'serif' 
          }}>
            {displayTitle}
          </h3>
        </div>
      </div>
    </Link>
  );
})}
</div>

        {/* 🔴 EVENT INFO セクション */}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', color: '#2d5a27', marginBottom: '40px', fontFamily: 'serif', letterSpacing: '0.1em' }}>EVENT INFO</h2>
          
          {events.length > 0 && (
            <div style={{ 
              backgroundColor: '#fff', 
              padding: '60px 40px', 
              borderRadius: '20px', 
              boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
              border: '1px solid #f5f5f5',
              fontFamily: 'serif'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
  <p style={{ fontSize: '0.85rem', color: '#bd5532', fontWeight: 'bold', marginBottom: '10px', letterSpacing: '0.1em' }}>DATE & PLACE</p>
  
  {/* 🌟 日付 */}
  <p style={{ fontSize: '1.5rem', color: '#333', margin: '10px 0' }}>
    {isEn ? (events[0].english_info?.date_en || events[0].date) : events[0].date}
  </p>

  {/* 🌟 時間 */}
  <p style={{ fontSize: '1.5rem', color: '#333', margin: '10px 0' }}>
    {isEn ? (events[0].english_info?.time_en || events[0].time) : events[0].time}
  </p>

  {/* 🌟 場所 */}
  <p style={{ fontSize: '1.1rem', color: '#555', marginTop: '20px' }}>
    {isEn ? (events[0].english_info?.place_en || events[0].place) : events[0].place}
  </p>

  {/* 🌟 補足事項 */}
  <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '10px' }}>
    {isEn ? (events[0].english_info?.note_en || events[0].note) : events[0].note}
  </p>
</div>

              <div style={{ maxWidth: '500px', margin: '0 auto', borderTop: '2px solid #f9f8f4', paddingTop: '40px' }}>
                <p style={{ fontSize: '0.85rem', color: '#bd5532', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center', letterSpacing: '0.1em' }}>VENDOR FEE</p>
                
                <div style={priceRowStyle}>
                  <span>{isEn ? "External Vendors" : "学外出店"}</span>
                  <span>{isEn && events[0].fee_outer_en ? events[0].fee_outer_en : events[0].fee_outer}</span>
                </div>
                <div style={priceRowStyle}>
                  <span>{isEn ? "Internal (Food)" : "学内出店 (Food)"}</span>
                  <span>{isEn && events[0].fee_inner_food_en ? events[0].fee_inner_food_en : events[0].fee_inner_food}</span>
                </div>
                <div style={priceRowStyle}>
                  <span>{isEn ? "Internal (Other)" : "学内出店 (その他)"}</span>
                  <span>{isEn && events[0].fee_inner_other_en ? events[0].fee_inner_other_en : events[0].fee_inner_other}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}