import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase設定
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 臨床データベース（PDF全32パターン完全移植） 
const DB = {
  "腰|前屈|放散痛あり|急性": [{ diagnosis: "腰椎椎間板ヘルニア (神経根症)", rank: 1, evidence: "高", basis: "椎間板内圧の上昇による神経圧迫 [cite: 5]" }, { diagnosis: "急性腰筋筋膜炎", rank: 2, evidence: "高", basis: "筋膜の微細損傷 [cite: 5]" }, { diagnosis: "仙腸関節障害", rank: 3, evidence: "中", basis: "関節由来の関連痛 [cite: 5]" }],
  "腰|前屈|局所のみ|急性": [{ diagnosis: "非特異的腰痛(急性腰筋筋膜炎)", rank: 1, evidence: "高", basis: "急性の筋・筋膜性疼痛 [cite: 8]" }, { diagnosis: "腰椎椎間関節炎", rank: 2, evidence: "中", basis: "関節包の過緊張 [cite: 8]" }],
  "腰|前屈|局所のみ|慢性": [{ diagnosis: "慢性一次性腰痛", rank: 1, evidence: "高", basis: "持続的な非特異的痛み [cite: 11]" }, { diagnosis: "変形性腰椎症", rank: 2, evidence: "高", basis: "加齢に伴う変性 [cite: 11]" }, { diagnosis: "腰椎椎間板症(IDD)", rank: 3, evidence: "中", basis: "内部断裂症 [cite: 11]" }],
  "腰|後屈|放散痛あり|慢性": [{ diagnosis: "腰部脊柱管狭窄症(LSS)", rank: 1, evidence: "高", basis: "神経管の狭窄 [cite: 14]" }, { diagnosis: "腰椎椎間関節症", rank: 2, evidence: "中", basis: "関節への荷重ストレス [cite: 14]" }],
  "腰|後屈|局所のみ|慢性": [{ diagnosis: "腰椎椎間関節症", rank: 1, evidence: "中", basis: "反る動作での関節痛 [cite: 17]" }, { diagnosis: "腰椎分離症", rank: 2, evidence: "高", basis: "若年者の疲労骨折 [cite: 18]" }],
  "腰|前屈|放散痛あり|慢性": [{ diagnosis: "腰椎椎間板ヘルニア (慢性型)", rank: 1, evidence: "高", basis: "持続的な神経根症状 [cite: 21]" }, { diagnosis: "腰部脊柱管狭窄症(間欠跛行型)", rank: 2, evidence: "高", basis: "歩行時の下肢症状 [cite: 21]" }, { diagnosis: "梨状筋症候群", rank: 3, evidence: "中", basis: "筋肉による神経絞扼 [cite: 21]" }],
  "腰|前屈|局所のみ|外傷": [{ diagnosis: "急性腰椎捻挫・筋損傷", rank: 1, evidence: "高", basis: "過負荷による組織損傷 [cite: 24]" }, { diagnosis: "腰椎圧迫骨折", rank: 2, evidence: "高", basis: "椎体の損傷（特に高齢者） [cite: 24]" }],
  "腰|常に痛い|局所のみ|慢性": [{ diagnosis: "慢性非特異的腰痛(中枢感作型)", rank: 1, evidence: "高", basis: "痛みの感受性亢進 [cite: 27]" }],
  "肩|挙上|局所のみ|慢性": [{ diagnosis: "肩峰下インピンジメント症候群", rank: 1, evidence: "高", basis: "肩峰下での組織の挟み込み [cite: 30]" }, { diagnosis: "癒着性関節包炎(五十肩)", rank: 2, evidence: "高", basis: "関節包の拘縮 [cite: 30]" }, { diagnosis: "石灰沈着性腱板炎(慢性期)", rank: 3, evidence: "高", basis: "石灰の沈着 [cite: 32]" }],
  "肩|挙上|局所のみ|急性": [{ diagnosis: "石灰沈着性腱板炎(急性吸収期)", rank: 1, evidence: "高", basis: "石灰吸収に伴う激痛 [cite: 34]" }, { diagnosis: "腱板損傷(急性期)", rank: 2, evidence: "高", basis: "構造的断裂 [cite: 36]" }],
  "肩|挙上|放散痛あり|慢性": [{ diagnosis: "頸椎由来の肩・上肢痛", rank: 1, evidence: "高", basis: "頸部神経根症 [cite: 39]" }],
  "肩|挙上|放散痛あり|急性": [{ diagnosis: "腱板損傷 (FOOSH)", rank: 1, evidence: "高", basis: "転倒時の急性損傷 [cite: 42]" }],
  "膝|動作時|内側|慢性": [{ diagnosis: "変形性膝関節症(膝OA)", rank: 1, evidence: "高", basis: "内側軟骨の磨耗 [cite: 45]" }, { diagnosis: "内側半月板損傷(変性)", rank: 2, evidence: "高", basis: "クッションの損傷 [cite: 45]" }, { diagnosis: "内側側副靭帯損傷(慢性)", rank: 3, evidence: "高", basis: "靭帯の緩み [cite: 45]" }],
  "膝|動作時|内側|外傷": [{ diagnosis: "前十字靭帯損傷(ACL)", rank: 1, evidence: "高", basis: "接触・捻りによる損傷 [cite: 48]" }, { diagnosis: "内側側副靭帯損傷(急性)", rank: 2, evidence: "高", basis: "側方の安定性低下 [cite: 48]" }],
  "膝|動作時|外側|慢性": [{ diagnosis: "腸脛靭帯炎", rank: 1, evidence: "高", basis: "外側の摩擦炎症 [cite: 51]" }],
  "膝|動作時|全体|慢性": [{ diagnosis: "膝蓋大腿関節症(PFPS)", rank: 1, evidence: "高", basis: "膝前面の痛み [cite: 54]" }],
  "頸部(首)|回旋・側屈|放散痛あり|急性": [{ diagnosis: "頸椎症性神経根症 / ヘルニア", rank: 1, evidence: "高", basis: "神経の圧迫 [cite: 57]" }, { diagnosis: "胸郭出口症候群(TOS)", rank: 2, evidence: "中", basis: "神経・血管の絞扼 [cite: 58]" }],
  "頸部(首)|回旋・側屈|局所のみ|急性": [{ diagnosis: "急性頸部筋筋膜炎(寝違え)", rank: 1, evidence: "高", basis: "急性の筋損傷 [cite: 61]" }, { diagnosis: "頸椎捻挫(むち打ち)", rank: 2, evidence: "高", basis: "衝撃による組織損傷 [cite: 61]" }],
  "頸部(首)|回旋・側屈|局所のみ|慢性": [{ diagnosis: "慢性頸部筋筋膜性疼痛", rank: 1, evidence: "高", basis: "トリガーポイント [cite: 64]" }, { diagnosis: "頸椎症性神経根症(慢性)", rank: 2, evidence: "高", basis: "変形に伴う持続痛 [cite: 64]" }],
  "足首・足底|歩き始め|かかと|慢性": [{ diagnosis: "足底腱膜炎", rank: 1, evidence: "高", basis: "荷重時の腱膜痛 [cite: 67]" }, { diagnosis: "踵骨棘", rank: 2, evidence: "中", basis: "骨形成による圧迫 [cite: 67]" }, { diagnosis: "足根管症候群", rank: 3, evidence: "中", basis: "末梢神経障害 [cite: 67]" }],
  "足首・足底|歩行時(全体)|外側|外傷": [{ diagnosis: "足関節外側靭帯損傷", rank: 1, evidence: "高", basis: "靭帯の急性損傷 [cite: 70]" }],
  "足首・足底|歩行時(全体)|前足部|慢性": [{ diagnosis: "Morton神経腫", rank: 1, evidence: "高", basis: "神経の腫脹 [cite: 73]" }],
  "肘|把持・回旋|外側|慢性": [{ diagnosis: "外側上顆炎(テニス肘)", rank: 1, evidence: "高", basis: "腱の付着部炎 [cite: 78]" }, { diagnosis: "後骨間神経障害", rank: 2, evidence: "中", basis: "神経の絞扼 [cite: 79]" }],
  "肘|把持・回旋|内側|慢性": [{ diagnosis: "内側上顆炎(ゴルフ肘)", rank: 1, evidence: "高", basis: "屈筋群の損傷 [cite: 82]" }, { diagnosis: "肘部管症候群", rank: 2, evidence: "高", basis: "尺骨神経障害 [cite: 83]" }],
  "手首|動作時|掌側(手のひら側)|慢性": [{ diagnosis: "手根管症候群", rank: 1, evidence: "高", basis: "正中神経の圧迫 [cite: 86]" }, { diagnosis: "ドケルバン病", rank: 2, evidence: "高", basis: "第一区画の腱鞘炎 [cite: 87]" }],
  "手首|動作時|背側(手の甲側)|慢性": [{ diagnosis: "TFCC損傷", rank: 1, evidence: "高", basis: "軟骨複合体の損傷 [cite: 90]" }, { diagnosis: "手根骨骨折", rank: 2, evidence: "高", basis: "舟状骨等の骨折 [cite: 90]" }, { diagnosis: "手関節ガングリオン", rank: 3, evidence: "中", basis: "腱鞘嚢腫 [cite: 90]" }],
  "手首|動作時|全体|外傷": [{ diagnosis: "橈骨遠位端骨折", rank: 1, evidence: "高", basis: "転倒による典型的な骨折 [cite: 93]" }],
  "指|屈伸時|屈側(腱)|慢性": [{ diagnosis: "ばね指", rank: 1, evidence: "高", basis: "狭窄性腱鞘炎 [cite: 96]" }, { diagnosis: "屈筋腱炎", rank: 2, evidence: "中", basis: "腱の炎症 [cite: 97]" }],
  "指|屈伸時|側副靭帯・PIP/DIP|外傷": [{ diagnosis: "指関節側副靭帯損傷", rank: 1, evidence: "高", basis: "突き指 [cite: 100]" }, { diagnosis: "槌指", rank: 2, evidence: "高", basis: "伸筋腱の断裂 [cite: 101]" }],
  "指|屈伸時|腫脹・変形|慢性": [{ diagnosis: "変形性指関節症", rank: 1, evidence: "高", basis: "結節性変形 [cite: 104]" }, { diagnosis: "関節リウマチ", rank: 2, evidence: "高", basis: "多発性関節炎 [cite: 105]" }],
  "股関節|動作時|前面 鼠径部|慢性": [{ diagnosis: "股関節インピンジメント(FAI)", rank: 1, evidence: "高", basis: "骨同士の衝突 [cite: 108]" }, { diagnosis: "変形性股関節症", rank: 2, evidence: "高", basis: "軟骨の磨耗 [cite: 108]" }, { diagnosis: "腸腰筋炎", rank: 3, evidence: "中", basis: "弾発股等の炎症 [cite: 108]" }],
  "股関節|動作時|外側(大転子)|慢性": [{ diagnosis: "大転子疼痛症候群(GTPS)", rank: 1, evidence: "高", basis: "滑液包炎や筋腱付着部症 [cite: 110]" }]
};

