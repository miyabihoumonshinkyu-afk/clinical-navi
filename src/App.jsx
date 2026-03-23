import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// --- 1. Supabase接続設定 ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// --- 2. 臨床データベース ---
const DB = {
  "腰|前屈|放散痛あり 急性": [
    {
      diagnosis: "腰椎椎間板ヘルニア (神経根症)",
      rank: 1,
      evidence: "高",
      basis: "腰痛診療GL2019",
      muscles: [
        {
          name: "多裂筋・大腰筋",
          mechanism: "神経根圧迫による防御性収縮",
          test: "SLRテスト (+)",
        },
      ],
      forbidden: ["過度な前屈動作", "重量物の挙上"],
      redflags: ["膀胱直腸障害 (失禁・排尿困難)", "進行性の筋力低下"],
      selfcare: ["マッケンジーエクステンション"],
    },
    {
      diagnosis: "急性腰筋筋膜炎 (ぎっくり腰)",
      rank: 2,
      evidence: "高",
      basis: "Lancet 2018",
      muscles: [
        {
          name: "腰方形筋・多裂筋",
          mechanism: "筋線維損傷",
          test: "圧痛点確認",
        },
      ],
      redflags: ["安静時痛", "発熱を伴う腰痛"],
      selfcare: ["急性期は安静、3日目から活動"],
    },
    {
      diagnosis: "仙腸関節障害",
      rank: 3,
      evidence: "中",
      basis: "Sembrano JN et al.",
    },
  ],
  "腰|前屈|局所のみ 急性": [
    { diagnosis: "非特異的腰痛(急性腰筋筋膜炎)", rank: 1, evidence: "高", basis: "腰痛診療GL" },
    { diagnosis: "腰椎椎間関節炎", rank: 2, evidence: "中", basis: "Schwarzer AC" },
  ],
  "腰|前屈|局所のみ 慢性": [
    { diagnosis: "慢性一次性腰痛(非特異的腰痛)", rank: 1, evidence: "高", basis: "Langevin HM" },
    { diagnosis: "変形性腰椎症", rank: 2, evidence: "高", basis: "腰痛診療GL" },
    { diagnosis: "腰椎椎間板症(IDD)", rank: 3, evidence: "中", basis: "Schwarzer AC" },
  ],
  "腰|後屈|放散痛あり 慢性": [
    { diagnosis: "腰部脊柱管狭窄症(LSS)", rank: 1, evidence: "高", basis: "腰痛診療GL" },
    { diagnosis: "腰椎椎間関節症", rank: 2, evidence: "中", basis: "Schwarzer AC" },
  ],
  "腰|後屈|局所のみ 慢性": [
    { diagnosis: "腰椎椎間関節症", rank: 1, evidence: "中", basis: "Schwarzer AC" },
    { diagnosis: "腰椎分離症(疲労骨折)", rank: 2, evidence: "高", basis: "腰痛診療GL" },
  ],
  "腰|前屈|放散痛あり 慢性": [
    { diagnosis: "腰椎椎間板ヘルニア (慢性型)", rank: 1, evidence: "高", basis: "腰痛診療GL" },
    { diagnosis: "腰部脊柱管狭窄症(間欠跛行型)", rank: 2, evidence: "高", basis: "NASS GL" },
    { diagnosis: "梨状筋症候群", rank: 3, evidence: "中", basis: "Boyajian-O'Neill" },
  ],
  "腰|前屈|局所のみ 外傷": [
    { diagnosis: "急性腰椎捻挫", rank: 1, evidence: "高", basis: "van Tulder" },
    { diagnosis: "腰椎圧迫骨折", rank: 2, evidence: "高", basis: "腰痛診療GL" },
  ],
  "腰|常に痛い|局所のみ 慢性": [
    { diagnosis: "慢性非特異的腰痛(中枢感作型)", rank: 1, evidence: "高", basis: "Lalvas" },
  ],
  "肩|挙上|局所のみ 慢性": [
    { diagnosis: "肩峰下インピンジメント症候群", rank: 1, evidence: "高", basis: "Uhlin" },
    { diagnosis: "癒着性関節包炎(五十肩)", rank: 2, evidence: "高", basis: "Zuckerman" },
    { diagnosis: "石灰沈着性腱板炎(慢性期)", rank: 3, evidence: "高", basis: "Uhlin" },
  ],
  "肩|挙上|局所のみ 急性": [
    { diagnosis: "石灰沈着性腱板炎(急性吸収期)", rank: 1, evidence: "高", basis: "Uhlin" },
    { diagnosis: "腱板損傷(急性期)", rank: 2, evidence: "高", basis: "Neer CS" },
  ],
  "肩|挙上|放散痛あり 慢性": [
    { diagnosis: "頸椎症性神経根症", rank: 1, evidence: "高", basis: "Zuckerman" },
  ],
  "肩|挙上|放散痛あり 急性": [
    { diagnosis: "腱板損傷 (FOOSH損傷)", rank: 1, evidence: "高", basis: "Neer CS" },
  ],
  "膝|動作時|内側 慢性": [
    { diagnosis: "変形性膝関節症", rank: 1, evidence: "高", basis: "OA診療GL" },
    { diagnosis: "内側半月板損傷(変性断裂)", rank: 2, evidence: "高", basis: "Englund" },
    { diagnosis: "内側側副靭帯損傷(慢性)", rank: 3, evidence: "高", basis: "Englund" },
  ],
  "膝|動作時|内側 外傷": [
    { diagnosis: "前十字靭帯損傷(ACL)", rank: 1, evidence: "高", basis: "Frobell RI" },
    { diagnosis: "内側側副靭帯損傷(急性)", rank: 2, evidence: "高", basis: "Phisitkul" },
  ],
  "膝|動作時|外側 慢性": [
    { diagnosis: "腸脛靭帯炎", rank: 1, evidence: "高", basis: "Fredericson" },
  ],
  "膝|動作時|全体 慢性": [
    { diagnosis: "膝蓋大腿関節症(PFPS)", rank: 1, evidence: "高", basis: "Englund" },
  ],
  "頸部(首)|回旋・側屈|放散痛あり 急性": [
    { diagnosis: "頸椎症性神経根症 / ヘルニア", rank: 1, evidence: "高", basis: "Halden" },
    { diagnosis: "胸郭出口症候群(TOS)", rank: 2, evidence: "中", basis: "Ferrante N" },
  ],
  "頸部(首)|回旋・側屈|局所のみ 急性": [
    { diagnosis: "急性頸部筋筋膜炎(寝違え)", rank: 1, evidence: "高", basis: "Spitzer" },
    { diagnosis: "頸椎捻挫(むち打ち症)", rank: 2, evidence: "高", basis: "Spitzer" },
  ],
  "頸部(首)|回旋・側屈|局所のみ 慢性": [
    { diagnosis: "慢性頸部筋筋膜性疼痛", rank: 1, evidence: "高", basis: "Ferrante N" },
    { diagnosis: "頸椎症性神経根症(慢性型)", rank: 2, evidence: "高", basis: "Halden" },
  ],
  "足首・足底|歩き始め|かかと 慢性": [
    { diagnosis: "足底腱膜炎", rank: 1, evidence: "高", basis: "JOSPT GL" },
    { diagnosis: "踵骨棘", rank: 2, evidence: "中", basis: "Johal KS" },
    { diagnosis: "足根管症候群", rank: 3, evidence: "中", basis: "Trepman E" },
  ],
  "足首・足底|歩行時(全体)|外側 外傷": [
    { diagnosis: "足関節外側靭帯損傷", rank: 1, evidence: "高", basis: "Johal KS" },
  ],
  "足首・足底|歩行時(全体)|前足部 慢性": [
    { diagnosis: "Morton神経腫", rank: 1, evidence: "高", basis: "Trepman E" },
  ],
  "肘|把持・回旋|外側 慢性": [
    { diagnosis: "外側上顆炎(テニス肘)", rank: 1, evidence: "高", basis: "Descatha" },
    { diagnosis: "後骨間神経障害", rank: 2, evidence: "中", basis: "最新System" },
  ],
  "肘|把持・回旋|内側 慢性": [
    { diagnosis: "内側上顆炎(ゴルフ肘)", rank: 1, evidence: "高", basis: "Barthel" },
    { diagnosis: "肘部管症候群", rank: 2, evidence: "高", basis: "Barthel" },
  ],
  "手首|動作時|掌側(手のひら側) 慢性": [
    { diagnosis: "手根管症候群", rank: 1, evidence: "高", basis: "AAEM" },
    { diagnosis: "ドケルバン病", rank: 2, evidence: "高", basis: "AAEM" },
  ],
  "手首|動作時|背側(手の甲側) 慢性": [
    { diagnosis: "TFCC損傷", rank: 1, evidence: "高", basis: "Palmer" },
    { diagnosis: "手根骨骨折", rank: 2, evidence: "高", basis: "Beeres" },
    { diagnosis: "手関節ガングリオン", rank: 3, evidence: "中", basis: "Diaz" },
  ],
  "手首|動作時|全体 外傷": [
    { diagnosis: "橈骨遠位端骨折", rank: 1, evidence: "高", basis: "Harrington" },
  ],
  "指|屈伸時|屈側(腱) 慢性": [
    { diagnosis: "ばね指", rank: 1, evidence: "高", basis: "Huisstede" },
    { diagnosis: "屈筋腱炎", rank: 2, evidence: "中", basis: "Huisstede" },
  ],
  "指|屈伸時|側副靭帯・PIP/DIP 外傷": [
    { diagnosis: "指関節側副靭帯損傷", rank: 1, evidence: "高", basis: "Arora" },
    { diagnosis: "槌指(マレット)", rank: 2, evidence: "高", basis: "Wehbe" },
  ],
  "指|屈伸時|腫脹・変形 慢性": [
    { diagnosis: "変形性指関節症", rank: 1, evidence: "高", basis: "Wehbe" },
    { diagnosis: "関節リウマチ", rank: 2, evidence: "高", basis: "Wehbe" },
  ],
  "股関節|動作時|前面 鼠径部 慢性": [
    { diagnosis: "股関節インピンジメント(FAI)", rank: 1, evidence: "高", basis: "OARSI" },
    { diagnosis: "変形性股関節症", rank: 2, evidence: "高", basis: "OARSI" },
    { diagnosis: "腸腰筋炎・弾発股", rank: 3, evidence: "中", basis: "OARSI" },
  ],
  "股関節|動作時|外側(大転子) 慢性": [
    { diagnosis: "大転子疼痛症候群(GTPS)", rank: 1, evidence: "高", basis: "Fearon" },
  ],
};

