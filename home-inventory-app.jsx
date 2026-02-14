import { useState, useEffect, useMemo, useCallback, useRef } from "react";

// ─── Constants ───
const CATEGORIES = [
  { id: "food", label: "食品", icon: "🍱", color: "#FF6B4A" },
  { id: "daily", label: "日用品", icon: "🧴", color: "#4A9FFF" },
  { id: "electronics", label: "家電", icon: "🔌", color: "#A855F7" },
  { id: "clothing", label: "衣類", icon: "👕", color: "#F59E0B" },
  { id: "medicine", label: "薬・医療品", icon: "💊", color: "#10B981" },
  { id: "other", label: "その他", icon: "📦", color: "#6B7280" },
];

const LOCATIONS = [
  { id: "fridge", label: "冷蔵庫", icon: "❄️" },
  { id: "freezer", label: "冷凍庫", icon: "🧊" },
  { id: "pantry", label: "パントリー", icon: "🏠" },
  { id: "bathroom", label: "洗面所", icon: "🚿" },
  { id: "closet", label: "クローゼット", icon: "🚪" },
  { id: "living", label: "リビング", icon: "🛋️" },
  { id: "kitchen", label: "キッチン", icon: "🍳" },
  { id: "other", label: "その他", icon: "📍" },
];

const ALERT_DAYS_OPTIONS = [1, 3, 5, 7, 14, 30];

const INITIAL_ITEMS = [
  { id: "1", name: "牛乳", category: "food", location: "fridge", quantity: 1, unit: "本", expiryDate: getFutureDate(2), alertDays: 3, createdAt: Date.now() },
  { id: "2", name: "食パン", category: "food", location: "kitchen", quantity: 1, unit: "袋", expiryDate: getFutureDate(5), alertDays: 3, createdAt: Date.now() },
  { id: "3", name: "卵", category: "food", location: "fridge", quantity: 10, unit: "個", expiryDate: getFutureDate(14), alertDays: 5, createdAt: Date.now() },
  { id: "4", name: "鶏むね肉", category: "food", location: "freezer", quantity: 2, unit: "パック", expiryDate: getFutureDate(1), alertDays: 3, createdAt: Date.now() },
  { id: "5", name: "ヨーグルト", category: "food", location: "fridge", quantity: 3, unit: "個", expiryDate: getFutureDate(-1), alertDays: 3, createdAt: Date.now() },
  { id: "6", name: "シャンプー", category: "daily", location: "bathroom", quantity: 1, unit: "本", expiryDate: null, alertDays: 7, createdAt: Date.now() },
  { id: "7", name: "トイレットペーパー", category: "daily", location: "bathroom", quantity: 4, unit: "ロール", expiryDate: null, alertDays: 7, createdAt: Date.now() },
  { id: "8", name: "味噌", category: "food", location: "fridge", quantity: 1, unit: "パック", expiryDate: getFutureDate(60), alertDays: 7, createdAt: Date.now() },
];

function getFutureDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function getDaysUntilExpiry(dateStr) {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(dateStr);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
}

function getExpiryStatus(dateStr, alertDays) {
  const days = getDaysUntilExpiry(dateStr);
  if (days === null) return "none";
  if (days < 0) return "expired";
  if (days === 0) return "today";
  if (days <= alertDays) return "warning";
  return "ok";
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// ─── Notification Banner ───
function NotificationBanner({ items }) {
  const [dismissed, setDismissed] = useState(new Set());
  const alerts = items.filter((item) => {
    if (dismissed.has(item.id)) return false;
    const status = getExpiryStatus(item.expiryDate, item.alertDays);
    return status === "expired" || status === "today" || status === "warning";
  });

  if (alerts.length === 0) return null;

  const expired = alerts.filter((i) => getExpiryStatus(i.expiryDate, i.alertDays) === "expired");
  const today = alerts.filter((i) => getExpiryStatus(i.expiryDate, i.alertDays) === "today");
  const warning = alerts.filter((i) => getExpiryStatus(i.expiryDate, i.alertDays) === "warning");

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      padding: "12px 16px", maxHeight: "40vh", overflowY: "auto",
      animation: "slideDown 0.4s cubic-bezier(0.16,1,0.3,1)"
    }}>
      <style>{`@keyframes slideDown { from { transform: translateY(-100%); opacity:0 } to { transform: translateY(0); opacity:1 }}`}</style>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ color: "#FF6B6B", fontWeight: 700, fontSize: 13, letterSpacing: "0.03em", fontFamily: "'Noto Sans JP', sans-serif" }}>
            ⚠️ {alerts.length}件のアラート
          </span>
          <button onClick={() => setDismissed(new Set(alerts.map(a => a.id)))}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif" }}>
            すべて閉じる
          </button>
        </div>
        {expired.map((item) => (
          <AlertRow key={item.id} item={item} type="expired" onDismiss={() => setDismissed((s) => new Set([...s, item.id]))} />
        ))}
        {today.map((item) => (
          <AlertRow key={item.id} item={item} type="today" onDismiss={() => setDismissed((s) => new Set([...s, item.id]))} />
        ))}
        {warning.map((item) => (
          <AlertRow key={item.id} item={item} type="warning" onDismiss={() => setDismissed((s) => new Set([...s, item.id]))} />
        ))}
      </div>
    </div>
  );
}

