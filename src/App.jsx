import React, { useState } from "react";
import {
  Home,
  Bookmark,
  User,
  Heart,
  Plus,
  Send,
  MessageCircle,
  LogOut,
} from "lucide-react";

export default function App() {
  // Kullanıcı
  const [currentUser, setCurrentUser] = useState({ username: "emre" });

  // Sekmeler
  const [activeTab, setActiveTab] = useState("home");

  // Pin verisi
  const [pins, setPins] = useState([
    {
      id: 1,
      title: "Doğa Manzarası",
      category: "Doğa",
      image:
        "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg",
      likes: 5,
      comments: [],
    },
    {
      id: 2,
      title: "Minimal Tasarım",
      category: "Tasarım",
      image:
        "https://images.pexels.com/photos/37347/office-820390_1280.jpg",
      likes: 2,
      comments: [],
    },
  ]);

  const [likedPins, setLikedPins] = useState([]);
  const [savedPins, setSavedPins] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  // Yeni pin ekleme
  const [newPin, setNewPin] = useState({
    title: "",
    image: "",
    category: "",
  });

  // Mesajlar
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Yorum
  const [selectedPinForComments, setSelectedPinForComments] = useState(null);
  const [commentText, setCommentText] = useState("");

  // --- Fonksiyonlar ---

  const toggleLike = (id) => {
    setLikedPins((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

    setPins((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              likes: likedPins.includes(id) ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  };

  const toggleSave = (id) => {
    setSavedPins((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addPin = () => {
    if (!newPin.title || !newPin.image) return;

    setPins([
      ...pins,
      {
        id: Date.now(),
        ...newPin,
        likes: 0,
        comments: [],
      },
    ]);

    setNewPin({ title: "", image: "", category: "" });
    setActiveTab("home");
  };

  const sendMessage = () => {
    if (!newMessage) return;
    setMessages([...messages, { text: newMessage, sender: currentUser.username }]);
    setNewMessage("");
  };

  const addComment = () => {
    if (!commentText || !selectedPinForComments) return;

    setPins((prev) =>
      prev.map((p) =>
        p.id === selectedPinForComments.id
          ? {
              ...p,
              comments: [...p.comments, { user: currentUser.username, text: commentText }],
            }
          : p
      )
    );

    setCommentText("");
  };

  // Filtreleme
  const filteredPins = pins.filter((p) => {
    const categoryMatch =
      selectedCategory === "Tümü" || p.category === selectedCategory;

    const searchMatch = p.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return categoryMatch && searchMatch;
  });

  // ----------- ARAYÜZLER -----------

  // --- Yorum Sayfası ---
  if (selectedPinForComments) {
    return (
      <div className="p-4 space-y-3">
        <button
          onClick={() => setSelectedPinForComments(null)}
          className="text-blue-500"
        >
          ← Geri
        </button>

        <img
          src={selectedPinForComments.image}
          className="w-full rounded-xl"
        />

        <p className="font-bold">{selectedPinForComments.title}</p>

        <div className="space-y-2">
          {selectedPinForComments.comments.map((c, i) => (
            <div key={i} className="bg-gray-100 p-2 rounded">
              <span className="font-semibold">{c.user}: </span>
              {c.text}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 border rounded px-2"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Yorum yaz..."
          />
          <button
            onClick={addComment}
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            Gönder
          </button>
        </div>
      </div>
    );
  }

  // --- Pin ekleme ---
  if (activeTab === "add") {
    return (
      <div className="p-4 space-y-3">
        <h2 className="text-xl font-bold">Yeni Pin Ekle</h2>

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Başlık"
          value={newPin.title}
          onChange={(e) => setNewPin({ ...newPin, title: e.target.value })}
        />

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Resim URL"
          value={newPin.image}
          onChange={(e) => setNewPin({ ...newPin, image: e.target.value })}
        />

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Kategori"
          value={newPin.category}
          onChange={(e) => setNewPin({ ...newPin, category: e.target.value })}
        />

        <button
          onClick={addPin}
          className="w-full bg-green-500 text-white py-2 rounded"
        >
          Ekle
        </button>
      </div>
    );
  }

  // --- Mesajlaşma ---
  if (activeTab === "messages") {
    return (
      <div className="p-4 space-y-3">
        <h2 className="text-xl font-bold">Mesajlar</h2>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className="bg-gray-100 p-2 rounded">
              <span className="font-semibold">{m.sender}: </span>
              {m.text}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 border rounded px-2"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mesaj yaz..."
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Gönder
          </button>
        </div>
      </div>
    );
  }

  // --- Profil ---
  if (activeTab === "profile") {
    return (
      <div className="p-4 space-y-3">
        <h2 className="text-xl font-bold">Profil</h2>

        <p>Kullanıcı: {currentUser.username}</p>

        <p>Kaydedilen pin sayısı: {savedPins.length}</p>

        <button
          onClick={() => {
            setCurrentUser(null);
          }}
          className="text-red-500 flex gap-2"
        >
          <LogOut size={16} /> Çıkış Yap
        </button>
      </div>
    );
  }

  // --- ANA SAYFA ---
  return (
    <div className="pb-20">
      <div className="p-4 space-y-3">
        {/* Arama */}
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Kategoriler */}
        <div className="flex gap-2 flex-wrap">
          {["Tümü", "Doğa", "Tasarım", "Sanat", "Moda"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full border ${
                selectedCategory === cat
                  ? "bg-purple-500 text-white"
                  : "bg-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        <div className="columns-2 gap-3">
          {filteredPins.map((pin) => (
            <div key={pin.id} className="mb-3 break-inside-avoid bg-white rounded-xl shadow">
              <img
                src={pin.image}
                className="w-full rounded-t-xl"
              />

              <div className="p-2 space-y-1">
                <p className="font-semibold">{pin.title}</p>

                <div className="flex justify-between">
                  <button onClick={() => toggleLike(pin.id)}>
                    <Heart
                      size={18}
                      color={likedPins.includes(pin.id) ? "red" : "black"}
                    />
                  </button>

                  <button onClick={() => toggleSave(pin.id)}>
                    <Bookmark size={18} />
                  </button>

                  <button onClick={() => setSelectedPinForComments(pin)}>
                    <MessageCircle size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alt navbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-inner flex justify-around py-3">
        <button onClick={() => setActiveTab("home")}>
          <Home />
        </button>
        <button onClick={() => setActiveTab("add")}>
          <Plus />
        </button>
        <button onClick={() => setActiveTab("messages")}>
          <Send />
        </button>
        <button onClick={() => setActiveTab("profile")}>
          <User />
        </button>
      </div>
    </div>
  );
}
