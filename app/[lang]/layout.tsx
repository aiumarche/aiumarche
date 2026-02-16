"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = use(params);
  const urlLang = resolvedParams.lang as 'jp' | 'en';

  const [lang, setLang] = useState<'jp' | 'en'>(urlLang);

  useEffect(() => {
    setLang(urlLang);
  }, [urlLang]);

  return (
    <html lang={lang}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ 
        margin: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh',
        backgroundColor: '#f9f8f4', fontFamily: 'serif'
      }}>
        {/* 固定ヘッダー */}
        <header style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000, 
          boxSizing: 'border-box', backgroundColor: 'rgba(255, 255, 255, 0.9)', 
          backdropFilter: 'blur(10px)', padding: '15px 5%', display: 'flex', 
          justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' 
        }}>
          <Link href={`/${lang}`} style={{ color: '#2d5a27', fontSize: '1.4rem', fontWeight: 'bold', textDecoration: 'none' }}>
            AIU Marché
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <nav style={{ display: 'flex', gap: '20px' }}>
              <Link href={`/${lang}`} style={navLinkStyle}>HOME</Link>
              <Link href={`/${lang}/about`} style={navLinkStyle}>ABOUT</Link>
              <Link href={`/${lang}/shops`} style={navLinkStyle}>SHOPS</Link>
              <Link href={`/${lang}/access`} style={navLinkStyle}>ACCESS</Link>
            </nav>

            <div style={{ display: 'flex', border: '1px solid #2d5a27', borderRadius: '20px', overflow: 'hidden' }}>
              <Link href="/jp" style={langBtnLinkStyle(lang === 'jp')}>JP</Link>
              <Link href="/en" style={langBtnLinkStyle(lang === 'en')}>EN</Link>
            </div>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main style={{ flex: 1, paddingTop: '100px' }}>
          {children}
        </main>

        {/* 🌟 共通フッター：ここに追加しました */}
        <footer style={{ 
          backgroundColor: '#2d4e3d', 
          color: '#fff', 
          padding: '80px 20px 40px', 
          textAlign: 'center' 
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            
            {/* 📸 ロゴ写真の表示エリア */}
            <div style={{ marginBottom: '30px' }}>
              <img 
                src="/logo.jpg" 
                alt="AIU Marche Logo" 
                style={{ 
                  maxWidth: '150px', 
                  height: 'auto',
                  marginBottom: '15px'
                }} 
              />
              <h2 style={{ 
                fontSize: '1.6rem', 
                letterSpacing: '0.1em', 
                fontWeight: 'normal',
                fontFamily: 'serif' 
              }}>AIU Marché</h2>
            </div>
            
            <div style={{ fontSize: '0.95rem', lineHeight: '2.2', marginBottom: '50px', color: '#f0f0f0' }}>
              <p style={{ margin: 0 }}>Email: aiumarche@gl.aiu.ac.jp</p>
              <p style={{ margin: 0 }}>
                Instagram: <a href="https://www.instagram.com/aiumarche" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'underline' }}>@aiumarche</a>
              </p>
            </div>

            <nav style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '60px' }}>
              <Link href={`/${lang}`} style={footerLinkStyle}>HOME</Link>
              <Link href={`/${lang}/about`} style={footerLinkStyle}>ABOUT</Link>
              <a href="mailto:aiumarche@gl.aiu.ac.jp" style={{ color: 'inherit', textDecoration: 'none' }}>
  CONTACT
</a>
            </nav>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '40px', fontSize: '0.75rem', color: '#9fb3a8' }}>
              © 2026 AIU Marché. All Rights Reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

// スタイル定義
const navLinkStyle = { color: '#2d5a27', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold' };
const footerLinkStyle = { color: '#fff', textDecoration: 'none', fontSize: '0.85rem', letterSpacing: '0.1em' };

const langBtnLinkStyle = (isActive: boolean) => ({
  padding: '4px 12px',
  textDecoration: 'none',
  backgroundColor: isActive ? '#2d5a27' : 'transparent',
  color: isActive ? '#fff' : '#2d5a27',
  fontSize: '0.75rem',
  fontWeight: 'bold' as const,
  transition: 'all 0.3s ease'
});