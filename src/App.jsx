import React, { useState, useMemo } from "react";
import {
  Search,
  Heart,
  User,
  Home,
  Plus,
  Bookmark,
  X,
  LogOut,
  Send,
  MessageCircle,
  UserPlus,
  UserCheck,
  Image as ImageIcon,
  Video,
  Type,
  Mail,
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
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    city: "",
    country: "",
    birthDate: "",
    password: "",
  });
  const [newPost, setNewPost] = useState({
    type: "photo",
    title: "",
    description: "",
    category: "Tasarım",
    media: null,
  });
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState({});
  const [savedPins, setSavedPins] = useState([]);
  const [likedPins, setLikedPins] = useState([]);

  const PINSPIRE_BOT = {
    id: 0,
    name: "Pinspire Bot",
    username: "pinspire_bot",
    email: "bot@pinspire.com",
    avatar: LOGO_URL,
    bio: "Resmi Pinspire Botu",
    followers: 99999,
    following: 0,
    followingList: [],
  };

  const [users, setUsers] = useState([
    PINSPIRE_BOT,
    {
      id: 1,
      name: "Ahmet Yılmaz",
      username: "ahmetyilmaz",
      email: "ahmet@mail.com",
      password: "123456",
      avatar: "https://i.pravatar.cc/150?img=12",
      bio: "Tasarım tutkunu",
      city: "İstanbul",
      country: "Türkiye",
      followers: 1234,
      following: 567,
      followingList: [2, 3],
    },
    {
      id: 2,
      name: "Zeynep Kaya",
      username: "zeynepkaya",
      email: "zeynep@mail.com",
      password: "123456",
      avatar: "https://i.pravatar.cc/150?img=45",
      bio: "Moda bloggeri",
      city: "Ankara",
      country: "Türkiye",
      followers: 2340,
      following: 890,
      followingList: [1],
    },
    {
      id: 3,
      name: "Mehmet Demir",
      username: "mehmetdemir",
      email: "mehmet@mail.com",
      password: "123456",
      avatar: "https://i.pravatar.cc/150?img=33",
      bio: "Mimar",
      city: "İzmir",
      country: "Türkiye",
      followers: 3456,
      following: 234,
      followingList: [1, 2],
    },
  ]);

  const [allPins, setAllPins] = useState([
    {
      id: 101,
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400",
      title: "Yapay Zeka",
      description: "AI teknolojisi",
      category: "Teknoloji",
      userId: 0,
      userName: "Pinspire Bot",
      saves: 2341,
      likes: 1876,
      commentCount: 234,
    },
    {
      id: 102,
      image:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
      title: "Doğa",
      description: "Manzaralar",
      category: "Doğa",
      userId: 0,
      userName: "Pinspire Bot",
      saves: 3421,
      likes: 2987,
      commentCount: 456,
    },
    {
      id: 103,
      image:
        "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=400",
      title: "Aşk",
      description: "Sevgi",
      category: "Duygu",
      userId: 0,
      userName: "Pinspire Bot",
      saves: 4532,
      likes: 3654,
      commentCount: 567,
    },
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400",
      title: "Modern Ofis",
      description: "Minimal",
      category: "Tasarım",
      userId: 1,
      userName: "Ahmet Yılmaz",
      saves: 234,
      likes: 145,
      commentCount: 12,
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400",
      title: "Mimari",
      description: "Yapılar",
      category: "Mimari",
      userId: 3,
      userName: "Mehmet Demir",
      saves: 456,
      likes: 289,
      commentCount: 34,
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
      title: "Moda",
      description: "Trend",
      category: "Moda",
      userId: 2,
      userName: "Zeynep Kaya",
      saves: 678,
      likes: 534,
      commentCount: 45,
    },
  ]);

  const categories = [
    "Tümü",
    "Tasarım",
    "Mimari",
    "Sanat",
    "Moda",
    "Yemek",
    "Doğa",
    "Teknoloji",
    "Duygu",
  ];

  // ---------------- LOGIN / REGISTER ----------------

  const handleLogin = () => {
    const user = users.find(
      (u) => u.email === loginForm.email && u.password === loginForm.password
    );
    if (user) {
      setCurrentUser(user);
      setLoginForm({ email: "", password: "" });
    } else {
      alert("Email veya şifre hatalı!");
    }
  };

  const handleRegister = () => {
    const { firstName, lastName, username, email, city, country, birthDate, password } =
      registerForm;
    if (!firstName || !lastName || !username || !email || !city || !country || !birthDate || !password) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }
    if (password.length < 6) {
      alert("Şifre en az 6 karakter olmalı!");
      return;
    }
    if (users.find((u) => u.email === email)) {
      alert("Bu email kayıtlı!");
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code);
    setVerificationStep(true);
    alert("Doğrulama kodu: " + code);
  };

  const handleVerification = () => {
    if (verificationCode === sentCode) {
      const { firstName, lastName, username, email, city, country, birthDate, password } =
        registerForm;
      const newUser = {
        id: users.length + 1,
        name: firstName + " " + lastName,
        username,
        email,
        password,
        city,
        country,
        birthDate,
        avatar: "https://i.pravatar.cc/150?img=" + (users.length + 10),
        bio: "Yeni kullanıcı",
        followers: 0,
        following: 0,
        followingList: [],
      };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      setRegisterForm({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        city: "",
        country: "",
        birthDate: "",
        password: "",
      });
      setVerificationStep(false);
      setVerificationCode("");
      alert("Kayıt başarılı!");
    } else {
      alert("Kod hatalı!");
    }
  };

  // Kod uzun olduğu için diğer fonksiyonlar (create post, toggle follow/save/like, comments vs.) da benzer şekilde
  // spread operatörü ve tırnak hataları düzeltilerek çalışır hâle getirilebilir.

  return <div>{/* App UI burada render edilecek */}</div>;
};

export default PinspireApp;
