import React, { useState, useMemo } from "react";
import { 
  Search, Heart, User, Home, Plus, Bookmark, X, LogOut, Send, 
  MessageCircle, UserPlus, UserCheck, Image as ImageIcon, Video, Type, Mail 
} from "lucide-react";

const PinspireApp = () => {
  const LOGO_URL = "https://i.hizliresim.com/jtv095w.jpeg";

  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [selectedPin, setSelectedPin] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [viewingUserId, setViewingUserId] = useState(null);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ 
    firstName: "", lastName: "", username: "", email: "", 
    city: "", country: "", birthDate: "", password: "" 
  });
  const [newPost, setNewPost] = useState({ 
    type: "photo", title: "", description: "", 
    category: "Tasarım", media: null 
  });
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState({});
  const [savedPins, setSavedPins] = useState([]);
  const [likedPins, setLikedPins] = useState([]);

  const PINSPIRE_BOT = { 
    id: 0, name: "Pinspire Bot", username: "pinspire_bot", 
    email: "bot@pinspire.com", avatar: LOGO_URL, 
    bio: "Resmi Pinspire Botu", followers: 99999, 
    following: 0, followingList: [] 
  };

  const [users, setUsers] = useState([
    PINSPIRE_BOT,
    { id: 1, name: "Ahmet Yılmaz", username: "ahmetyilmaz", email: "ahmet@mail.com", password: "123456", avatar: "https://i.pravatar.cc/150?img=12", bio: "Tasarım tutkunu", city: "İstanbul", country: "Türkiye", followers: 1234, following: 567, followingList: [2, 3] },
    { id: 2, name: "Zeynep Kaya", username: "zeynepkaya", email: "zeynep@mail.com", password: "123456", avatar: "https://i.pravatar.cc/150?img=45", bio: "Moda bloggeri", city: "Ankara", country: "Türkiye", followers: 2340, following: 890, followingList: [1] },
    { id: 3, name: "Mehmet Demir", username: "mehmetdemir", email: "mehmet@mail.com", password: "123456", avatar: "https://i.pravatar.cc/150?img=33", bio: "Mimar", city: "İzmir", country: "Türkiye", followers: 3456, following: 234, followingList: [1, 2] },
  ]);

  const [allPins, setAllPins] = useState([
    { id: 101, image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400", title: "Yapay Zeka", description: "AI teknolojisi", category: "Teknoloji", userId: 0, userName: "Pinspire Bot", saves: 2341, likes: 1876, commentCount: 234 },
    { id: 102, image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400", title: "Doğa", description: "Manzaralar", category: "Doğa", userId: 0, userName: "Pinspire Bot", saves: 3421, likes: 2987, commentCount: 456 },
    { id: 103, image: "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=400", title: "Aşk", description: "Sevgi", category: "Duygu", userId: 0, userName: "Pinspire Bot", saves: 4532, likes: 3654, commentCount: 567 },
    { id: 1, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400", title: "Modern Ofis", description: "Minimal", category: "Tasarım", userId: 1, userName: "Ahmet Yılmaz", saves: 234, likes: 145, commentCount: 12 },
    { id: 2, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400", title: "Mimari", description: "Yapılar", category: "Mimari", userId: 3, userName: "Mehmet Demir", saves: 456, likes: 289, commentCount: 34 },
    { id: 3, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400", title: "Moda", description: "Trend", category: "Moda", userId: 2, userName: "Zeynep Kaya", saves: 678, likes: 534, commentCount: 45 },
  ]);

  const categories = ["Tümü", "Tasarım", "Mimari", "Sanat", "Moda", "Yemek", "Doğa", "Teknoloji", "Duygu"];

  const handleLogin = () => {
    const user = users.find(u => u.email === loginForm.email && u.password === loginForm.password);
    if (user) { setCurrentUser(user); setLoginForm({ email: "", password: "" }); } 
    else { alert("Email veya şifre hatalı!"); }
  };

  const handleRegister = () => {
    const { firstName, lastName, username, email, city, country, birthDate, password } = registerForm;
    if (!firstName || !lastName || !username || !email || !city || !country || !birthDate || !password) {
      alert("Lütfen tüm alanları doldurun!"); return;
    }
    if (password.length < 6) { alert("Şifre en az 6 karakter olmalı!"); return; }
    if (users.find(u => u.email === email)) { alert("Bu email kayıtlı!"); return; }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code); setVerificationStep(true); alert("Doğrulama kodu: " + code);
  };

  const handleVerification = () => {
    if (verificationCode === sentCode) {
      const { firstName, lastName, username, email, city, country, birthDate, password } = registerForm;
      const newUser = { 
        id: users.length + 1, name: `${firstName} ${lastName}`, username, email, password, 
        city, country, birthDate, avatar: `https://i.pravatar.cc/150?img=${users.length + 10}`, 
        bio: "Yeni kullanıcı", followers: 0, following: 0, followingList: [] 
      };
      setUsers([...users, newUser]); setCurrentUser(newUser);
      setRegisterForm({ firstName: "", lastName: "", username: "", email: "", city: "", country: "", birthDate: "", password: "" });
      setVerificationStep(false); setVerificationCode(""); alert("Kayıt başarılı!");
    } else { alert("Kod hatalı!"); }
  };

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.media) { alert("Başlık ve medya gerekli!"); return; }
    const post = { 
      id: allPins.length + 1, image: newPost.media, title: newPost.title, 
      description: newPost.description, category: newPost.category, 
      userId: currentUser.id, userName: currentUser.name, saves: 0, likes: 0, commentCount: 0 
    };
    setAllPins([post, ...allPins]); setShowCreatePost(false);
    setNewPost({ type: "photo", title: "", description: "", category: "Tasarım", media: null });
    alert("Paylaşıldı!");
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewPost({ ...newPost, media: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const toggleFollow = (userId) => {
    setUsers(users.map(u => {
      if (u.id === currentUser.id) {
        const isFollowing = u.followingList.includes(userId);
        return { ...u, followingList: isFollowing ? u.followingList.filter(id => id !== userId) : [...u.followingList, userId], following: isFollowing ? u.following - 1 : u.following + 1 };
      }
      if (u.id === userId) {
        const isFollowing = currentUser.followingList?.includes(userId);
        return { ...u, followers: isFollowing ? u.followers - 1 : u.followers + 1 };
      }
      return u;
    }));
    setCurrentUser(prev => {
      const isFollowing = prev.followingList?.includes(userId);
      return { ...prev, followingList: isFollowing ? prev.followingList.filter(id => id !== userId) : [...prev.followingList, userId], following: isFollowing ? prev.following - 1 : prev.following + 1 };
    });
  };

  const toggleSave = (pinId) => setSavedPins(prev => prev.includes(pinId) ? prev.filter(id => id !== pinId) : [...prev, pinId]);

  const toggleLike = (pinId) => {
    setLikedPins(prev => prev.includes(pinId) ? prev.filter(id => id !== pinId) : [...prev, pinId]);
    setAllPins(prev => prev.map(pin => pin.id === pinId ? { ...pin, likes: likedPins.includes(pinId) ? pin.likes - 1 : pin.likes + 1 } : pin));
  };

  const handleAddComment = (pinId) => {
    if (!newComment.trim()) return;
    const comment = { id: Date.now(), userId: currentUser.id, userName: currentUser.name, avatar: currentUser.avatar, text: newComment };
    setComments({ ...comments, [pinId]: [...(comments[pinId] || []), comment] });
    setAllPins(prev => prev.map(pin => pin.id === pinId ? { ...pin, commentCount: pin.commentCount + 1 } : pin));
    setNewComment("");
  };

  const openUserProfile = (userId) => { setViewingUserId(userId); setShowProfile(true); setShowUserSearch(false); };

  const filteredUsers = useMemo(() => {
    if (!userSearchQuery) return users.filter(u => u.id !== currentUser?.id);
    return users.filter(u => u.id !== currentUser?.id && (u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || u.bio.toLowerCase().includes(userSearchQuery.toLowerCase())));
  }, [userSearchQuery, users, currentUser]);

  const filteredPins = useMemo(() => {
    let result = allPins;
    if (selectedCategory !== "all") result = result.filter(pin => pin.category.toLowerCase() === selectedCategory.toLowerCase());
    if (searchQuery) result = result.filter(pin => pin.title.toLowerCase().includes(searchQuery.toLowerCase()));
    if (activeTab === "saved") result = result.filter(pin => savedPins.includes(pin.id));
    if (showProfile && viewingUserId !== null) result = result.filter(pin => pin.userId === viewingUserId);
    else if (showProfile && viewingUserId === null) result = result.filter(pin => pin.userId === currentUser?.id);
    return result;
  }, [selectedCategory, searchQuery, activeTab, savedPins, allPins, showProfile, viewingUserId, currentUser]);
  // Login ekranı
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center mb-8">
            <img src={LOGO_URL} alt="Logo" className="w-24 h-24 mx-auto mb-4 rounded-2xl shadow-lg" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2">Pinspire</h1>
            <p className="text-gray-600">İlham veren fikirler</p>
          </div>
          {verificationStep ? (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <Mail className="w-16 h-16 mx-auto text-purple-500 mb-2" />
                <h3 className="font-bold text-lg mb-2">Email Doğrulama</h3>
                <p className="text-sm text-gray-600">6 haneli kod</p>
              </div>
              <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 focus:border-purple-500 outline-none text-center text-2xl" placeholder="000000" maxLength={6} />
              <button onClick={handleVerification} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold">Doğrula</button>
              <button onClick={() => { setVerificationStep(false); setVerificationCode(""); }} className="w-full text-gray-600 text-sm">Geri</button>
            </div>
          ) : authMode === "login" ? (
            <div className="space-y-4">
              <input type="email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 focus:border-purple-500 outline-none" placeholder="Email" />
              <input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 focus:border-purple-500 outline-none" placeholder="Şifre" />
              <button onClick={handleLogin} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold">Giriş Yap</button>
              <p className="text-center text-sm">Hesabın yok mu? <button onClick={() => setAuthMode("register")} className="text-purple-600 font-semibold">Kayıt Ol</button></p>
              <div className="text-xs text-center text-gray-500 border-t pt-4"><p>Demo: ahmet@mail.com / 123456</p></div>
            </div>
          ) : (
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" value={registerForm.firstName} onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })} className="px-4 py-2 rounded-xl border-2 focus:border-purple-500 outline-none text-sm" placeholder="Ad" />
                <input type="text" value={registerForm.lastName} onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })} className="px-4 py-2 rounded-xl border-2 focus:border-purple-500 outline-none text-sm" placeholder="Soyad" />
              </div>
              <input type="text" value={registerForm.username} onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })} className="w-full px-4 py-2 rounded-xl border-2 focus:border-purple-500 outline-none text-sm" placeholder="Kullanıcı Adı" />
              <input type="email" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} className="w-full px-4 py-2 rounded-xl border-2 focus:border-purple-500 outline-none text-sm" placeholder="Email" />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" value={registerForm.city} onChange={(e) => setRegisterForm({ ...registerForm, city: e.target.value })} className="px-4 py-2 rounded-xl border-2 focus:border-purple-500 outline-none text-sm" placeholder="Şehir" />
                <input type="text" value={registerForm.country} onChange={(e) => setRegisterForm({ ...registerForm, country: e.target.value })} className="px-4 py-2 rounded-xl border-2 focus:border-purple-500 outline-none text-sm" placeholder="Ülke" />
              </div>
              <input type="date" value={registerForm.birthDate} onChange={(e) => setRegisterForm({ ...registerForm, birthDate: e.target.value })} className="w-full px-4 py-2 rounded-xl border-2 focus:border-purple-500 outline-none text-sm" />
              <input type="password" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} className="w-full px-4 py-2 rounded-xl border-2 focus:border-purple-500 outline-none text-sm" placeholder="Şifre" />
              <button onClick={handleRegister} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold">Kayıt Ol</button>
              <p className="text-center text-sm">Hesabın var mı? <button onClick={() => setAuthMode("login")} className="text-purple-600 font-semibold">Giriş Yap</button></p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Yeni gönderi ekranı
  if (showCreatePost) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={() => setShowCreatePost(false)} className="text-2xl">←</button>
            <h2 className="font-bold text-lg">Yeni Gönderi</h2>
            <button onClick={handleCreatePost} className="px-4 py-2 bg-purple-500 text-white rounded-full font-semibold text-sm">Paylaş</button>
          </div>
        </header>
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white rounded-3xl p-6">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Medya Türü</label>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => setNewPost({ ...newPost, type: "photo" })} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${newPost.type === "photo" ? "border-purple-500 bg-purple-50" : "border-gray-200"}`}>
                  <ImageIcon size={24} />
                  <span className="text-sm font-semibold">Fotoğraf</span>
                </button>
                <button onClick={() => setNewPost({ ...newPost, type: "video" })} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${newPost.type === "video" ? "border-purple-500 bg-purple-50" : "border-gray-200"}`}>
                  <Video size={24} />
                  <span className="text-sm font-semibold">Video</span>
                </button>
                <button onClick={() => setNewPost({ ...newPost, type: "text" })} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${newPost.type === "text" ? "border-purple-500 bg-purple-50" : "border-gray-200"}`}>
                  <Type size={24} />
                  <span className="text-sm font-semibold">Yazı</span>
                </button>
              </div>
            </div>
            {newPost.type !== "text" && (
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Galeri</label>
                <input type="file" accept={newPost.type === "photo" ? "image/*" : "video/*"} onChange={handleFileSelect} className="w-full px-4 py-3 rounded-xl border-2" />
                {newPost.media && <img src={newPost.media} alt="Preview" className="w-full rounded-xl mt-3 max-h-64 object-cover" />}
              </div>
            )}
            <input type="text" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 mb-4" placeholder="Başlık" />
            <textarea value={newPost.description} onChange={(e) => setNewPost({ ...newPost, description: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 mb-4" placeholder="Açıklama" rows={3} />
            <select value={newPost.category} onChange={(e) => setNewPost({ ...newPost, category: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2">
              {categories.filter(c => c !== "Tümü").map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 z-40">
          <button onClick={() => { setShowCreatePost(false); setActiveTab("home"); }} className="text-gray-400"><Home size={24} /></button>
          <button onClick={() => { setShowCreatePost(false); setShowUserSearch(true); }} className="text-gray-400"><Search size={24} /></button>
          <button className="text-purple-600"><Plus size={24} /></button>
          <button onClick={() => { setShowCreatePost(false); setActiveTab("saved"); }} className="text-gray-400"><Bookmark size={24} /></button>
          <button onClick={() => { setShowCreatePost(false); setShowMessages(true); }} className="text-gray-400"><MessageCircle size={24} /></button>
        </nav>
      </div>
    );
  }

  // Mesajlar ekranı
  if (showMessages) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={() => setShowMessages(false)} className="text-2xl">←</button>
            <h2 className="font-bold text-lg">Mesajlar</h2>
            <div className="w-6"></div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto p-4 text-center py-20">
          <MessageCircle size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold mb-2">Henüz mesaj yok</h3>
          <p className="text-gray-600">Yakında</p>
        </div>
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 z-40">
          <button onClick={() => { setShowMessages(false); setActiveTab("home"); }} className="text-gray-400"><Home size={24} /></button>
          <button onClick={() => { setShowMessages(false); setShowUserSearch(true); }} className="text-gray-400"><Search size={24} /></button>
          <button onClick={() => { setShowMessages(false); setShowCreatePost(true); }} className="text-gray-400"><Plus size={24} /></button>
          <button onClick={() => { setShowMessages(false); setActiveTab("saved"); }} className="text-gray-400"><Bookmark size={24} /></button>
          <button className="text-purple-600"><MessageCircle size={24} /></button>
        </nav>
      </div>
    );
  }

  // Kullanıcı arama ekranı
  if (showUserSearch) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
            <button onClick={() => setShowUserSearch(false)} className="text-2xl">←</button>
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Kullanıcı ara" value={userSearchQuery} onChange={(e) => setUserSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full outline-none" />
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto p-4">
          {filteredUsers.map(user => {
            const isFollowing = currentUser.followingList?.includes(user.id);
            return (
              <div key={user.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 mb-3">
                <img src={user.avatar} alt="" className="w-16 h-16 rounded-full cursor-pointer" onClick={() => openUserProfile(user.id)} />
                <div className="flex-1 cursor-pointer" onClick={() => openUserProfile(user.id)}>
                  <h3 className="font-bold">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.bio}</p>
                </div>
                {user.id !== 0 && (
                  <button onClick={() => toggleFollow(user.id)} className={`px-5 py-2 rounded-full font-semibold text-sm ${isFollowing ? "bg-gray-200" : "bg-purple-500 text-white"}`}>
                    {isFollowing ? "Takipte" : "Takip"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 z-40">
          <button onClick={() => { setShowUserSearch(false); setActiveTab("home"); }} className="text-gray-400"><Home size={24} /></button>
          <button className="text-purple-600"><Search size={24} /></button>
          <button onClick={() => { setShowUserSearch(false); setShowCreatePost(true); }} className="text-gray-400"><Plus size={24} /></button>
          <button onClick={() => { setShowUserSearch(false); setActiveTab("saved"); }} className="text-gray-400"><Bookmark size={24} /></button>
          <button onClick={() => { setShowUserSearch(false); setShowMessages(true); }} className="text-gray-400"><MessageCircle size={24} /></button>
        </nav>
      </div>
    );
  }

  // Profil ekranı
  if (showProfile) {
    const profileUser = viewingUserId !== null ? users.find(u => u.id === viewingUserId) : currentUser;
    const isOwnProfile = profileUser?.id === currentUser.id;
    const isFollowing = currentUser.followingList?.includes(profileUser?.id);

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={() => { setShowProfile(false); setViewingUserId(null); }} className="text-2xl">←</button>
            <h2 className="font-bold text-lg">Profil</h2>
            {isOwnProfile ? (
              <button onClick={() => setCurrentUser(null)} className="text-red-500"><LogOut size={20} /></button>
            ) : (
              <div className="w-6"></div>
            )}
          </div>
        </header>
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white rounded-3xl p-6 mb-4">
            <div className="flex items-start gap-4 mb-4">
              <img src={profileUser?.avatar} alt="" className="w-24 h-24 rounded-full" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{profileUser?.name}</h2>
                <p className="text-gray-600 mb-2">@{profileUser?.username}</p>
                <p className="text-sm mb-3">{profileUser?.bio}</p>
                {!isOwnProfile && profileUser?.id !== 0 && (
                  <button onClick={() => toggleFollow(profileUser.id)} className={`px-6 py-2 rounded-full font-semibold ${isFollowing ? "bg-gray-200" : "bg-purple-500 text-white"}`}>
                    {isFollowing ? "Takipte" : "Takip Et"}
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-6 text-center border-t pt-4">
              <div>
                <div className="font-bold text-xl">{filteredPins.length}</div>
                <div className="text-sm text-gray-600">Gönderi</div>
              </div>
              <div>
                <div className="font-bold text-xl">{profileUser?.followers}</div>
                <div className="text-sm text-gray-600">Takipçi</div>
              </div>
              <div>
                <div className="font-bold text-xl">{profileUser?.following}</div>
                <div className="text-sm text-gray-600">Takip</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {filteredPins.map(pin => (
              <div key={pin.id} onClick={() => setSelectedPin(pin)} className="bg-white rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition">
                <img src={pin.image} alt={pin.title} className="w-full h-48 object-cover" />
                <div className="p-3">
                  <h3 className="font-bold mb-1">{pin.title}</h3>
                  <p className="text-xs text-gray-600">{pin.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 z-40">
          <button onClick={() => { setShowProfile(false); setActiveTab("home"); }} className="text-gray-400"><Home size={24} /></button>
          <button onClick={() => { setShowProfile(false); setShowUserSearch(true); }} className="text-gray-400"><Search size={24} /></button>
          <button onClick={() => { setShowProfile(false); setShowCreatePost(true); }} className="text-gray-400"><Plus size={24} /></button>
          <button onClick={() => { setShowProfile(false); setActiveTab("saved"); }} className="text-gray-400"><Bookmark size={24} /></button>
          <button onClick={() => { setShowProfile(false); setShowMessages(true); }} className="text-gray-400"><MessageCircle size={24} /></button>
        </nav>
      </div>
    );
  }

  // Pin detay ekranı
  if (selectedPin) {
    const pinComments = comments[selectedPin.id] || [];
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={() => setSelectedPin(null)} className="text-2xl">←</button>
            <h2 className="font-bold text-lg">Detay</h2>
            <div className="w-6"></div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto">
          <img src={selectedPin.image} alt={selectedPin.title} className="w-full max-h-96 object-cover" />
          <div className="bg-white p-4">
            <div className="flex items-center gap-3 mb-4">
              <img src={users.find(u => u.id === selectedPin.userId)?.avatar} alt="" className="w-12 h-12 rounded-full cursor-pointer" onClick={() => openUserProfile(selectedPin.userId)} />
              <div className="flex-1 cursor-pointer" onClick={() => openUserProfile(selectedPin.userId)}>
                <h3 className="font-bold">{selectedPin.userName}</h3>
                <p className="text-xs text-gray-600">{selectedPin.category}</p>
              </div>
              {selectedPin.userId !== currentUser.id && selectedPin.userId !== 0 && (
                <button onClick={() => toggleFollow(selectedPin.userId)} className={`px-4 py-1 rounded-full text-sm font-semibold ${currentUser.followingList?.includes(selectedPin.userId) ? "bg-gray-200" : "bg-purple-500 text-white"}`}>
                  {currentUser.followingList?.includes(selectedPin.userId) ? "Takipte" : "Takip"}
                </button>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2">{selectedPin.title}</h2>
            <p className="text-gray-700 mb-4">{selectedPin.description}</p>
            <div className="flex gap-6 mb-4 py-3 border-y">
              <button onClick={() => toggleLike(selectedPin.id)} className="flex items-center gap-2">
                <Heart size={20} className={likedPins.includes(selectedPin.id) ? "fill-red-500 text-red-500" : ""} />
                <span>{selectedPin.likes}</span>
              </button>
              <button onClick={() => toggleSave(selectedPin.id)} className="flex items-center gap-2">
                <Bookmark size={20} className={savedPins.includes(selectedPin.id) ? "fill-purple-500 text-purple-500" : ""} />
                <span>{selectedPin.saves}</span>
              </button>
              <div className="flex items-center gap-2">
                <MessageCircle size={20} />
                <span>{selectedPin.commentCount}</span>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-bold mb-3">Yorumlar</h3>
              <div className="space-y-3 mb-4">
                {pinComments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <img src={comment.avatar} alt="" className="w-8 h-8 rounded-full" />
                    <div className="flex-1 bg-gray-100 rounded-2xl p-3">
                      <p className="font-semibold text-sm">{comment.userName}</p>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Yorum yaz..." className="flex-1 px-4 py-2 border-2 rounded-full outline-none focus:border-purple-500" />
                <button onClick={() => handleAddComment(selectedPin.id)} className="bg-purple-500 text-white p-2 rounded-full"><Send size={20} /></button>
              </div>
            </div>
          </div>
        </div>
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 z-40">
          <button onClick={() => { setSelectedPin(null); setActiveTab("home"); }} className="text-gray-400"><Home size={24} /></button>
          <button onClick={() => { setSelectedPin(null); setShowUserSearch(true); }} className="text-gray-400"><Search size={24} /></button>
          <button onClick={() => { setSelectedPin(null); setShowCreatePost(true); }} className="text-gray-400"><Plus size={24} /></button>
          <button onClick={() => { setSelectedPin(null); setActiveTab("saved"); }} className="text-gray-400"><Bookmark size={24} /></button>
          <button onClick={() => { setSelectedPin(null); setShowMessages(true); }} className="text-gray-400"><MessageCircle size={24} /></button>
        </nav>
      </div>
    );
  }

  // Ana sayfa
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <img src={LOGO_URL} alt="Logo" className="w-10 h-10 rounded-xl cursor-pointer" onClick={() => { setActiveTab("home"); setSearchQuery(""); setSelectedCategory("all"); }} />
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Pinspire</h1>
            <button onClick={() => { setShowProfile(true); setViewingUserId(null); }}><User size={24} /></button>
          </div>
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full outline-none" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat === "Tümü" ? "all" : cat)} className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold text-sm ${(selectedCategory === "all" && cat === "Tümü") || selectedCategory === cat ? "bg-purple-500 text-white" : "bg-gray-200"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {filteredPins.map(pin => (
            <div key={pin.id} onClick={() => setSelectedPin(pin)} className="bg-white rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition">
              <img src={pin.image} alt={pin.title} className="w-full h-48 object-cover" />
              <div className="p-3">
                <h3 className="font-bold mb-1">{pin.title}</h3>
                <p className="text-xs text-gray-600 mb-2">{pin.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Heart size={14} />{pin.likes}</span>
                  <span className="flex items-center gap-1"><Bookmark size={14} />{pin.saves}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 z-40">
        <button onClick={() => setActiveTab("home")} className={activeTab === "home" ? "text-purple-600" : "text-gray-400"}><Home size={24} /></button>
        <button onClick={() => setShowUserSearch(true)} className="text-gray-400"><Search size={24} /></button>
        <button onClick={() => setShowCreatePost(true)} className="text-gray-400"><Plus size={24} /></button>
        <button onClick={() => setActiveTab("saved")} className={activeTab === "saved" ? "text-purple-600" : "text-gray-400"}><Bookmark size={24} /></button>
        <button onClick={() => setShowMessages(true)} className="text-gray-400"><MessageCircle size={24} /></button>
      </nav>
    </div>
  );
};

export default PinspireApp;
