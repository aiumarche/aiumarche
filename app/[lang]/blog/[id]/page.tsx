"use client";

import { useEffect, useState, use } from "react";
import { createClient } from "microcms-js-sdk";

const client = createClient({
  serviceDomain: "aiumarche",
  apiKey: "F8ms5r1H7MEOHCcR3DiwONlbqOmvlnLMQig4",
});

export default function BlogDetailPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  // 🌟 URLから言語(jp/en)と記事IDを取得
  const resolvedParams = use(params);
  const currentLang = (resolvedParams.lang || 'jp') as 'jp' | 'en';
  const contentId = resolvedParams.id;
  const isEn = currentLang === 'en';

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🌟 記事を1件だけ取得する
    client.get({
      endpoint: "news",
      contentId: contentId,
    })
    .then((res) => {
      setPost(res);
      setLoading(false);
    })
    .catch((err) => {
      console.error("記事の取得に失敗しました:", err);
      setLoading(false);
    });
  }, [contentId]);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontFamily: 'serif' }}>Loading...</div>;
  if (!post) return <div style={{ textAlign: 'center', padding: '100px' }}>記事が見つかりませんでした。</div>;

  // 🌟 表示するデータの選択（英語があれば英語、なければ日本語）
  const displayTitle = isEn && post.title_en ? post.title_en : post.title;
  const displayContent = isEn && post.content_en ? post.content_en : post.content;
  const imageUrl = post.images?.[0]?.url || post.image?.url || post.img?.[0]?.url;

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'serif' }}>
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
        
        {/* 📅 日付 */}
        <p style={{ color: '#bd5532', fontWeight: 'bold', marginBottom: '10px' }}>
          {new Date(post.publishedAt || post.createdAt).toLocaleDateString(isEn ? 'en-US' : 'ja-JP')}
        </p>

        {/* 🏷️ タイトル */}
        <h1 style={{ color: '#2d5a27', fontSize: '2.2rem', marginBottom: '40px', lineHeight: '1.4' }}>
          {displayTitle}
        </h1>

        {/* 📸 メイン画像（ある場合のみ） */}
        {imageUrl && (
          <div style={{ marginBottom: '40px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <img 
              src={`${imageUrl}?w=1200&q=80`} 
              alt="" 
              style={{ width: '100%', display: 'block' }} 
            />
          </div>
        )}

        {/* ✍️ 本文（リッチエディタの中身を表示） */}
        <div 
          style={{ 
            lineHeight: '2', 
            fontSize: '1.15rem', 
            color: '#333',
            textAlign: 'justify'
          }}
          dangerouslySetInnerHTML={{ __html: displayContent }} 
        />

        {/* 🔙 戻るボタン */}
        <div style={{ marginTop: '80px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '40px' }}>
          <button 
            onClick={() => window.history.back()}
            style={{ 
              padding: '12px 40px', 
              borderRadius: '50px', 
              border: '2px solid #2d5a27', 
              color: '#2d5a27',
              fontWeight: 'bold',
              cursor: 'pointer', 
              background: '#fff',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2d5a27';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.color = '#2d5a27';
            }}
          >
            {isEn ? "← Back to News" : "← ニュース一覧へ戻る"}
          </button>
        </div>
      </main>
    </div>
  );
}