import React, { useState } from "react";
import {
  Home,
  User,
  Plus,
  Moon,
  Sun,
  LogOut,
  Heart,
  MessageCircle,
  UserPlus,
  UserCheck
} from "lucide-react";

const App = () => {
  // ---------- THEME ----------
  const [darkMode, setDarkMode] = useState(false);

  // ---------- AUTH ----------
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [verificationMode, setVerificationMode] = useState(false);

  // ---------- LOGIN ----------
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  // ---------- REGISTER ----------
  const [registerForm, setRegisterForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    city: "",
    country: "",
    birthday: ""
  });

  // ---------- USERS ----------
  const [users, setUsers] = useState([]);

  // ---------- VERIFICATION ----------
  const [sentCode, setSentCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");

  // ---------- POSTS ----------
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    type: "text",
    content: ""
  });

  // ---------- PROFILE ----------
  const [showProfile, setShowProfile] = useState(false);
  const [profileEdit, setProfileEdit] = useState({
    avatar: "",
    bio: ""
  });

  // ---------- FOLLOW ----------
  const toggleFollow = (user) => {
    if (!currentUser) return;

    const isFollowing = currentUser.following?.includes(user.username);

    setCurrentUser({
      ...currentUser,
      following: isFollowing
        ? currentUser.following.filter((u) => u !== user.username)
        : [...(currentUser.following || []), user.username]
    });
  };

  // ---------- SEND CODE ----------
  const sendVerificationCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code);
    alert("Doğrulama kodunuz: " + code);
    setVerificationMode(true);
  };

  // ---------- REGISTER ----------
  const handleRegister = () => {
    if (!registerForm.username) return alert("Kullanıcı adı zorunlu");
    if (!registerForm.email || !registerForm.password)
      return alert("E-posta ve şifre zorunlu");

    sendVerificationCode();
  };

  // ---------- VERIFY ----------
  const verifyCode = () => {
    if (enteredCode !== sentCode) return alert("Kod hatalı");

    const user = {
      ...registerForm,
      avatar: "https://i.pravatar.cc/150",
      bio: "",
      followers: [],
      following: []
    };

    setUsers([...users, user]);
    setCurrentUser(user);
    setVerificationMode(false);
    alert("Doğrulama başarılı 🎉");
  };

  // ---------- LOGIN ----------
  const handleLogin = () => {
    const found = users.find(
      (u) =>
        u.email === loginForm.email && u.password === loginForm.password
    );
    if (!found) return alert("Bilgiler yanlış");

    setCurrentUser(found);
  };

  // ---------- NEW POST ----------
  const addPost = () => {
    if (!newPost.content) return;

    setPosts([
      ...posts,
      {
        id: Date.now(),
        user: currentUser.username,
        type: newPost.type,
        content: newPost.content,
        likes: []
      }
    ]);

    setNewPost({ type: "text", content: "" });
  };

  // ---------- LIKE ----------
  const toggleLike = (post) => {
    const liked = post.likes.includes(currentUser.username);
    post.likes = liked
      ? post.likes.filter((u) => u !== currentUser.username)
      : [...post.likes, currentUser.username];

    setPosts([...posts]);
  };

  // ---------- THEME ----------
  const theme = darkMode
    ? "bg-black text-white"
    : "bg-gray-100 text-gray-900";

  // ---------- REGISTER SCREEN ----------
  if (!currentUser && !verificationMode && authMode === "register") {
    return (
      <div className={`${theme} min-h-screen flex items-center justify-center`}>
        <div className="bg-white/10 backdrop-blur p-6 rounded-2xl w-96">
          <div className="flex justify-center mb-4">
            <img
              src="https://i.hizliresim.com/jtv095w.jpeg"
              className="w-28 h-28 rounded-2xl"
              alt="logo"
            />
          </div>

          <h2 className="text-center font-bold mb-3">Kayıt Ol</h2>

          {[
            ["Kullanıcı Adı *", "username"],
            ["Ad Soyad", "name"],
            ["Email", "email"],
            ["Şifre", "password"],
            ["Şehir", "city"],
            ["Ülke", "country"]
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
            className="w-full p-2 mb-2 rounded"
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
            Devam Et
          </button>

          <p className="text-center mt-2">
            Hesabın var mı?{" "}
            <button
              className="text-purple-400"
              onClick={() => setAuthMode("login")}
            >
              Giriş Yap
            </button>
          </p>
        </div>
      </div>
    );
  }

  // ---------- VERIFICATION ----------
  if (verificationMode && !currentUser) {
    return (
      <div className={`${theme} min-h-screen flex items-center justify-center`}>
        <div className="bg-white/10 backdrop-blur p-6 rounded-2xl w-96">
          <h2 className="text-center font-bold mb-3">
            E-posta Doğrulama
          </h2>

          <input
            className="w-full p-2 mb-2 rounded"
            placeholder="Gönderilen kod"
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

  // ---------- LOGIN ----------
  if (!currentUser && authMode === "login") {
    return (
      <div className={`${theme} min-h-screen flex items-center justify-center`}>
        <div className="bg-white/10 backdrop-blur p-6 rounded-2xl w-96">
          <div className="flex justify-center mb-4">
            <img
              src="https://i.hizliresim.com/jtv095w.jpeg"
              className="w-28 h-28 rounded-2xl"
              alt="logo"
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

          <p className="text-center mt-2">
            Hesabın yok mu?{" "}
            <button
              className="text-purple-400"
              onClick={() => setAuthMode("register")}
            >
              Kayıt Ol
            </button>
          </p>
        </div>
      </div>
    );
  }

  // ---------- MAIN APP ----------
  return (
    <div className={`${theme} min-h-screen`}>
      <div className="flex justify-between items-center p-3">

        <img
          src="https://i.hizliresim.com/jtv095w.jpeg"
          className="w-10 h-10 rounded-xl"
          alt="logo"
        />

        <div className="flex gap-4">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun /> : <Moon />}
          </button>

          <button onClick={() => setShowProfile(!showProfile)}>
            <User />
          </button>

          <button onClick={() => setCurrentUser(null)}>
            <LogOut />
          </button>
        </div>
      </div>

      {!showProfile && (
        <div className="p-3">
          {/* NEW POST */}
          <h3 className="font-bold mb-2">Gönderi Ekle</h3>

          <select
            className="w-full p-2 rounded mb-2"
            onChange={(e) =>
              setNewPost({ ...newPost, type: e.target.value })
            }
          >
            <option value="text">Yazı</option>
            <option value="image">Fotoğraf</option>
            <option value="video">Video</option>
          </select>

          <input
            className="w-full p-2 rounded mb-2"
            placeholder="Yazı / Görsel-Video linki"
            onChange={(e) =>
              setNewPost({ ...newPost, content: e.target.value })
            }
          />

          <button
            className="bg-green-600 text-white w-full p-2 rounded"
            onClick={addPost}
          >
            Paylaş
          </button>

          {/* FEED */}
          <h3 className="font-bold mt-4 mb-2">Akış</h3>

          {posts.map((p) => (
            <div key={p.id} className="border p-2 rounded mb-3">
              <p className="text-sm text-purple-500">@{p.user}</p>

              {p.type === "text" && <p>{p.content}</p>}
              {p.type === "image" && (
                <img src={p.content} className="rounded mt-2" />
              )}
              {p.type === "video" && (
                <video controls className="rounded mt-2">
                  <source src={p.content} />
                </video>
              )}

              <button
                className="flex items-center gap-1 mt-2"
                onClick={() => toggleLike(p)}
              >
                <Heart />
                {p.likes.length}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* PROFILE */}
      {showProfile && (
        <div className="p-3">
          <h3 className="font-bold mb-2">Profil</h3>

          <img
            src={currentUser.avatar}
            className="w-24 h-24 rounded-full"
          />

          <input
            className="w-full p-2 mt-2 rounded"
            placeholder="Yeni profil fotoğrafı linki"
            onChange={(e) =>
              setProfileEdit({ ...profileEdit, avatar: e.target.value })
            }
          />

          <button
            className="bg-blue-600 text-white w-full p-2 rounded mt-1"
            onClick={() =>
              setCurrentUser({
                ...currentUser,
                avatar: profileEdit.avatar || currentUser.avatar
              })
            }
          >
            Fotoğrafı Güncelle
          </button>

          <textarea
            className="w-full p-2 mt-3 rounded"
            placeholder="Biyografi"
            onChange={(e) =>
              setProfileEdit({ ...profileEdit, bio: e.target.value })
            }
          />

          <button
            className="bg-purple-600 text-white w-full p-2 rounded mt-1"
            onClick={() =>
              setCurrentUser({
                ...currentUser,
                bio: profileEdit.bio || currentUser.bio
              })
            }
          >
            Bio Güncelle
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
