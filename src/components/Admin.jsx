import { useState, useEffect } from 'react';
import { 
  MOCK_MANGAS, 
  getMangaChapters, 
  deleteManga, 
  deleteChapter, 
  addChapter 
} from '../utils/mangadex';

export default function Admin({ suggestions = [], onApprove, onReject, onAiTranslate, isMobile }) {
  const [adminTab, setAdminTab] = useState('translations'); // 'translations', 'mangas'
  const [mangas, setMangas] = useState([]);
  const [selectedMangaId, setSelectedMangaId] = useState(null);
  const [mangaChapters, setMangaChapters] = useState([]);

  // Form states for adding a new chapter
  const [newChapterNum, setNewChapterNum] = useState('');
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterPages, setNewChapterPages] = useState('16');

  // Users Management state
  const [users, setUsers] = useState([
    { username: 'MangaThaisTranslator', approvedCount: 142, points: 1420, level: 'Grandmaster', status: 'active' },
    { username: 'NekoNeko', approvedCount: 98, points: 980, level: 'Master', status: 'active' },
    { username: 'KuroChan', approvedCount: 76, points: 760, level: 'Expert', status: 'active' },
    { username: 'TranslationWizard', approvedCount: 45, points: 450, level: 'Contributor', status: 'banned' }
  ]);

  // Load mangas on mount
  useEffect(() => {
    setMangas([...MOCK_MANGAS]);
    if (MOCK_MANGAS.length > 0) {
      setSelectedMangaId(MOCK_MANGAS[0].id);
    }
  }, []);

  // Update chapters when selected manga changes
  useEffect(() => {
    if (selectedMangaId) {
      setMangaChapters([...getMangaChapters(selectedMangaId)]);
    } else {
      setMangaChapters([]);
    }
  }, [selectedMangaId, mangas]);

  // Ban/Unban user toggler
  const handleToggleBan = (username) => {
    setUsers(prev => prev.map(u => {
      if (u.username === username) {
        const nextStatus = u.status === 'active' ? 'banned' : 'active';
        alert(`${nextStatus === 'banned' ? 'ระงับสิทธิ์การใช้งาน (แบน)' : 'คืนสิทธิ์การใช้งาน (ปลดแบน)'} ผู้ใช้ @${username} เรียบร้อยแล้ว!`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // Delete manga action
  const handleDeleteManga = (id, title) => {
    if (confirm(`คุณต้องการลบมังงะเรื่อง "${title}" ออกจากระบบจำลองใช่หรือไม่?`)) {
      deleteManga(id);
      const updated = [...MOCK_MANGAS];
      setMangas(updated);
      if (selectedMangaId === id) {
        setSelectedMangaId(updated[0]?.id || null);
      }
      alert(`ลบมังงะ "${title}" เรียบร้อยแล้ว!`);
    }
  };

  // Delete chapter action
  const handleDeleteChapter = (chapterId, chapterNum) => {
    if (confirm(`คุณต้องการลบ ตอนที่ ${chapterNum} ใช่หรือไม่?`)) {
      deleteChapter(selectedMangaId, chapterId);
      setMangaChapters([...getMangaChapters(selectedMangaId)]);
      alert(`ลบตอนที่ ${chapterNum} เรียบร้อยแล้ว`);
    }
  };

  // Add chapter action
  const handleAddChapterSubmit = (e) => {
    e.preventDefault();
    if (!newChapterNum.trim()) {
      alert('กรุณากรอกเลขตอน');
      return;
    }
    const added = addChapter(
      selectedMangaId,
      newChapterNum,
      newChapterTitle,
      parseInt(newChapterPages) || 16
    );
    setMangaChapters([...getMangaChapters(selectedMangaId)]);
    setNewChapterNum('');
    setNewChapterTitle('');
    setNewChapterPages('16');
    alert(`เพิ่มตอนที่ ${added.chapter} สำเร็จ!`);
  };

  const getLevelBadgeStyle = (level) => {
    switch (level) {
      case 'Grandmaster':
        return { background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)' };
      case 'Master':
        return { background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.2)' };
      case 'Expert':
        return { background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.2)' };
      default:
        return { background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.2)' };
    }
  };

  const selectedMangaObj = mangas.find(m => m.id === selectedMangaId);

  return (
    <div className="container animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>ระบบจัดการสำหรับผู้ดูแลระบบ (Admin Console)</h1>
        <p style={styles.subtitle}>ตรวจสอบคิวเสนอแนะคำแปล ควบคุมรายชื่อสมาชิก และจัดการมังงะ/ตอนในระบบ</p>
      </div>

      {/* Admin Tabs */}
      <div style={styles.tabsContainer}>
        <button 
          style={{
            ...styles.tabBtn,
            background: adminTab === 'translations' ? 'var(--accent-purple)' : 'var(--bg-card)',
            color: adminTab === 'translations' ? '#fff' : 'var(--text-muted)',
            border: `1px solid ${adminTab === 'translations' ? 'var(--accent-purple)' : 'var(--border-color)'}`,
          }}
          onClick={() => setAdminTab('translations')}
        >
          📥 คิวคำแปลและสมาชิก
        </button>
        <button 
          style={{
            ...styles.tabBtn,
            background: adminTab === 'mangas' ? 'var(--accent-purple)' : 'var(--bg-card)',
            color: adminTab === 'mangas' ? '#fff' : 'var(--text-muted)',
            border: `1px solid ${adminTab === 'mangas' ? 'var(--accent-purple)' : 'var(--border-color)'}`,
          }}
          onClick={() => setAdminTab('mangas')}
        >
          📚 จัดการข้อมูลมังงะและตอน
        </button>
      </div>

      {/* TAB 1: TRANSLATIONS & MEMBERS */}
      {adminTab === 'translations' && (
        <div style={{
          ...styles.grid,
          ...(isMobile ? { gridTemplateColumns: '1fr', gap: '24px' } : {})
        }}>
          {/* Left Column: Review Queue */}
          <div style={styles.leftCol}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>📥 คิวตรวจสอบคำแปลจากคอมมูนิตี้</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                รอยืนยันการแก้ไข ({suggestions.filter(s => s.status === 'pending').length}) รายการ
              </span>
            </div>

            {suggestions.filter(s => s.status === 'pending').length === 0 ? (
              <div style={styles.emptyQueue} className="glass-panel">
                <span style={{ fontSize: '2.5rem' }}>🎉</span>
                <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  ไม่มีคำแปลค้างตรวจสอบในระบบ คิวว่างทั้งหมด!
                </p>
              </div>
            ) : isMobile ? (
              /* Mobile View: Queue list card style */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {suggestions
                  .filter(s => s.status === 'pending')
                  .map((sug) => (
                    <div key={sug.id} style={styles.mobileJobCard} className="glass-panel">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.95rem' }}>{sug.mangaTitle}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            ตอนที่ {sug.chapter} • หน้า {sug.pageNumber} • กรอบ: {sug.bubbleId}
                          </div>
                        </div>
                        <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>@{sug.contributor}</span>
                      </div>

                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>ต้นฉบับ (EN):</div>
                        <div style={styles.codeText}>{sug.originalText}</div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>แปลปัจจุบัน:</div>
                        <div style={styles.blockText}>{sug.currentTranslation}</div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>เสนอใหม่ (TH):</div>
                        <div style={styles.suggestedText}>{sug.suggestedTranslation}</div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <button 
                          className="btn btn-cyan" 
                          style={{ flex: 1, padding: '8px', fontSize: '0.8rem' }}
                          onClick={() => onApprove(sug.id)}
                        >
                          ✓ อนุมัติ
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{ flex: 1, padding: '8px', fontSize: '0.8rem' }}
                          onClick={() => onReject(sug.id)}
                        >
                          ✗ ปฏิเสธ
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              /* Desktop View: Queue Table */
              <div style={styles.tableWrapper} className="glass-panel">
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.trHeader}>
                      <th style={styles.thCol}>มังงะ / พิกัด</th>
                      <th style={styles.thCol}>ผู้เขียนคำแปล</th>
                      <th style={styles.thCol}>ต้นฉบับ (EN)</th>
                      <th style={styles.thCol}>แปลไทยปัจจุบัน</th>
                      <th style={styles.thCol}>เสนอแนะปรับปรุง</th>
                      <th style={{ ...styles.thCol, textAlign: 'center' }}>การดำเนินการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suggestions
                      .filter(s => s.status === 'pending')
                      .map((sug) => (
                        <tr key={sug.id} style={styles.trRow}>
                          <td style={styles.tdCol}>
                            <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{sug.mangaTitle}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              ตอนที่ {sug.chapter} • หน้า {sug.pageNumber} • กรอบ {sug.bubbleId}
                            </div>
                          </td>
                          <td style={styles.tdCol}>
                            <span className="badge badge-purple">@{sug.contributor}</span>
                          </td>
                          <td style={{ ...styles.tdCol, fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                            {sug.originalText}
                          </td>
                          <td style={{ ...styles.tdCol, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            {sug.currentTranslation}
                          </td>
                          <td style={{ ...styles.tdCol, color: 'var(--accent-purple)', fontWeight: '700', fontSize: '0.85rem' }}>
                            {sug.suggestedTranslation}
                          </td>
                          <td style={styles.tdCol}>
                            <div style={styles.actionsCell}>
                              <button 
                                className="btn btn-cyan" 
                                style={styles.actionBtn}
                                onClick={() => onApprove(sug.id)}
                              >
                                ✓ อนุมัติ
                              </button>
                              <button 
                                className="btn btn-danger" 
                                style={styles.actionBtn}
                                onClick={() => onReject(sug.id)}
                              >
                                ✗ ปฏิเสธ
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Column: User Management */}
          <div style={styles.rightCol} className="glass-panel">
            <h3 style={styles.sectionTitle}>👥 จัดการสมาชิกคอมมูนิตี้</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.4' }}>
              แบนผู้ใช้งานที่แปลภาษาไม่เหมาะสมหรือระงับสิทธิ์ชั่วคราว
            </p>

            <div style={styles.userList}>
              {users.map((user) => (
                <div key={user.username} style={styles.userCard}>
                  <div style={styles.userInfo}>
                    <div style={styles.userMeta}>
                      <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>@{user.username}</span>
                      <span className="badge" style={{ ...getLevelBadgeStyle(user.level), fontSize: '0.65rem' }}>
                        {user.level}
                      </span>
                    </div>
                    <div style={styles.userDetailRow}>
                      <span>คะแนน: {user.points} แต้ม</span>
                      <span style={{ margin: '0 6px' }}>•</span>
                      <span>ส่งคำแปล: {user.approvedCount} ครั้ง</span>
                    </div>
                  </div>

                  <div style={styles.userActionBox}>
                    {user.status === 'banned' ? (
                      <div style={styles.statusBannedRow}>
                        <span style={styles.bannedText}>🚫 ถูกระงับสิทธิ์</span>
                        <button 
                          className="btn btn-cyan" 
                          style={styles.banBtn}
                          onClick={() => handleToggleBan(user.username)}
                        >
                          ปลดแบน
                        </button>
                      </div>
                    ) : (
                      <div style={styles.statusActiveRow}>
                        <span style={styles.activeText}>🟢 สถานะปกติ</span>
                        <button 
                          className="btn btn-danger" 
                          style={styles.banBtn}
                          onClick={() => handleToggleBan(user.username)}
                        >
                          แบนผู้ใช้
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE MANGAS & CHAPTERS */}
      {adminTab === 'mangas' && (
        <div style={{
          ...styles.grid,
          gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr',
          ...(isMobile ? { gap: '24px' } : {})
        }}>
          {/* Left Section: Manga List */}
          <div style={styles.leftCol}>
            <h3 style={styles.sectionTitle}>📚 รายการมังงะในระบบ</h3>
            
            {mangas.length === 0 ? (
              <div style={styles.emptyQueue} className="glass-panel">
                <span style={{ fontSize: '2.5rem' }}>📭</span>
                <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)' }}>ไม่มีมังงะเหลืออยู่ในระบบจำลอง</p>
              </div>
            ) : (
              <div style={styles.mangaAdminList}>
                {mangas.map((m) => (
                  <div 
                    key={m.id} 
                    style={{
                      ...styles.mangaAdminCard,
                      border: selectedMangaId === m.id ? '2px solid var(--accent-purple)' : '1px solid var(--border-color)',
                      background: selectedMangaId === m.id ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                    }}
                    onClick={() => setSelectedMangaId(m.id)}
                    className="glass-panel"
                  >
                    <img src={m.coverUrl} alt={m.title} style={styles.mangaAdminCover} />
                    <div style={styles.mangaAdminMeta}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)' }}>{m.title}</h4>
                      <p style={{ margin: '2px 0 6px 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.japaneseTitle}</p>
                      <div style={styles.mangaTagsRow}>
                        <span className="badge badge-cyan" style={{ fontSize: '0.6rem' }}>{m.status === 'ongoing' ? 'กำลังแต่ง' : 'จบแล้ว'}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{m.tags.slice(0, 2).join(', ')}</span>
                      </div>
                    </div>
                    <button 
                      className="btn btn-danger" 
                      style={styles.deleteMangaBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteManga(m.id, m.title);
                      }}
                    >
                      ลบมังงะ
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Section: Manage Chapters for Selected Manga */}
          <div style={styles.rightCol} className="glass-panel">
            <h3 style={styles.sectionTitle}>
              📖 จัดการตอน: {selectedMangaObj ? selectedMangaObj.title : 'ไม่ได้เลือกมังงะ'}
            </h3>

            {selectedMangaObj ? (
              <div>
                {/* Form to Add simulated Chapter */}
                <form onSubmit={handleAddChapterSubmit} style={styles.addChapterForm}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-main)' }}>➕ เพิ่มตอนมังงะใหม่ (Simulated)</h4>
                  
                  <div style={styles.formRow}>
                    <div style={{ flex: 1 }}>
                      <label style={styles.formLabel}>เลขตอน</label>
                      <input 
                        type="number" 
                        step="0.1"
                        placeholder="เช่น 7" 
                        value={newChapterNum}
                        onChange={e => setNewChapterNum(e.target.value)}
                        className="input-field"
                        style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                        required
                      />
                    </div>
                    <div style={{ width: '80px' }}>
                      <label style={styles.formLabel}>จำนวนหน้า</label>
                      <input 
                        type="number" 
                        placeholder="16" 
                        value={newChapterPages}
                        onChange={e => setNewChapterPages(e.target.value)}
                        className="input-field"
                        style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={styles.formLabel}>ชื่อตอน</label>
                    <input 
                      type="text" 
                      placeholder="เช่น การเดินทางครั้งใหม่เริ่มต้นขึ้น" 
                      value={newChapterTitle}
                      onChange={e => setNewChapterTitle(e.target.value)}
                      className="input-field"
                      style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
                    เพิ่มตอนในระบบ
                  </button>
                </form>

                {/* List of Chapters with Delete Action */}
                <h4 style={{ margin: '20px 0 10px 0', fontSize: '0.9rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                  ตอนในระบบขณะนี้ ({mangaChapters.length} ตอน)
                </h4>

                {mangaChapters.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '12px' }}>
                    ไม่มีตอนในระบบ มังงะนี้กำลังว่างเปล่า
                  </p>
                ) : (
                  <div style={styles.chapterAdminList}>
                    {mangaChapters.map((c) => (
                      <div key={c.id} style={styles.chapterAdminRow}>
                        <div style={styles.chapterAdminMeta}>
                          <span style={styles.chapterAdminNum}>ตอนที่ {c.chapter}</span>
                          <span style={styles.chapterAdminTitle} title={c.title}>{c.title}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({c.pages} หน้า)</span>
                        </div>
                        <button 
                          className="btn btn-danger" 
                          style={styles.deleteChapterBtn}
                          onClick={() => handleDeleteChapter(c.id, c.chapter)}
                        >
                          ลบตอน
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '24px' }}>
                กรุณาเลือกมังงะในรายการฝั่งซ้ายเพื่อจัดการตอน
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    paddingTop: '20px',
    paddingBottom: '60px',
    textAlign: 'left',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '2rem',
    color: 'var(--text-main)',
    marginBottom: '8px',
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
  },
  tabsContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
  },
  tabBtn: {
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: '0.2s',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: '32px',
    alignItems: 'start',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  rightCol: {
    padding: '24px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    color: 'var(--text-main)',
    margin: 0,
  },
  emptyQueue: {
    padding: '48px',
    textAlign: 'center',
    borderRadius: '14px',
    border: '1px dashed var(--border-color)',
  },
  mobileJobCard: {
    padding: '16px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  codeText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem',
    color: 'var(--text-main)',
    background: 'var(--bg-input)',
    padding: '8px 12px',
    borderRadius: '6px',
  },
  blockText: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    background: 'var(--bg-input)',
    padding: '8px 12px',
    borderRadius: '6px',
  },
  suggestedText: {
    fontSize: '0.85rem',
    color: 'var(--accent-purple)',
    fontWeight: '700',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    padding: '8px 12px',
    borderRadius: '6px',
  },
  tableWrapper: {
    overflowX: 'auto',
    border: '1px solid var(--border-color)',
    borderRadius: '14px',
    background: 'var(--bg-card)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  trHeader: {
    borderBottom: '2px solid var(--border-color)',
  },
  thCol: {
    padding: '12px 16px',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  trRow: {
    borderBottom: '1px solid var(--border-color)',
    transition: 'background-color 0.2s',
  },
  tdCol: {
    padding: '14px 16px',
    fontSize: '0.85rem',
    verticalAlign: 'middle',
  },
  actionsCell: {
    display: 'flex',
    gap: '8px',
  },
  actionBtn: {
    padding: '6px 12px',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  userList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  userCard: {
    padding: '16px',
    background: 'var(--bg-input)',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    textAlign: 'left',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  userMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userDetailRow: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  userActionBox: {
    borderTop: '1px solid var(--border-color)',
    paddingTop: '10px',
  },
  statusActiveRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBannedRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeText: {
    fontSize: '0.8rem',
    color: '#10b981',
    fontWeight: '600',
  },
  bannedText: {
    fontSize: '0.8rem',
    color: '#ef4444',
    fontWeight: '600',
  },
  banBtn: {
    padding: '6px 12px',
    fontSize: '0.75rem',
  },

  // Manga list styles
  mangaAdminList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  mangaAdminCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    cursor: 'pointer',
    borderRadius: '12px',
    transition: '0.2s',
  },
  mangaAdminCover: {
    width: '50px',
    height: '68px',
    objectFit: 'cover',
    borderRadius: '6px',
    marginRight: '16px',
  },
  mangaAdminMeta: {
    flex: 1,
    textAlign: 'left',
  },
  mangaTagsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  deleteMangaBtn: {
    padding: '6px 12px',
    fontSize: '0.75rem',
  },

  // Chapters admin form
  addChapterForm: {
    background: 'var(--bg-input)',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    marginBottom: '20px',
    textAlign: 'left',
  },
  formRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
  },
  formLabel: {
    display: 'block',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginBottom: '4px',
    fontWeight: 'bold',
  },
  chapterAdminList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '260px',
    overflowY: 'auto',
    paddingRight: '4px',
  },
  chapterAdminRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
  },
  chapterAdminMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.8rem',
    overflow: 'hidden',
  },
  chapterAdminNum: {
    fontWeight: '800',
    color: 'var(--accent-cyan)',
    flexShrink: 0,
  },
  chapterAdminTitle: {
    color: 'var(--text-main)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '140px',
  },
  deleteChapterBtn: {
    padding: '4px 10px',
    fontSize: '0.7rem',
  }
};
