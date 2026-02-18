"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "microcms-js-sdk";
import Link from "next/link";

const client = createClient({
  serviceDomain: "aiumarche",
  apiKey: "F8ms5r1H7MEOHCcR3DiwONlbqOmvlnLMQig4", 
});

export default function BlogDetail() {
  const params = useParams();
  const [post, setPost] = useState<any>(null);

  const currentLang = params.lang as string;
  const isEn = currentLang === 'en';

  useEffect(() => {
    if (!params.id) return;
    
    client.get({
      endpoint: "news",
      contentId: params.id as string,
    }).then((res) => setPost(res));
  }, [params.id]);

  if (!post) return <div style={{ padding: "50px", textAlign: "center" }}>Loading...</div>;

  const displayTitle = isEn && post.title_en ? post.title_en : post.title;
  const displayContent = isEn && post.content_en ? post.content_en : post.content;

  // 🌟 画像URLの取得（img または img_en）
  const imageUrl = isEn 
    ? (post.img_en?.[0]?.url || post.img?.[0]?.url) 
    : (post.img?.[0]?.url);

  const displayDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString(
    isEn ? 'en-US' : 'ja-JP',
    { year: 'numeric', month: isEn ? 'short' : '2-digit', day: '2-digit' }
  );

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
      backgroundColor: '#fff', zIndex: 9999, overflowY: 'auto'
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .detail-container { padding: 40px 10%; }
        .detail-content img { max-width: 100%; height: auto; border-radius: 10px; margin: 20px 0; }
        .detail-title { font-size: 2rem; }

        @media (max-width: 768px) {
          .detail-container { padding: 30px 20px; }
          .detail-title { font-size: 1.5rem; }
          .detail-content { font-size: 1rem; }
        }
      `}} />
      
      <div className="detail-container">
        <Link href={`/${currentLang}`} style={{ color: '#2d5a27', textDecoration: 'none', fontWeight: 'bold' }}>
          ← {isEn ? 'Back to Top' : 'トップページに戻る'}
        </Link>

        <article style={{ marginTop: '40px', maxWidth: '800px' }}>
          <h1 className="detail-title" style={{ 
            color: '#2d5a27', 
            borderBottom: '2px solid #ebad4e', 
            paddingBottom: '10px',
            fontFamily: 'serif',
            lineHeight: '1.3'
          }}>
            {displayTitle}
          </h1>
          
          <p style={{ color: '#bd5532', marginTop: '15px', fontWeight: 'bold' }}>
            {displayDate}
          </p>

          {/* 🌟 修正：記事のメイン画像を表示 */}
          {imageUrl && (
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              <img 
                src={imageUrl} 
                alt="" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '500px', // 大きすぎないように制限
                  height: 'auto', 
                  borderRadius: '15px', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)' 
                }} 
              />
            </div>
          )}

          <div 
            className="detail-content"
            style={{ 
              marginTop: '40px', 
              lineHeight: '1.9', 
              fontSize: '1.1rem', 
              color: '#333',
              overflowWrap: 'break-word' 
            }}
            dangerouslySetInnerHTML={{ __html: displayContent }} 
          />
        </article>

        <footer style={{ marginTop: '100px', paddingBottom: '50px', textAlign: 'center', color: '#ccc', fontSize: '0.8rem' }}>
          © AIU Marche
        </footer>
      </div>
    </div>
  );
}