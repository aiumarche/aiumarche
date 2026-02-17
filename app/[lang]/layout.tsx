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
  const [isMenuOpen, setIsMenuOpen] = useState(false); // スマホメニューの開閉状態

  useEffect(() => {
    setLang(urlLang);
  }, [urlLang]);

  // メニューを閉じる関数
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <html lang={lang}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <meta name="google-site-verification" content="uuT-6lPtBdU4p5c2nLJqIj9tEeSu1m39ghAKIjND0yo" />
      <body style={{ 
        margin: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh',
        backgroundColor: '#f9f8f4', fontFamily: 'serif'
      }}>
        <style dangerouslySetInnerHTML={{ __html: `
          /* デスクトップ用：スマホメニューボタンを隠す */
          .mobile-menu-btn { display: none; }
          
          @media (max-width: 850px) {
            .nav-desktop { display: none !important; } /* PC用ナビを隠す */
            .mobile-menu-btn { 
              display: block; 
              background: none; border: none; color: #2d5a27; 
              font-size: 1.8rem; cursor: pointer; z-index: 1100;
            }
            .mobile-nav-overlay {
              position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
              background-color: rgba(255, 255, 255, 0.98);
              display: flex; flex-direction: column; align-items: center; justify-content: center;
              gap: 30px; z-index: 1050; transition: all 0.4s ease;
              opacity: ${isMenuOpen ? '1' : '0'};
              visibility: ${isMenuOpen ? 'visible' : 'hidden'};
              transform: ${isMenuOpen ? 'translateY(0)' : 'translateY(-20px)'};
            }
          }
        `}} />

        {/* 固定ヘッダー */}
        <header style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000, 
          boxSizing: 'border-box', backgroundColor: 'rgba(255, 255, 255, 0.9)', 
          backdropFilter: 'blur(10px)', padding: '20px 5%', display: 'flex', 
          justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' 
        }}>
          <Link href={`/${lang}`} style={{ color: '#2d5a27', fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' }}>
            AIU Marché
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* PC用ナビゲーション */}
            <nav className="nav-desktop" style={{ display: 'flex', gap: '25px' }}>
              <Link href={`/${lang}`} style={navLinkStyle}>HOME</Link>
              <Link href={`/${lang}/about`} style={navLinkStyle}>ABOUT</Link>
              <Link href={`/${lang}/shops`} style={navLinkStyle}>SHOPS</Link>
              <Link href={`/${lang}/access`} style={navLinkStyle}>ACCESS</Link>
              <Link href={`/${lang}/recruit`} style={navLinkStyle}>RECRUIT</Link>
            </nav>

            <div style={{ display: 'flex', border: '1px solid #2d5a27', borderRadius: '20px', overflow: 'hidden' }}>
              <Link href="/jp" style={langBtnLinkStyle(lang === 'jp')}>JP</Link>
              <Link href="/en" style={langBtnLinkStyle(lang === 'en')}>EN</Link>
            </div>

            {/* スマホ用メニューボタン */}
            <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </header>

        {/* スマホ用全画面メニュー */}
        <div className="mobile-nav-overlay">
          <Link href={`/${lang}`} onClick={closeMenu} style={mobileNavLinkStyle}>HOME</Link>
          <Link href={`/${lang}/about`} onClick={closeMenu} style={mobileNavLinkStyle}>ABOUT</Link>
          <Link href={`/${lang}/shops`} onClick={closeMenu} style={mobileNavLinkStyle}>SHOPS</Link>
          <Link href={`/${lang}/access`} onClick={closeMenu} style={mobileNavLinkStyle}>ACCESS</Link>
          <Link href={`/${lang}/recruit`} onClick={closeMenu} style={mobileNavLinkStyle}>RECRUIT</Link>
        </div>

        {/* メインコンテンツ */}
        <main style={{ flex: 1, paddingTop: '0px' }}> {/* 100px や 90px だったのを 0 に変更 */}
  {children}
</main>

        {/* 共通フッター */}
        <footer style={{ backgroundColor: '#2d4e3d', color: '#fff', padding: '60px 20px 40px', textAlign: 'center' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '30px' }}>
              <img src="/logo.jpg" alt="AIU Marche Logo" style={{ maxWidth: '120px', height: 'auto', marginBottom: '15px' }} />
              <h2 style={{ fontSize: '1.4rem', letterSpacing: '0.1em', fontWeight: 'normal' }}>AIU Marché</h2>
            </div>
            
            <div style={{ fontSize: '0.9rem', lineHeight: '2', marginBottom: '40px', color: '#f0f0f0' }}>
              <p>Email: <a href="mailto:aiumarche@gl.aiu.ac.jp" style={{ color: 'inherit' }}>aiumarche@gl.aiu.ac.jp</a></p>
              <p>Instagram: <a href="https://www.instagram.com/aiumarche" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>@aiumarche</a></p>
            </div>

            <nav style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
              <Link href={`/${lang}`} style={footerLinkStyle}>HOME</Link>
              <Link href={`/${lang}/about`} style={footerLinkStyle}>ABOUT</Link>
              <a href="mailto:aiumarche@gl.aiu.ac.jp" style={footerLinkStyle}>CONTACT</a>
            </nav>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '30px', fontSize: '0.7rem', color: '#9fb3a8' }}>
              © AIU Marché. All Rights Reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

// スタイル定義
const navLinkStyle = { color: '#2d5a27', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold' };
const mobileNavLinkStyle = { color: '#2d5a27', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '0.1em' };
const footerLinkStyle = { color: '#fff', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.1em' };

const langBtnLinkStyle = (isActive: boolean) => ({
  padding: '3px 10px',
  textDecoration: 'none',
  backgroundColor: isActive ? '#2d5a27' : 'transparent',
  color: isActive ? '#fff' : '#2d5a27',
  fontSize: '0.7rem',
  fontWeight: 'bold' as const
});