const NAV = [
  { id: "area", question: "どこが痛いですか?", label: "部位", options: [{ label: "腰" }, { label: "肩" }, { label: "膝" }, { label: "頸部(首)" }, { label: "足首・足底" }, { label: "肘" }, { label: "手首" }, { label: "指" }, { label: "股関節" }] },
  { id: "motion", question: "どんな動作・タイミングで痛みますか?", label: "動作", options: [{ label: "前屈" }, { label: "後屈" }, { label: "挙上" }, { label: "動作時" }, { label: "回旋・側屈" }, { label: "歩き始め" }, { label: "歩行時(全体)" }, { label: "把持・回旋" }, { label: "屈伸時" }, { label: "常に痛い" }] },
  { id: "location", question: "痛みの場所・広がりを教えてください", label: "場所", options: [{ label: "局所のみ" }, { label: "放散痛あり" }, { label: "内側" }, { label: "外側" }, { label: "全体" }, { label: "かかと" }, { label: "前足部" }, { label: "掌側(手のひら側)" }, { label: "背側(手の甲側)" }, { label: "屈側(腱)" }, { label: "側副靭帯・PIP/DIP" }, { label: "腫脹・変形" }, { label: "前面 鼠径部" }, { label: "外側(大転子)" }] },
  { id: "onset", question: "いつから、どのように始まりましたか?", label: "発症", options: [{ label: "急性" }, { label: "慢性" }, { label: "外傷" }] }
];