function AlertRow({ item, type, onDismiss }) {
  const days = getDaysUntilExpiry(item.expiryDate);
  const colors = { expired: "#FF4757", today: "#FF6B4A", warning: "#FBBF24" };
  const msgs = {
    expired: `${Math.abs(days)}日前に期限切れ`,
    today: "今日が期限です！",
    warning: `あと${days}日で期限切れ`,
  };
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
      background: `${colors[type]}11`, borderRadius: 10, marginBottom: 4,
      borderLeft: `3px solid ${colors[type]}`
    }}>
      <span style={{ fontSize: 16 }}>{CATEGORIES.find(c => c.id === item.category)?.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "'Noto Sans JP', sans-serif" }}>{item.name}</div>
        <div style={{ color: colors[type], fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif" }}>{msgs[type]}</div>
      </div>
      <button onClick={onDismiss} style={{
        background: "none", border: "none", color: "rgba(255,255,255,0.3)",
        fontSize: 16, cursor: "pointer", padding: 4
      }}>×</button>
    </div>
  );
}

// ─── Dashboard ───
function Dashboard({ items, onNavigate }) {
  const expiredItems = items.filter(i => getExpiryStatus(i.expiryDate, i.alertDays) === "expired");
  const warningItems = items.filter(i => ["today", "warning"].includes(getExpiryStatus(i.expiryDate, i.alertDays)));
  const foodItems = items.filter(i => i.category === "food");
  const categoryStats = CATEGORIES.map(c => ({
    ...c, count: items.filter(i => i.category === c.id).length
  })).filter(c => c.count > 0);

  return (
    <div style={{ padding: "0 16px 100px" }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 800, margin: "0 0 4px", fontFamily: "'Noto Sans JP', sans-serif" }}>
          おうちの在庫
        </h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0, fontFamily: "'Noto Sans JP', sans-serif" }}>
          {new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" })}
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
        <StatCard label="総アイテム" value={items.length} color="#4A9FFF" icon="📦" />
        <StatCard label="期限注意" value={warningItems.length} color="#FBBF24" icon="⚡" />
        <StatCard label="期限切れ" value={expiredItems.length} color="#FF4757" icon="🔥" />
      </div>

      {/* Expiry Timeline */}
      {foodItems.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <SectionHeader title="賞味期限タイムライン" icon="📅" />
          <div style={{
            background: "rgba(255,255,255,0.03)", borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden"
          }}>
            {foodItems
              .filter(i => i.expiryDate)
              .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
              .slice(0, 6)
              .map((item, idx) => {
                const days = getDaysUntilExpiry(item.expiryDate);
                const status = getExpiryStatus(item.expiryDate, item.alertDays);
                const barColor = status === "expired" ? "#FF4757" : status === "today" ? "#FF6B4A" : status === "warning" ? "#FBBF24" : "#4A9FFF";
                const maxDays = 30;
                const barWidth = Math.max(5, Math.min(100, ((maxDays - Math.min(days, maxDays)) / maxDays) * 100));
                return (
                  <div key={item.id} style={{
                    padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
                    borderBottom: idx < 5 ? "1px solid rgba(255,255,255,0.04)" : "none"
                  }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${barColor}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                      {CATEGORIES.find(c => c.id === item.category)?.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 4, fontFamily: "'Noto Sans JP', sans-serif" }}>{item.name}</div>
                      <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${barWidth}%`, background: barColor, borderRadius: 2, transition: "width 0.6s ease" }} />
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ color: barColor, fontSize: 14, fontWeight: 700, fontFamily: "'Noto Sans JP', sans-serif" }}>
                        {days < 0 ? `${Math.abs(days)}日超過` : days === 0 ? "今日" : `${days}日`}
                      </div>
                      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif" }}>{item.expiryDate}</div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      <div style={{ marginBottom: 24 }}>
        <SectionHeader title="カテゴリ別" icon="📊" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {categoryStats.map((cat) => (
            <button key={cat.id} onClick={() => onNavigate("items", cat.id)} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: "14px 16px", cursor: "pointer", textAlign: "left",
              transition: "all 0.2s", display: "flex", alignItems: "center", gap: 10
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}>
              <span style={{ fontSize: 22 }}>{cat.icon}</span>
              <div>
                <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "'Noto Sans JP', sans-serif" }}>{cat.label}</div>
                <div style={{ color: cat.color, fontSize: 18, fontWeight: 800, fontFamily: "'Noto Sans JP', sans-serif" }}>{cat.count}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Location Summary */}
      <div>
        <SectionHeader title="保管場所" icon="🏠" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {LOCATIONS.map(loc => {
            const count = items.filter(i => i.location === loc.id).length;
            if (count === 0) return null;
            return (
              <div key={loc.id} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6
              }}>
                <span style={{ fontSize: 14 }}>{loc.icon}</span>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif" }}>{loc.label}</span>
                <span style={{ color: "#4A9FFF", fontSize: 12, fontWeight: 700, fontFamily: "'Noto Sans JP', sans-serif" }}>{count}</span>
              </div>
            );
          }).filter(Boolean)}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon }) {
  return (
    <div style={{
      background: `${color}08`, border: `1px solid ${color}20`, borderRadius: 14,
      padding: "14px 12px", textAlign: "center"
    }}>
      <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
      <div style={{ color, fontSize: 24, fontWeight: 800, lineHeight: 1, fontFamily: "'Noto Sans JP', sans-serif" }}>{value}</div>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, marginTop: 4, fontFamily: "'Noto Sans JP', sans-serif" }}>{label}</div>
    </div>
  );
}

function SectionHeader({ title, icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <h3 style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 700, margin: 0, fontFamily: "'Noto Sans JP', sans-serif" }}>{title}</h3>
    </div>
  );
}

// ─── Items List ───
function ItemsList({ items, onEdit, onDelete, initialCategory }) {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState(initialCategory || "all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [sortBy, setSortBy] = useState("expiry");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (initialCategory) setFilterCategory(initialCategory);
  }, [initialCategory]);

  const filtered = useMemo(() => {
    let result = [...items];
    if (search) result = result.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
    if (filterCategory !== "all") result = result.filter(i => i.category === filterCategory);
    if (filterLocation !== "all") result = result.filter(i => i.location === filterLocation);
    result.sort((a, b) => {
      if (sortBy === "expiry") {
        if (!a.expiryDate && !b.expiryDate) return 0;
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;
        return new Date(a.expiryDate) - new Date(b.expiryDate);
      }
      if (sortBy === "name") return a.name.localeCompare(b.name, "ja");
      if (sortBy === "category") return a.category.localeCompare(b.category);
      if (sortBy === "newest") return b.createdAt - a.createdAt;
      return 0;
    });
    return result;
  }, [items, search, filterCategory, filterLocation, sortBy]);

  return (
    <div style={{ padding: "0 16px 100px" }}>
      {/* Search */}
      <div style={{
        position: "relative", marginBottom: 12
      }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: 0.4 }}>🔍</span>
        <input
          type="text" placeholder="アイテムを検索..." value={search} onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", padding: "12px 14px 12px 42px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box",
            fontFamily: "'Noto Sans JP', sans-serif"
          }}
        />
      </div>

      {/* Filter Toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button onClick={() => setShowFilters(!showFilters)} style={{
          background: showFilters ? "rgba(74,159,255,0.15)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${showFilters ? "rgba(74,159,255,0.3)" : "rgba(255,255,255,0.08)"}`,
          borderRadius: 10, padding: "8px 14px", color: showFilters ? "#4A9FFF" : "rgba(255,255,255,0.6)",
          fontSize: 12, cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 600
        }}>
          🎛️ フィルタ {showFilters ? "▲" : "▼"}
        </button>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif" }}>
          {filtered.length}件
        </span>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 14, padding: 16, marginBottom: 16,
          animation: "slideDown 0.3s ease"
        }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, display: "block", marginBottom: 6, fontFamily: "'Noto Sans JP', sans-serif" }}>カテゴリ</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <FilterChip label="すべて" active={filterCategory === "all"} onClick={() => setFilterCategory("all")} />
              {CATEGORIES.map(c => (
                <FilterChip key={c.id} label={`${c.icon} ${c.label}`} active={filterCategory === c.id} onClick={() => setFilterCategory(c.id)} color={c.color} />
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, display: "block", marginBottom: 6, fontFamily: "'Noto Sans JP', sans-serif" }}>保管場所</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <FilterChip label="すべて" active={filterLocation === "all"} onClick={() => setFilterLocation("all")} />
              {LOCATIONS.map(l => (
                <FilterChip key={l.id} label={`${l.icon} ${l.label}`} active={filterLocation === l.id} onClick={() => setFilterLocation(l.id)} />
              ))}
            </div>
          </div>
          <div>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, display: "block", marginBottom: 6, fontFamily: "'Noto Sans JP', sans-serif" }}>並び替え</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {[{ id: "expiry", label: "期限順" }, { id: "name", label: "名前順" }, { id: "category", label: "カテゴリ順" }, { id: "newest", label: "新しい順" }].map(s => (
                <FilterChip key={s.id} label={s.label} active={sortBy === s.id} onClick={() => setSortBy(s.id)} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Items */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(255,255,255,0.3)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 14, fontFamily: "'Noto Sans JP', sans-serif" }}>アイテムが見つかりません</div>
        </div>
      ) : (
        filtered.map((item) => (
          <ItemCard key={item.id} item={item} onEdit={() => onEdit(item)} onDelete={() => onDelete(item.id)} />
        ))
      )}
    </div>
  );
}

