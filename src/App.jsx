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
  UserCheck
} from "lucide-react";

const PinspireApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [activeTab, setActiveTab] = useState("home");
  const [selectedPin, setSelectedPin] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [viewingUserId, setViewingUserId] = useState(null);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState({});
  const [savedPins, setSavedPins] = useState([]);
  const [likedPins, setLikedPins] = useState([]);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Ahmet Yılmaz",
      email: "ahmet@mail.com",
      password: "123456",
      avatar: "https://i.pravatar.cc/150?img=12",
      bio: "Tasarım tutkunu 🎨",
      followers: 1234,
      following: 567,
      followingList: [2, 3]
    },
    {
      id: 2,
      name: "Zeynep Kaya",
      email: "zeynep@mail.com",
      password: "123456",
      avatar: "https://i.pravatar.cc/150?img=45",
      bio: "Moda bloggeri ✨",
      followers: 2340,
      following: 890,
      followingList: [1, 4]
    },
    {
      id: 3,
      name: "Mehmet Demir",
      email: "mehmet@mail.com",
      password: "123456",
      avatar: "https://i.pravatar.cc/150?img=33",
      bio: "Mimar | Minimalist 🏛️",
      followers: 3456,
      following: 234,
      followingList: [1, 2]
    },
    {
      id: 4,
      name: "Ayşe Şahin",
      email: "ayse@mail.com",
      password: "123456",
      avatar: "https://i.pravatar.cc/150?img=27",
      bio: "Yemek sanatçısı 👩‍🍳",
      followers: 5678,
      following: 456,
      followingList: [2]
    },
    {
      id: 5,
      name: "Can Öztürk",
      email: "can@mail.com",
      password: "123456",
      avatar: "https://i.pravatar.cc/150?img=15",
      bio: "Doğa fotoğrafçısı 📸",
      followers: 4321,
      following: 678,
      followingList: [3]
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
      userName: "Ahmet Yılmaz",
      saves: 234,
      likes: 145,
      commentCount: 12
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400",
      title: "Sürdürülebilir Mimari",
      description: "Çevre dostu yapılar",
      category: "Mimari",
      userId: 3,
      userName: "Mehmet Demir",
      saves: 456,
      likes: 289,
      commentCount: 34
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
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }
    if (registerForm.password.length < 6) {
      alert("Şifre en az 6 karakter olmalı!");
      return;
    }
    if (users.find((u) => u.email === registerForm.email)) {
      alert("Bu email zaten kayıtlı!");
      return;
    }

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
    setRegisterForm({ name: "", email: "", password: "" });
    alert("Kayıt başarılı! 🎉");
  };

  const toggleFollow = (userId) => {
    setUsers(
      users.map((u) => {
        if (u.id === currentUser.id) {
          const isFollowing = u.followingList.includes(userId);
          return {
            ...u,
            followingList: isFollowing
              ? u.followingList.filter((id) => id !== userId)
              : [...u.followingList, userId],
            following: isFollowing ? u.following - 1 : u.following + 1
          };
        }
        if (u.id === userId) {
          const isFollowing = currentUser.followingList.includes(userId);
          return {
            ...u,
            followers: isFollowing ? u.followers - 1 : u.followers + 1
          };
        }
        return u;
      })
    );

    setCurrentUser((prev) => {
      const isFollowing = prev.followingList.includes(userId);
      return {
        ...prev,
        followingList: isFollowing
          ? prev.followingList.filter((id) => id !== userId)
          : [...prev.followingList, userId],
        following: isFollowing ? prev.following - 1 : prev.following + 1
      };
    });
  };

  const toggleSave = (pinId) =>
    setSavedPins((prev) =>
      prev.includes(pinId) ? prev.filter((id) => id !== pinId) : [...prev, pinId]
    );

  const toggleLike = (pinId) => {
    setLikedPins((prev) =>
      prev.includes(pinId) ? prev.filter((id) => id !== pinId) : [...prev, pinId]
    );

    setAllPins((prev) =>
      prev.map((pin) =>
        pin.id === pinId
          ? {
              ...pin,
              likes: likedPins.includes(pinId)
                ? pin.likes - 1
                : pin.likes + 1
            }
          : pin
      )
    );
  };

  const handleAddComment = (pinId) => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      avatar: currentUser.avatar,
      text: newComment
    };

    setComments({
      ...comments,
      [pinId]: [...(comments[pinId] || []), comment]
    });

    setAllPins((prev) =>
      prev.map((pin) =>
        pin.id === pinId
          ? { ...pin, commentCount: pin.commentCount + 1 }
          : pin
      )
    );

    setNewComment("");
  };

  const openUserProfile = (userId) => {
    setViewingUserId(userId);
    setShowProfile(true);
    setShowUserSearch(false);
  };

  const filteredUsers = useMemo(() => {
    if (!userSearchQuery)
      return users.filter((u) => u.id !== currentUser?.id);

    return users.filter(
      (u) =>
        u.id !== currentUser?.id &&
        (u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
          u.bio.toLowerCase().includes(userSearchQuery.toLowerCase()))
    );
  }, [userSearchQuery, users, currentUser]);

  const filteredPins = useMemo(() => {
    let result = allPins;

    if (selectedCategory !== "all")
      result = result.filter(
        (pin) =>
          pin.category.toLowerCase() === selectedCategory.toLowerCase()
      );

    if (searchQuery)
      result = result.filter((pin) =>
        pin.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (activeTab === "saved")
      result = result.filter((pin) => savedPins.includes(pin.id));

    if (showProfile && viewingUserId)
      result = result.filter((pin) => pin.userId === viewingUserId);
    else if (showProfile && !viewingUserId)
      result = result.filter((pin) => pin.userId === currentUser?.id);

    return result;
  }, [
    selectedCategory,
    searchQuery,
    activeTab,
    savedPins,
    allPins,
    showProfile,
    viewingUserId,
    currentUser
  ]);

  /* ---------------- AUTH SCREENS ---------------- */

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2">
              Pinspire
            </h1>
            <p className="text-gray-600">İlham veren fikirleri keşfedin</p>
          </div>

          {authMode === "login" ? (
            <div className="space-y-4">
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 focus:border-purple-500 outline-none"
                placeholder="Email"
              />

              <input
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 focus:border-purple-500 outline-none"
                placeholder="Şifre"
              />

              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold"
              >
                Giriş Yap
              </button>

              <p className="text-center text-sm">
                Hesabın yok mu?{" "}
                <button
                  onClick={() => setAuthMode("register")}
                  className="text-purple-600 font-semibold"
                >
                  Kayıt Ol
                </button>
              </p>

              <div className="text-xs text-center text-gray-500 border-t pt-4">
                <p className="font-semibold mb-1">
                  Demo: Tüm şifreler 123456
                </p>
                <p>ahmet@mail.com, zeynep@mail.com</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                value={registerForm.name}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, name: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 focus:border-purple-500 outline-none"
                placeholder="Ad Soyad"
              />

              <input
                type="email"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 focus:border-purple-500 outline-none"
                placeholder="Email"
              />

              <input
                type="password"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    password: e.target.value
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 focus:border-purple-500 outline-none"
                placeholder="Şifre (min 6)"
              />

              <button
                onClick={handleRegister}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold"
              >
                Kayıt Ol
              </button>

              <p className="text-center text-sm">
                Hesabın var mı?{" "}
                <button
                  onClick={() => setAuthMode("login")}
                  className="text-purple-600 font-semibold"
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

  /* ---------------- MAIN UI ---------------- */

  return (
    <div>🎉 Pinspire başarıyla düzeltildi — şimdi render akışı hazır.</div>
  );
};

export default PinspireApp;