const NAV = [
  {
    id: "area",
    question: "どこが痛いですか?",
    label: "部位",
    options: [
      { label: "腰" }, { label: "肩" }, { label: "膝" }, { label: "頸部(首)" },
      { label: "足首・足底" }, { label: "肘" }, { label: "手首" }, { label: "指" }, { label: "股関節" },
    ],
  },
  {
    id: "motion",
    question: "どんな動作で痛みますか?",
    label: "動作",
    options: [
      { label: "前屈" }, { label: "後屈" }, { label: "挙上" }, { label: "動作時" },
      { label: "回旋・側屈" }, { label: "歩き始め" }, { label: "歩行時(全体)" },
      { label: "把持・回旋" }, { label: "屈伸時" }, { label: "常に痛い" },
    ],
  },
  {
    id: "location",
    question: "痛みの場所・広がりは?",
    label: "場所",
    options: [
      { label: "局所のみ" }, { label: "放散痛あり" }, { label: "内側" }, { label: "外側" },
      { label: "全体" }, { label: "かかと" }, { label: "前足部" },
      { label: "掌側(手のひら側)" }, { label: "背側(手の甲側)" },
      { label: "側副靭帯・PIP/DIP" }, { label: "屈側(腱)" }, { label: "腫脹・変形" },
      { label: "前面 鼠径部" }, { label: "外側(大転子)" },
    ],
  },
  {
    id: "onset",
    question: "いつから始まりましたか?",
    label: "発症",
    options: [{ label: "急性" }, { label: "慢性" }, { label: "外傷" }],
  },
];

