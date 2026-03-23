import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const MOTIONS_BY_AREA = {
  "腰": [
    { label: "前に曲げると痛い（前屈）", value: "前屈" },
    { label: "後ろに反ると痛い（後屈）", value: "後屈" },
    { label: "ひねる・横に倒すと痛い（回旋・側屈）", value: "回旋・側屈" },
    { label: "じっとしていても痛い（安静時痛）", value: "安静時痛" },
  ],
  "肩": [
    { label: "腕を上げると痛い（挙上）", value: "挙上" },
    { label: "後ろに手を回すと痛い（結帯・結髪）", value: "結帯・結髪" },
    { label: "夜寝ている時・じっとしていても痛い", value: "安静時痛" },
  ],
  "膝": [
    { label: "曲げ伸ばしで痛い（屈伸時）", value: "屈伸時" },
    { label: "立ち上がり・歩き始めに痛い", value: "歩き始め" },
    { label: "歩いているとずっと痛い", value: "歩行時" },
    { label: "じっとしていても熱を持って痛い", value: "安静時痛" },
  ],
  "首": [
    { label: "下を向くと痛い（前屈）", value: "前屈" },
    { label: "上を向くと痛い（後屈）", value: "後屈" },
    { label: "横を向く・倒すと痛い（回旋・側屈）", value: "回旋・側屈" },
    { label: "じっとしていても痛い・腕にしびれがある", value: "安静時痛" },
  ],
  "足首・足底": [
    { label: "歩き始め・朝の一歩目が痛い", value: "歩き始め" },
    { label: "体重をかけると常に痛い（荷重時）", value: "荷重時" },
    { label: "足首を反らす・伸ばすと痛い（背屈・底屈）", value: "背屈・底屈" },
    { label: "じっとしていても痛い", value: "安静時痛" },
  ],
  "肘": [
    { label: "物を掴んで持ち上げると痛い（把持・手関節伸展）", value: "把持・手関節伸展" },
    { label: "曲げ伸ばしで痛い", value: "屈伸時" },
    { label: "じっとしていても痛い", value: "安静時痛" },
  ],
  "手首": [
    { label: "物を握る・親指を動かすと痛い", value: "把持・母指動作" },
    { label: "手をつくと痛い（荷重時）", value: "荷重時" },
    { label: "じっとしていても痛い", value: "安静時痛" },
  ],
  "指": [
    { label: "曲げ伸ばしで引っかかる・痛い", value: "屈伸時" },
    { label: "指先をつまむと痛い", value: "つまみ動作" },
    { label: "じっとしていてもズキズキ痛い", value: "安静時痛" },
  ],
  "股関節": [
    { label: "歩き始め・立ち上がりで痛い", value: "歩き始め" },
    { label: "あぐらをかく・曲げてひねると痛い", value: "屈曲・回旋" },
    { label: "じっとしていても痛い", value: "安静時痛" },
  ],
};

const AREAS = Object.keys(MOTIONS_BY_AREA);
const AGES = ["10代", "20代", "30代", "40代", "50代", "60代以上"];

