"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/microcms"; 
import { useParams } from "next/navigation";

export default function RecruitPage() {
  const params = useParams();
  const lang = params.lang;
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
      
      {/* 🌟 スマホ用の細かい調整を追加 */}
      <style dangerouslySetInnerHTML={{ __html: `
        .recruit-main { padding: 120px 15px; }
        .recruit-card { padding: 40px 60px; }
        .recruit-title { font-size: 2.5rem; }

        @media (max-width: 768px) {
          .recruit-main { padding: 80px 15px; }
          .recruit-card { padding: 30px 20px !important; border-radius: 25px !important; }
          .recruit-title { font-size: 2rem !important; }
          .cms-content { font-size: 0.95rem !important; }
        }

        .cms-content img {
          max-width: 100%;
          height: auto;
          border-radius: 10px;
          margin: 15px 0;
        }
      `}} />

      <main className="recruit-main" style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 className="recruit-title" style={{ color: '#2d5a27', fontWeight: 'bold', letterSpacing: '0.2em', marginBottom: '15px' }}>RECRUIT</h1>
          <div style={{ width: '60px', height: '3px', backgroundColor: '#bd5532', margin: '0 auto' }}></div>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center' }}>{lang === 'en' ? 'Loading...' : '読み込み中...'}</p>
        ) : recruits.length > 0 ? (
          <div style={{ display: 'grid', gap: '30px' }}>
            {recruits.map((item) => (
              <section key={item.id} className="recruit-card" style={{ 
                background: '#fff', 
                borderRadius: '40px', 
                boxShadow: '0 20px 60px rgba(0,0,0,0.05)', 
                border: '1px solid #f5f5f5' 
              }}>
                <h2 style={{ color: '#2d5a27', marginBottom: '20px', fontSize: '1.5rem', borderLeft: '4px solid #bd5532', paddingLeft: '15px' }}>
                  {lang === 'en' ? (item.title_en || item.title) : item.title}
                </h2>
                <div 
                  className="cms-content"
                  style={{ lineHeight: '1.9', color: '#333', overflowWrap: 'break-word' }}
                  dangerouslySetInnerHTML={{ 
                    __html: lang === 'en' ? (item.content_en || item.content) : item.content 
                  }} 
                />
              </section>
            ))}
          </div>
        ) : (
          <section className="recruit-card" style={{ background: '#fff', borderRadius: '40px', textAlign: 'center' }}>
            <p style={{ lineHeight: '2', color: '#333' }}>
              {lang === 'en' 
                ? "Currently, there is no recruitment information available." 
                : "現在、募集情報はございません。"}
            </p>
          </section>
        )}
      </main>
    </div>
  );
}