const PIN = "0165";

// --- DiagCard コンポーネント ---
function DiagCard({ diag, idx }) {
  const [open, setOpen] = useState(idx === 0);
  const colors = [
    "border-blue-400 bg-blue-50",
    "border-slate-300 bg-slate-50",
    "border-slate-200 bg-white",
  ];

  return (
    <div className={`rounded-2xl border-2 overflow-hidden mb-4 ${colors[idx] || "border-slate-200 bg-white"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-3 flex items-center justify-between"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${idx === 0 ? "bg-blue-600 text-white" : "bg-slate-500 text-white"}`}>
              第{idx + 1}候補
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-600 text-blue-600">
              信頼度:{diag.evidence}
            </span>
          </div>
          <p className="text-sm font-black text-slate-800">{diag.diagnosis}</p>
        </div>
        <span className="text-slate-400 text-sm ml-2">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t pt-3 text-xs">
          {diag.muscles && diag.muscles.map((m, i) => (
            <div key={i} className="bg-white p-2 rounded-lg border shadow-sm">
              <p className="font-bold text-blue-700">{m.name}</p>
              <p className="text-slate-600">機序:{m.mechanism} / 評価:{m.test}</p>
            </div>
          ))}
          {diag.redflags && diag.redflags.length > 0 && (
            <div className="bg-red-50 p-2 rounded-lg border border-red-100 shadow-sm">
              <p className="font-bold text-red-700 mb-1">⚠ レッドフラグ</p>
              {diag.redflags.map((f, i) => (
                <p key={i} className="text-red-700">・{f}</p>
              ))}
            </div>
          )}
          {diag.selfcare && diag.selfcare.length > 0 && (
            <div className="bg-green-50 p-2 rounded-lg border border-green-100 shadow-sm">
              <p className="font-bold text-green-700 mb-1">セルフケア</p>
              {diag.selfcare.map((s, i) => (
                <p key={i} className="text-green-700">・{s}</p>
              ))}
            </div>
          )}
          <p className="text-[9px] text-slate-400 text-right italic">根拠: {diag.basis}</p>
        </div>
      )}
    </div>
  );
}