const DB = (() => {
  const db = {};

  AREAS.forEach(area => {
    MOTIONS_BY_AREA[area].forEach(motionObj => {
      const motion = motionObj.value;
      AGES.forEach(age => {
        db[`${area}|${motion}|${age}`] = {
          results: [{
            diagnosis: "筋・筋膜性疼痛症候群の疑い（要追加調査）",
            muscles: [`${area}関連の主要筋群`],
            selfcare: ["痛みの出る動作を避ける", "2週間以上続く場合は整形外科へ"]
          }]
        };
      });
    });
  });

  AREAS.forEach(area => {
    AGES.forEach(age => {
      db[`${area}|安静時痛|${age}`] = {
        results: [{
          diagnosis: "⚠️ 要注意：腫瘍・感染・骨折・内科的疾患の疑い",
          muscles: [],
          selfcare: ["すぐに医療機関を受診してください", "自己判断でのケアは控えてください"]
        }]
      };
    });
  });

  ['20代', '30代', '40代'].forEach(age => {
    db[`腰|前屈|${age}`] = { results: [{ diagnosis: "腰椎椎間板ヘルニア / 非特異的腰痛", muscles: ["多裂筋", "大腰筋", "ハムストリングス"], selfcare: ["マッケンジー体操（背中を反らす運動）", "長時間の座りっぱなしを避ける"] }] };
  });
  ['50代', '60代以上'].forEach(age => {
    db[`腰|後屈|${age}`] = { results: [{ diagnosis: "腰部脊柱管狭窄症 / 椎間関節性腰痛", muscles: ["腸腰筋", "脊柱起立筋"], selfcare: ["前かがみで楽になる姿勢をとる", "自転車こぎなどの軽い運動"] }] };
  });
  ['10代'].forEach(age => {
    db[`腰|後屈|${age}`] = { results: [{ diagnosis: "腰椎分離症（スポーツによる疲労骨折）", muscles: ["多裂筋", "ハムストリングス"], selfcare: ["スポーツを一時休止する", "体幹を安定させる運動（ドローイン）"] }] };
  });

  ['40代', '50代', '60代以上'].forEach(age => {
    db[`肩|挙上|${age}`] = { results: [{ diagnosis: "肩関節周囲炎（四十肩・五十肩） / 腱板断裂", muscles: ["棘上筋", "肩甲下筋", "小円筋"], selfcare: ["振り子運動（コッドマン体操）", "患部を温める"] }] };
    db[`肩|結帯・結髪|${age}`] = { results: [{ diagnosis: "肩関節周囲炎（拘縮期）", muscles: ["大胸筋", "広背筋", "肩甲下筋"], selfcare: ["温熱療法", "ゆっくり優しくストレッチ"] }] };
  });
  ['10代', '20代', '30代'].forEach(age => {
    db[`肩|挙上|${age}`] = { results: [{ diagnosis: "インピンジメント症候群 / 肩関節不安定症", muscles: ["ローテーターカフ", "前鋸筋"], selfcare: ["頭より上に手を上げる動作を休む", "肩甲骨周りを安定させる運動"] }] };
  });

  ['50代', '60代以上'].forEach(age => {
    db[`膝|歩き始め|${age}`] = { results: [{ diagnosis: "変形性膝関節症（初期）", muscles: ["大腿四頭筋（内側広筋）"], selfcare: ["太ももの筋トレ（膝伸ばしキープ）", "体重を減らす"] }] };
    db[`膝|歩行時|${age}`] = { results: [{ diagnosis: "変形性膝関節症（進行期）", muscles: ["大腿四頭筋", "大腿筋膜張筋"], selfcare: ["太ももの筋トレ", "杖の使用を検討する"] }] };
  });
  ['10代'].forEach(age => {
    db[`膝|屈伸時|${age}`] = { results: [{ diagnosis: "オスグッド病 / ジャンパー膝", muscles: ["大腿四頭筋（大腿直筋）"], selfcare: ["太ももの前面をストレッチ", "アイシングと安静"] }] };
  });
  ['20代', '30代', '40代'].forEach(age => {
    db[`膝|歩行時|${age}`] = { results: [{ diagnosis: "腸脛靭帯炎（ランナー膝） / 鵞足炎", muscles: ["大腿筋膜張筋", "縫工筋", "半腱様筋"], selfcare: ["走る量を減らす", "股関節外側のストレッチ"] }] };
  });

  ['40代', '50代', '60代以上'].forEach(age => {
    db[`首|後屈|${age}`] = { results: [{ diagnosis: "頚椎症性神経根症", muscles: ["斜角筋群", "肩甲挙筋"], selfcare: ["上を向く動作を避ける", "姿勢を正す習慣をつける"] }] };
  });
  ['10代', '20代', '30代'].forEach(age => {
    db[`首|前屈|${age}`] = { results: [{ diagnosis: "非特異的頚部痛（スマホ首・VDT症候群）", muscles: ["後頭下筋群", "僧帽筋上部"], selfcare: ["長時間のスマホ・PC作業を中断する", "顎を引く運動"] }] };
  });

  ['30代', '40代', '50代', '60代以上'].forEach(age => {
    db[`足首・足底|歩き始め|${age}`] = { results: [{ diagnosis: "足底腱膜炎", muscles: ["足底腱膜", "下腿三頭筋"], selfcare: ["アキレス腱のストレッチ", "クッションの良い靴を履く"] }] };
  });
  ['10代', '20代'].forEach(age => {
    db[`足首・足底|背屈・底屈|${age}`] = { results: [{ diagnosis: "アキレス腱炎 / 足関節捻挫後遺症", muscles: ["下腿三頭筋", "前脛骨筋"], selfcare: ["ジャンプ動作を休む", "ふくらはぎのゆっくりストレッチ"] }] };
  });

  ['30代', '40代', '50代'].forEach(age => {
    db[`肘|把持・手関節伸展|${age}`] = { results: [{ diagnosis: "上腕骨外側上顆炎（テニス肘）", muscles: ["短橈側手根伸筋", "回外筋"], selfcare: ["手首を反らす動作を減らす", "前腕バンドを装着する"] }] };
  });
  ['10代', '20代'].forEach(age => {
    db[`肘|屈伸時|${age}`] = { results: [{ diagnosis: "野球肘 / スポーツ障害", muscles: ["円回内筋", "橈側手根屈筋"], selfcare: ["投球動作を完全に休止する", "早めに専門医を受診する"] }] };
  });

  ['20代', '30代', '40代'].forEach(age => {
    db[`手首|把持・母指動作|${age}`] = { results: [{ diagnosis: "ドケルバン病（狭窄性腱鞘炎）", muscles: ["短母指伸筋", "長母指外転筋"], selfcare: ["親指の使いすぎを控える", "テーピングで固定する"] }] };
  });
  ['50代', '60代以上'].forEach(age => {
    db[`手首|荷重時|${age}`] = { results: [{ diagnosis: "手根管症候群 / 橈骨遠位端骨折後遺症", muscles: ["手関節屈筋群"], selfcare: ["手首を安静にする", "夜間はスプリント（添え木）を使う"] }] };
  });

  ['50代', '60代以上'].forEach(age => {
    db[`指|屈伸時|${age}`] = { results: [{ diagnosis: "ばね指（弾発指） / ヘバーデン結節", muscles: ["浅指屈筋", "深指屈筋"], selfcare: ["指を安静にする", "装具で固定する"] }] };
  });

  ['40代', '50代', '60代以上'].forEach(age => {
    db[`股関節|歩き始め|${age}`] = { results: [{ diagnosis: "変形性股関節症", muscles: ["中殿筋", "腸腰筋"], selfcare: ["水中歩行などの負担の少ない運動", "杖の使用を検討する"] }] };
  });
  ['10代', '20代', '30代'].forEach(age => {
    db[`股関節|屈曲・回旋|${age}`] = { results: [{ diagnosis: "股関節インピンジメント（FAI）", muscles: ["大腿筋膜張筋", "腸腰筋"], selfcare: ["深くしゃがむ動作を避ける"] }] };
  });

  return db;
})();

