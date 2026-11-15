import React,{useEffect,useMemo,useState} from 'react';
import{createRoot}from'react-dom/client';
import{supabase}from'./supabase';
import'./style.css';

const empty={title:'',author:'',excerpt:'',content:'',status:'draft'};
const fmtDate=v=>v?new Date(v).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}):'—';
const slugify=t=>String(t).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,75)||'artikel';
function App(){
 const [user,setUser]=useState(null),[role,setRole]=useState(null),[articles,setArticles]=useState([]);
 const [search,setSearch]=useState(''),[filter,setFilter]=useState('semua'),[selected,setSelected]=useState(null);
 const [editing,setEditing]=useState(undefined),[form,setForm]=useState(empty),[loginOpen,setLoginOpen]=useState(false);
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[busy,setBusy]=useState(false),[notice,setNotice]=useState(''),[loading,setLoading]=useState(true);
 const canEdit=['owner','admin','editor'].includes(role),canDelete=['owner','admin'].includes(role);
 useEffect(()=>{if(!supabase){setLoading(false);return;}
  supabase.auth.getUser().then(({data})=>setUser(data.user||null));
  const{data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>setUser(session?.user||null));
  return()=>subscription.unsubscribe();
 },[]);
 useEffect(()=>{let live=true;
  async function refresh(){
   if(!supabase)return;
   const [list,membership]=await Promise.all([
    supabase.from('newshub_articles').select('*').order('created_at',{ascending:false}),
    user?supabase.from('app_memberships').select('role').eq('app_key','NEWSHUB').eq('user_id',user.id).maybeSingle():Promise.resolve({data:null})
   ]);
   if(!live)return;
   if(list.error)setNotice('Gagal memuat artikel: '+list.error.message);
   else setArticles(list.data||[]);
   setRole(membership.data?.role||null);setLoading(false);
  }refresh();return()=>{live=false};
 },[user]);
 const items=useMemo(()=>articles.filter(a=>(filter==='semua'||(filter==='draft'&&a.status==='draft')||(filter==='published'&&a.status==='published'))&&[a.title,a.author,a.excerpt].join(' ').toLowerCase().includes(search.toLowerCase())),[articles,filter,search]);
 function startEditor(a=null){setEditing(a);setForm(a?{title:a.title,author:a.author,excerpt:a.excerpt,content:a.content,status:a.status}:empty);setSelected(null);}
 async function refresh(){const{data,error}=await supabase.from('newshub_articles').select('*').order('created_at',{ascending:false});if(error)setNotice(error.message);else setArticles(data||[]);}
 async function signIn(e){e.preventDefault();if(!supabase)return;setBusy(true);const{error}=await supabase.auth.signInWithPassword({email:email.trim(),password});setBusy(false);if(error){setNotice('Login gagal: '+error.message);return;}setLoginOpen(false);setPassword('');setNotice('Berhasil masuk ke akun Supabase.');}
 async function signOut(){await supabase.auth.signOut();setNotice('Berhasil keluar.');setEditing(undefined);}
 async function save(e){e.preventDefault();if(!canEdit||!supabase||!user)return;setBusy(true);
  const payload={title:form.title.trim(),author:form.author.trim(),excerpt:form.excerpt.trim(),content:form.content.trim(),status:form.status,published_at:form.status==='published'?(editing?.published_at||new Date().toISOString()):null};
  const result=editing?await supabase.from('newshub_articles').update(payload).eq('id',editing.id):await supabase.from('newshub_articles').insert({...payload,slug:slugify(payload.title)+'-'+Date.now().toString(36),author_id:user.id});
  setBusy(false);if(result.error){setNotice(result.error.message);return;}setEditing(undefined);setNotice('Artikel tersimpan.');await refresh();
 }
 async function remove(a){if(!canDelete||!window.confirm('Hapus artikel ini secara permanen?'))return;const{error}=await supabase.from('newshub_articles').delete().eq('id',a.id);if(error)setNotice(error.message);else{setSelected(null);setNotice('Artikel dihapus.');await refresh();}}
 return <div className="site">
 <header className="header"><div className="wrap nav"><a href="/" className="brand"><span className="brand-icon">N</span><span>NEWSHUB<small>EDITORIAL WORKSPACE</small></span></a><nav className="links"><a href="#articles">Artikel</a><a href="#about">Tentang</a></nav><div className="account">{user?<><span className="user-email">{user.email}</span><button className="soft-button" onClick={signOut}>Keluar</button></>:<button className="soft-button" onClick={()=>setLoginOpen(true)}>Masuk admin ↗</button>}</div></div></header>
 <main><div className="wrap"><section className="hero"><div><p className="eyebrow">IDEAS · WRITING · DIGITAL STORYTELLING</p><h1>Cerita yang layak <em>dibaca.</em></h1><p className="lead">Portal artikel dengan studio editorial terhubung Supabase. Rancang draft, publikasikan tulisan, dan kelola semuanya dalam satu ruang kerja.</p><a className="main-button" href="#articles">Jelajahi artikel <span>↗</span></a></div><aside className="hero-art"><div className="art-orbit"></div><span>THE<br/>EDITORIAL<br/>EDITION</span><small>BUILDING BETTER STORIES — 2026</small></aside></section>
 <section className="editorial" id="articles"><div className="section-top"><div><p className="eyebrow">THE JOURNAL</p><h2>Artikel terbaru<span>.</span></h2><p>Informasi ditampilkan dari database Supabase secara langsung.</p></div>{canEdit&&<button className="main-button" onClick={()=>startEditor()}>+ Tulis artikel</button>}</div>
 {!supabase&&<p className="alert">Konfigurasi Supabase belum tersedia. Isi environment variables VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY.</p>}
 <div className="toolbar"><div className="filter-buttons">{['semua','published',...(canEdit?['draft']:[])].map(x=><button key={x} className={filter===x?'active':''} onClick={()=>setFilter(x)}>{x==='semua'?'Semua':x==='published'?'Terbit':'Draft'}</button>)}</div><input aria-label="Cari artikel" value={search} onChange={e=>setSearch(e.target.value)} placeholder="⌕  Cari judul, penulis, topik..."/></div>
 {loading?<div className="empty">Memuat artikel...</div>:items.length?<div className="article-grid">{items.map((a,i)=><article className="article-card" key={a.id}><div className="article-art"><span>0{i+1}</span><strong>{a.title.slice(0,1).toUpperCase()}</strong><small>{a.status==='draft'?'DRAFT':'EDITORIAL'}</small></div><div className="card-content"><div className="meta"><span>{fmtDate(a.created_at)}</span><span className={a.status==='draft'?'tag draft':'tag'}>{a.status==='draft'?'Draft':'Terbit'}</span></div><h3>{a.title}</h3><p>{a.excerpt}</p><div className="card-footer"><span>Oleh {a.author}</span><button onClick={()=>setSelected(a)}>Baca ↗</button></div>{canEdit&&<div className="admin-actions"><button onClick={()=>startEditor(a)}>Edit</button>{canDelete&&<button onClick={()=>remove(a)}>Hapus</button>}</div>}</div></article>)}</div>:<div className="empty"><h3>Belum ada artikel di kategori ini.</h3><p>{canEdit?'Klik “Tulis artikel” untuk mulai.':'Konten publik akan tampil setelah artikel diterbitkan.'}</p></div>}
 </section><section className="about" id="about"><p className="eyebrow">ABOUT THE PROJECT</p><h2>Dibangun untuk latihan menulis dan mengelola konten.</h2><p>NewsHub adalah proyek pembelajaran yang dimigrasikan dari PHP/MySQL ke React dan Supabase. Konten draft serta perubahan artikel hanya bisa diakses editor terotorisasi.</p><span>Tri Puji Antoro · 221011402646</span></section></div></main>
 <footer className="footer"><div className="wrap"><span>© 2026 NEWSHUB</span><span>React · Vite · Supabase</span></div></footer>
 {notice&&<div className="toast" role="status"><span>{notice}</span><button onClick={()=>setNotice('')}>×</button></div>}
 {selected&&<div className="overlay" onClick={()=>setSelected(null)}><section className="detail modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)}>×</button><p className="eyebrow">NEWSHUB JOURNAL · {fmtDate(selected.published_at||selected.created_at)}</p><h2>{selected.title}</h2><p className="byline">Ditulis oleh {selected.author}</p><h3>{selected.excerpt}</h3><p className="body-text">{selected.content}</p></section></div>}
 {loginOpen&&<div className="overlay" onClick={()=>setLoginOpen(false)}><section className="modal signin" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setLoginOpen(false)}>×</button><p className="eyebrow">EDITOR ACCESS</p><h2>Masuk ke studio.</h2><p className="muted">Gunakan akun Supabase yang sudah memiliki role NewsHub.</p><form onSubmit={signIn}><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/></label><button className="main-button" disabled={busy}>{busy?'Memproses...':'Masuk ↗'}</button></form></section></div>}
 {canEdit&&editing!==undefined&&<Editor/>}
 </div>;
 function Editor(){return <div className="overlay" onClick={()=>setEditing(undefined)}><section className="modal editing" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setEditing(undefined)}>×</button><p className="eyebrow">EDITORIAL STUDIO</p><h2>{editing?.id?'Edit artikel':'Tulis artikel'}</h2><form onSubmit={save}><label>Judul<input required minLength="3" maxLength="180" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><label>Penulis<input required minLength="2" maxLength="100" value={form.author} onChange={e=>setForm({...form,author:e.target.value})}/></label><label>Ringkasan<textarea required minLength="5" maxLength="500" value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})}/></label><label>Isi artikel<textarea className="body-editor" required minLength="5" maxLength="30000" value={form.content} onChange={e=>setForm({...form,content:e.target.value})}/></label><label>Status<select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option value="draft">Draft</option><option value="published">Terbit</option></select></label><button className="main-button" disabled={busy}>{busy?'Menyimpan...':'Simpan artikel ↗'}</button></form></section></div>}
}
createRoot(document.getElementById('root')).render(<App/>);
