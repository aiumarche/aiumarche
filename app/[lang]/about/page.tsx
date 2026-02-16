"use client";

import { useEffect, useState, use } from "react";
import { createClient } from "microcms-js-sdk";

const client = createClient({
  serviceDomain: "aiumarche",
  apiKey: "F8ms5r1H7MEOHCcR3DiwONlbqOmvlnLMQig4", 
});

export default function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = use(params);
  const currentLang = resolvedParams.lang as 'jp' | 'en';
  const isEn = currentLang === 'en';

  const [aboutContents, setAboutContents] = useState<any[]>([]);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get({ 
      endpoint: "about",
      queries: { limit: 100 } 
    }).then((res: any) => {
      const contents = res.contents || [];
      setAboutContents(contents);

      let foundTimeline: any[] = [];
      for (const article of contents) {
        if (article.event && Array.isArray(article.event)) {
          foundTimeline = article.event.map((item: any) => {
            const d = item.timeline || item;
            return {
              year: d.year || "",
              month: d.month || "",
              day: d.day || "",
              text: d.text || "",
              text_en: d.text_en || item.text_en || "", 
              image: d.image || null,
              link: d.link || ""
            };
          });

          foundTimeline.sort((a, b) => {
            if (a.year !== b.year) return Number(a.year) - Number(b.year);
            if (a.month !== b.month) return Number(a.month) - Number(b.month);
            return Number(a.day) - Number(b.day);
          });
          
          if (foundTimeline.length > 0) break;
        }
      }

      setTimelineData(foundTimeline);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>;

  return (
    <div style={{ 
      backgroundColor: '#fff', 
      minHeight: '100vh', 
      fontFamily: '"Shippori Mincho", "Sawarabi Mincho", serif' 
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .rich-content h3 { color: #2d5a27 !important; font-size: 1.4rem !important; margin: 40px 0 20px !important; font-weight: bold !important; display: flex !important; align-items: center !important; }
        .rich-content h3::before { content: "" !important; width: 6px !important; height: 1.2em !important; background-color: #bd5532 !important; margin-right: 15px !important; border-radius: 2px !important; }
        .rich-content table { width: 100% !important; border-collapse: collapse !important; margin-bottom: 30px !important; }
        .rich-content tr { border-bottom: 1px solid #f0f0f0 !important; }
        .rich-content td { padding: 18px 0 !important; color: #444 !important; font-size: 1rem !important; }
        .rich-content td:first-child { width: 35% !important; font-weight: bold !important; color: #2d5a27 !important; }
        .rich-content p { line-height: 2.1 !important; margin-bottom: 1.5em !important; }
        
        /* 🌟 追加したスタイル：マウスを乗せた時に浮き上がらせる */
        .timeline-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.12) !important;
        }
      `}} />

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px' }}>
        <h1 style={{ textAlign: 'center', color: '#2d5a27', fontSize: '2.5rem', marginBottom: '80px', fontWeight: 'bold', letterSpacing: '0.2em' }}>ABOUT</h1>
        
       {/* 1. AIUマルシェとは？ */}
{aboutContents.length > 0 && (
  <section style={{ marginBottom: '100px', padding: '0 20px' }}>
    <div className="rich-content" dangerouslySetInnerHTML={{ 
      __html: isEn 
        ? (aboutContents[0].about_english?.content_en || aboutContents[0].about_en_fields?.content_en || aboutContents[0].about) 
        : aboutContents[0].about 
    }} />
  </section>
)}

        {/* 2. 代表挨拶 */}
{aboutContents.length > 1 && (
  <section style={{ 
    background: '#fff', padding: '50px 60px', borderRadius: '40px', 
    boxShadow: '0 20px 60px rgba(0,0,0,0.05)', border: '1px solid #f5f5f5', marginBottom: '80px'
  }}>
    <div className="rich-content" dangerouslySetInnerHTML={{ 
      __html: isEn 
        ? (aboutContents[1].about_english?.content_en || aboutContents[1].about_en_fields?.content_en || aboutContents[1].about) 
        : aboutContents[1].about 
    }} />
  </section>
)}

        {/* 3. 団体概要・実績 */}
{aboutContents.length > 2 && (
  <section style={{ 
    background: '#fff', padding: '50px 60px', borderRadius: '40px', 
    boxShadow: '0 20px 60px rgba(0,0,0,0.05)', border: '1px solid #f5f5f5', marginBottom: '120px'
  }}>
    <div className="rich-content" dangerouslySetInnerHTML={{ 
      __html: isEn 
        ? (aboutContents[2].about_english?.content_en || aboutContents[2].about_en_fields?.content_en || aboutContents[2].about) 
        : aboutContents[2].about 
    }} />
  </section>
)}

        {/* 4. 歩み（タイムライン） */}
        <h2 style={{ textAlign: 'center', color: '#2d5a27', fontSize: '1.8rem', margin: '100px 0 10px', fontWeight: 'bold' }}>
          {isEn ? "History of AIU Marche" : "AIUマルシェの歩み"}
        </h2>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', marginBottom: '50px' }}>
          {isEn ? "Click the cards to see our activities on Instagram." : "各イベントのカードをクリックすると、Instagramで詳しくご覧いただけます。"}
        </p>
        
        <div style={{ position: 'relative', minHeight: '300px' }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '4px', backgroundColor: '#bd5532', transform: 'translateX(-50%)' }}></div>
          {timelineData.map((d: any, index: number) => {
            const isLeft = index % 2 === 0;
            const showYear = index === 0 || d.year !== timelineData[index - 1].year;
            return (
              <div key={index}>
                {showYear && d.year && (
                  <div style={{ textAlign: 'center', marginBottom: '50px', position: 'relative', zIndex: 3 }}>
                    <span style={{ backgroundColor: '#bd5532', color: '#fff', padding: '8px 28px', borderRadius: '50px', fontWeight: 'bold' }}>{d.year}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: isLeft ? 'flex-start' : 'flex-end', width: '100%', marginBottom: '80px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '50%', top: '30px', width: '22px', height: '22px', backgroundColor: '#fff', border: '4px solid #bd5532', borderRadius: '50%', transform: 'translateX(-50%)', zIndex: 2 }}></div>
                  <div 
                    onClick={() => d.link && window.open(d.link, '_blank')}
                    className="timeline-card" // クラス名を追加
                    style={{ 
                      width: '40%', 
                      background: '#fff', 
                      padding: '30px', 
                      borderRadius: '25px', 
                      boxShadow: '0 15px 40px rgba(0,0,0,0.06)', 
                      border: '1px solid #eee', 
                      zIndex: 2,
                      cursor: d.link ? 'pointer' : 'default',
                      transition: 'all 0.3s ease', // 変化をなめらかにする
                    }}
                  >
                    <div style={{ marginBottom: '15px' }}>
                      <span style={{ backgroundColor: '#2d4e3d', color: '#fff', padding: '6px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                        {isEn ? `${d.month}/${d.day}` : `${d.month}月${d.day && `${d.day}日`}`}
                      </span>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: isEn && d.text_en ? d.text_en : d.text }} style={{ fontSize: '1rem', color: '#333', lineHeight: '1.9' }} />
                    {d.image?.url && <img src={d.image.url} alt="" style={{ width: '100%', borderRadius: '15px', marginTop: '20px' }} />}
                    {d.link && (
                      <div style={{ marginTop: '25px', textAlign: 'right' }}>
                        <span style={{ padding: '10px 22px', borderRadius: '50px', backgroundColor: '#f9f9f9', color: '#2d5a27', fontSize: '0.8rem', fontWeight: 'bold', border: '1px solid #eee' }}>
                          {isEn ? "See Details →" : "詳細を見る →"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}