const NAV = [
  { id: "area", question: "どこが痛いですか？", label: "部位" },
  { id: "motion", question: "どんな動きで痛みますか？", label: "動作" },
  { id: "age", question: "年代を教えてください", label: "年代" },
  { id: "subarea", question: "他に痛い場所はありますか？\n（なければ「なし」を選んでください）", label: "他の部位" },
];

const PIN = "0165";

function ResultCard({ result, idx }) {
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
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${idx === 0 ? "bg-blue-600 text-white" : "bg-slate-500 text-white"}`}>
            第{idx + 1}候補
          </span>
          <p className="text-sm font-black text-slate-800 mt-1">{result.diagnosis}</p>
        </div>
        <span className="text-slate-400 text-sm ml-2">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t pt-3 text-xs">
          {result.muscles && result.muscles.length > 0 && (
            <div className="bg-white p-2 rounded-lg border shadow-sm">
              <p className="font-bold text-blue-700 mb-1">🎯 施術対象筋肉</p>
              {result.muscles.map((m, i) => (
                <p key={i} className="text-slate-600">・{m}</p>
              ))}
            </div>
          )}
          {result.selfcare && result.selfcare.length > 0 && (
            <div className="bg-green-50 p-2 rounded-lg border border-green-100 shadow-sm">
              <p className="font-bold text-green-700 mb-1">💪 自分でできるケア</p>
              {result.selfcare.map((s, i) => (
                <p key={i} className="text-green-700">・{s}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState({});
  const [results, setResults] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [statsError, setStatsError] = useState("");
  const [logs, setLogs] = useState([]);

  const saveLog = async (s) => {
    if (!supabase) return;
    try {
      await supabase.from("clinic_logs").insert([{
        area: s.area, motion: s.motion, age: s.age, subarea: s.subarea,
      }]);
    } catch (e) { console.error("Save Error", e); }
  };

  const fetchStats = async () => {
    if (!supabase) { setStatsError("Supabase未接続です。"); setLogs([]); return; }
    try {
      const { data, error } = await supabase.from("clinic_logs").select("area, motion, age, subarea");
      if (error) throw error;
      setLogs(data || []);
    } catch (e) { setStatsError("データ取得に失敗しました。"); setLogs([]); }
  };

  const choose = (val) => {
    const newSel = { ...sel, [NAV[step].id]: val };
    setSel(newSel);
    if (step + 1 >= NAV.length) {
      const key = `${newSel.area}|${newSel.motion}|${newSel.age}`;
      const found = DB[key];
      setResults(found ? found.results : []);
      saveLog(newSel);
    } else {
      setStep(step + 1);
    }
  };

  const reset = () => { setStep(0); setResults(null); setSel({}); };

  const openStats = () => {
    setPinInput(""); setAuthenticated(false); setStatsError("");
    setShowStats(true); fetchStats();
  };

  const areaStats = Object.entries(
    logs.reduce((acc, l) => { if (l.area) acc[l.area] = (acc[l.area] || 0) + 1; return acc; }, {})
  ).sort((a, b) => b[1] - a[1]);

  const getOptions = () => {
    if (NAV[step].id === "motion") return MOTIONS_BY_AREA[sel.area] || [];
    if (NAV[step].id === "age") return AGES.map(a => ({ label: a, value: a }));
    if (NAV[step].id === "subarea") return [
      { label: "なし", value: "なし" },
      ...AREAS.filter(a => a !== sel.area).map(a => ({ label: a, value: a }))
    ];
    return AREAS.map(a => ({ label: a, value: a }));
  };

  return (
    <div className="min-h-screen bg-slate-50 max-w-xl mx-auto p-4 font-sans shadow-sm">
      <header className="flex justify-between items-center mb-6 py-2 border-b">
        <h1 className="font-black text-slate-800">臨床推論ナビ</h1>
        <button onClick={openStats} className="text-[10px] bg-slate-100 px-3 py-1 rounded-full text-slate-400 font-bold hover:bg-slate-200 transition-colors">
          管理者
        </button>
      </header>

      {results ? (
        <div>
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 rounded-2xl mb-5 shadow-lg">
            <p className="text-[10px] opacity-80 mb-1">入力内容</p>
            <p className="font-bold text-sm">
              {sel.area} ／ {sel.motion} ／ {sel.age}
              {sel.subarea && sel.subarea !== "なし" && ` ／ 他：${sel.subarea}`}
            </p>
          </div>
          {results.length > 0 ? (
            results.map((r, i) => <ResultCard key={i} result={r} idx={i} />)
          ) : (
            <p className="text-center text-slate-400 py-10">該当するデータが未登録です</p>
          )}
          <button onClick={reset} className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold mt-6 shadow-md hover:bg-slate-700 transition-colors">
            最初からやり直す
          </button>
        </div>
      ) : (
        <div>
          <div className="flex gap-1 mb-8">
            {NAV.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < step ? "bg-blue-600" : "bg-slate-200"}`} />
            ))}
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-2 whitespace-pre-line">{NAV[step].question}</h2>
          <div className="grid gap-3 mt-6">
            {getOptions().map((o, i) => (
              <button key={i} onClick={() => choose(o.value)}
                className="p-5 bg-white border-2 border-slate-100 rounded-2xl text-left hover:border-blue-400 transition-all font-bold text-slate-700 shadow-sm">
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
                <input type="password" value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (() => {
                    if (pinInput === PIN) { setAuthenticated(true); setStatsError(""); }
                    else setStatsError("PINが違います");
                  })()}
                  placeholder="PIN入力"
                  className="w-full border-2 p-4 rounded-2xl mb-2 text-center text-2xl font-black outline-none focus:border-blue-400"
                />
                {statsError && <p className="text-red-500 text-sm mb-3">{statsError}</p>}
                <button onClick={() => {
                  if (pinInput === PIN) { setAuthenticated(true); setStatsError(""); }
                  else setStatsError("PINが違います");
                }} className="w-full py-3 bg-blue-600 text-white rounded-2xl font-bold mb-3 hover:bg-blue-700 transition-colors">
                  認証
                </button>
                <button onClick={() => setShowStats(false)} className="text-slate-400 text-sm">キャンセル</button>
              </div>
            ) : (
              <div className="max-h-[70vh] overflow-y-auto">
                <p className="font-black mb-4 border-b pb-3 text-center">集計（全{logs.length}件）</p>
                {statsError && <p className="text-red-500 text-sm text-center mb-3">{statsError}</p>}
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
                <button onClick={() => { setShowStats(false); setPinInput(""); setAuthenticated(false); }}
                  className="w-full py-4 bg-slate-100 rounded-2xl font-bold text-slate-600 mt-4 hover:bg-slate-200 transition-colors">
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