function FilterChip({ label, active, onClick, color }) {
  return (
    <button onClick={onClick} style={{
      background: active ? (color ? `${color}20` : "rgba(74,159,255,0.15)") : "rgba(255,255,255,0.04)",
      border: `1px solid ${active ? (color || "#4A9FFF") + "40" : "rgba(255,255,255,0.06)"}`,
      borderRadius: 8, padding: "6px 10px", color: active ? (color || "#4A9FFF") : "rgba(255,255,255,0.5)",
      fontSize: 11, cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif", fontWeight: active ? 600 : 400,
      transition: "all 0.15s"
    }}>
      {label}
    </button>
  );
}

function ItemCard({ item, onEdit, onDelete }) {
  const [showActions, setShowActions] = useState(false);
  const cat = CATEGORIES.find(c => c.id === item.category);
  const loc = LOCATIONS.find(l => l.id === item.location);
  const days = getDaysUntilExpiry(item.expiryDate);
  const status = getExpiryStatus(item.expiryDate, item.alertDays);
  const statusColors = { expired: "#FF4757", today: "#FF6B4A", warning: "#FBBF24", ok: "#4A9FFF", none: "transparent" };
  const borderColor = statusColors[status] || "transparent";

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
      borderLeft: status !== "none" ? `3px solid ${borderColor}` : "1px solid rgba(255,255,255,0.06)",
      borderRadius: 14, padding: "14px 16px", marginBottom: 8,
      transition: "all 0.2s"
    }}
      onClick={() => setShowActions(!showActions)}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, background: `${cat?.color || "#6B7280"}12`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0
        }}>
          {cat?.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "'Noto Sans JP', sans-serif" }}>{item.name}</span>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif" }}>
              ×{item.quantity}{item.unit}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{
              fontSize: 10, padding: "2px 6px", borderRadius: 4,
              background: `${cat?.color || "#6B7280"}15`, color: cat?.color || "#6B7280",
              fontFamily: "'Noto Sans JP', sans-serif"
            }}>{cat?.label}</span>
            <span style={{
              fontSize: 10, padding: "2px 6px", borderRadius: 4,
              background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)",
              fontFamily: "'Noto Sans JP', sans-serif"
            }}>{loc?.icon} {loc?.label}</span>
          </div>
        </div>
        {item.expiryDate && (
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ color: borderColor, fontSize: 13, fontWeight: 700, fontFamily: "'Noto Sans JP', sans-serif" }}>
              {status === "expired" ? `${Math.abs(days)}日超過` : status === "today" ? "今日！" : `${days}日`}
            </div>
            <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif" }}>{item.expiryDate}</div>
          </div>
        )}
      </div>
      {showActions && (
        <div style={{ display: "flex", gap: 8, marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={(e) => { e.stopPropagation(); onEdit(); }} style={{
            flex: 1, padding: "8px 0", borderRadius: 8, border: "1px solid rgba(74,159,255,0.3)",
            background: "rgba(74,159,255,0.1)", color: "#4A9FFF", fontSize: 12, cursor: "pointer",
            fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 600
          }}>✏️ 編集</button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} style={{
            flex: 1, padding: "8px 0", borderRadius: 8, border: "1px solid rgba(255,71,87,0.3)",
            background: "rgba(255,71,87,0.1)", color: "#FF4757", fontSize: 12, cursor: "pointer",
            fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 600
          }}>🗑️ 削除</button>
        </div>
      )}
    </div>
  );
}

