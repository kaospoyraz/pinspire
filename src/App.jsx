import React, { useState, useMemo } from "react";

const LOGO_URL = "https://i.hizliresim.com/jtv095w.jpeg";

export default function App() {
  /* ========= GLOBAL ========= */
  const [darkMode, setDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [tab, setTab] = useState("home");

  /* ========= AUTH ========= */
  const [authMode, setAuthMode] = useState("login");
  const [verifyCode, setVerifyCode] = useState("");
  const [sentCode, setSentCode] = useState(null);

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

  /* ========= DATA ========= */
  const [users, setUsers] = useState([]);
  const [pins, setPins] = useState([]);
  const [saved, setSaved] = useState([]);
  const [liked, setLiked] = useState([]);

  /* ========= ADD PIN ========= */
  const [showAdd, setShowAdd] = useState(false);
  const [newFile, setNewFile] = useState(null);
  const [newType, setNewType] = useState("image");
  const [newTitle, setNewTitle] = useState("");

  /* ========= PIN PREVIEW ========= */
  const [openedPin, setOpenedPin] = useState(null);

  /* ========= SEARCH ========= */
  const [searchQuery, setSearchQuery] = useState("");

  /* ========= SEND VERIFY CODE ========= */
  const sendCode = () => {
    const c = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(c);
    alert("E-posta doğrulama kodu: " + c);
    setAuthMode("verify");
  };

  /* ========= REGISTER ========= */
  const handleRegister = () => {
    if (
      !registerForm.username ||
      !registerForm.email ||
      !registerForm.password
    ) {
      alert("Gerekli alanları doldurun");
      return;
    }

    sendCode();
  };

  const confirmCode = () => {
    if (verifyCode !== sentCode) {
      alert("Kod hatalı");
      return;
    }

    const u = {
      id: Date.now(),
      ...registerForm,
      bio: "",
      avatar: null
    };

    setUsers((d) => [...d, u]);
    setCurrentUser(u);
  };

  /* ========= LOGIN ========= */
  const handleLogin = () => {
    const u = users.find(
      (x) =>
        x.email === loginForm.email && x.password === loginForm.password
    );
    if (!u) {
      alert("E-posta veya şifre hatalı");
      return;
    }
    setCurrentUser(u);
  };

  /* ========= ADD PIN ========= */
  const addPin = () => {
    if (!newFile) {
      alert("Dosya seçilmedi");
      return;
    }

    const url = URL.createObjectURL(newFile);

    const pin = {
      id: Date.now(),
      url,
      title: newTitle,
      type: newType,
      owner: currentUser.username
    };

    setPins([pin, ...pins]);
    setShowAdd(false);
    setNewFile(null);
    setNewTitle("");
  };

  /* ========= LIKE & SAVE ========= */
  const toggleLike = (id) =>
    setLiked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const toggleSave = (id) =>
    setSaved((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  /* ========= FILTER ========= */
  const visiblePins = useMemo(() => {
    let x = pins;
    if (searchQuery)
      x = x.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    if (tab === "likes") x = x.filter((p) => liked.includes(p.id));
    if (tab === "saved") x = x.filter((p) => saved.includes(p.id));
    return x;
  }, [pins, searchQuery, tab, liked, saved]);

  /* ========= AUTH UI ========= */
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow">

          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img
              src={LOGO_URL}
              className="w-28 h-28 rounded-xl cursor-pointer"
              onClick={() => window.location.reload()}
            />
          </div>

          {/* LOGIN */}
          {authMode === "login" && (
            <div className="space-y-2">
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
            <div className="space-y-2">

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

              <button
                className="w-full bg-purple-600 text-white p-2 rounded"
                onClick={handleRegister}
              >
                Devam et (Kod al)
              </button>
            </div>
          )}

          {/* VERIFY */}
          {authMode === "verify" && (
            <div className="space-y-2">
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
        </div>
      </div>
    );
  }

  /* ========= MAIN UI ========= */
  return (
    <div className="min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between p-3 bg-white shadow">
        <img
          src={LOGO_URL}
          className="w-10 h-10 rounded-xl cursor-pointer"
          onClick={() => setTab("home")}
        />
        <input
          className="border p-2 rounded w-1/2"
          placeholder="Ara"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={() => setCurrentUser(null)}>Çıkış</button>
      </div>

      {/* PIN GRID */}
      <div className="grid grid-cols-2 gap-3 p-3">
        {visiblePins.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl shadow cursor-pointer"
            onClick={() => setOpenedPin(p)}
          >
            {p.type === "image" ? (
              <img src={p.url} className="rounded-xl object-cover h-44 w-full" />
            ) : (
              <video src={p.url} className="rounded-xl h-44 w-full" />
            )}
            <div className="p-2 text-sm">{p.title}</div>
          </div>
        ))}
      </div>

      {/* OPENED PIN FULLSCREEN */}
      {openedPin && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-white rounded-xl p-3 w-96 max-h-[90vh] overflow-y-auto">

            {openedPin.type === "image" ? (
              <img src={openedPin.url} className="rounded-xl w-full" />
            ) : (
              <video src={openedPin.url} controls className="rounded-xl w-full" />
            )}

            <h2 className="mt-2 text-lg font-semibold">{openedPin.title}</h2>
            <p className="text-sm text-gray-600">Paylaşan: {openedPin.owner}</p>

            <div className="flex gap-2 mt-2">
              <button onClick={() => toggleLike(openedPin.id)}>Beğen</button>
              <button onClick={() => toggleSave(openedPin.id)}>Kaydet</button>
              <button onClick={() => setOpenedPin(null)}>Kapat</button>
            </div>

            {/* önerilenler */}
            <h3 className="mt-3 font-semibold">Önerilenler</h3>

            {pins.slice(0, 4).map((r) => (
              <div
                key={r.id}
                className="mt-2 bg-gray-100 rounded-lg p-2 cursor-pointer"
                onClick={() => setOpenedPin(r)}
              >
                {r.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD BUTTON */}
      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-20 right-5 bg-purple-600 text-white rounded-full p-4"
      >
        +
      </button>

      {/* ADD MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-white rounded-xl p-3 w-80">
            <h2>Paylaşım ekle</h2>

            <select
              className="w-full border p-2 mt-2 rounded"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
            >
              <option value="image">Fotoğraf</option>
              <option value="video">Video</option>
            </select>

            <input
              type="file"
              accept={newType === "image" ? "image/*" : "video/*"}
              className="w-full mt-2"
              onChange={(e) => setNewFile(e.target.files?.[0] || null)}
            />

            <input
              className="w-full border p-2 rounded mt-2"
              placeholder="Başlık"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <button
              onClick={addPin}
              className="w-full bg-purple-600 text-white p-2 rounded mt-2"
            >
              Paylaş
            </button>

            <button
              onClick={() => setShowAdd(false)}
              className="w-full mt-1"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow flex justify-around p-2">
        <button onClick={() => setTab("home")}>Ana sayfa</button>
        <button onClick={() => setTab("explore")}>Keşfet</button>
        <button onClick={() => setTab("likes")}>Beğeniler</button>
        <button onClick={() => setTab("saved")}>Kaydedilenler</button>
        <button onClick={() => setTab("profile")}>Profil</button>
      </div>
    </div>
  );
}
