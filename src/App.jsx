import React, { useState, useMemo } from "react";

const LOGO_URL = "https://i.hizliresim.com/jtv095w.jpeg";

const App = () => {
  /* ============ GLOBAL ============ */
  const [darkMode, setDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [verifyCode, setVerifyCode] = useState("");
  const [sentCode, setSentCode] = useState(null);

  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");

  /* ============ AUTH FORMS ============ */

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

  /* ============ USERS & PINS ============ */

  const [users, setUsers] = useState([]);
  const [allPins, setAllPins] = useState([]);

  const [savedPins, setSavedPins] = useState([]);
  const [likedPins, setLikedPins] = useState([]);

  /* ADD PIN */
  const [showAddPin, setShowAddPin] = useState(false);
  const [newPinFile, setNewPinFile] = useState(null);
  const [newPinType, setNewPinType] = useState("image");
  const [newPinTitle, setNewPinTitle] = useState("");

  /* SEND CODE */
  const sendCode = () => {
    const c = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(c);
    alert("E-posta doğrulama kodun: " + c);
    setAuthMode("verify");
  };

  /* REGISTER */
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
      alert("Lütfen tüm alanları doldurun");
      return;
    }

    if (registerForm.password.length < 6) {
      alert("Şifre en az 6 karakter olmalı");
      return;
    }

    if (users.find((u) => u.email === registerForm.email)) {
      alert("Bu e-posta zaten kayıtlı");
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
      avatar: null,      // OTOMATİK FOTO YOK
      bio: "",
      posts: []
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    alert("Kayıt tamamlandı!");
  };

  /* LOGIN */
  const handleLogin = () => {
    const u = users.find(
      (x) =>
        x.email === loginForm.email && x.password === loginForm.password
    );
    if (!u) {
      alert("Email veya şifre hatalı");
      return;
    }
    setCurrentUser(u);
  };

  /* LIKE / SAVE */
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

  /* ADD PIN – FIXED FILE HANDLING */
  const addPin = () => {
    if (!newPinFile) {
      alert("Seçili dosya yok");
      return;
    }

    if (!newPinTitle.trim()) {
      alert("Başlık gir");
      return;
    }

    const objectUrl = URL.createObjectURL(newPinFile);

    const pin = {
      id: Date.now(),
      url: objectUrl,
      type: newPinType,
      title: newPinTitle,
      userId: currentUser.id,
      userName: currentUser.username
    };

    setAllPins([pin, ...allPins]);

    // temizle
    setShowAddPin(false);
    setNewPinFile(null);
    setNewPinTitle("");
  };

  /* FILTER */
  const filteredPins = useMemo(() => {
    let p = allPins;
    if (searchQuery)
      p = p.filter((x) =>
        x.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return p;
  }, [allPins, searchQuery]);

  /* ============ AUTH SCREENS ============ */
  if (!currentUser) {
    return (
      <div
        className={
          darkMode
            ? "min-h-screen bg-gray-900 text-white flex items-center justify-center"
            : "min-h-screen bg-gray-100 text-black flex items-center justify-center"
        }
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-md shadow">

          {/* LOGO */}
          <div
            className="flex justify-center mb-4 cursor-pointer"
            onClick={() => window.location.reload()}
          >
            <img src={LOGO_URL} className="w-28 h-28 rounded-2xl object-cover" />
          </div>

          {/* LOGIN */}
          {authMode === "login" && (
            <div className="space-y-3">
              <input
                className="w-full border p-2 rounded"
                placeholder="E-posta"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
              />

              <input
                type="password"
                className="w-full border p-2 rounded"
                placeholder="Şifre"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
              />

              <button
                className="w-full bg-purple-600 text-white p-2 rounded"
                onClick={handleLogin}
              >
                Giriş yap
              </button>

              <p className="text-center text-sm">
                Hesabın yok mu?{" "}
                <button
                  className="text-purple-600"
                  onClick={() => setAuthMode("register")}
                >
                  Kayıt ol
                </button>
              </p>
            </div>
          )}

          {/* REGISTER */}
          {authMode === "register" && (
            <div className="space-y-3">

              <input
                className="w-full border p-2 rounded"
                placeholder="Kullanıcı adı"
                value={registerForm.username}
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    username: e.target.value
                  })
                }
              />

              <input
                className="w-full border p-2 rounded"
                placeholder="Ad Soyad"
                value={registerForm.name}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, name: e.target.value })
                }
              />

              <input
                className="w-full border p-2 rounded"
                placeholder="E-posta"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, email: e.target.value })
                }
              />

              <input
                type="password"
                className="w-full border p-2 rounded"
                placeholder="Şifre"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    password: e.target.value
                  })
                }
              />

              <input
                className="w-full border p-2 rounded"
                placeholder="Ülke"
                value={registerForm.country}
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    country: e.target.value
                  })
                }
              />

              <input
                className="w-full border p-2 rounded"
                placeholder="Şehir"
                value={registerForm.city}
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    city: e.target.value
                  })
                }
              />

              <input
                type="date"
                className="w-full border p-2 rounded"
                value={registerForm.birthday}
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    birthday: e.target.value
                  })
                }
              />

              <button
                className="w-full bg-purple-600 text-white p-2 rounded"
                onClick={handleRegister}
              >
                Devam et (Kod al)
              </button>

              <p className="text-center text-sm">
                Hesabın var mı?{" "}
                <button
                  className="text-purple-600"
                  onClick={() => setAuthMode("login")}
                >
                  Giriş yap
                </button>
              </p>
            </div>
          )}

          {/* VERIFY CODE */}
          {authMode === "verify" && (
            <div className="space-y-3">
              <p className="text-center">E-postana gelen kodu gir</p>

              <input
                className="w-full border p-2 rounded"
                placeholder="Doğrulama kodu"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
              />

              <button
                className="w-full bg-green-600 text-white p-2 rounded"
                onClick={confirmCode}
              >
                Onayla
              </button>
            </div>
          )}

          <div className="text-center mt-3">
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "Açık mod" : "Koyu mod"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ============ MAIN APP UI ============ */

  return (
    <div className={darkMode ? "bg-gray-900 text-white min-h-screen" : "bg-gray-100 min-h-screen"}>

      {/* HEADER LOGO */}
      <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow">
        <img
          src={LOGO_URL}
          className="w-12 h-12 rounded-xl cursor-pointer"
          onClick={() => {
            setActiveTab("home");
            window.location.reload();
          }}
        />
        <button onClick={() => setCurrentUser(null)} className="text-red-500">
          Çıkış
        </button>
      </div>

      {/* SEARCH */}
      <div className="p-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* PIN LIST */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {filteredPins.map((p) => (
          <div key={p.id} className="bg-white dark:bg-gray-800 rounded-xl shadow">

            {p.type === "image" ? (
              <img src={p.url} className="rounded-t-xl h-40 w-full object-cover" />
            ) : (
              <video src={p.url} controls className="rounded-t-xl h-40 w-full object-cover" />
            )}

            <div className="p-2">
              <p className="font-semibold">{p.title}</p>

              <div className="flex justify-between mt-2">
                <button onClick={() => toggleLike(p.id)}>♥</button>
                <button onClick={() => toggleSave(p.id)}>★</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD PIN BUTTON */}
      <button
        onClick={() => setShowAddPin(true)}
        className="fixed bottom-20 right-4 bg-purple-600 text-white p-4 rounded-full"
      >
        +
      </button>

      {/* ADD PIN MODAL */}
      {showAddPin && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-4 rounded-xl w-80">
            <h3>Paylaşım ekle</h3>

            <select
              className="w-full border p-2 rounded mt-2"
              value={newPinType}
              onChange={(e) => {
                setNewPinType(e.target.value);
                setNewPinFile(null);
              }}
            >
              <option value="image">Fotoğraf</option>
              <option value="video">Video</option>
            </select>

            <input
              key={newPinType}
              type="file"
              accept={newPinType === "image" ? "image/*" : "video/*"}
              className="w-full mt-2"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setNewPinFile(e.target.files[0]);
                } else {
                  setNewPinFile(null);
                }
              }}
            />

            <input
              className="w-full border p-2 rounded mt-2"
              placeholder="Başlık"
              value={newPinTitle}
              onChange={(e) => setNewPinTitle(e.target.value)}
            />

            <button
              onClick={addPin}
              className="w-full bg-purple-600 text-white p-2 rounded mt-2"
            >
              Paylaş
            </button>

            <button onClick={() => setShowAddPin(false)} className="w-full mt-2">
              Kapat
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