// ─── Add/Edit Form ───
function ItemForm({ item, onSave, onCancel }) {
  const isEdit = !!item;
  const [form, setForm] = useState(item || {
    name: "", category: "food", location: "fridge", quantity: 1, unit: "個",
    expiryDate: "", alertDays: 3
  });

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave({
      ...form,
      id: form.id || generateId(),
      expiryDate: form.expiryDate || null,
      createdAt: form.createdAt || Date.now()
    });
  };

  return (
    <div style={{ padding: "0 16px 100px" }}>
      <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 800, margin: "0 0 24px", fontFamily: "'Noto Sans JP', sans-serif" }}>
        {isEdit ? "アイテムを編集" : "アイテムを追加"}
      </h2>

      <FormField label="アイテム名 *">
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="例: 牛乳" style={inputStyle} />
      </FormField>

      <FormField label="カテゴリ">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setForm({ ...form, category: c.id })} style={{
              padding: "10px 8px", borderRadius: 10, border: `1px solid ${form.category === c.id ? c.color + "50" : "rgba(255,255,255,0.06)"}`,
              background: form.category === c.id ? `${c.color}15` : "rgba(255,255,255,0.03)",
              color: form.category === c.id ? c.color : "rgba(255,255,255,0.5)",
              fontSize: 12, cursor: "pointer", textAlign: "center", fontFamily: "'Noto Sans JP', sans-serif", fontWeight: form.category === c.id ? 600 : 400
            }}>
              <div style={{ fontSize: 18, marginBottom: 2 }}>{c.icon}</div>
              {c.label}
            </button>
          ))}
        </div>
      </FormField>

      <FormField label="保管場所">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {LOCATIONS.map(l => (
            <button key={l.id} onClick={() => setForm({ ...form, location: l.id })} style={{
              padding: "10px 12px", borderRadius: 10, border: `1px solid ${form.location === l.id ? "#4A9FFF50" : "rgba(255,255,255,0.06)"}`,
              background: form.location === l.id ? "rgba(74,159,255,0.1)" : "rgba(255,255,255,0.03)",
              color: form.location === l.id ? "#4A9FFF" : "rgba(255,255,255,0.5)",
              fontSize: 12, cursor: "pointer", textAlign: "left", fontFamily: "'Noto Sans JP', sans-serif",
              display: "flex", alignItems: "center", gap: 8, fontWeight: form.location === l.id ? 600 : 400
            }}>
              <span style={{ fontSize: 16 }}>{l.icon}</span> {l.label}
            </button>
          ))}
        </div>
      </FormField>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FormField label="数量">
          <input type="number" min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
            style={inputStyle} />
        </FormField>
        <FormField label="単位">
          <input value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}
            placeholder="個, 本, 袋..." style={inputStyle} />
        </FormField>
      </div>

      {form.category === "food" || form.category === "medicine" ? (
        <>
          <FormField label="賞味期限">
            <input type="date" value={form.expiryDate || ""} onChange={e => setForm({ ...form, expiryDate: e.target.value })}
              style={{ ...inputStyle, colorScheme: "dark" }} />
          </FormField>
          <FormField label="通知タイミング（期限の何日前）">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ALERT_DAYS_OPTIONS.map(d => (
                <button key={d} onClick={() => setForm({ ...form, alertDays: d })} style={{
                  padding: "8px 14px", borderRadius: 8,
                  border: `1px solid ${form.alertDays === d ? "#4A9FFF50" : "rgba(255,255,255,0.06)"}`,
                  background: form.alertDays === d ? "rgba(74,159,255,0.15)" : "rgba(255,255,255,0.03)",
                  color: form.alertDays === d ? "#4A9FFF" : "rgba(255,255,255,0.5)",
                  fontSize: 13, cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif", fontWeight: form.alertDays === d ? 700 : 400
                }}>
                  {d}日前
                </button>
              ))}
            </div>
          </FormField>
        </>
      ) : null}

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button onClick={onCancel} style={{
          flex: 1, padding: "14px 0", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)", fontSize: 14,
          cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 600
        }}>キャンセル</button>
        <button onClick={handleSave} style={{
          flex: 2, padding: "14px 0", borderRadius: 12, border: "none",
          background: form.name.trim() ? "linear-gradient(135deg, #4A9FFF, #6366F1)" : "rgba(255,255,255,0.08)",
          color: form.name.trim() ? "#fff" : "rgba(255,255,255,0.3)", fontSize: 14,
          cursor: form.name.trim() ? "pointer" : "not-allowed", fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 700
        }}>{isEdit ? "更新する" : "追加する"}</button>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 8, fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 500 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "12px 14px", borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)",
  color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box",
  fontFamily: "'Noto Sans JP', sans-serif"
};

