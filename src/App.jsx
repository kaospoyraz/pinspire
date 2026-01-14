import React, { useState, useMemo } from "react";

const LOGO_URL = "https://i.hizliresim.com/jtv095w.jpeg";

const App = () => {
  /* ====== GLOBAL ====== */
  const [darkMode, setDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [verifyCode, setVerifyCode] = useState("");
  const [sentCode, setSentCode] = useState(null);

  /* ====== NAVIGATION ====== */
  const [activeTab, setActiveTab] = useState("home");

  /* ====== SEARCH ====== */
  const [searchQuery, setSearchQuery] = useState("");

  /* ====== AUTH FORMS ====== */
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  const [registerForm, setRegisterForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    country: "",
    city: "",
    birthday: ""
  });

  /* ====== PROFILE EDIT ====== */
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editAvatarFile, setEditAvatarFile] = useState(null);
  const [editBio, setEditBio] = useState("");

  /* ====== DATA ====== */
  const [users, setUsers] = useState([]);
  const [allPins, setAllPins] = useState([]);
  const [savedPins, setSavedPins] = useState([]);
  const [likedPins, setLikedPins] = useState([]);

  /* ====== ADD PIN ====== */
  const [showAddPin, setShowAddPin] = useState(false);
  const [newPinFile, setNewPinFile] = useState(null);
  const [newPinType, setNewPinType] = useState("image");
  const [newPinTitle, setNewPinTitle] = useState("");

  /* ====== PIN FULL VIEW ====== */
  const [openPin, setOpenPin] = useState(null);

  /* ====== SEND CODE ====== */
  const sendCode = () => {
    const c = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(c);
    alert("Doğrulama kodun: " + c);
    setAuthMode("verify");
  };

  /* ====== REGISTER ====== */
  const handleRegister = () => {
    if (
      !registerForm.username ||
      !registerForm.name ||
      !registerForm.email ||
      !registerForm.password ||
      !registerForm.city ||
      !registerForm.country ||
      !registerForm.birthday
    ) {
      alert("Boş yer bırakma");
      return;
    }

    if (registerForm.password.length < 6) {
      alert("Şifre en az 6 karakter olmalı");
      return;
    }

    sendCode();
  };

  const confirmCode = () => {
    if (verifyCode !== sentCode) {
      alert("Kod hatalı");
      return;
    }

    const newUser = {
      id: Date.now(),
      ...registerForm,
      avatar: null,
      bio: "",
      posts: []
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    alert("Kayıt tamamlandı");
  };

  /* ====== LOGIN ====== */
  const handleLogin = () => {
    const u = users.find(
      (x) =>
        x.email === loginForm.email && x.password === loginForm.password
    );
    if (!u) {
      alert("Bilgiler hatalı");
      return;
    }
    setCurrentUser(u);
  };

  /* ====== LIKE / SAVE ====== */
  const toggleLike = (id) => {
    setLikedPins((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );
  };

  const toggleSave = (id) => {
    setSavedPins((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );
  };

  /* ====== ADD PIN ====== */
  const addPin = () => {
    if (!newPinFile) {
      alert("Seçili dosya yok");
      return;
    }

    const url = URL.createObjectURL(newPinFile);

    const pin = {
      id: Date.now(),
      url,
      type: newPinType,
      title: newPinTitle,
      userId: currentUser.id,
      userName: currentUser.username
    };

    setAllPins([pin, ...allPins]);

    setShowAddPin(false);
    setNewPinFile(null);
    setNewPinTitle("");
  };

  /* ====== FILTER ====== */
  const filteredPins = useMemo(() => {
    let p = allPins;

    if (activeTab === "likes") p = p.filter((x) => likedPins.includes(x.id));
    if (activeTab === "saved") p = p.filter((x) => savedPins.includes(x.id));
    if (activeTab === "profile") p = p.filter((x) => x.userId === currentUser?.id);

    if (searchQuery)
      p = p.filter((x) =>
        x.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return p;
  }, [allPins, likedPins, savedPins, activeTab, searchQuery, currentUser]);

  /* ====== AUTH UI ====== */
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-2xl w-96 shadow">

          <div className="flex justify-center mb-3">
            <img src={LOGO_URL} className="w-16 h-16 rounded-xl" />
          </div>

          {authMode === "login" && (
            <>
              <h2 className="text-xl font-bold text-center mb-2">Giriş yap</h2>

              <input
                className="w-full border p-2 rounded mt-2"
                placeholder="E-posta"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
              />

              <input
                type="password"
                className="w-full border p-2 rounded mt-2"
                placeholder="Şifre"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
              />

              <button
                className="w-full bg-purple-600 text-white p-2 rounded mt-3"
                onClick={handleLogin}
              >
                Giriş yap
              </button>

              <p
                className="text-center mt-2 text-sm cursor-pointer"
                onClick={() => setAuthMode("register")}
              >
                Hesabın yok mu? Kayıt ol
              </p>
            </>
          )}

          {authMode === "register" && (
            <>
              <h2 className="text-xl font-bold text-center mb-2">Kayıt ol</h2>

              <input
                className="w-full border p-2 rounded mt-2"
                placeholder="Kullanıcı adı"
                value={registerForm.username}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, username: e.target.value })
                }
              />

              <input
                className="w-full border p-2 rounded mt-2"
                placeholder="Ad Soyad"
                value={registerForm.name}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, name: e.target.value })
                }
              />

              <input
                className="w-full border p-2 rounded mt-2"
                placeholder="E-posta"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, email: e.target.value })
                }
              />

              <input
                type="password"
                className="w-full border p-2 rounded mt-2"
                placeholder="Şifre"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, password: e.target.value })
                }
              />

              <input
                className="w-full border p-2 rounded mt-2"
                placeholder="Ülke"
                value={registerForm.country}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, country: e.target.value })
                }
              />

              <input
                className="w-full border p-2 rounded mt-2"
                placeholder="Şehir"
                value={registerForm.city}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, city: e.target.value })
                }
              />

              <input
                type="date"
                className="w-full border p-2 rounded mt-2"
                value={registerForm.birthday}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, birthday: e.target.value })
                }
              />

              <button
                className="w-full bg-purple-600 text-white p-2 rounded mt-3"
                onClick={handleRegister}
              >
                Doğrulama kodu al
              </button>

              <p
                className="text-center mt-2 text-sm cursor-pointer"
                onClick={() => setAuthMode("login")}
              >
                Zaten hesabın var mı? Giriş yap
              </p>
            </>
          )}

          {authMode === "verify" && (
            <>
              <h2 className="text-xl font-bold text-center mb-2">
                E-posta doğrulama
              </h2>

              <input
                className="w-full border p-2 rounded mt-2"
                placeholder="Gelen kodu yaz"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
              />

              <button
                className="w-full bg-green-600 text-white p-2 rounded mt-3"
                onClick={confirmCode}
              >
                Hesabı oluştur
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  /* ====== MAIN UI ====== */
  return (
    <div className={darkMode ? "bg-gray-900 text-white min-h-screen" : "bg-gray-100 min-h-screen"}>

      {/* HEADER */}
      <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow">
        <img
          src={LOGO_URL}
          className="w-12 h-12 rounded-xl cursor-pointer"
          onClick={() => setActiveTab("home")}
        />

        <div className="flex gap-3">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Açık mod" : "Koyu mod"}
          </button>
          <button onClick={() => setCurrentUser(null)} className="text-red-500">
            Çıkış
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="p-3">
        <input
          className="w-full border p-2 rounded"
          placeholder="Ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-3 p-3 pb-20">
        {filteredPins.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow cursor-pointer"
            onClick={() => setOpenPin(p)}
          >
            {p.type === "image" ? (
              <img src={p.url} className="rounded-xl h-44 w-full object-cover" />
            ) : (
              <video src={p.url} className="rounded-xl h-44 w-full object-cover" />
            )}
          </div>
        ))}
      </div>

      {/* FULLSCREEN PIN */}
      {openPin && (
        <div className="fixed inset-0 bg-black/80 overflow-y-auto">
          <div className="max-w-xl mx-auto mt-6 bg-white dark:bg-gray-900 rounded-2xl p-3">

            {openPin.type === "image" ? (
              <img src={openPin.url} className="w-full rounded-xl" />
            ) : (
              <video src={openPin.url} controls className="w-full rounded-xl" />
            )}

            <p className="mt-2 font-semibold">{openPin.title}</p>

            <div className="flex justify-between mt-2">
              <button onClick={() => toggleLike(openPin.id)}>♥ Beğen</button>
              <button onClick={() => toggleSave(openPin.id)}>★ Kaydet</button>
            </div>

            <button
              className="w-full mt-3 p-2 bg-red-500 text-white rounded"
              onClick={() => setOpenPin(null)}
            >
              Kapat
            </button>
          </div>

          <div className="p-4 grid grid-cols-2 gap-3 pb-10">
            {allPins
              .filter((x) => x.id !== openPin.id)
              .slice(0, 20)
              .map((s) => (
                <div key={s.id} onClick={() => setOpenPin(s)}>
                  <img src={s.url} className="rounded-xl h-36 w-full object-cover" />
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ADD BUTTON */}
      <button
        onClick={() => setShowAddPin(true)}
        className="fixed bottom-24 right-4 bg-purple-600 text-white p-4 rounded-full"
      >
        +
      </button>

      {/* NAV BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow flex justify-around p-2 text-sm">
        <button onClick={() => setActiveTab("home")}>Ana sayfa</button>
        <button onClick={() => setActiveTab("explore")}>Keşfet</button>
        <button onClick={() => setActiveTab("likes")}>Beğeniler</button>
        <button onClick={() => setActiveTab("saved")}>Kaydedilenler</button>
        <button onClick={() => setActiveTab("profile")}>Profil</button>
      </div>

      {/* ADD PIN MODAL */}
      {showAddPin && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-4 rounded-xl w-80">
            <h3>Paylaşım ekle</h3>

            <select
              className="w-full border p-2 rounded mt-2"
              value={newPinType}
              onChange={(e) => setNewPinType(e.target.value)}
            >
              <option value="image">Fotoğraf</option>
              <option value="video">Video</option>
            </select>

            <input
              type="file"
              accept={newPinType === "image" ? "image/*" : "video/*"}
              className="w-full mt-2"
              onChange={(e) => setNewPinFile(e.target.files[0])}
            />

            <input
              className="w-full border p-2 rounded mt-2"
              placeholder="Başlık"
              value={newPinTitle}
              onChange={(e) => setNewPinTitle(e.target.value)}
            />

            <button
              className="w-full bg-purple-600 text-white p-2 rounded mt-2"
              onClick={addPin}
            >
              Paylaş
            </button>

            <button className="w-full mt-2" onClick={() => setShowAddPin(false)}>
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* PROFILE EDIT */}
      {editProfileOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-4 rounded-xl w-80">
            <h3>Profili düzenle</h3>

            <input
              type="file"
              accept="image/*"
              className="w-full mt-2"
              onChange={(e) => setEditAvatarFile(e.target.files[0])}
            />

            <textarea
              className="w-full border p-2 rounded mt-2"
              placeholder="Biyografi"
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
            />

            <button
              className="w-full bg-green-600 text-white p-2 rounded mt-2"
              onClick={() => {
                let avatarUrl = currentUser.avatar;

                if (editAvatarFile) {
                  avatarUrl = URL.createObjectURL(editAvatarFile);
                }

                const updated = {
                  ...currentUser,
                  avatar: avatarUrl,
                  bio: editBio
                };

                setCurrentUser(updated);
                setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
                setEditProfileOpen(false);
              }}
            >
              Kaydet
            </button>

            <button className="w-full mt-2" onClick={() => setEditProfileOpen(false)}>
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
