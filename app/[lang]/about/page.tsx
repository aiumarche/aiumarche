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
  const departments = [
    {
      title: isEn ? "Planning & Development (PD) Team" : "『企画開発部』\nPlanning & Development (PD) Team",
      text: isEn 
        ? `**The department responsible for preparing everything needed to hold the market**\n・Setting the schedule leading up to the event\n・Calculating the funds required for the event\n・Coordinating the event schedule with the university\n・Handling all publicity and market-related design\n・Communicating information about the AIU Market` 
        : `**マルシェを行うために必要な準備を行う部署\n・開催するまでのスケジュール決め\n・開催に必要なお金の計算**\n・大学との開催調整\n・広報やマルシェに関するデザイン全般\n・AIUマルシェの情報発信`,
      link: "https://www.instagram.com/aiumarche/p/C39k7aYxXiV/"
    },
    {
      title: isEn ? "AIU Co-Creation (AIU CC) Team" : "『AIU共創事業部』\nAIU Co-Creation (AIU CC) Team",
      text: isEn 
        ? `**Department Maximizing the Appeal of AIU Student Exhibitors**\n・Recruiting Regular Students and International Students for Booths\n・Supporting AIU Exhibitors with Booth Setup\n・Counseling AIU Exhibitors\n・Planning and Setting Up Children's Game and Craft Corners` 
        : `**AIU生出店者の魅力を最大限に引き出す部署\n・正規生、留学生からの出店募集**\n・AIU出店者の出店サポート\n・AIU出店者とカウンセリング\n・子供たちのゲームコーナーや工作コーナの企画、設営`,
      link: "https://www.instagram.com/aiumarche/p/C4Hoahnxk-g/"
    },
    {
      title: isEn ? "Akita Co-Creation (Akita CC) Team" : "『あきた共創事業部』\nAkita Co-Creation (Akita CC) Team",
      text: isEn 
        ? `**The department connecting wonderful local vendors with AIU**\n・Inviting and liaising with local vendors\n・Supporting local vendors to showcase their unique appeal\n・Providing interpretation to facilitate communication between vendors and international students\n・Developing initiatives that delight local residents` 
        : `**地域の素敵な出店者さんとAIUを結ぶ部署\n・地域の出店者さんの招待、連絡**\n・地域の出店者さんの魅力が最大限に発揮されるようにサポート\n・通訳をし出店者さんと留学生の会話をサポート\n・地元の人に喜んでもらえる企画考案`,
      link: "https://www.instagram.com/aiumarche/p/C4KXZ-rBJMr/"
    }
  ];

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
  const d = item.timeline || item; // 日本語版のデータを基本にする
  return {
    year: d.year || "",
    month: d.month || "",
    day: d.day || "",
    image: d.image || null, 
    link: d.link || "",     
    text: d.text || "", 
    text_en: d.text_en || item.text_en || d.text || "" 
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
      fontFamily: 'serif' 
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .rich-content h3 { color: #2d5a27 !important; font-size: 1.4rem !important; margin: 40px 0 20px !important; font-weight: bold !important; display: flex !important; align-items: center !important; }
        .rich-content h3::before { content: "" !important; width: 6px !important; height: 1.2em !important; background-color: #bd5532 !important; margin-right: 15px !important; border-radius: 2px !important; }
        .rich-content table { width: 100% !important; border-collapse: collapse !important; margin-bottom: 30px !important; }
        .rich-content tr { border-bottom: 1px solid #f0f0f0 !important; }
        .rich-content td { padding: 18px 0 !important; color: #444 !important; font-size: 1rem !important; }
        .rich-content td:first-child { width: 35% !important; font-weight: bold !important; color: #2d5a27 !important; }
        .rich-content p { line-height: 2.1 !important; margin-bottom: 1.5em !important; }
        
        .timeline-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.12) !important;
        }

        /* 🌟 部署カードのスタイル */
        /* 🌟 部署紹介カードのスタイル */
        .dept-card {
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          cursor: pointer;
          border: 1px solid #eee;
          background: #fff;
          padding: 50px 30px;
          border-radius: 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          min-height: 520px; /* カードの高さをしっかり出す */
          position: relative;
          z-index: 1;
        }

        /* 🌟 浮かび上がるアニメーション復活 */
        .dept-card:hover {
          transform: translateY(-15px) !important;
          box-shadow: 0 40px 80px rgba(45, 90, 39, 0.12) !important;
          border-color: #2d5a27 !important; /* ホバー時は緑色に */
        }

        /* 🌟 タイトルの文字設定（赤色を廃止） */
        .dept-title {
          color: #2d5a27; /* マルシェの緑色 */
          font-size: 1.5rem; /* 他のH2などとバランスの取れた大きさに */
          font-weight: bold;
          margin-bottom: 25px;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .dept-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .dept-card { width: 95% !important; margin: 0 auto !important; min-height: auto !important; }
        }

        /* 📱 スマホ対応用レスポンシブスタイル（修正版） */
        @media (max-width: 768px) {
          /* 1. タイムラインの線をスマホでは非表示にする（スッキリさせるため） */
          .timeline-line { display: none !important; }
          .timeline-dot { display: none !important; }
          
          /* 2. 行の余白をリセットしてカードを中央寄せにする */
          .timeline-row { 
            justify-content: center !important; 
            padding-left: 0 !important; 
            margin-bottom: 40px !important; 
          }
          
          /* 3. カードの幅を調整（左右に少し隙間を作る） */
          .timeline-card { 
            width: 90% !important; 
            padding: 20px !important; 
            margin: 0 auto !important;
          }

          /* 4. 全体の余白を調整 */
          .section-container { padding: 30px 15px !important; }
          .main-title { font-size: 1.8rem !important; margin-bottom: 40px !important; }
          
          /* 5. 挨拶文などのパディングもスマホ用に小さくする */
          main { padding: 40px 10px !important; }
        }
      `}} />

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px' }}>
        <h1 className="main-title" style={{ textAlign: 'center', color: '#2d5a27', fontSize: '2.5rem', marginBottom: '80px', fontWeight: 'bold', letterSpacing: '0.2em' }}>ABOUT</h1>
        
       {/* 1. AIUマルシェとは？ */}
{aboutContents.length > 0 && (
  <section style={{ marginBottom: '100px', padding: '0 10px' }}>
    <div className="rich-content" dangerouslySetInnerHTML={{ 
      __html: isEn 
        ? (aboutContents[0].about_english?.content_en || aboutContents[0].about_en_fields?.content_en || aboutContents[0].about) 
        : aboutContents[0].about 
    }} />
  </section>
)}

        {/* 2. 代表挨拶 */}
{aboutContents.length > 1 && (
  <section className="section-container" style={{ 
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
  <section className="section-container" style={{ 
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
        {/* 🌟 3.5 部署紹介セクション（ここを追加！） */}
        <section style={{ marginBottom: '120px', maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', color: '#2d5a27', fontSize: '1.8rem', marginBottom: '40px', fontWeight: 'bold' }}>
            {isEn ? "Departments" : "部署紹介"}
          </h2>
          <div className="dept-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '30px',
            padding: '0 10px'
          }}>
            {departments.map((dept, i) => (
              <div 
                key={i} 
                onClick={() => window.open(dept.link, '_blank')}
                className="dept-card"
              >
                <div style={{ color: '#bd5532', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '15px', lineHeight: '1.4' }}>
                  {dept.title}
                </div>
                
                <div style={{ 
  fontSize: '1rem', 
  color: '#444', 
  lineHeight: '1.8', 
  marginBottom: '15px',
  whiteSpace: 'pre-wrap', 
  textAlign: 'left'
}}
dangerouslySetInnerHTML={{   __html: dept.text.replace(/\*\*([\s\S]*?)\*\*/g, '<strong style="color:#2d5a27; display:block; margin-bottom:10px; font-size:1.1rem;">$1</strong>') 
}} />

                <div style={{ color: '#2d5a27', fontSize: '0.8rem', fontWeight: 'bold', marginTop: 'auto' }}>
                  {isEn ? "View Instagram →" : "Instagramを見る →"}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. 歩み（タイムライン） */}
        <h2 style={{ textAlign: 'center', color: '#2d5a27', fontSize: '1.8rem', margin: '100px 0 10px', fontWeight: 'bold' }}>
          {isEn ? "History of AIU Marche" : "AIUマルシェの歩み"}
        </h2>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', marginBottom: '50px', padding: '0 10px' }}>
          {isEn ? "Click the cards to see our activities on Instagram." : "各イベントのカードをクリックすると、Instagramで詳しくご覧いただけます。"}
        </p>
        
        <div style={{ position: 'relative', minHeight: '300px' }}>
          {/* 中央の線（スマホ時は左に寄る） */}
          <div className="timeline-line" style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '4px', backgroundColor: '#bd5532', transform: 'translateX(-50%)' }}></div>
          
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
                <div className="timeline-row" style={{ display: 'flex', justifyContent: isLeft ? 'flex-start' : 'flex-end', width: '100%', marginBottom: '80px', position: 'relative' }}>
                  {/* 点（スマホ時は線に合わせて左に寄る） */}
                  <div className="timeline-dot" style={{ position: 'absolute', left: '50%', top: '30px', width: '22px', height: '22px', backgroundColor: '#fff', border: '4px solid #bd5532', borderRadius: '50%', transform: 'translateX(-50%)', zIndex: 2 }}></div>
                  
                  <div 
                    onClick={() => d.link && window.open(d.link, '_blank')}
                    className="timeline-card"
                    style={{ 
                      width: '40%', 
                      background: '#fff', 
                      padding: '30px', 
                      borderRadius: '25px', 
                      boxShadow: '0 15px 40px rgba(0,0,0,0.06)', 
                      border: '1px solid #eee', 
                      zIndex: 2,
                      cursor: d.link ? 'pointer' : 'default',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{ marginBottom: '15px' }}>
                      <span style={{ backgroundColor: '#2d4e3d', color: '#fff', padding: '6px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                        {isEn ? `${d.month}/${d.day}` : `${d.month}月${d.day && `${d.day}日`}`}
                      </span>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: isEn && d.text_en ? d.text_en : d.text }} style={{ fontSize: '1rem', color: '#333', lineHeight: '1.9' }} />
                    {d.image?.url && (
  <img 
    src={`${d.image.url}?w=800&q=75`} 
    alt="" 
    style={{ width: '100%', borderRadius: '15px', marginTop: '20px' }} 
  />
)}
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