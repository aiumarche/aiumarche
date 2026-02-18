"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/microcms"; 
import { useParams } from "next/navigation";
import Link from "next/link"; // 🌟 追加

export default function RecruitPage() {
  const params = useParams();
  const lang = params.lang;
  const isEn = lang === 'en'; // 🌟 判定を共通化
  const [recruits, setRecruits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get({
      endpoint: 'news',
      queries: { filters: 'category[contains]recruit' },
    }).then((res) => {
      setRecruits(res.contents);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ backgroundColor: '#f9f8f4', minHeight: '100vh', paddingBottom: '100px', fontFamily: 'serif' }}>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .recruit-main { padding: 80px 20px; }
        .recruit-title { font-size: 2.5rem; }
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
        .back-btn {
          display: inline-block;
          margin-top: 30px;
          padding: 12px 40px;
          border-radius: 30px;
          border: 2px solid #2d5a27;
          color: #2d5a27;
          text-decoration: none;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        .back-btn:hover {
          background: #2d5a27;
          color: #fff;
        }

        @media (max-width: 768px) {
          .recruit-main { padding: 60px 15px; }
          .recruit-title { font-size: 2rem !important; }
          .coming-soon-box { padding: 60px 20px; }
        }

        .cms-content img {
          max-width: 100%;
          height: auto;
          border-radius: 10px;
          margin: 15px 0;
        }
      `}} />

      <main className="recruit-main" style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 className="recruit-title" style={{ color: '#2d5a27', fontWeight: 'bold', letterSpacing: '0.2em', marginBottom: '15px' }}>RECRUIT</h1>
          <div style={{ width: '60px', height: '3px', backgroundColor: '#bd5532', margin: '0 auto' }}></div>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '100px' }}>{isEn ? 'Loading...' : '読み込み中...'}</p>
        ) : recruits.length > 0 ? (
          <div style={{ display: 'grid', gap: '30px' }}>
            {recruits.map((item) => (
              <section key={item.id} style={{ 
                background: '#fff', 
                padding: '40px 60px',
                borderRadius: '40px', 
                boxShadow: '0 20px 60px rgba(0,0,0,0.05)', 
                border: '1px solid #f5f5f5' 
              }}>
                <h2 style={{ color: '#2d5a27', marginBottom: '20px', fontSize: '1.5rem', borderLeft: '4px solid #bd5532', paddingLeft: '15px' }}>
                  {isEn ? (item.title_en || item.title) : item.title}
                </h2>
                <div 
                  className="cms-content"
                  style={{ lineHeight: '1.9', color: '#333', overflowWrap: 'break-word' }}
                  dangerouslySetInnerHTML={{ 
                    __html: isEn ? (item.content_en || item.content) : item.content 
                  }} 
                />
              </section>
            ))}
          </div>
        ) : (
          /* 🌟 修正：データがない時の Coming Soon ボックス */
          <div className="coming-soon-box">
            <h2 style={{ fontSize: '2.5rem', color: '#2d5a27', marginBottom: '20px' }}>Coming Soon</h2>
            <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
              {isEn 
                ? "Recruitment information is being prepared.\nDetails will be announced soon." 
                : "出店者および部員の募集は準備中です。\n詳細は追って公開いたします。"}
            </p>
            <Link href={`/${lang}`} className="back-btn">
              {isEn ? "Back to Top" : "トップページへ戻る"}
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}