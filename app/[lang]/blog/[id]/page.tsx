"use client";

import { useEffect, useState, use } from "react";
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

export default function Home({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = use(params);
  const currentLang = (resolvedParams.lang || 'jp') as 'jp' | 'en';
  const isEn = currentLang === 'en';

  const [news, setNews] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [bgImages, setBgImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      client.get({ endpoint: "news" }),
      client.get({ endpoint: "eventinfo" }),
      client.get({ endpoint: "about", contentId: "yn0i5llt8k" })
    ]).then(([newsRes, eventRes, aboutRes]) => {
      setNews(newsRes.contents || []);
      setEvents(eventRes.contents || []);
      if (aboutRes && aboutRes.eyecatch) {
        setBgImages(aboutRes.eyecatch);
      }
      setLoading(false);
    }).catch((err) => {
      console.error("データ取得エラー:", err);
      setLoading(false);
    });
  }, []);

  const priceRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 0',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '1rem',
    color: '#444'
  };

  if (loading) {
    return <div style={{ padding: "100px", textAlign: "center", fontFamily: "serif" }}>Loading...</div>;
  }

  return (
    <div style={{ position: 'relative', zIndex: 1, backgroundColor: '#fff', minHeight: '100vh' }}>

      {/* 📸 メインビジュアル */}
      <section style={{ position: 'relative', width: '100%', height: '70vh', overflow: 'hidden', backgroundColor: '#eee' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
          {bgImages.length > 0 && (
            <Swiper
              modules={[Autoplay, EffectFade]}
              effect="fade"
              loop={true}
              autoplay={{ delay: 3000 }}
              style={{ width: '100%', height: '100%' }}
            >
              {bgImages.map((img, index) => (
                <SwiperSlide key={index}>
                  <div style={{
                    width: '100%', height: '100%',
                    backgroundImage: `url(${img.url})`,
                    backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.6
                  }}></div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, textAlign: 'center', width: '100%' }}>
          <h1 style={{ fontSize: '2.4rem', color: '#2d5a27', fontWeight: 'bold', marginBottom: '20px', textShadow: '0 0 10px #fff', fontFamily: 'serif' }}>
            {isEn ? <>Where AIU Students, International Students,<br />and the Local Community Meet</> : <>AIU生、留学生、<br />地域の方々が交わる場所</>}
          </h1>
          <Link href={`/${currentLang}/about`}>
            <button style={{ backgroundColor: '#ebad4e', color: '#fff', border: 'none', padding: '12px 40px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }}>
              {isEn ? "About AIU Marché" : "AIUマルシェについて"}
            </button>
          </Link>
        </div>
      </section>

      <main style={{ padding: '80px 10%', background: '#fff' }}>

        {/* 🔴 NEWS セクション */}
        <h2 style={{ textAlign: 'center', color: '#2d5a27', marginBottom: '40px', fontFamily: 'serif' }}>NEWS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px', marginBottom: '100px' }}>
          {news.map((item) => (
            <Link href={`/${currentLang}/blog/${item.id}`} key={item.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
                {(item.img?.[0]?.url || item.images?.[0]?.url) && (
                  <img src={item.img?.[0]?.url || item.images?.[0]?.url} alt="" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                )}
                <div style={{ padding: '20px' }}>
                  <p style={{ color: '#bd5532', fontSize: '0.8rem', fontWeight: 'bold' }}>{new Date(item.publishedAt).toLocaleDateString()}</p>
                  <h3 style={{ fontSize: '1rem', color: '#2d5a27', fontFamily: 'serif' }}>{isEn ? (item.title_en || item.title) : item.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 🔴 EVENT INFO セクション */}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', color: '#2d5a27', marginBottom: '40px', fontFamily: 'serif' }}>EVENT INFO</h2>
          {events.length > 0 && (
            <div style={{ backgroundColor: '#fff', padding: '60px 40px', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid #f5f5f5', fontFamily: 'serif' }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                
                {/* 🌟 ポスター画像の安全な表示 */}
                {(isEn ? (events[0].poster_en?.url || events[0].poster?.url) : events[0].poster?.url) && (
                  <div style={{ marginBottom: '40px' }}>
                    <img 
                      src={isEn ? (events[0].poster_en?.url || events[0].poster?.url) : events[0].poster?.url} 
                      alt="Event Poster" 
                      style={{ maxWidth: '100%', maxHeight: '600px', borderRadius: '15px' }} 
                    />
                  </div>
                )}

                <p style={{ fontSize: '0.85rem', color: '#bd5532', fontWeight: 'bold' }}>DATE & PLACE</p>
                <p style={{ fontSize: '1.5rem', color: '#333' }}>{isEn ? (events[0].english_info?.date_en || events[0].date) : events[0].date}</p>
                <p style={{ fontSize: '1.5rem', color: '#333' }}>{isEn ? (events[0].english_info?.time_en || events[0].time) : events[0].time}</p>
                <p style={{ fontSize: '1.1rem', color: '#555' }}>{isEn ? (events[0].english_info?.place_en || events[0].place) : events[0].place}</p>
              </div>

              <div style={{ maxWidth: '500px', margin: '0 auto', borderTop: '2px solid #f9f8f4', paddingTop: '40px' }}>
                <p style={{ fontSize: '0.85rem', color: '#bd5532', fontWeight: 'bold', textAlign: 'center' }}>VENDOR FEE</p>
                <div style={priceRowStyle}>
                  <span>{isEn ? "External" : "学外出店"}</span>
                  <span>{isEn ? (events[0].fee_outer_en || events[0].fee_outer) : events[0].fee_outer}</span>
                </div>
                <div style={priceRowStyle}>
                  <span>{isEn ? "Internal (Food)" : "学内出店 (Food)"}</span>
                  <span>{isEn ? (events[0].fee_inner_food_en || events[0].fee_inner_food) : events[0].fee_inner_food}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}