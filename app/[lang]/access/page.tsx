"use client";

import { useState, use } from "react";

export default function AccessPage({ params }: { params: Promise<{ lang: string }> }) {
  // 言語設定の取得
  const resolvedParams = use(params);
  const currentLang = resolvedParams.lang as 'jp' | 'en';
  const isEn = currentLang === 'en';

  const [isMapHovered, setIsMapHovered] = useState(false);

  return (
    <div style={{ backgroundColor: '#f9f8f4', minHeight: '100vh', paddingBottom: '100px', fontFamily: 'serif' }}>
      
      {/* 🌟 スマホ対応用のスタイルを追加（デザイン変更なし） */}
      <style dangerouslySetInnerHTML={{ __html: `
        .bus-btn {
          display: inline-block; 
          padding: 10px 30px; 
          border-radius: 50px; 
          border: 2px solid #2d5a27; 
          color: #2d5a27; 
          background-color: transparent;
          text-decoration: none; 
          font-weight: bold; 
          font-size: 0.9rem; 
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        .bus-btn:hover {
          background-color: #2d5a27;
          color: #fff;
          transform: translateY(-12px);
          box-shadow: 0 15px 30px rgba(45, 90, 39, 0.2);
        }

        /* 📱 スマホ対応：横並びを縦並びに切り替える */
        @media (max-width: 768px) {
          .access-container {
            flex-direction: column !important;
            gap: 40px !important;
          }
          .access-info-section {
            min-width: 100% !important;
          }
          .access-map-section {
            min-width: 100% !important;
            height: 350px !important; /* スマホではマップの高さを少し抑える */
          }
          .access-title {
            font-size: 2rem !important;
            margin-bottom: 40px !important;
          }
        }
      `}} />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 className="access-title" style={{ fontSize: '2.5rem', color: '#2d5a27', fontWeight: 'bold', letterSpacing: '0.2em', marginBottom: '15px', fontFamily: 'serif' }}>ACCESS</h1>
          <div style={{ width: '60px', height: '3px', backgroundColor: '#bd5532', margin: '0 auto' }}></div>
        </div>

        {/* 🌟 className="access-container" を追加してメディアクエリで制御 */}
        <div className="access-container" style={{ display: 'flex', gap: '60px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          
          <div className="access-info-section" style={{ flex: '1', minWidth: '350px' }}>
            {/* 会場 (Venue) */}
            <section style={{ marginBottom: '50px' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#2d5a27', fontWeight: 'bold', borderBottom: '2px solid #bd5532', display: 'inline-block', marginBottom: '25px', paddingBottom: '5px' }}>
                {isEn ? "Venue" : "会場"}
              </h2>
              <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '10px', color: '#333' }}>
                {isEn ? "Akita International University (AIU)" : "国際教養大学（AIU）"}
              </p>
              <p style={{ lineHeight: '1.8', color: '#555', fontSize: '0.95rem' }}>
                {isEn ? (
                  <>
                    Okutsubakidai-193-2 Yuwatsubakigawa, Akita, 010-1211<br />
                    Student Hall / Building F
                  </>
                ) : (
                  <>
                    〒010-1211 秋田県秋田市雄和椿川字奥椿岱<br />
                    Okutsubakidai-193-2 Yuwatsubakigawa, Akita, 010-1211<br />
                    学生会館 / F棟
                  </>
                )}
              </p>
            </section>

            {/* 公共交通機関 (By Bus) */}
            <section style={{ marginBottom: '50px' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#2d5a27', fontWeight: 'bold', borderBottom: '2px solid #bd5532', display: 'inline-block', marginBottom: '25px', paddingBottom: '5px' }}>
                {isEn ? "By Bus" : "バスでお越しの方"}
              </h2>
              <p style={{ lineHeight: '1.8', color: '#555', fontSize: '0.95rem', marginBottom: '20px' }}>
                {isEn ? (
                  <>
                    Take the "Akita International University Line" from JR Akita Station East Exit (Approx. 35 min).<br />
                    Get off at "Akita International University" bus stop.
                  </>
                ) : (
                  <>
                    イオンモール秋田より「国際教養大学線」に乗車（約10分）<br />
                    バス停「国際教養大学」下車すぐ
                  </>
                )}
              </p>
              <a href="https://www.akita-chuoukotsu.co.jp/aiu.html" target="_blank" rel="noopener noreferrer" className="bus-btn">
                {isEn ? "View Bus Timetable" : "バス時刻表を見る"}
              </a>
            </section>

            {/* お車でお越しの方 (By Car) */}
            <section>
              <h2 style={{ fontSize: '1.4rem', color: '#2d5a27', fontWeight: 'bold', borderBottom: '2px solid #bd5532', display: 'inline-block', marginBottom: '25px', paddingBottom: '5px' }}>
                {isEn ? "By Car" : "お車でお越しの方"}
              </h2>
              <p style={{ color: '#555', fontSize: '0.95rem', marginBottom: '25px' }}>
                {isEn ? "Approx. 5 min from Akita Airport IC" : "秋田空港ICより車で約5分"}
              </p>
              <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '15px', border: '1px solid #eee' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
                  {isEn ? "【Parking Information】" : "【駐車場について】"}
                </p>
                <p style={{ lineHeight: '1.8', color: '#555', fontSize: '0.9rem' }}>
                  {isEn ? (
                    <>
                      Please use the "Central Park Parking Lot 1."<br />
                      <span style={{ fontSize: '0.85rem', color: '#888' }}>*Parking spaces are limited. We appreciate your cooperation in using public transportation.</span>
                    </>
                  ) : (
                    <>
                      中央公園第一駐車場をご利用ください。<br />
                      <span style={{ fontSize: '0.85rem', color: '#888' }}>※台数に限りがありますので、公共交通機関のご利用にご協力ください。</span>
                    </>
                  )}
                </p>
              </div>
            </section>
          </div>

          {/* 右側：Googleマップ（デザイン・アニメーション維持） */}
          <div 
            className="access-map-section"
            style={{ 
              flex: '1', minWidth: '400px', height: '500px', position: 'relative',
              borderRadius: '25px', overflow: 'hidden', backgroundColor: '#eee',
              boxShadow: isMapHovered ? '0 30px 60px rgba(0,0,0,0.15)' : '0 10px 30px rgba(0,0,0,0.05)',
              transform: isMapHovered ? 'translateY(-12px)' : 'translateY(0)',
              transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
            }}
            onMouseEnter={() => setIsMapHovered(true)}
            onMouseLeave={() => setIsMapHovered(false)}
          >
            <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3072.083313072382!2d140.2115167765104!3d39.61058090408581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5f8fbd86f7b11d9d%3A0x66f6c382173e33f3!2z5Zu96Zqb5pWZ6aSK5aSn5a2m!5e0!3m2!1sja!2sjp!4v1711200000000!5m2!1sja!2sjp"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen={true}
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
          </div>

        </div>
      </main>
    </div>
  );
}