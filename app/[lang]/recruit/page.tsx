"use client";

import Link from "next/link";

export default function RecruitPage() {
  return (
    <div style={{ backgroundColor: '#f9f8f4', minHeight: '100vh', paddingBottom: '100px', fontFamily: 'serif' }}>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#2d5a27', fontWeight: 'bold', letterSpacing: '0.2em', marginBottom: '15px' }}>RECRUIT</h1>
          <div style={{ width: '60px', height: '3px', backgroundColor: '#bd5532', margin: '0 auto' }}></div>
        </div>

        <section style={{ background: '#fff', padding: '50px 60px', borderRadius: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', border: '1px solid #f5f5f5' }}>
          <p style={{ textAlign: 'center', lineHeight: '2', color: '#333' }}>
            現在、出店者・メンバー募集に関する情報を準備中です。<br />
            公開まで今しばらくお待ちください。
          </p>
        </section>
      </main>
    </div>
  );
}