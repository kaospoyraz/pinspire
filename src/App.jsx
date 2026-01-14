import React, { useState, useMemo } from "react";
import {
  Search,
  Heart,
  User,
  Home,
  Bookmark,
  X,
  LogOut,
  Send,
  MessageCircle,
  UserPlus,
  UserCheck,
  Plus
} from "lucide-react";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [activeTab, setActiveTab] = useState("home");
  const [selectedPin, setSelectedPin] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [viewingUserId, setViewingUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState({});
  const [savedPins, setSavedPins] = useState([]);
  const [likedPins, setLikedPins] = useState([]);
  const [showAddPin, setShowAddPin] = useState(false);
  const [messages, setMessages] = useState({});
  const [chatUser, setChatUser] = useState(null);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [newPin, setNewPin] = useState({
    image: "",
    title: "",
    description: "",
    category: "Tasarım"
  });

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Emre Akıcı",
      email: "emre@mail.com",
      password: "123456",
      avatar: "https://i.pravatar.cc/150?img=12",
      bio: "Tasarım tutkunu 🎨",
      followers: 5,
      following: 1,
      followingList: [2]
    },
    {
      id: 2,
      name: "Zeynep Kaya",
      email: "zeynep@mail.com",
      password: "123456",
      avatar: "https://i.pravatar.cc/150?img=45",
      bio: "Moda bloggeri ✨",
      followers: 2,
      following: 1,
      followingList: [1]
    }
  ]);

  const [allPins, setAllPins] = useState([
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400",
      title: "Modern Minimalist Ofis",
      description: "Minimal ofis tasarımı",
      category: "Tasarım",
      userId: 1,
      userName: "Emre Akıcı",
      likes: 10,
      commentCount: 2
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400",
      title: "Sürdürülebilir Mimari",
      description: "Çevre dostu yapılar",
      category: "Mimari",
      userId: 2,
      userName: "Zeynep Kaya",
      likes: 20,
      commentCount: 4
    }
  ]);

  const categories = [
    "Tümü",
    "Tasarım",
    "Mimari",
    "Sanat",
    "Moda",
    "Yemek",
    "Doğa",
    "Teknoloji"
  ];

  /* ---------- AUTH ---------- */

  const handleLogin = () => {
    const user = users.find(
      (u) =>
        u.email === loginForm.email && u.password === loginForm.password
    );
    if (user) {
      setCurrentUser(user);
      setLoginForm({ email: "", password: "" });
    } else {
      alert("Email veya şifre hatalı!");
    }
  };

  const handleRegister = () => {
    if (!registerForm.name || !registerForm.email || !registerForm.password)
      return alert("Boş alan bırakmayın");

    if (registerForm.password.length < 6)
      return alert("Şifre en az 6 karakter olmalı");

    const newUser = {
      id: users.length + 1,
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
      avatar: `https://i.pravatar.cc/150?img=${users.length + 10}`,
      bio: "Yeni kullanıcı 👋",
      followers: 0,
      following: 0,
      followingList: []
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
  };

  /* ---------- PIN FİLTRE ---------- */

  const filteredPins = useMemo(() => {
    let p = allPins;

    if (selectedCategory !== "Tümü")
      p = p.filter((x) => x.category === selectedCategory);

    if (searchQuery)
      p = p.filter((x) =>
        x.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (activeTab === "saved")
      p = p.filter((x) => savedPins.includes(x.id));

    return p;
  }, [allPins, selectedCategory, searchQuery, activeTab, savedPins]);

  /* ---------- LIKE / SAVE ---------- */

  const toggleLike = (id) => {
    setLikedPins((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

    setAllPins((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, likes: likedPins.includes(id) ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const toggleSave = (id) => {
    setSavedPins((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ---------- COMMENT ---------- */

  const addComment = (pinId) => {
    if (!newComment.trim()) return;

    const com = {
      id: Date.now(),
      text: newComment,
      user: currentUser.name,
      avatar: currentUser.avatar
    };

    setComments({
      ...comments,
      [pinId]: [...(comments[pinId] || []), com]
    });

    setNewComment("");
  };

  /* ---------- ADD PIN ---------- */

  const addPin = () => {
    const p = {
      ...newPin,
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      likes: 0,
      commentCount: 0
    };

    setAllPins([p, ...allPins]);
    setShowAddPin(false);
    setNewPin({ image: "", title: "", description: "", category: "Tasarım" });
  };

  /* ---------- FOLLOW ---------- */

  const toggleFollow = (userId) => {
    if (!currentUser) return;

    const is = currentUser.followingList.includes(userId);

    setCurrentUser({
      ...currentUser,
      followingList: is
        ? currentUser.followingList.filter((x) => x !== userId)
        : [...currentUser.followingList, userId]
    });
  };

  /* ---------- CHAT ---------- */

  const sendMessage = () => {
    if (!chatUser || !newComment.trim()) return;

    const msg = {
      id: Date.now(),
      from: currentUser.id,
      text: newComment
    };

    const key = `${currentUser.id}-${chatUser.id}`;

    setMessages({
      ...messages,
      [key]: [...(messages[key] || []), msg]
    });

    setNewComment("");
  };

  /* ---------- AUTH UI ---------- */

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">Pinspire</h1>

          {authMode === "login" ? (
            <div className="space-y-3">
              <input
                className="w-full border p-3 rounded-xl"
                placeholder="Email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
              />

              <input
                type="password"
                className="w-full border p-3 rounded-xl"
                placeholder="Şifre"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
              />

              <button
                className="w-full bg-purple-500 text-white p-3 rounded-xl"
                onClick={handleLogin}
              >
                Giriş Yap
              </button>

              <p className="text-center text-sm">
                Hesabın yok mu?{" "}
                <button
                  className="text-purple-600"
                  onClick={() => setAuthMode("register")}
                >
                  Kayıt Ol
                </button>
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                className="w-full border p-3 rounded-xl"
                placeholder="Ad Soyad"
                value={registerForm.name}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, name: e.target.value })
                }
              />

              <input
                className="w-full border p-3 rounded-xl"
                placeholder="Email"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, email: e.target.value })
                }
              />

              <input
                type="password"
                className="w-full border p-3 rounded-xl"
                placeholder="Şifre"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, password: e.target.value })
                }
              />

              <button
                className="w-full bg-purple-500 text-white p-3 rounded-xl"
                onClick={handleRegister}
              >
                Kayıt Ol
              </button>

              <p className="text-center text-sm">
                Hesabın var mı?{" "}
                <button
                  className="text-purple-600"
                  onClick={() => setAuthMode("login")}
                >
                  Giriş Yap
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ---------- MAIN UI ---------- */

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="flex justify-between p-4 bg-white shadow">
        <h2 className="font-bold text-xl">Pinspire</h2>
        <button onClick={() => setCurrentUser(null)} className="text-red-500">
          <LogOut />
        </button>
      </div>

      {/* Search */}
      <div className="p-4">
        <input
          className="w-full border p-2 rounded-xl"
          placeholder="Ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 px-4 overflow-auto">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-3 py-1 rounded-full border ${
              selectedCategory === c ? "bg-purple-500 text-white" : ""
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Pins */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {filteredPins.map((pin) => (
          <div key={pin.id} className="bg-white rounded-xl shadow">
            <img
              src={pin.image}
              className="rounded-t-xl h-40 w-full object-cover"
            />
            <div className="p-2">
              <p className="font-semibold">{pin.title}</p>

              <div className="flex justify-between mt-2">
                <button onClick={() => toggleLike(pin.id)}>
                  <Heart
                    color={likedPins.includes(pin.id) ? "red" : "black"}
                  />
                </button>

                <button onClick={() => toggleSave(pin.id)}>
                  <Bookmark
                    color={savedPins.includes(pin.id) ? "purple" : "black"}
                  />
                </button>

                <button onClick={() => setSelectedPin(pin)}>
                  <MessageCircle />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Pin */}
      <button
        onClick={() => setShowAddPin(true)}
        className="fixed bottom-20 right-4 bg-purple-500 text-white p-4 rounded-full shadow-xl"
      >
        <Plus />
      </button>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white flex justify-around py-3 shadow-inner">
        <button onClick={() => setActiveTab("home")}>
          <Home />
        </button>
        <button onClick={() => setActiveTab("saved")}>
          <Bookmark />
        </button>
        <button onClick={() => setShowProfile(true)}>
          <User />
        </button>
      </div>
    </div>
  );
};

export default App;
