import React, { useState } from "react";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [verificationMode, setVerificationMode] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const [registerForm, setRegisterForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    city: "",
    country: "",
    birthday: "",
  });

  const [sentCode, setSentCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");

  const [users, setUsers] = useState([]);

  const [posts, setPosts] = useState([]);
  const [newPostFile, setNewPostFile] = useState(null);
  const [newPostType, setNewPostType] = useState("image");

  const [showProfile, setShowProfile] = useState(false);
  const [profileEdit, setProfileEdit] = useState({
    avatarFile: null,
    bio: "",
  });

  const logoUrl = "https://i.hizliresim.com/jtv095w.jpeg";

  // ANA SAYFAYI YENİLE
  const refreshHome = () => {
    setShowProfile(false);
    setPosts([...posts]); // basit yenile
  };

  // DOĞRULAMA KODU GÖNDER
  const sendVerificationCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code);
    alert("Doğrulama kodunuz: " + code);
    setVerificationMode(true);
  };

  // KAYIT
  const handleRegister = () => {
    if (!registerForm.username) return alert("Kullanıcı adı zorunlu");
    if (!registerForm.email || !registerForm.password)
      return alert("Email ve şifre zorunlu");

    sendVerificationCode();
  };

  // DOĞRULAMA
  const verifyCode = () => {
    if (enteredCode !== sentCode) return alert("Kod hatalı");

    const newUser = {
      ...registerForm,
      avatar: null, // otomatik yok
      bio: "",
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setVerificationMode(false);
    alert("Kayıt tamamlandı");
  };

  // GİRİŞ
  const handleLogin = () => {
    const found = users.find(
      (u) =>
        u.email === loginForm.email && u.password === loginForm.password
    );
    if (!found) return alert("Bilgiler hatalı");
    setCurrentUser(found);
  };

  // GÖNDERİ EKLE (GALERİDEN)
  const addPost = () => {
    if (!newPostFile) return alert("Dosya seçmedin");

    const url = URL.createObjectURL(newPostFile);

    setPosts([
      ...posts,
      {
        id: Date.now(),
        user: currentUser.username,
        type: newPostType,
        url,
      },
    ]);

    setNewPostFile(null);
  };

  // PROFİL FOTOĞRAFI KAYDET
  const saveAvatar = () => {
    if (!profileEdit.avatarFile) return;

    const url = URL.createObjectURL(profileEdit.avatarFile);

    setCurrentUser({
      ...currentUser,
      avatar: url,
    });
  };

  const theme = darkMode
    ? "bg-black text-white"
    : "bg-gray-100 text-gray-900";

  /* ================= AUTH: REGISTER ================= */

  if (!currentUser && !verificationMode && authMode === "register") {
    return (
      <div className={`${theme} min-h-screen flex items-center justify-center`}>
        <div className="bg-white/10 backdrop-blur p-6 rounded-2xl w-96">

          <div className="flex justify-center mb-4">
            <img
              src={logoUrl}
              alt="logo"
              className="w-28 h-28 rounded-2xl cursor-pointer"
              onClick={refreshHome}
            />
          </div>

          <h2 className="text-center font-bold mb-3">Kayıt Ol</h2>

          {[
            ["Kullanıcı Adı *", "username"],
            ["Ad Soyad", "name"],
            ["Email", "email"],
            ["Şifre", "password"],
            ["Şehir", "city"],
            ["Ülke", "country"],
          ].map(([ph, key]) => (
            <input
              key={key}
              type={key === "password" ? "password" : "text"}
              className="w-full p-2 mb-2 rounded"
              placeholder={ph}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, [key]: e.target.value })
              }
            />
          ))}

          <input
            type="date"
            className="w-full p-2 mb-3 rounded"
            onChange={(e) =>
              setRegisterForm({ ...registerForm, birthday: e.target.value })
            }
          />

          <button
            className="w-full bg-purple-600 text-white p-2 rounded"
            onClick={handleRegister}
          >
            Devam Et
          </button>

          <p
            className="text-sm mt-2 text-center cursor-pointer"
            onClick={() => setAuthMode("login")}
          >
            Hesabın var mı? Giriş yap
          </p>
        </div>
      </div>
    );
  }

  /* ================= AUTH: EMAIL VERIFY ================= */

  if (verificationMode && !currentUser) {
    return (
      <div className={`${theme} min-h-screen flex items-center justify-center`}>
        <div className="bg-white/10 backdrop-blur p-6 rounded-2xl w-96">
          <h2 className="text-center font-bold mb-3">E-posta Doğrulama</h2>

          <input
            className="w-full p-2 mb-2 rounded"
            placeholder="Gönderilen kodu gir"
            onChange={(e) => setEnteredCode(e.target.value)}
          />

          <button
            className="w-full bg-green-600 text-white p-2 rounded"
            onClick={verifyCode}
          >
            Onayla
          </button>
        </div>
      </div>
    );
  }

  /* ================= AUTH: LOGIN ================= */

  if (!currentUser && authMode === "login") {
    return (
      <div className={`${theme} min-h-screen flex items-center justify-center`}>
        <div className="bg-white/10 backdrop-blur p-6 rounded-2xl w-96">
          <div className="flex justify-center mb-4">
            <img
              src={logoUrl}
              alt="logo"
              className="w-28 h-28 rounded-2xl cursor-pointer"
              onClick={refreshHome}
            />
          </div>

          <h2 className="text-center font-bold mb-3">Giriş Yap</h2>

          <input
            className="w-full p-2 mb-2 rounded"
            placeholder="Email"
            onChange={(e) =>
              setLoginForm({ ...loginForm, email: e.target.value })
            }
          />

          <input
            type="password"
            className="w-full p-2 mb-2 rounded"
            placeholder="Şifre"
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
          />

          <button
            className="w-full bg-purple-600 text-white p-2 rounded"
            onClick={handleLogin}
          >
            Giriş Yap
          </button>

          <p
            className="text-sm mt-2 text-center cursor-pointer"
            onClick={() => setAuthMode("register")}
          >
            Hesabın yok mu? Kayıt ol
          </p>
        </div>
      </div>
    );
  }

  /* ================= MAIN APP ================= */

  return (
    <div className={`${theme} min-h-screen`}>

      {/* ÜST BAR */}
      <div className="flex justify-between items-center p-3">

        <img
          src={logoUrl}
          alt="logo"
          className="w-10 h-10 rounded-xl cursor-pointer"
          onClick={refreshHome}
        />

        <div className="flex gap-3">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Açık Mod" : "Koyu Mod"}
          </button>

          <button onClick={() => setShowProfile(!showProfile)}>
            Profil
          </button>

          <button onClick={() => setCurrentUser(null)}>Çıkış</button>
        </div>
      </div>

      {/* ANA SAYFA / FEED */}
      {!showProfile && (
        <div className="p-3">

          <h3 className="font-bold mb-2">Gönderi Ekle</h3>

          <select
            className="w-full p-2 rounded mb-2"
            onChange={(e) => setNewPostType(e.target.value)}
          >
            <option value="image">Fotoğraf</option>
            <option value="video">Video</option>
          </select>

          <input
            type="file"
            accept={newPostType === "image" ? "image/*" : "video/*"}
            className="w-full p-2 rounded mb-2"
            onChange={(e) => setNewPostFile(e.target.files[0])}
          />

          <button
            className="bg-green-600 text-white w-full p-2 rounded"
            onClick={addPost}
          >
            Paylaş
          </button>

          <h3 className="font-bold mt-4">Akış</h3>

          {posts.map((p) => (
            <div key={p.id} className="border p-2 rounded mt-2">
              <p className="text-sm">@{p.user}</p>

              {p.type === "image" && <img src={p.url} className="rounded" />}

              {p.type === "video" && (
                <video controls className="rounded">
                  <source src={p.url} />
                </video>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PROFİL SAYFASI */}
      {showProfile && (
        <div className="p-3">

          <h3 className="font-bold mb-2">Profilim</h3>

          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-400 flex items-center justify-center">
              Fotoğraf Yok
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            className="w-full p-2 mt-2 rounded"
            onChange={(e) =>
              setProfileEdit({
                ...profileEdit,
                avatarFile: e.target.files[0],
              })
            }
          />

          <button
            className="bg-blue-600 text-white w-full p-2 rounded mt-1"
            onClick={saveAvatar}
          >
            Profil Fotoğrafı Güncelle
          </button>

          <textarea
            className="w-full p-2 mt-3 rounded"
            placeholder="Bio"
            onChange={(e) =>
              setProfileEdit({ ...profileEdit, bio: e.target.value })
            }
          />

          <button
            className="bg-purple-600 text-white w-full p-2 rounded mt-1"
            onClick={() =>
              setCurrentUser({
                ...currentUser,
                bio: profileEdit.bio || currentUser.bio,
              })
            }
          >
            Bio Kaydet
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
