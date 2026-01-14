import React, { useState, useMemo } from 'react';
import { Search, Heart, User, Home, Plus, Bookmark, X, LogOut, Send, MessageCircle, UserPlus, UserCheck, Camera, Image as ImageIcon, Video, Type, Mail } from 'lucide-react';

const PinspireApp = () => {
  const LOGO_URL = 'https://i.hizliresim.com/jtv095w.jpeg';

  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPin, setSelectedPin] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [viewingUserId, setViewingUserId] = useState(null);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    city: '',
    country: '',
    birthDate: '',
    password: ''
  });
  const [newPost, setNewPost] = useState({ type: 'photo', title: '', description: '', category: 'Tasarım', media: null });
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState({});
  const [savedPins, setSavedPins] = useState([]);
  const [likedPins, setLikedPins] = useState([]);
  const [conversations, setConversations] = useState([]);

  // Pinspire Bot
  const PINSPIRE_BOT = {
    id: 0,
    name: 'Pinspire Bot',
    username: 'pinspire_official',
    email: 'bot@pinspire.com',
    avatar: LOGO_URL,
    bio: '🤖 Resmi Pinspire Botu | Her gün yeni içerik',
    followers: 99999,
    following: 0,
    followingList: []
  };

  const [users, setUsers] = useState([
    PINSPIRE_BOT,
    { id: 1, name: 'Ahmet Yılmaz', username: 'ahmetyilmaz', email: 'ahmet@mail.com', password: '123456', avatar: 'https://i.pravatar.cc/150?img=12', bio: 'Tasarım tutkunu 🎨', city: 'İstanbul', country: 'Türkiye', followers: 1234, following: 567, followingList: [2, 3] },
    { id: 2, name: 'Zeynep Kaya', username: 'zeynepkaya', email: 'zeynep@mail.com', password: '123456', avatar: 'https://i.pravatar.cc/150?img=45', bio: 'Moda bloggeri ✨', city: 'Ankara', country: 'Türkiye', followers: 2340, following: 890, followingList: [1, 4] },
    { id: 3, name: 'Mehmet Demir', username: 'mehmetdemir', email: 'mehmet@mail.com', password: '123456', avatar: 'https://i.pravatar.cc/150?img=33', bio: 'Mimar | Minimalist 🏛️', city: 'İzmir', country: 'Türkiye', followers: 3456, following: 234, followingList: [1, 2] },
    { id: 4, name: 'Ayşe Şahin', username: 'aysesahin', email: 'ayse@mail.com', password: '123456', avatar: 'https://i.pravatar.cc/150?img=27', bio: 'Yemek sanatçısı 👩‍🍳', city: 'Bursa', country: 'Türkiye', followers: 5678, following: 456, followingList: [2] },
    { id: 5, name: 'Can Öztürk', username: 'canozturk', email: 'can@mail.com', password: '123456', avatar: 'https://i.pravatar.cc/150?img=15', bio: 'Doğa fotoğrafçısı 📸', city: 'Antalya', country: 'Türkiye', followers: 4321, following: 678, followingList: [3] },
  ]);

  const [allPins, setAllPins] = useState([
    // Bot pins
    { id: 101, image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400', title: 'Yapay Zeka Devrimi', description: 'AI teknolojisinin geleceği', category: 'Teknoloji', userId: 0, userName: 'Pinspire Bot', saves: 2341, likes: 1876, commentCount: 234 },
    { id: 102, image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400', title: 'Doğanın Güzelliği', description: 'Muhteşem manzaralar', category: 'Doğa', userId: 0, userName: 'Pinspire Bot', saves: 3421, likes: 2987, commentCount: 456 },
    { id: 103, image: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=400', title: 'Aşkın Dili', description: 'Sevgi ve tutku', category: 'Duygu', userId: 0, userName: 'Pinspire Bot', saves: 4532, likes: 3654, commentCount: 567 },
    { id: 104, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400', title: 'Geleceğin Teknolojisi', description: 'İnovasyon ve bilim', category: 'Teknoloji', userId: 0, userName: 'Pinspire Bot', saves: 2876, likes: 2345, commentCount: 321 },
    { id: 105, image: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=400', title: 'Motivasyon', description: 'İlham veren sözler', category: 'Duygu', userId: 0, userName: 'Pinspire Bot', saves: 5234, likes: 4321, commentCount: 678 },

    // User pins
    { id: 1, image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400', title: 'Modern Minimalist Ofis', description: 'Minimal ofis tasarımı', category: 'Tasarım', userId: 1, userName: 'Ahmet Yılmaz', saves: 234, likes: 145, commentCount: 12 },
    { id: 2, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400', title: 'Sürdürülebilir Mimari', description: 'Çevre dostu yapılar', category: 'Mimari', userId: 3, userName: 'Mehmet Demir', saves: 456, likes: 289, commentCount: 34 },
    { id: 3, image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400', title: 'Soyut Sanat', description: 'Modern sanat', category: 'Sanat', userId: 1, userName: 'Ahmet Yılmaz', saves: 189, likes: 167, commentCount: 23 },
    { id: 4, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400', title: 'Sokak Modası', description: '2025 trendler', category: 'Moda', userId: 2, userName: 'Zeynep Kaya', saves: 678, likes: 534, commentCount: 45 },
    { id: 5, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', title: 'Gurme Tatlılar', description: 'Lezzetli tarifler', category: 'Yemek', userId: 4, userName: 'Ayşe Şahin', saves: 891, likes: 723, commentCount: 67 },
    { id: 6, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', title: 'Dağ Manzaraları', description: 'Doğa fotoğrafları', category: 'Doğa', userId: 5, userName: 'Can Öztürk', saves: 1234, likes: 987, commentCount: 89 },
    { id: 7, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', title: 'UI/UX Tasarım', description: 'Modern arayüz', category: 'Teknoloji', userId: 1, userName: 'Ahmet Yılmaz', saves: 543, likes: 445, commentCount: 56 },
  ]);

  const categories = ['Tümü', 'Tasarım', 'Mimari', 'Sanat', 'Moda', 'Yemek', 'Doğa', 'Teknoloji', 'Duygu'];

  // --- Fonksiyonlar ve Auth / Post / Toggle vs. kodları aynen devam edecek ---

  // filteredPins ve filteredUsers memo
  const filteredUsers = useMemo(() => {
    if (!userSearchQuery) return users.filter(u => u.id !== currentUser?.id);
    return users.filter(u => u.id !== currentUser?.id && (u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || u.bio.toLowerCase().includes(userSearchQuery.toLowerCase())));
  }, [userSearchQuery, users, currentUser]);

  const filteredPins = useMemo(() => {
    let result = allPins;
    if (selectedCategory !== 'all') result = result.filter(pin => pin.category.toLowerCase() === selectedCategory.toLowerCase());
    if (searchQuery) result = result.filter(pin => pin.title.toLowerCase().includes(searchQuery.toLowerCase()));
    if (activeTab === 'saved') result = result.filter(pin => savedPins.includes(pin.id));
    if (showProfile && viewingUserId !== null) result = result.filter(pin => pin.userId === viewingUserId);
    else if (showProfile && viewingUserId === null) result = result.filter(pin => pin.userId === currentUser?.id);
    return result;
  }, [selectedCategory, searchQuery, activeTab, savedPins, allPins, showProfile, viewingUserId, currentUser]);

  // --- JSX render kısmı aynen devam eder ---
};

export default PinspireApp;