// ─── Settings ───
function Settings({ settings, onUpdate }) {
  return (
    <div style={{ padding: "0 16px 100px" }}>
      <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 800, margin: "0 0 24px", fontFamily: "'Noto Sans JP', sans-serif" }}>設定</h2>

      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16, overflow: "hidden"
      }}>
        <SettingsRow label="デフォルト通知日数" value={
          <select value={settings.defaultAlertDays} onChange={e => onUpdate({ ...settings, defaultAlertDays: parseInt(e.target.value) })}
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, padding: "6px 10px", color: "#fff", fontSize: 13, fontFamily: "'Noto Sans JP', sans-serif"
            }}>
            {ALERT_DAYS_OPTIONS.map(d => <option key={d} value={d}>{d}日前</option>)}
          </select>
        } />
        <SettingsRow label="期限切れアイテムを表示" value={
          <ToggleSwitch checked={settings.showExpired} onChange={v => onUpdate({ ...settings, showExpired: v })} />
        } />
        <SettingsRow label="バージョン" value={
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: "'Noto Sans JP', sans-serif" }}>1.0.0</span>
        } last />
      </div>

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif" }}>
          おうちの在庫管理アプリ v1.0
        </p>
      </div>
    </div>
  );
}

function SettingsRow({ label, value, last }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px",
      borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.04)"
    }}>
      <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontFamily: "'Noto Sans JP', sans-serif" }}>{label}</span>
      {value}
    </div>
  );
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <div onClick={() => onChange(!checked)} style={{
      width: 44, height: 24, borderRadius: 12, cursor: "pointer",
      background: checked ? "#4A9FFF" : "rgba(255,255,255,0.15)",
      position: "relative", transition: "background 0.2s"
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: 9, background: "#fff",
        position: "absolute", top: 3, left: checked ? 23 : 3,
        transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)"
      }} />
    </div>
  );
}