export default function App() {
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState({});
  const [results, setResults] = useState(null);
  const [logs, setLogs] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const PIN = "0165";

  const saveLog = async (newSel) => {
    const entry = {
      area: newSel.area || "",
      combo: `${newSel.motion} | ${newSel.location}`,
      age: newSel.onset || "",
      at: new Date().toLocaleDateString("ja-JP"),
    };
    try { await supabase.from('clinic_logs').insert([entry]); } catch (e) { console.error(e); }
  };

  const fetchLogs = async () => {
    try {
      const { data } = await supabase.from('clinic_logs').select('*').order('created_at', { ascending: false });
      if (data) setLogs(data);
    } catch (e) { console.error(e); }
  };

  const choose = (label) => {
    const newSel = { ...sel, [NAV[step].id]: label };
    setSel(newSel);
    if (step + 1 >= NAV.length) {
      const key = `${newSel.area}|${newSel.motion}|${newSel.location}|${newSel.onset}`;
      setResults(DB[key] || DB[`${newSel.area}|${newSel.motion}|${newSel.location}|慢性`] || null);
      saveLog(newSel);
    } else { setStep(step + 1); }
  };

  const reset = () => { setStep(0); setSel({}); setResults(null); };

  const summary = NAV.slice(0, step).map(n => sel[n.id]).filter(Boolean).join(" > ");

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      <header className="bg-white border-b sticky top-0 z-20 px-4 py-3 flex justify-between items-center max-w-xl mx-auto w-full shadow-sm">
        <h1 className="text-sm font-black text-slate-800">臨床推論ナビ</h1>
        <button onClick={() => {setShowStats(true); setPinUnlocked(false); setPinInput("");}} className="text-xs bg-blue-50 text-blue-600 font-bold px-3 py-1.5 rounded-lg">管理者</button>
      </header>

      <main className="max-w-xl mx-auto px-4 py-6">
        {!results ? (
          <>
            <div className="flex gap-1 mb-6">
              {NAV.map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-blue-600" : "bg-slate-200"}`} />)}
            </div>
            {summary && <p className="text-[10px] text-slate-400 mb-2 uppercase">{summary}</p>}
            <h2 className="text-xl font-black text-slate-800 mb-6">{NAV[step].question}</h2>
            <div className="grid gap-3">
              {NAV[step].options.map((opt, i) => (
                <button key={i} onClick={() => choose(opt.label)} className="w-full text-left bg-white border border-slate-200 rounded-xl p-4 font-bold text-slate-700 shadow-sm active:bg-blue-50 transition-all">
                  {opt.label}
                </button>
              ))}
            </div>
            {step > 0 && <button onClick={() => setStep(step - 1)} className="w-full mt-6 text-sm text-slate-400 font-bold">戻る</button>}
          </>
        ) : (
          <div>
            <div className="bg-blue-600 rounded-2xl p-5 mb-6 text-white shadow-lg">
              <p className="text-blue-100 text-[10px] mb-1">診断結果</p>
              <p className="font-bold text-sm leading-relaxed">{summary}</p>
            </div>
            {results ? results.map((diag, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 shadow-sm">
                <div className="flex gap-2 mb-2 text-[10px] font-bold">
                  <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full">第{diag.rank}候補</span>
                  <span className="text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">信頼度: {diag.evidence}</span>
                </div>
                <p className="font-black text-slate-800 mb-2">{diag.diagnosis}</p>
                <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg leading-relaxed">{diag.basis}</p>
              </div>
            )) : <p className="text-center text-slate-400 py-10">該当データなし</p>}
            <button onClick={reset} className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black mt-4 shadow-lg active:scale-95 transition-all">最初からやり直す</button>
          </div>
        )}
      </main>

      {showStats && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6">
            {!pinUnlocked ? (
              <div className="text-center">
                <p className="font-black mb-4">パスコード</p>
                <input 
                  type="password" maxLength={4} value={pinInput} 
                  onChange={e => {setPinInput(e.target.value); if(e.target.value === PIN) { setPinUnlocked(true); fetchLogs(); }}}
                  className="w-32 text-center text-3xl font-mono border-b-2 outline-none mb-8"
                  autoFocus
                />
                <button onClick={() => setShowStats(false)} className="block w-full text-xs text-slate-400">閉じる</button>
              </div>
            ) : (
              <div className="max-h-[70vh] flex flex-col">
                <h2 className="font-black mb-4 border-b pb-2">検索履歴 ({logs.length}件)</h2>
                <div className="overflow-y-auto space-y-3">
                  {logs.map((l, i) => (
                    <div key={i} className="bg-slate-50 p-3 rounded-xl text-[10px] text-slate-600">
                      <div className="flex justify-between mb-1 text-slate-400"><span>{l.at}</span><span>{l.age}</span></div>
                      <p className="font-bold">{l.area}: {l.combo}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowStats(false)} className="mt-4 bg-slate-100 py-2 rounded-xl text-xs font-bold">閉じる</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
