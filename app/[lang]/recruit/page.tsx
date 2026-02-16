"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/microcms"; // microCMSのクライアント設定ファイルを読み込み
import Link from "next/link";

export default function RecruitPage() {
  const [recruits, setRecruits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // microCMSからデータを取得
    client.get({
      endpoint: 'news',
      queries: { 
        filters: 'category[contains]recruit', // カテゴリがrecruitのものだけ取得
      },
    }).then((res) => {
      setRecruits(res.contents);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ backgroundColor: '#f9f8f4', minHeight: '100vh', paddingBottom: '100px', fontFamily: 'serif' }}>
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '120px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#2d5a27', fontWeight: 'bold', letterSpacing: '0.2em', marginBottom: '15px' }}>RECRUIT</h1>
          <div style={{ width: '60px', height: '3px', backgroundColor: '#bd5532', margin: '0 auto' }}></div>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center' }}>読み込み中...</p>
        ) : recruits.length > 0 ? (
          <div style={{ display: 'grid', gap: '30px' }}>
            {recruits.map((item) => (
              <section key={item.id} style={{ background: '#fff', padding: '40px 60px', borderRadius: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', border: '1px solid #f5f5f5' }}>
                <h2 style={{ color: '#2d5a27', marginBottom: '15px' }}>{item.title}</h2>
                <div 
                  style={{ lineHeight: '1.8', color: '#333' }}
                  dangerouslySetInnerHTML={{ __html: item.content }} 
                />
              </section>
            ))}
          </div>
        ) : (
          <section style={{ background: '#fff', padding: '50px 60px', borderRadius: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', border: '1px solid #f5f5f5' }}>
            <p style={{ textAlign: 'center', lineHeight: '2', color: '#333' }}>
              現在、募集情報はございません。<br />
              最新情報は公式Instagram等をご確認ください。
            </p>
          </section>
        )}
      </main>
    </div>
  );
}