// --- メインアプリ ---
export default function App() {
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState({});
  const [results, setResults] = useState(null);
  const [logs, setLogs] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [statsError, setStatsError] = useState("");

  const saveLog = async (s) => {
    if (!supabase) return;
    try {
      await supabase.from("clinic_logs").insert([{
        area: s.area,
        motion: s.motion,
        location: s.location,
        onset: s.onset,
      }]);
    } catch (e) {
      console.error("Cloud Save Error", e);
    }
  };

  const fetchStats = async () => {
    if (!supabase) {
      setStatsError("Supabase未接続です。環境変数を確認してください。");
      setLogs([]);
      return;
    }
    setStatsError("");
    try {
      const { data, error } = await supabase
        .from("clinic_logs")
        .select("area, motion, location, onset");
      if (error) throw error;
      setLogs(data || []);
    } catch (e) {
      console.error("Fetch Error", e);
      setStatsError("データ取得に失敗しました。");
      setLogs([]);
    }
  };

  const choose = (val) => {
    const newSel = { ...sel, [NAV[step].id]: val };
    setSel(newSel);
    if (step + 1 >= NAV.length) {
      const key = `${newSel.area}|${newSel.motion}|${newSel.location} ${newSel.onset}`;
      setResults(DB[key] || []);
      saveLog(newSel);
    } else {
      setStep(step + 1);
    }
  };

  const reset = () => {
    setStep(0);
    setResults(null);
    setSel({});
  };

  const openStats = () => {
    setPinInput("");
    setAuthenticated(false);
    setStatsError("");
    setShowStats(true);
    fetchStats();
  };

  const handlePinSubmit = () => {
    if (pinInput === PIN) {
      setAuthenticated(true);
      setStatsError("");
    } else {
      setStatsError("PINが違います");
    }
  };

  const areaStats = Object.entries(
    logs.reduce((acc, l) => {
      if (l.area) acc[l.area] = (acc[l.area] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div className="min-h-screen bg-slate-50 max-w-xl mx-auto p-4 font-sans shadow-sm">
      <header className="flex justify-between items-center mb-6 py-2 border-b">
        <h1 className="font-black text-slate-800">臨床推論ナビ</h1>
        <button
          onClick={openStats}
          className="text-[10px] bg-slate-100 px-3 py-1 rounded-full text-slate-400 font-bold hover:bg-slate-200 transition-colors"
        >
          管理者
        </button>
      </header>

      {results ? (
        <div>
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 rounded-2xl mb-5 shadow-lg">
            <p className="text-[10px] opacity-80 mb-1">診断内容</p>
            <p className="font-bold text-sm">
              {sel.area} ＞ {sel.motion} ＞ {sel.location} ＞ {sel.onset}
            </p>
          </div>
          {results.length > 0 ? (
            results.map((d, i) => <DiagCard key={i} diag={d} idx={i} />)
          ) : (
            <p className="text-center text-slate-400 py-10">該当するデータが未登録です</p>
          )}
          <button
            onClick={reset}
            className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold mt-6 shadow-md hover:bg-slate-700 transition-colors"
          >
            最初からやり直す
          </button>
        </div>
      ) : (
        <div>
          <div className="flex gap-1 mb-8">
            {NAV.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${i < step ? "bg-blue-600" : "bg-slate-200"}`}
              />
            ))}
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-8">{NAV[step].question}</h2>
          <div className="grid gap-3">
            {NAV[step].options.map((o, i) => (
              <button
                key={i}
                onClick={() => choose(o.label)}
                className="p-5 bg-white border-2 border-slate-100 rounded-2xl text-left hover:border-blue-400 transition-all font-bold text-slate-700 shadow-sm"
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {showStats && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-2xl">
            {!authenticated ? (
              <div className="text-center">
                <p className="font-black mb-4">管理者認証</p>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
                  placeholder="PIN入力"
                  className="w-full border-2 p-4 rounded-2xl mb-2 text-center text-2xl font-black outline-none focus:border-blue-400"
                />
                {statsError && (
                  <p className="text-red-500 text-sm mb-3">{statsError}</p>
                )}
                <button
                  onClick={handlePinSubmit}
                  className="w-full py-3 bg-blue-600 text-white rounded-2xl font-bold mb-3 hover:bg-blue-700 transition-colors"
                >
                  認証
                </button>
                <button onClick={() => setShowStats(false)} className="text-slate-400 text-sm">
                  キャンセル
                </button>
              </div>
            ) : (
              <div className="max-h-[70vh] overflow-y-auto">
                <p className="font-black mb-4 border-b pb-3 text-center">
                  集計 (全端末:{logs.length}件)
                </p>
                {statsError && (
                  <p className="text-red-500 text-sm text-center mb-3">{statsError}</p>
                )}
                {areaStats.length > 0 ? (
                  <div className="space-y-2">
                    {areaStats.map(([area, count], i) => (
                      <div key={i} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded-lg">
                        <span className="font-bold">{area}</span>
                        <span className="text-blue-600 font-bold">{count}回</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-slate-400 py-4">データがありません</p>
                )}
                <button
                  onClick={() => { setShowStats(false); setPinInput(""); setAuthenticated(false); }}
                  className="w-full py-4 bg-slate-100 rounded-2xl font-bold text-slate-600 mt-4 hover:bg-slate-200 transition-colors"
                >
                  閉じる
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