// ─── Main App ───
export default function App() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [page, setPage] = useState("dashboard");
  const [editingItem, setEditingItem] = useState(null);
  const [filterCat, setFilterCat] = useState(null);
  const [settings, setSettings] = useState({ defaultAlertDays: 3, showExpired: true });

  const hasAlerts = items.some(i => {
    const s = getExpiryStatus(i.expiryDate, i.alertDays);
    return s === "expired" || s === "today" || s === "warning";
  });

  const handleSave = (item) => {
    setItems((prev) => {
      const idx = prev.findIndex(i => i.id === item.id);
      if (idx >= 0) { const n = [...prev]; n[idx] = item; return n; }
      return [...prev, item];
    });
    setEditingItem(null);
    setPage("items");
  };

  const handleDelete = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleNavigate = (p, cat) => {
    setPage(p);
    if (cat) setFilterCat(cat);
    else setFilterCat(null);
  };

  const alertCount = items.filter(i => {
    const s = getExpiryStatus(i.expiryDate, i.alertDays);
    return s === "expired" || s === "today" || s === "warning";
  }).length;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0d0d1a 0%, #141428 50%, #0d0d1a 100%)",
      maxWidth: 480, margin: "0 auto", position: "relative",
      fontFamily: "'Noto Sans JP', sans-serif"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Notification Banner */}
      {page === "dashboard" && <NotificationBanner items={items} />}

      {/* Header Spacer for notifications */}
      {page === "dashboard" && hasAlerts && <div style={{ height: 8 }} />}

      {/* Page Content */}
      <div style={{ paddingTop: 24 }}>
        {page === "dashboard" && <Dashboard items={items} onNavigate={handleNavigate} />}
        {page === "items" && (
          <ItemsList
            items={settings.showExpired ? items : items.filter(i => getExpiryStatus(i.expiryDate, i.alertDays) !== "expired")}
            onEdit={(item) => { setEditingItem(item); setPage("form"); }}
            onDelete={handleDelete}
            initialCategory={filterCat}
          />
        )}
        {page === "form" && (
          <ItemForm
            item={editingItem}
            onSave={handleSave}
            onCancel={() => { setEditingItem(null); setPage(editingItem ? "items" : "dashboard"); }}
          />
        )}
        {page === "settings" && <Settings settings={settings} onUpdate={setSettings} />}
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480, background: "rgba(13,13,26,0.95)",
        borderTop: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)",
        display: "flex", justifyContent: "space-around", padding: "8px 0 calc(8px + env(safe-area-inset-bottom))",
        zIndex: 900
      }}>
        <NavButton icon="🏠" label="ホーム" active={page === "dashboard"} onClick={() => handleNavigate("dashboard")} />
        <NavButton icon="📋" label="アイテム" active={page === "items"} onClick={() => handleNavigate("items")} badge={alertCount > 0 ? alertCount : null} />
        <div style={{ position: "relative", marginTop: -20 }}>
          <button onClick={() => { setEditingItem(null); setPage("form"); }} style={{
            width: 52, height: 52, borderRadius: 16, border: "none",
            background: "linear-gradient(135deg, #4A9FFF, #6366F1)",
            color: "#fff", fontSize: 24, cursor: "pointer",
            boxShadow: "0 4px 20px rgba(74,159,255,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>+</button>
        </div>
        <NavButton icon="⚙️" label="設定" active={page === "settings"} onClick={() => setPage("settings")} />
        <NavButton icon="📊" label="統計" active={false} onClick={() => {}} disabled />
      </div>
    </div>
  );
}

function NavButton({ icon, label, active, onClick, badge, disabled }) {
  return (
    <button onClick={disabled ? undefined : onClick} style={{
      background: "none", border: "none", display: "flex", flexDirection: "column",
      alignItems: "center", gap: 2, cursor: disabled ? "default" : "pointer", padding: "4px 12px",
      opacity: disabled ? 0.3 : 1, position: "relative"
    }}>
      <span style={{ fontSize: 20, filter: active ? "none" : "grayscale(0.5)", opacity: active ? 1 : 0.5 }}>{icon}</span>
      <span style={{
        fontSize: 10, color: active ? "#4A9FFF" : "rgba(255,255,255,0.3)",
        fontFamily: "'Noto Sans JP', sans-serif", fontWeight: active ? 600 : 400
      }}>{label}</span>
      {badge && (
        <div style={{
          position: "absolute", top: -2, right: 4, width: 16, height: 16, borderRadius: 8,
          background: "#FF4757", color: "#fff", fontSize: 9, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>{badge}</div>
      )}
    </button>
  );
}
