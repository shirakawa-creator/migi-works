/* ======================================================
   MIGI WORKS — app.js
   全機能: ログイン/チーム共有/超過控除計算/メールテンプレート
====================================================== */

// ─── STATE ───────────────────────────────────────────
const STATE = {
  currentUser: null,
  currentView: 'dashboard',
};

// ─── MOCK DATA ───────────────────────────────────────
const USERS = [
  { id:1, email:'admin@migiworks.co.jp', password:'password', name:'原 辰徳', role:'管理者', initials:'HR', color:'#00c896' },
  { id:2, email:'sales@migiworks.co.jp', password:'password', name:'阿部 慎之助', role:'営業', initials:'AB', color:'#3b7dd8' },
  { id:3, email:'hr@migiworks.co.jp',    password:'password', name:'中田 翔', role:'人事', initials:'NT', color:'#f5a623' },
];

const ENGINEERS = [
  { id:1, name:'岡本 和真', role:'フロントエンド', skills:['React','TypeScript','Vue.js','Next.js'], status:'稼働中', project:'テックコア', initials:'OK', color:'#3b7dd8', rate:650000, hours:0 },
  { id:2, name:'坂本 勇人', role:'バックエンド', skills:['Java','Spring Boot','AWS','PostgreSQL'], status:'稼働中', project:'デジタルSL', initials:'AB', color:'#00c896', rate:1200000, hours:0 },
  { id:3, name:'丸 佳浩', role:'PM / PMO', skills:['PMO','Jira','Confluence','Agile'], status:'稼働中', project:'アルファベット', initials:'MM', color:'#f5a623', rate:920000, hours:0 },
  { id:4, name:'菅野 智之', role:'インフラ', skills:['AWS','Linux','Docker','Kubernetes'], status:'営業中', project:'—', initials:'KN', color:'#e85d4a', rate:600000, hours:0 },
  { id:5, name:'大城 卓三', role:'データエンジニア', skills:['Python','BigQuery','Spark','Airflow'], status:'稼働中', project:'BDL', initials:'OT', color:'#6c63ff', rate:2400000, hours:0 },
  { id:6, name:'吉川 尚輝', role:'フロントエンド', skills:['React','Next.js','GraphQL','Figma'], status:'営業中', project:'—', initials:'YN', color:'#00a67a', rate:700000, hours:0 },
  { id:7, name:'戸郷 翔征', role:'QA', skills:['テスト設計','Selenium','Postman','Jira'], status:'稼働中', project:'テックコア', initials:'TH', color:'#e91e8c', rate:500000, hours:0 },
];

const CONTRACTS = [
  { id:'C-2025-001', name:'財務システム開発・保守作業', clientUpper:'株式会社ニューアクセス', clientUpperDept:'稲垣', clientUpperJobType:'顧問', clientLower:'株式会社ユニオンコンサルタント', clientLowerDept:'大西', clientLowerJobType:'大西', engineer:'岡本 和真', role:'システムエンジニア', monthly:480000, clientLowerMonthly:30000, start:'2025-07-01', end:'2026-06-30', extendMonths:1, extendStatus:'未確認', minHours:140, maxHours:180, overRate:3000, underRate:3000, note:'交通費（プロパーの場合）: 14,420円 会議費: ¥7,500/回×2回\n時間帯割増について\n固=一般労働+2,000円\n固=一般労働+2,000円', selfNote:'', hasExpense:true },
  { id:'C-2025-002', name:'2024年度開発支援', clientUpper:'エンパワー株式会社', clientUpperDept:'稲垣', clientUpperJobType:'顧問', clientLower:'株式会社ミギナナメウエ', clientLowerDept:'', clientLowerJobType:'', engineer:'坂本 勇人', role:'エンジニア', monthly:500000, clientLowerMonthly:0, start:'2024-10-01', end:'2025-03-31', extendMonths:'1年6ヶ月', extendStatus:'未確認', minHours:140, maxHours:180, overRate:3125, underRate:3125, note:'中間割', selfNote:'', hasExpense:false },
  { id:'C-2025-003', name:'システムとネットワークの保守業務', clientUpper:'株式会社GYD', clientUpperDept:'細田', clientUpperJobType:'細田', clientLower:'株式会社ミギナナメウエ', clientLowerDept:'', clientLowerJobType:'', engineer:'丸 佳浩', role:'エンジニア', monthly:400000, clientLowerMonthly:0, start:'2025-10-01', end:'2026-03-31', extendMonths:'9ヶ月', extendStatus:'延長しない', minHours:140, maxHours:180, overRate:2500, underRate:2500, note:'交通費（プロパーの電車代）: 14,440円', selfNote:'', hasExpense:true },
  { id:'C-2025-004', name:'金融機関向け示支援および帳作業', clientUpper:'株式会社CCS', clientUpperDept:'総務部', clientUpperJobType:'総務部', clientLower:'株式会社リューマンシステムイースト', clientLowerDept:'遠藤', clientLowerJobType:'遠藤', engineer:'菅野 智之', role:'エンジニア', monthly:640000, clientLowerMonthly:600000, start:'2025-11-01', end:'2026-03-31', extendMonths:'8ヶ月', extendStatus:'未確認', minHours:140, maxHours:180, overRate:4000, underRate:4000, note:'', selfNote:'', hasExpense:false },
  { id:'C-2025-005', name:'SCRUMシステム開発支援および開発計支援', clientUpper:'アクティス・ジャパン株式会社', clientUpperDept:'稲垣', clientUpperJobType:'稲垣', clientLower:'株式会社ミギナナメウエ', clientLowerDept:'', clientLowerJobType:'', engineer:'大城 卓三', role:'エンジニア', monthly:640000, clientLowerMonthly:0, start:'2026-01-01', end:'2026-09-30', extendMonths:'9ヶ月', extendStatus:'延長する', minHours:140, maxHours:180, overRate:4000, underRate:4000, note:'交通費（プロパーの場合）: 18,150円（今季テレワーク有用）', selfNote:'', hasExpense:true },
  { id:'C-2025-006', name:'SCRUMシステムの開発支援作業', clientUpper:'株式会社シーマン', clientUpperDept:'稲垣', clientUpperJobType:'稲垣', clientLower:'株式会社ミギナナメウエ', clientLowerDept:'', clientLowerJobType:'', engineer:'吉川 尚輝', role:'エンジニア', monthly:580000, clientLowerMonthly:0, start:'2026-01-01', end:'2026-03-31', extendMonths:'3ヶ月', extendStatus:'未確認', minHours:140, maxHours:180, overRate:3625, underRate:3625, note:'', selfNote:'', hasExpense:false },
  { id:'C-2025-007', name:'Webアプリ開発支援', clientUpper:'フューチャーウェブ株式会社', clientUpperDept:'佐々木', clientUpperJobType:'佐々木', clientLower:'株式会社ミギナナメウエ', clientLowerDept:'', clientLowerJobType:'', engineer:'戸郷 翔征', role:'フロントエンド', monthly:700000, clientLowerMonthly:0, start:'2025-09-01', end:'2026-03-31', extendMonths:'7ヶ月', extendStatus:'未確認', minHours:140, maxHours:180, overRate:4375, underRate:4375, note:'', selfNote:'', hasExpense:false },
  { id:'C-2025-008', name:'クラウドインフラ保守運用', clientUpper:'クラウドネクスト株式会社', clientUpperDept:'中村', clientUpperJobType:'中村', clientLower:'株式会社ミギナナメウエ', clientLowerDept:'', clientLowerJobType:'', engineer:'菅野 智之', role:'インフラ', monthly:600000, clientLowerMonthly:0, start:'2025-04-01', end:'2026-03-31', extendMonths:'12ヶ月', extendStatus:'延長しない', minHours:140, maxHours:180, overRate:3750, underRate:3750, note:'', selfNote:'', hasExpense:false },
];

// 契約月ビュー用ステート
const CONTRACT_VIEW_STATE = {
  year: 2026,
  month: 3,
};

const INVOICES = [
  { id:'INV-2024-089', contractId:'C-2024-047', client:'株式会社テックコア', item:'SESエンジニア派遣費（2024年10月分）', amount:650000, tax:65000, total:715000, issued:'2024-10-01', due:'2024-10-31', status:'未入金' },
  { id:'INV-2024-088', contractId:'C-2024-043', client:'デジタルSL株式会社', item:'システム開発支援費（2024年10月分）', amount:1200000, tax:120000, total:1320000, issued:'2024-10-01', due:'2024-10-31', status:'入金済' },
  { id:'INV-2024-086', contractId:'C-2024-040', client:'アルファベット株式会社', item:'PMO支援費（2024年10月分）', amount:920000, tax:92000, total:1012000, issued:'2024-10-01', due:'2024-10-31', status:'入金済' },
  { id:'INV-2024-084', contractId:'C-2024-038', client:'クラウドネクスト株式会社', item:'インフラ保守費（2024年10月分）', amount:480000, tax:48000, total:528000, issued:'2024-10-01', due:'2024-10-31', status:'滞納' },
];

// 稼働データ（契約ごとに月次入力）
const ATTENDANCE_DATA = {};

const ATTENDANCE_VIEW_STATE = { year: 2026, month: 3 };

function getAttData(contractId, year, month) {
  const key = contractId + '_' + year + '-' + String(month).padStart(2,'0');
  if (!ATTENDANCE_DATA[key]) {
    ATTENDANCE_DATA[key] = { hours:'', minutes:'', expense:'', misc:'', confirmed:false, urlSent:false };
  }
  return ATTENDANCE_DATA[key];
}

function attStatus(d) {
  if (d.confirmed) return 'confirmed';
  if (d.hours !== '' || d.minutes !== '') return 'inputted';
  return 'uncollected';
}

// ─── CLIENTS MASTER ──────────────────────────────────
let CLIENTS = [
  { id:'CL-001', name:'株式会社テックコア', tel:'03-1234-5678', zip:'100-0001', address:'東京都千代田区丸の内1-1-1', salesPerson:'山田 太郎', salesEmail:'yamada@techcore.co.jp', invoiceEmail:'invoice@techcore.co.jp' },
  { id:'CL-002', name:'デジタルソリューションズ株式会社', tel:'03-2345-6789', zip:'105-0001', address:'東京都港区虎ノ門2-2-2', salesPerson:'佐藤 花子', salesEmail:'sato@digital-sol.co.jp', invoiceEmail:'billing@digital-sol.co.jp' },
  { id:'CL-003', name:'アルファベット株式会社', tel:'06-3456-7890', zip:'530-0001', address:'大阪府大阪市北区梅田3-3-3', salesPerson:'鈴木 次郎', salesEmail:'suzuki@alphabet.co.jp', invoiceEmail:'invoice@alphabet.co.jp' },
  { id:'CL-004', name:'クラウドネクスト株式会社', tel:'03-4567-8901', zip:'150-0001', address:'東京都渋谷区神宮前4-4-4', salesPerson:'高橋 三郎', salesEmail:'takahashi@cloudnext.co.jp', invoiceEmail:'billing@cloudnext.co.jp' },
  { id:'CL-005', name:'株式会社ミギナナメウエ', tel:'03-5678-9012', zip:'107-0001', address:'東京都港区赤坂1-1-1', salesPerson:'原 辰徳', salesEmail:'hara@migiworks.co.jp', invoiceEmail:'billing@migiworks.co.jp' },
];

// ─── MY COMPANY DATA ─────────────────────────────────
let MY_COMPANY = {
  name: '',
  registrationNo: '',
  tel: '',
  salesContact: '',
  fax: '',
  address: '',
  capital: '',
  foundedDate: '',
  pmark: false,
  isms: false,
  accountManager: '',
  bankAccount1: '',
  bankAccount2: '',
  settlementUnit: '月',
  closingDay: '末日',
  paymentSite: '30',
  ccMailList: '',
  bccMailList: '',
  hideOriginalLink: false,
  contractCloseInfo: '',
  personalSeal: '',
  companySeal: '',
  autoExtendMail: false,
  keepInvoiceOnDelete: false,
  approvalRequired: false,
  timesheetExtensions: '.xlsx,.xls,.pdf',
  twoFactorAuth: false,
  salesPersons: [], // 営業担当者リスト
};

// ─── EMAIL TEMPLATES ─────────────────────────────────
let EMAIL_TEMPLATES = [
  {
    id: 'remind-attendance',
    name: '勤怠回収リマインド',
    icon: '📅',
    iconBg: '#fff3e0',
    desc: '月末に未回収のエンジニアへ自動送付するリマインドメール',
    variables: ['{{engineer_name}}', '{{month}}', '{{deadline}}', '{{upload_url}}'],
    subject: '【MIGI WORKS】{{month}}分 勤怠表のご提出のお願い',
    body: `{{engineer_name}} 様

お疲れ様です。MIGI WORKS 管理チームです。

{{month}}分の勤怠表がまだ未提出となっております。
お手数ですが、{{deadline}}までに下記URLよりご提出ください。

▼ 勤怠表アップロードページ
{{upload_url}}

ご不明な点がございましたお気軽にご連絡ください。

--
MIGI WORKS 管理チーム
https://migiworks.co.jp`
  },
  {
    id: 'extend-confirm',
    name: '契約延長確認',
    icon: '📋',
    iconBg: '#e8f5e9',
    desc: '契約期限が近づいたエンジニアへ延長確認の一括連絡',
    variables: ['{{engineer_name}}', '{{client_name}}', '{{contract_end}}', '{{reply_url}}'],
    subject: '【MIGI WORKS】契約延長のご確認（{{client_name}}様案件）',
    body: `{{engineer_name}} 様

お疲れ様です。MIGI WORKS 担当の三木です。

現在ご参画中の {{client_name}} 様との契約が
{{contract_end}} に終了を迎えます。

つきましては、延長・終了のご意向を確認させてください。

▼ 延長確認フォーム
{{reply_url}}

ご回答期限：契約終了の2週間前
延長の場合は条件等についてご相談させてください。

どうぞよろしくお願いいたします。

--
原 辰徳
MIGI WORKS`
  },
  {
    id: 'invoice-send',
    name: '請求書送付',
    icon: '🧾',
    iconBg: '#fff0e6',
    desc: '請求書を取引先へメールで送付する際のテンプレート',
    variables: ['{{client_name}}', '{{invoice_no}}', '{{amount}}', '{{due_date}}', '{{bank_info}}'],
    subject: '【請求書】{{invoice_no}} / MIGI WORKS',
    body: `{{client_name}} 御中

お世話になっております。MIGI WORKS 三木でございます。

先月分のご請求書をお送りいたします。

■ 請求番号：{{invoice_no}}
■ ご請求金額：{{amount}}（税込）
■ お支払期限：{{due_date}}

■ お振込先
{{bank_info}}

添付のPDFをご確認のうえ、期日までにお振込みいただけますと幸いです。

何かご不明な点がございましたら、お気軽にご連絡ください。

--
原 辰徳
MIGI WORKS
TEL: 03-1234-5678
billing@migiworks.co.jp`
  },
  {
    id: 'quote-send',
    name: '見積書送付',
    icon: '📊',
    iconBg: '#e8f0fe',
    desc: '新規案件の見積書を取引先へ送付するテンプレート',
    variables: ['{{client_name}}', '{{quote_no}}', '{{valid_until}}', '{{total_amount}}'],
    subject: '【見積書】{{quote_no}} / MIGI WORKS',
    body: `{{client_name}} 御中

お世話になっております。MIGI WORKS 三木でございます。

先日ご相談いただいた件につきまして、見積書をお送りいたします。

■ 見積番号：{{quote_no}}
■ 見積金額：{{total_amount}}（税込）
■ 見積有効期限：{{valid_until}}

添付のPDFをご確認いただき、ご不明点やご要望がございましたら
お気軽にお申し付けください。

引き続きどうぞよろしくお願いいたします。

--
原 辰徳
MIGI WORKS
sales@migiworks.co.jp`
  },
  {
    id: 'welcome',
    name: '新メンバー招待',
    icon: '👋',
    iconBg: '#f3f0ff',
    desc: 'チームに新メンバーを招待する際に送るウェルカムメール',
    variables: ['{{member_name}}', '{{invite_url}}', '{{role}}', '{{invited_by}}'],
    subject: '【MIGI WORKS】チームへ招待されました',
    body: `{{member_name}} 様

{{invited_by}} よりMIGI WORKSチームへご招待いたします。

MIGI WORKSは、SES契約管理・勤怠回収・請求処理を
一元化するチーム向けツールです。

▼ 下記URLよりアカウントを作成してください
{{invite_url}}

権限：{{role}}

ご不明な点はお気軽にご連絡ください。

--
MIGI WORKS チーム
https://migiworks.co.jp`
  },
];

const TEAM_MEMBERS = [
  { id:1, name:'原 辰徳', email:'admin@migiworks.co.jp', role:'管理者', initials:'HR', color:'#00c896', lastLogin:'2024-10-15 09:32' },
  { id:2, name:'阿部 慎之助', email:'sales@migiworks.co.jp', role:'営業', initials:'AB', color:'#3b7dd8', lastLogin:'2024-10-15 08:45' },
  { id:3, name:'中田 翔', email:'hr@migiworks.co.jp', role:'人事', initials:'NT', color:'#f5a623', lastLogin:'2024-10-14 17:20' },
  { id:4, name:'松原 聖弥', email:'w.yukio@migiworks.co.jp', role:'営業', initials:'WY', color:'#6c63ff', lastLogin:'2024-10-13 14:10' },
];

const SALES_PIPELINE = {
  approach: [
    { company:'株式会社フォーカス', detail:'Javaエンジニア 1名 / ¥700,000', memo:'2024/10/10 初回メール送信済' },
    { company:'ネクストジェン株式会社', detail:'インフラ 2名 / ¥1,200,000', memo:'2024/10/12 担当者と通話済' },
    { company:'テクノロジーX', detail:'PM 1名 / ¥950,000', memo:'紹介案件、来週アプローチ予定' },
  ],
  proposal: [
    { company:'デジタルソリューションズ', detail:'追加 1名 / ¥800,000', memo:'山田の提案を送付済' },
    { company:'クラウドネクスト', detail:'移行支援 3名 / ¥3,200,000', memo:'見積書送付後、回答待ち' },
  ],
  negotiation: [
    { company:'アルファベット株式会社', detail:'継続 1名 / ¥920,000', memo:'単価交渉中（+50,000希望）' },
  ],
  won: [
    { company:'テックコア', detail:'追加 1名 / ¥650,000', memo:'✓ 成約' },
    { company:'ビッグデータラボ', detail:'新規 2名 / ¥1,450,000', memo:'✓ 成約' },
    { company:'フューチャーウェブ', detail:'継続 1名 / ¥850,000', memo:'✓ 成約' },
  ],
};

// ─── AUTH ─────────────────────────────────────────────
function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-password').value;
  const user  = USERS.find(u => u.email === email && u.password === pass);
  if (!user) {
    document.getElementById('login-error').classList.remove('hidden');
    return;
  }
  STATE.currentUser = user;
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('sb-username').textContent = user.name;
  document.getElementById('sb-userrole').textContent = user.role;
  document.getElementById('sb-avatar').textContent = user.initials;
  document.getElementById('sb-avatar').style.background = `linear-gradient(135deg, ${user.color}, ${shadeColor(user.color,-20)})`;
  showView('dashboard', document.querySelector('.nav-item[data-view="dashboard"]'));
}

function doLogout() {
  STATE.currentUser = null;
  document.getElementById('app').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('login-error').classList.add('hidden');
}

function fillDemo(email, pass, role) {
  document.getElementById('login-email').value = email;
  document.getElementById('login-password').value = pass;
}

// ─── NAVIGATION ──────────────────────────────────────
const VIEW_TITLES = {
  dashboard:'ダッシュボード', engineers:'エンジニア管理', attendance:'稼働管理一覧',
  contracts:'契約管理', billing:'超過控除計算', invoices:'請求書',
  documents:'見積書・注文書', sales:'営業管理', 'email-templates':'メールテンプレート',
  team:'チーム管理', clients:'取引先一覧', 'company-settings':'自社情報設定',
};
const CTA_LABELS = {
  dashboard:'＋ 新規契約', engineers:'＋ エンジニア登録', attendance:'',
  contracts:'＋ 新規契約', billing:'契約を選択して計算', invoices:'＋ 新規作成',
  documents:'＋ 新規作成', sales:'＋ 案件登録', 'email-templates':'＋ テンプレート追加',
  team:'＋ メンバー招待', clients:'＋ 取引先登録', 'company-settings':'保存する',
};

function showView(view, el) {
  STATE.currentView = view;
  document.getElementById('page-title').textContent = VIEW_TITLES[view] || view;
  const ctaBtn = document.getElementById('topbar-cta');
  const ctaLabel = CTA_LABELS[view];
  if (!ctaLabel) {
    ctaBtn.style.display = 'none';
  } else {
    ctaBtn.style.display = '';
    ctaBtn.textContent = ctaLabel;
  }
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  if (el) el.classList.add('active');
  const ca = document.getElementById('content-area');
  ca.innerHTML = '';
  const fn = VIEWS[view];
  if (fn) ca.innerHTML = fn();
  initViewBindings(view);
}

function topbarCTA() {
  const v = STATE.currentView;
  if (v === 'contracts' || v === 'dashboard') openContractModal();
  else if (v === 'attendance') { alert('未回収3名にリマインドメールを送信しました ✓'); }
  else if (v === 'email-templates') openTemplateEdit(null);
  else if (v === 'company-settings') saveCompanySettings();
  else if (v === 'billing') alert('左のメニューから「超過控除計算」を選び、契約を選んで計算してください');
  else alert(`「${VIEW_TITLES[v]}」の新規作成フォームを開きます`);
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
}

function initViewBindings(view) {
  if (view === 'billing') initBillingCalc();
}

// ─── VIEWS ───────────────────────────────────────────
const VIEWS = {

  // ── DASHBOARD ──────────────────────────────────────
  dashboard: () => {
    const today = new Date();
    const thisYear  = today.getFullYear();
    const thisMonth = today.getMonth() + 1; // 1-12

    // 「来月末が契約終了」= 今月中に確認が必要
    const nextYear  = thisMonth === 12 ? thisYear + 1 : thisYear;
    const nextMonth = thisMonth === 12 ? 1 : thisMonth + 1;
    const nextYM    = `${nextYear}-${String(nextMonth).padStart(2,'0')}`;

    // 確認が必要な契約：終了月が来月 かつ 未確認
    const needConfirm = CONTRACTS.filter(c => c.end.startsWith(nextYM) && c.extendStatus === '未確認');
    // 確認済み（延長する・延長しない含む）
    const alreadyDone = CONTRACTS.filter(c => c.end.startsWith(nextYM) && c.extendStatus !== '未確認');

    const deadlineLabel = `${thisMonth}月末締め切り（${nextMonth}月末終了契約）`;

    return `
<div class="stat-grid g-2">
  <div class="stat-card">
    <div class="stat-label">契約総数</div>
    <div class="stat-val">${CONTRACTS.length}</div>
    <div class="stat-sub trend-up">▲ 3件 今月追加</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">延長確認待ち</div>
    <div class="stat-val" style="color:var(--gold)">${needConfirm.length}</div>
    <div class="stat-sub trend-dn">${deadlineLabel}</div>
  </div>
</div>

<div class="card">
  <div class="card-header">
    <div class="card-title">⚠ 延長確認 — ${deadlineLabel}</div>
    <div class="card-actions">
      <button class="btn-outline btn-sm" onclick="alert('${needConfirm.length}名に延長確認メールを一括送信しました ✓')">一括メール送信</button>
    </div>
  </div>
  <div class="table-wrap">
    <table>
      <thead><tr><th>エンジニア</th><th>案件名</th><th>契約終了</th><th>確認状況</th><th>操作</th></tr></thead>
      <tbody>
        ${needConfirm.length === 0 && alreadyDone.length === 0
          ? `<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:20px">来月末（${nextMonth}月）に終了する契約はありません</td></tr>`
          : [
              ...needConfirm.map(c => `
              <tr>
                <td><strong>${c.engineer}</strong></td>
                <td>${c.name}</td>
                <td>${c.end}</td>
                <td><span class="badge b-amber">未確認</span></td>
                <td class="td-actions">
                  <button class="btn-outline btn-sm" onclick="openEmailSendFor('extend-confirm','${c.engineer}','${c.clientUpper}')">メール送信</button>
                  <button class="btn-outline btn-sm" onclick="openExtendModal('${c.id}')">延長する</button>
                </td>
              </tr>`),
              ...alreadyDone.map(c => `
              <tr>
                <td><strong>${c.engineer}</strong></td>
                <td>${c.name}</td>
                <td>${c.end}</td>
                <td>${c.extendStatus === '延長する'
                  ? '<span class="badge b-green">延長確認済</span>'
                  : '<span class="badge b-gray">延長しない</span>'}</td>
                <td><button class="btn-outline btn-sm" onclick="setExtendStatus('${c.id}','未確認')">未確認に戻す</button></td>
              </tr>`)
            ].join('')}
      </tbody>
    </table>
  </div>
</div>

<div class="card">
  <div class="card-header">
    <div class="card-title">最近の契約</div>
    <div class="card-actions">
      <button class="btn-outline btn-sm" onclick="showView('contracts',document.querySelector('[data-view=contracts]'))">すべて表示</button>
    </div>
  </div>
  <div class="table-wrap">
    <table>
      <thead><tr><th>契約名</th><th>案件元</th><th>エンジニア</th><th>月額</th><th>契約期間</th><th>帳票</th></tr></thead>
      <tbody>
        ${CONTRACTS.slice(0,5).map(c => `
        <tr>
          <td><strong>${c.name}</strong><br><span class="text-muted">${c.id}</span></td>
          <td>${c.clientUpper}</td><td>${c.engineer}</td>
          <td>¥${c.monthly.toLocaleString()}</td>
          <td style="font-size:11px">${c.start} 〜 ${c.end}</td>
          <td class="td-actions">
            <button class="btn-outline btn-sm" onclick="openDoc('請求書','${c.id}')">請求書</button>
            <button class="btn-outline btn-sm" onclick="openDoc('見積書','${c.id}')">見積書</button>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
</div>`;
  },

  // ── ENGINEERS ──────────────────────────────────────
  engineers: () => `
<div class="stat-grid g-3">
  <div class="stat-card"><div class="stat-label">エンジニア総数</div><div class="stat-val">23</div><div class="stat-sub">自社15名 / 協力8名</div></div>
  <div class="stat-card"><div class="stat-label">稼働中</div><div class="stat-val" style="color:var(--acc)">20</div><div class="stat-sub trend-up">稼働率 87%</div></div>
  <div class="stat-card"><div class="stat-label">アサイン可能</div><div class="stat-val" style="color:var(--blue)">3</div><div class="stat-sub">今月末 +5名</div></div>
</div>
<div class="eng-grid">
  ${ENGINEERS.map(e => `
  <div class="eng-card" onclick="alert('${e.name}の詳細ページを開きます')">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <div class="eng-av" style="background:${e.color}">${e.initials}</div>
      <div style="flex:1">
        <div style="font-size:12px;font-weight:700;color:var(--ink)">${e.name}</div>
        <div class="text-muted">${e.role}</div>
      </div>
      ${statusBadge(e.status)}
    </div>
    <div class="text-muted mb-8">現在: ${e.project}</div>
    <div>${e.skills.map(s=>`<span class="skill-tag">${s}</span>`).join('')}</div>
    <div style="margin-top:10px;display:flex;gap:6px">
      <button class="btn-outline btn-sm" onclick="event.stopPropagation();openBillingForEngineer(${e.id})">超過控除計算</button>
      <button class="btn-outline btn-sm" onclick="event.stopPropagation();alert('スキルシートを表示')">スキルシート</button>
    </div>
  </div>`).join('')}
</div>`,

  // ── ATTENDANCE ──────────────────────────────────────
  attendance: () => renderAttendanceView(),


  // ── CONTRACTS ──────────────────────────────────────
  contracts: () => renderContractsView(),

  // ── BILLING CALCULATOR ─────────────────────────────
  billing: () => `
<div class="card" style="max-width:700px">
  <div class="card-header"><div class="card-title">🧮 超過控除計算</div></div>
  <div class="card-body">
    <p class="text-muted mb-16">契約の精算幅に基づき、超過・控除金額を自動計算します。</p>
    <div class="form-row">
      <label>契約を選択</label>
      <select class="input" id="billing-contract-sel" onchange="calcBilling()">
        <option value="">— 契約を選択してください —</option>
        ${CONTRACTS.map(c=>`<option value="${c.id}">${c.id} / ${c.name}（${c.engineer}）</option>`).join('')}
      </select>
    </div>
    <div id="billing-contract-info" class="hidden">
      <div class="form-grid-3 mb-16" id="billing-info-grid"></div>
      <div class="divider"></div>
      <div class="form-grid">
        <div class="form-row">
          <label>実働時間（h）</label>
          <input type="number" class="input" id="billing-actual-hours" value="168" min="0" max="300" oninput="calcBilling()">
        </div>
        <div class="form-row">
          <label>立替経費（円）</label>
          <input type="number" class="input" id="billing-expense" value="12500" min="0" oninput="calcBilling()">
        </div>
      </div>
      <div class="form-row">
        <label>雑費（円）</label>
        <input type="number" class="input" id="billing-misc" value="0" min="0" oninput="calcBilling()">
      </div>
      <div id="billing-result-area"></div>
      <div class="modal-footer">
        <button class="btn-ghost" onclick="document.getElementById('billing-contract-sel').value='';document.getElementById('billing-contract-info').classList.add('hidden')">リセット</button>
        <button class="btn-outline" onclick="generateBillingInvoice()">この金額で請求書を作成</button>
      </div>
    </div>
  </div>
</div>`,

  // ── INVOICES ──────────────────────────────────────
  invoices: () => `
<div class="stat-grid g-3">
  <div class="stat-card"><div class="stat-label">今月発行</div><div class="stat-val">8</div><div class="stat-sub">¥5,280,000</div></div>
  <div class="stat-card"><div class="stat-label">未入金</div><div class="stat-val" style="color:var(--coral)">3</div><div class="stat-sub trend-dn">¥2,100,000</div></div>
  <div class="stat-card"><div class="stat-label">入金済み</div><div class="stat-val" style="color:var(--acc)">5</div><div class="stat-sub trend-up">¥3,180,000</div></div>
</div>
<div class="card">
  <div class="card-header">
    <div class="card-title">請求書一覧</div>
    <div class="card-actions">
      <button class="btn-primary btn-sm" onclick="openDoc('請求書','NEW')">＋ 新規作成</button>
      <button class="btn-outline btn-sm" onclick="alert('勤怠表・請求書を一括メール送付しました ✓')">一括送付</button>
    </div>
  </div>
  <div class="table-wrap">
    <table>
      <thead><tr><th>請求番号</th><th>取引先</th><th>金額</th><th>消費税</th><th>合計</th><th>発行日</th><th>支払期限</th><th>状態</th><th></th></tr></thead>
      <tbody>
        ${INVOICES.map(inv=>`
        <tr>
          <td style="font-weight:700">${inv.id}</td><td>${inv.client}</td>
          <td>¥${inv.amount.toLocaleString()}</td>
          <td>¥${inv.tax.toLocaleString()}</td>
          <td style="font-weight:700">¥${inv.total.toLocaleString()}</td>
          <td>${inv.issued}</td><td>${inv.due}</td>
          <td>${invStatusBadge(inv.status)}</td>
          <td class="td-actions">
            <button class="btn-outline btn-sm" onclick="openDoc('請求書','${inv.contractId}')">発行</button>
            ${inv.status==='未入金'||inv.status==='滞納'?`<button class="btn-outline btn-sm" onclick="openEmailSendFor('invoice-send','${inv.client}','')">送付</button>`:''}
          </td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
</div>`,

  // ── DOCUMENTS ──────────────────────────────────────
  documents: () => `
<div class="stat-grid g-2">
  <div class="stat-card"><div class="stat-label">見積書 今月</div><div class="stat-val">5</div><div class="stat-sub">受注率 60%</div></div>
  <div class="stat-card"><div class="stat-label">注文書 今月</div><div class="stat-val">12</div><div class="stat-sub trend-up">確定 12件</div></div>
</div>
<div class="card">
  <div class="card-header">
    <div class="card-title">見積書一覧</div>
    <div class="card-actions"><button class="btn-primary btn-sm" onclick="openDoc('見積書','NEW')">＋ 見積書作成</button></div>
  </div>
  <div class="table-wrap">
    <table>
      <thead><tr><th>見積番号</th><th>件名</th><th>取引先</th><th>金額（税込）</th><th>有効期限</th><th>状態</th><th></th></tr></thead>
      <tbody>
        <tr><td style="font-weight:700">QUO-2024-021</td><td>SESエンジニア追加提案</td><td>テックコア</td><td>¥1,930,500</td><td>2024-11-15</td><td><span class="badge b-amber">提案中</span></td><td class="td-actions"><button class="btn-outline btn-sm" onclick="openDoc('見積書','C-2024-047')">発行</button><button class="btn-outline btn-sm" onclick="openEmailSendFor('quote-send','テックコア','')">送付</button></td></tr>
        <tr><td style="font-weight:700">QUO-2024-019</td><td>クラウド移行支援</td><td>クラウドネクスト</td><td>¥3,520,000</td><td>2024-11-01</td><td><span class="badge b-blue">下書き</span></td><td class="td-actions"><button class="btn-outline btn-sm" onclick="openDoc('見積書','C-2024-038')">発行</button></td></tr>
        <tr><td style="font-weight:700">QUO-2024-017</td><td>PMO支援 継続提案</td><td>アルファベット</td><td>¥1,113,200</td><td>2024-10-20</td><td><span class="badge b-green">受注済</span></td><td class="td-actions"><button class="btn-outline btn-sm" onclick="openDoc('見積書','C-2024-040')">発行</button></td></tr>
      </tbody>
    </table>
  </div>
</div>
<div class="card">
  <div class="card-header">
    <div class="card-title">注文書一覧</div>
    <div class="card-actions"><button class="btn-primary btn-sm" onclick="openDoc('注文書','NEW')">＋ 注文書作成</button></div>
  </div>
  <div class="table-wrap">
    <table>
      <thead><tr><th>注文番号</th><th>件名</th><th>取引先</th><th>金額（税込）</th><th>発注日</th><th>状態</th><th></th></tr></thead>
      <tbody>
        <tr><td style="font-weight:700">ORD-2024-015</td><td>SESエンジニア派遣 10月分</td><td>テックコア</td><td>¥715,000</td><td>2024-09-25</td><td><span class="badge b-green">確定</span></td><td><button class="btn-outline btn-sm" onclick="openDoc('注文書','C-2024-047')">発行</button></td></tr>
        <tr><td style="font-weight:700">ORD-2024-014</td><td>システム開発支援 10月分</td><td>デジタルSL</td><td>¥1,320,000</td><td>2024-09-25</td><td><span class="badge b-green">確定</span></td><td><button class="btn-outline btn-sm" onclick="openDoc('注文書','C-2024-043')">発行</button></td></tr>
        <tr><td style="font-weight:700">ORD-2024-013</td><td>PMO支援 10月分</td><td>アルファベット</td><td>¥1,012,000</td><td>2024-09-25</td><td><span class="badge b-amber">承認待ち</span></td><td><button class="btn-outline btn-sm" onclick="openDoc('注文書','C-2024-040')">発行</button></td></tr>
      </tbody>
    </table>
  </div>
</div>`,

  // ── SALES ──────────────────────────────────────────
  sales: () => `
<div class="stat-grid g-4">
  <div class="stat-card"><div class="stat-label">商談中</div><div class="stat-val">7</div></div>
  <div class="stat-card"><div class="stat-label">提案中エンジニア</div><div class="stat-val">4</div></div>
  <div class="stat-card"><div class="stat-label">今月成約</div><div class="stat-val" style="color:var(--acc)">3</div><div class="stat-sub trend-up">¥2.1M</div></div>
  <div class="stat-card"><div class="stat-label">稼働率</div><div class="stat-val">87%</div><div class="progress-bar"><div class="progress-fill" style="width:87%"></div></div></div>
</div>
<div class="pipeline">
  ${[
    ['アプローチ','approach'],['提案中','proposal'],['交渉中','negotiation'],['今月成約','won']
  ].map(([label,key])=>`
  <div class="pipeline-col">
    <div class="pipeline-col-hd">${label} <span class="pipeline-count">${SALES_PIPELINE[key].length}</span></div>
    ${SALES_PIPELINE[key].map(p=>`
    <div class="pipe-card" onclick="alert('商談メモ: ${p.memo}')">
      <div class="pipe-co">${p.company}</div>
      <div class="pipe-detail">${p.detail}</div>
    </div>`).join('')}
  </div>`).join('')}
</div>
<div class="card">
  <div class="card-header">
    <div class="card-title">営業中エンジニア（WEB共有可能）</div>
    <div class="card-actions">
      <button class="btn-primary btn-sm" onclick="copyShareURL()">🔗 共有URLをコピー</button>
    </div>
  </div>
  <div class="table-wrap">
    <table>
      <thead><tr><th>氏名</th><th>職種</th><th>主要スキル</th><th>希望単価</th><th>稼働可能日</th><th>状況</th><th></th></tr></thead>
      <tbody>
        ${ENGINEERS.filter(e=>e.status==='営業中').map(e=>`
        <tr>
          <td><strong>${e.name}</strong></td><td>${e.role}</td>
          <td>${e.skills.slice(0,3).join(' / ')}</td>
          <td>¥${e.rate.toLocaleString()}〜</td>
          <td>2024-11-01</td>
          <td><span class="badge b-blue">営業中</span></td>
          <td class="td-actions">
            <button class="btn-outline btn-sm" onclick="alert('案件提案メール作成')">案件提案</button>
            <button class="btn-outline btn-sm" onclick="alert('スキルシート表示')">スキルシート</button>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
</div>`,

  // ── COMPANY SETTINGS ───────────────────────────────
  'company-settings': () => renderCompanySettings(),

  // ── CLIENTS ────────────────────────────────────────
  clients: () => renderClientsView(),

  // ── EMAIL TEMPLATES ────────────────────────────────
  'email-templates': () => `
<p class="text-muted mb-16">メールテンプレートを管理・編集できます。変数は <code style="background:var(--bg);padding:1px 5px;border-radius:3px;font-size:11px">{{変数名}}</code> 形式で挿入されます。</p>
<div class="template-list">
  ${EMAIL_TEMPLATES.map((t,i) => `
  <div class="template-card">
    <div class="template-icon" style="background:${t.iconBg}">${t.icon}</div>
    <div class="template-meta">
      <div class="template-name">${t.name}</div>
      <div class="template-desc">${t.desc}</div>
      <div class="template-vars">
        ${t.variables.map(v=>`<span class="var-tag">${v}</span>`).join('')}
      </div>
    </div>
    <div class="template-actions">
      <button class="btn-outline btn-sm" onclick="previewTemplate(${i})">プレビュー</button>
      <button class="btn-primary btn-sm" onclick="openTemplateEdit(${i})">編集</button>
    </div>
  </div>`).join('')}
</div>`,

  // ── TEAM ───────────────────────────────────────────
  team: () => `
<div class="stat-grid g-3">
  <div class="stat-card"><div class="stat-label">チームメンバー</div><div class="stat-val">${TEAM_MEMBERS.length}</div></div>
  <div class="stat-card"><div class="stat-label">管理者</div><div class="stat-val">1</div></div>
  <div class="stat-card"><div class="stat-label">今日のアクティブ</div><div class="stat-val" style="color:var(--acc)">3</div></div>
</div>
<div class="team-grid">
  ${TEAM_MEMBERS.map(m=>`
  <div class="team-card">
    <div class="team-av" style="background:${m.color}">${m.initials}</div>
    <div class="team-name">${m.name}</div>
    <div class="team-email">${m.email}</div>
    <span class="team-role-badge ${roleClass(m.role)}">${m.role}</span>
    <div class="text-muted" style="margin-top:10px;font-size:10px">最終ログイン: ${m.lastLogin}</div>
    ${m.id !== STATE.currentUser?.id
      ? `<div style="margin-top:10px;display:flex;gap:6px;justify-content:center">
          <button class="btn-outline btn-sm" onclick="alert('権限変更フォームを開きます')">権限変更</button>
          <button class="btn-ghost btn-sm" style="color:var(--coral)" onclick="confirmRemove('${m.name}')">削除</button>
        </div>`
      : `<div class="badge b-green" style="margin-top:10px">あなた</div>`}
  </div>`).join('')}
</div>
<div class="card">
  <div class="card-header">
    <div class="card-title">招待リンク</div>
    <div class="card-actions">
      <button class="btn-primary btn-sm" onclick="openModal('invite-modal')">＋ メンバーを招待</button>
    </div>
  </div>
  <div class="card-body">
    <p class="text-muted mb-16">以下のURLを共有することでチームメンバーを招待できます。</p>
    <div style="display:flex;gap:10px;align-items:center">
      <input class="input" value="https://app.migiworks.co.jp/invite/abc123xyz" readonly style="flex:1">
      <button class="btn-outline btn-sm" onclick="alert('URLをコピーしました ✓')">コピー</button>
      <button class="btn-ghost btn-sm" onclick="alert('新しいURLを生成しました')">再生成</button>
    </div>
  </div>
</div>`,
};

// ─── ATTENDANCE MONTHLY VIEW ─────────────────────────
function renderAttendanceView() {
  const { year, month } = ATTENDANCE_VIEW_STATE;
  const ymStr = year + '-' + String(month).padStart(2,'0');
  const lastDay = new Date(year, month, 0).getDate();
  const monthEnd = ymStr + '-' + lastDay;

  const active = CONTRACTS.filter(c => c.start <= monthEnd && c.end >= ymStr + '-01');
  const total = active.length;
  const unsentCount  = active.filter(c => !getAttData(c.id,year,month).urlSent).length;
  const uncollected  = active.filter(c => { const d=getAttData(c.id,year,month); return !d.confirmed && d.hours==='' && d.minutes===''; }).length;
  const uninputted   = active.filter(c => { const d=getAttData(c.id,year,month); return !d.confirmed && (d.hours===''||d.minutes===''); }).length;

  const prevYear  = month===1 ? year-1 : year;
  const prevMonth = month===1 ? 12 : month-1;
  const nextYear  = month===12 ? year+1 : year;
  const nextMonth = month===12 ? 1 : month+1;

  return `
<div class="att-toolbar">
  <div class="month-nav">
    <button class="month-nav-btn" onclick="changeAttMonth(${prevYear},${prevMonth})">&#8249;</button>
    <span class="month-nav-label">${year}年${month}月</span>
    <button class="month-nav-btn" onclick="changeAttMonth(${nextYear},${nextMonth})">&#8250;</button>
  </div>
  <div class="att-toolbar-btns">
    <button class="btn-outline btn-sm" onclick="alert('初期表示の年月を変更します')">
      📅 初期表示の年月を変更する
    </button>
    <button class="btn-outline btn-sm" onclick="alert('稼働表を一括ダウンロードしました ✓')">
      📥 稼働表一括ダウンロード
    </button>
  </div>
</div>

<div class="att-summary-bar">
  <div class="att-summary-left">
    <span>検索結果一覧（全 <strong>${total}</strong> 件）</span>
  </div>
  <div class="att-summary-stats" id="att-summary-stats">
    <span class="att-stat-item unsent">未送付：<strong>${unsentCount}</strong>件</span>
    <span class="att-stat-item uncollected">未回収：<strong>${uncollected}</strong>件</span>
    <span class="att-stat-item uninputted">未入力：<strong>${uninputted}</strong>件</span>
  </div>
  <div class="att-filter-row">
    <label class="att-filter-cb"><input type="checkbox" onchange="attFilter()"> 未送付の稼働のみ</label>
    <label class="att-filter-cb"><input type="checkbox" onchange="attFilter()"> 未回収の稼働表のみ</label>
    <label class="att-filter-cb"><input type="checkbox" onchange="attFilter()"> 未入力の稼働のみ</label>
    <label class="att-filter-cb"><input type="checkbox" onchange="attFilter()"> 担当の稼働のみ</label>
  </div>
</div>

<div class="att-cards" id="att-cards">
  ${active.map(c => renderAttCard(c, year, month)).join('')}
  ${active.length===0 ? '<div style="text-align:center;padding:60px;color:var(--muted)">この月の稼働データはありません</div>' : ''}
</div>`;
}

function renderAttCard(c, year, month) {
  const d = getAttData(c.id, year, month);
  const st = attStatus(d);
  const cardClass = st==='confirmed' ? 'att-card-confirmed' : st==='inputted' ? 'att-card-inputted' : '';

  const hoursStr = d.hours !== '' ? `${d.hours}時間${d.minutes||0}分` : '未入力';
  const closingDay = MY_COMPANY.closingDay || '末日';
  const billDate = `${year}年${String(month).padStart(2,'0')}月${closingDay}`;
  const overDays = 0;
  const contractType = '精算契約';
  const billUpper = c.monthly ? `${c.monthly.toLocaleString()}円` : '—';
  const nextM = month === 12 ? 1 : month + 1;
  const nextY = month === 12 ? year + 1 : year;
  const payDate = `${String(nextY).slice(2)}/${String(nextM).padStart(2,'0')}/01`;
  const billLower = c.clientLowerMonthly ? `${c.clientLowerMonthly.toLocaleString()}円` : '0円';
  const payDateLower = `${String(nextY).slice(2)}/${String(nextM).padStart(2,'0')}/08`;
  const isConfirmed = st === 'confirmed';
  const dis = isConfirmed ? 'disabled' : '';

  return `
<div class="att-entry-card2 ${cardClass}" id="att-card-${c.id}">
  <!-- 左：エンジニア情報 -->
  <div class="att2-left">
    <div class="att2-name">
      <button class="att-name-btn" onclick="openAttDetail('${c.id}',${year},${month})">${c.engineer}</button>
      <a class="att-link-icon" href="#" onclick="openUploadModal('${c.id}','${c.engineer}',${year},${month});return false" title="稼働表アップロード">
        <svg viewBox="0 0 14 14" width="12" height="12"><path d="M6 3H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V8M9 1h4m0 0v4m0-4L6 8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
      </a>
    </div>
    <div class="att2-job">${c.name}</div>
    <div class="att2-meta-row"><span class="att2-lbl">請求日</span><span>${billDate}</span></div>
    <div class="att2-meta-row"><span class="att2-lbl">書類番号</span><span style="color:var(--muted)">—</span></div>
    <div class="att2-meta-row"><span class="att2-lbl">稼働時間</span><span style="font-weight:600">${hoursStr}</span></div>
    <div class="att2-meta-row"><span class="att2-lbl">稼働日数</span><span>${overDays}日</span></div>
    <div class="att2-meta-row"><span class="att2-lbl">自社担当者</span>
      <span class="att-memo-icon" title="担当者メモ">
        <svg viewBox="0 0 14 14" width="11" height="11"><path d="M2 10V12h2l6-6-2-2-6 6zM11.7 3.3a1 1 0 0 0 0-1.4l-.6-.6a1 1 0 0 0-1.4 0L8.5 2.5l2 2 1.2-1.2z" fill="currentColor" opacity=".5"/></svg>
      </span>
    </div>
  </div>

  <!-- 中：提案先（上位）-->
  <div class="att2-party">
    <div class="att2-party-title">提案先（上位）</div>
    <div class="att2-party-row"><span class="att2-plbl">会社名</span><span class="att2-pval">${c.clientUpper}</span></div>
    <div class="att2-party-row"><span class="att2-plbl">担当者名</span><span class="att2-pval">${c.clientUpperDept||'—'}</span></div>
    <div class="att2-party-row"><span class="att2-plbl">契約形態</span><span class="att2-pval">${contractType}</span></div>
    <div class="att2-party-row"><span class="att2-plbl">請求金額</span><span class="att2-pval att2-amount">${billUpper}</span></div>
    <div class="att2-party-row"><span class="att2-plbl">支払期日</span><span class="att2-pval">${payDate}</span></div>
  </div>

  <!-- 中：所属先（下位）-->
  <div class="att2-party">
    <div class="att2-party-title">所属先（下位）</div>
    <div class="att2-party-row"><span class="att2-plbl">会社名</span><span class="att2-pval">${c.clientLower}</span></div>
    <div class="att2-party-row"><span class="att2-plbl">担当者名</span><span class="att2-pval">${c.clientLowerDept||'—'}</span></div>
    <div class="att2-party-row"><span class="att2-plbl">契約形態</span><span class="att2-pval">${contractType}</span></div>
    <div class="att2-party-row"><span class="att2-plbl">支払金額</span><span class="att2-pval ${c.clientLowerMonthly>0?'att2-amount':''}">${billLower}</span></div>
    <div class="att2-party-row"><span class="att2-plbl">支払期日</span><span class="att2-pval">${payDateLower}</span></div>
  </div>

  <!-- 稼働入力エリア -->
  <div class="att2-input">
    <div class="att2-input-title">稼働（所属先から回収）</div>
    <div class="att2-input-label">稼働時間</div>
    <div class="att2-time-row">
      <input type="number" class="att2-num" id="h-${c.id}" min="0" max="300" placeholder="0" value="${d.hours}" ${dis} oninput="onAttInput('${c.id}')">
      <span class="att2-unit">時間</span>
      <input type="number" class="att2-num" id="m-${c.id}" min="0" max="59" placeholder="0" value="${d.minutes}" ${dis} oninput="onAttInput('${c.id}')">
      <span class="att2-unit">分</span>
    </div>
    <div class="att2-money-row">
      <div class="att2-money-item">
        <div class="att2-input-label">立替経費（税込）</div>
        <div class="att2-money-inp-row">
          <input type="number" class="att2-num att2-num-wide" id="ex-${c.id}" min="0" placeholder="0" value="${d.expense}" ${dis} oninput="onAttInput('${c.id}')">
          <span class="att2-unit">円</span>
        </div>
      </div>
      <div class="att2-money-item">
        <div class="att2-input-label">雑費（税抜）</div>
        <div class="att2-money-inp-row">
          <input type="number" class="att2-num att2-num-wide" id="misc-${c.id}" min="0" placeholder="0" value="${d.misc}" ${dis} oninput="onAttInput('${c.id}')">
          <span class="att2-unit">円</span>
        </div>
      </div>
    </div>
    <div class="att2-footer">
      ${isConfirmed
        ? `<button class="att2-btn-reconfirm" onclick="unconfirmAtt('${c.id}')">再確定</button>
           <span style="font-size:10px;color:var(--acc);font-weight:600">✓ 確定済み</span>`
        : `<button class="att2-btn-confirm" onclick="confirmAtt('${c.id}')">確定</button>`}
    </div>
  </div>

  <!-- 右：アクションボタン -->
  <div class="att2-actions">
    <button class="att2-btn-detail" onclick="openAttDetail('${c.id}',${year},${month})">詳細表示</button>
    <div style="position:relative">
      <div class="att2-pdf-wrap">
        <button class="att2-btn-pdf" onclick="openAttPdfPreview('${c.id}',${year},${month})">PDFプレビュー</button>
        <button class="att2-btn-pdf-arrow" onclick="toggleAttMenu('${c.id}',event)">▾</button>
      </div>
      <div class="att2-dropdown hidden" id="att-menu-${c.id}">
        <button class="att2-dropdown-item" onclick="openAttPdfPreview('${c.id}',${year},${month});toggleAttMenu('${c.id}')">
          🖨 PDFプレビュー・ダウンロード
        </button>
        <button class="att2-dropdown-item" onclick="openAttInvoiceSend('${c.id}',${year},${month});toggleAttMenu('${c.id}')">
          📧 請求書をメールで送付
        </button>
        <button class="att2-dropdown-item" onclick="openDoc('請求書','${c.id}');toggleAttMenu('${c.id}')">
          📄 請求書を発行（担当者選択）
        </button>
      </div>
    </div>
  </div>
</div>`;
}

function onAttInput(contractId) {
  const { year, month } = ATTENDANCE_VIEW_STATE;
  const d = getAttData(contractId, year, month);
  d.hours   = document.getElementById('h-'+contractId)?.value || '';
  d.minutes = document.getElementById('m-'+contractId)?.value || '';
  d.expense = document.getElementById('ex-'+contractId)?.value || '';
  d.misc    = document.getElementById('misc-'+contractId)?.value || '';
}

function confirmAtt(contractId) {
  const { year, month } = ATTENDANCE_VIEW_STATE;
  onAttInput(contractId);
  const d = getAttData(contractId, year, month);
  if (d.hours==='' && d.minutes==='') {
    if (!confirm('稼働時間が未入力です。このまま確定しますか？')) return;
  }
  d.confirmed = true;
  refreshAttCard(contractId);
  refreshAttSummary();
}

function unconfirmAtt(contractId) {
  const { year, month } = ATTENDANCE_VIEW_STATE;
  getAttData(contractId, year, month).confirmed = false;
  refreshAttCard(contractId);
  refreshAttSummary();
}

function refreshAttCard(contractId) {
  const { year, month } = ATTENDANCE_VIEW_STATE;
  const c = CONTRACTS.find(x => x.id === contractId);
  if (!c) return;
  const el = document.getElementById('att-card-' + contractId);
  if (!el) return;
  const tmp = document.createElement('div');
  tmp.innerHTML = renderAttCard(c, year, month);
  el.replaceWith(tmp.firstElementChild);
}

function refreshAttSummary() {
  const { year, month } = ATTENDANCE_VIEW_STATE;
  const ymStr = year + '-' + String(month).padStart(2,'0');
  const lastDay = new Date(year, month, 0).getDate();
  const monthEnd = ymStr + '-' + lastDay;
  const active = CONTRACTS.filter(c => c.start <= monthEnd && c.end >= ymStr + '-01');
  const unsentCount = active.filter(c => !getAttData(c.id,year,month).urlSent).length;
  const uncollected = active.filter(c => { const d=getAttData(c.id,year,month); return !d.confirmed && d.hours==='' && d.minutes===''; }).length;
  const uninputted  = active.filter(c => { const d=getAttData(c.id,year,month); return !d.confirmed && (d.hours===''||d.minutes===''); }).length;
  const bar = document.getElementById('att-summary-stats');
  if (bar) bar.innerHTML = `
    <span class="att-stat-item unsent">未送付：<strong>${unsentCount}</strong>件</span>
    <span class="att-stat-item uncollected">未回収：<strong>${uncollected}</strong>件</span>
    <span class="att-stat-item uninputted">未入力：<strong>${uninputted}</strong>件</span>`;
}

function changeAttMonth(year, month) {
  ATTENDANCE_VIEW_STATE.year = year;
  ATTENDANCE_VIEW_STATE.month = month;
  document.getElementById('content-area').innerHTML = renderAttendanceView();
}

function attFilter() { /* フィルター機能プレースホルダー */ }

function toggleAttMenu(contractId, event) {
  if (event) event.stopPropagation();
  document.querySelectorAll('.att2-dropdown').forEach(el => {
    if (el.id !== 'att-menu-'+contractId) el.classList.add('hidden');
  });
  document.getElementById('att-menu-'+contractId)?.classList.toggle('hidden');
}
// Close menu when clicking outside
document.addEventListener('click', e => {
  if (!e.target.closest('.att2-pdf-wrap') && !e.target.closest('.att2-dropdown')) {
    document.querySelectorAll('.att2-dropdown').forEach(el => el.classList.add('hidden'));
  }
});

function openAttInvoiceSend(contractId, year, month) {
  const c = CONTRACTS.find(x => x.id === contractId);
  if (!c) return;
  const d = getAttData(contractId, year, month);

  // Read latest input values from DOM
  const hEl = document.getElementById('h-'+contractId);
  const mEl = document.getElementById('m-'+contractId);
  if (hEl) d.hours   = hEl.value;
  if (mEl) d.minutes = mEl.value;

  const hoursStr = d.hours ? `${d.hours}時間${d.minutes||0}分` : '未入力';
  const amount   = c.monthly;
  const tax      = Math.round(amount * 0.1);
  const total    = amount + tax;
  const nextM    = month===12?1:month+1;
  const nextY    = month===12?year+1:year;
  const dueDate  = `${nextY}年${String(nextM).padStart(2,'0')}月1日`;

  // Get client email from clients list
  const clientData = CLIENTS.find(cl => cl.name === c.clientUpper);
  const toEmail    = clientData?.invoiceEmail || clientData?.salesEmail || '';

  // Fill email modal
  const tpl = EMAIL_TEMPLATES.find(t => t.id === 'invoice-send') || EMAIL_TEMPLATES[2];
  const subject = `【ご請求書送付】${c.name} ${year}年${month}月分`;
  const body =
`${c.clientUpper} ご担当者様

お世話になっております。
${MY_COMPANY.name || 'MIGI WORKS'} でございます。

${year}年${month}月分のご請求書をお送りいたします。

━━━━━━━━━━━━━━━━━━━━
■ 作業内容：${c.name}
■ 技術者名：${c.engineer}
■ 稼働時間：${hoursStr}
■ ご請求金額：¥${total.toLocaleString()}（税込）
■ お支払期限：${dueDate}
━━━━━━━━━━━━━━━━━━━━

ご確認のほど、よろしくお願いいたします。

${MY_COMPANY.name || 'MIGI WORKS'}
${MY_COMPANY.salesContact || ''}`;

  document.getElementById('email-modal-body').innerHTML = `
    <div class="form-group">
      <label>送付先メールアドレス</label>
      <input class="input" id="inv-send-to" value="${escHtml(toEmail)}" placeholder="送付先のメールアドレス">
    </div>
    <div class="form-group">
      <label>CC</label>
      <input class="input" id="inv-send-cc" value="${escHtml(MY_COMPANY.ccMailList||'')}" placeholder="CC（任意）">
    </div>
    <div class="form-group">
      <label>件名</label>
      <input class="input" id="inv-send-subject" value="${escHtml(subject)}">
    </div>
    <div class="form-group">
      <label>本文</label>
      <textarea class="input" id="inv-send-body" rows="10" style="font-size:12px">${escHtml(body)}</textarea>
    </div>
    <div class="form-group" style="background:var(--bg);border-radius:8px;padding:10px">
      <div style="font-size:11px;font-weight:700;color:var(--muted);margin-bottom:4px">📎 添付ファイル</div>
      <div style="font-size:12px;color:var(--ink)">請求書 ${year}年${month}月分.pdf</div>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end;padding-top:14px;border-top:1px solid var(--border);margin-top:4px">
      <button class="btn-ghost" onclick="closeModal('email-modal')">キャンセル</button>
      <button class="btn-outline" onclick="openAttPdfPreview('${contractId}',${year},${month})">📄 PDFを確認</button>
      <button class="btn-primary" onclick="sendAttInvoice('${contractId}')">📧 送付する</button>
    </div>`;

  document.querySelector('#email-modal .modal-header h3').textContent = '請求書メール送付';
  openModal('email-modal');
}

function sendAttInvoice(contractId) {
  const to      = document.getElementById('inv-send-to')?.value || '';
  const subject = document.getElementById('inv-send-subject')?.value || '';
  if (!to) { alert('送付先メールアドレスを入力してください'); return; }

  // Mark as sent in att data
  const { year, month } = ATTENDANCE_VIEW_STATE;
  const d = getAttData(contractId, year, month);
  d.invoiceSent = true;
  d.invoiceSentAt = new Date().toLocaleString('ja-JP');

  closeModal('email-modal');
  refreshAttCard(contractId);

  // Toast
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:var(--navy);color:#fff;padding:14px 22px;border-radius:10px;font-size:13px;font-weight:600;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.2);animation:modalIn .2s ease';
  toast.textContent = `✓ ${to} に請求書メールを送付しました`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ─── ATT DETAIL MODAL ────────────────────────────────
function openAttDetail(contractId, year, month) {
  const c = CONTRACTS.find(x => x.id === contractId);
  if (!c) return;
  const d = getAttData(contractId, year, month);
  const hoursStr = d.hours !== '' ? `${d.hours}時間${d.minutes||0}分` : '未入力';
  const overH = 0, underH = 0;
  const expense = d.expense || 0;
  const misc = d.misc || 0;
  const nextM = month===12?1:month+1, nextY = month===12?year+1:year;
  const payDate = `${nextY}年${String(nextM).padStart(2,'0')}月01日`;
  const payDateLower = `${nextY}年${String(nextM).padStart(2,'0')}月08日`;

  if (!document.getElementById('att-detail-modal')) {
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="modal-overlay hidden" id="att-detail-modal" onclick="if(event.target===this)closeModal('att-detail-modal')">
        <div class="modal-card" style="width:720px;max-height:88vh;overflow-y:auto">
          <div class="modal-header">
            <h3 id="att-detail-title">請求概要</h3>
            <div style="margin-left:auto;display:flex;gap:8px">
              <button class="btn-primary btn-sm" id="att-detail-edit-btn">✏ 編集</button>
              <button class="modal-close" onclick="closeModal('att-detail-modal')">✕</button>
            </div>
          </div>
          <div class="modal-body" id="att-detail-body"></div>
        </div>
      </div>`;
    document.body.appendChild(div.firstElementChild);
  }

  document.getElementById('att-detail-title').textContent = `${c.engineer} — ${year}年${month}月 請求概要`;
  document.getElementById('att-detail-edit-btn').onclick = () => openUploadModal(contractId, c.engineer, year, month);

  document.getElementById('att-detail-body').innerHTML = `
    <div style="font-size:10px;color:var(--muted);text-align:right;margin-bottom:12px">
      ${year}年${String(month).padStart(2,'0')}月 登録済み
    </div>

    <div class="detail-section-title">請求概要（共通）</div>
    <div class="detail-grid-2">
      <div class="detail-table">
        ${detailRow('作業者', c.engineer)}
        ${detailRow('作業内容', c.name)}
        ${detailRow('自社の事務担当者', MY_COMPANY.accountManager||'—')}
        ${detailRow('自社の営業担当者（提案先）', (MY_COMPANY.salesPersons||[])[0]||'—')}
        ${detailRow('自社の営業担当者（所属先）', (MY_COMPANY.salesPersons||[])[0]||'—')}
        ${detailRow('書類発行日', `${year}年${String(month).padStart(2,'0')}月${MY_COMPANY.closingDay||'末日'}`)}
        ${detailRow('請求日', `${year}年${String(month).padStart(2,'0')}月${MY_COMPANY.closingDay||'末日'}`)}
        ${detailRow('書類番号', '未設定')}
      </div>
      <div class="detail-table">
        ${detailRow('作業時間', hoursStr)}
        ${detailRow('立替経費（交通費等）', `${Number(expense).toLocaleString()}円`)}
        ${detailRow('雑費', `${Number(misc).toLocaleString()}円`)}
        ${detailRow('稼働日数', '0日')}
        ${detailRow('超過時間合計', `${overH}時間 0分`)}
        ${detailRow('控除時間合計', `${underH}時間 0分`)}
      </div>
    </div>

    <div class="detail-grid-2" style="margin-top:18px">
      <div>
        <div class="detail-section-title">提案先（上位）への請求と企業情報</div>
        <div class="detail-table">
          ${detailRow('会社名', c.clientUpper)}
          ${detailRow('担当者名', c.clientUpperDept||'—')}
          ${detailRow('電話番号', '未設定')}
          ${detailRow('FAX', '未設定')}
          ${detailRow('郵便番号', '—')}
          ${detailRow('本社所在地', '—')}
          ${detailRow('請求金額', `${c.monthly.toLocaleString()}円`)}
          ${detailRow('支払期限', payDate)}
          ${detailRow('入金の有無', '未入金')}
          ${detailRow('備考', '未設定')}
        </div>
      </div>
      <div>
        <div class="detail-section-title">所属先（下位）からの請求と企業情報</div>
        <div class="detail-table">
          ${detailRow('会社名', c.clientLower)}
          ${detailRow('担当者名', c.clientLowerDept||'—')}
          ${detailRow('電話番号', '未設定')}
          ${detailRow('FAX', '未設定')}
          ${detailRow('郵便番号', '—')}
          ${detailRow('本社所在地', '—')}
          ${detailRow('請求金額', `${c.clientLowerMonthly.toLocaleString()}円`)}
          ${detailRow('支払期限', payDateLower)}
          ${detailRow('支払いの有無', '未払い')}
          ${detailRow('備考', '未設定')}
        </div>
      </div>
    </div>

    <div class="detail-grid-2" style="margin-top:18px">
      <div>
        <div class="detail-section-title">提案先（上位）向け書類の発行</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
          <button class="btn-outline btn-sm" onclick="closeModal('att-detail-modal');openDoc('請求書','${c.id}')">請求書</button>
          <button class="btn-outline btn-sm" onclick="closeModal('att-detail-modal');openDoc('見積書','${c.id}')">見積書</button>
          <button class="btn-outline btn-sm" onclick="closeModal('att-detail-modal');openDoc('注文書','${c.id}')">注文書</button>
        </div>
      </div>
      <div>
        <div class="detail-section-title">所属先（下位）向け書類の発行</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
          <button class="btn-outline btn-sm" onclick="closeModal('att-detail-modal');openDoc('請求書','${c.id}')">請求書</button>
          <button class="btn-outline btn-sm" onclick="closeModal('att-detail-modal');openDoc('注文書','${c.id}')">注文書</button>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn-ghost" onclick="closeModal('att-detail-modal')">閉じる</button>
      <button class="btn-primary" onclick="openUploadModal('${c.id}','${c.engineer}',${year},${month});closeModal('att-detail-modal')">稼働表・ファイル管理</button>
    </div>`;

  openModal('att-detail-modal');
}

function detailRow(label, value) {
  return `<div class="detail-row"><span class="detail-lbl">${label}</span><span class="detail-val">${value||'—'}</span></div>`;
}

function openAttPdfPreview(contractId, year, month) {
  const c = CONTRACTS.find(x => x.id === contractId);
  if (!c) return;
  // Set up _docState and open invoice doc in print window directly
  const amount = c.monthly;
  const tax = Math.round(amount * 0.1);
  const total = amount + tax;
  window._docState = {
    type: '請求書', color: '#0d1b35',
    num: `INV-${year}-${String(Math.floor(Math.random()*900+100)).padStart(3,'0')}`,
    defaultClient: c.clientUpper,
    item: `${c.name}費（${year}年${month}月分）`,
    amount, tax, total, note: '', contract: c, contractId
  };
  // Build HTML directly without picker UI
  const d = getAttData(contractId, year, month);
  const co = MY_COMPANY;
  const compName = co.name || 'MIGI WORKS';
  const compAddr = co.address || '〒150-0011 東京都渋谷区東1丁目22番11号 THE FIRST SHIBUYA3F';
  const compBank = co.bankAccount1 || '三菱UFJ銀行(0005) 池袋支店(359) 普通 0683436\n三井住友銀行(0009) 渋谷駅前支店(234) 普通 5679825　カ)ミギナナメウエ';
  const regNo = co.registrationNo || 'T1234567890123';
  const today = new Date();
  const issueDate = `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日`;
  const nextM = month===12?1:month+1, nextY = month===12?year+1:year;
  const dueDate = `${nextY}年${String(nextM).padStart(2,'0')}月1日`;
  const workMonth = `${c.name}（${year}年${month}月分:${c.start.slice(5,7)}/01〜${c.end.slice(5,7)}/${new Date(year,month,0).getDate()}）`;
  // 最新の入力値をDOMから直接読み取る（入力後にoninputが走っていない場合に備えて）
  const hEl = document.getElementById('h-' + contractId);
  const mEl = document.getElementById('m-' + contractId);
  const exEl = document.getElementById('ex-' + contractId);
  const miscEl = document.getElementById('misc-' + contractId);
  if (hEl)    d.hours   = hEl.value;
  if (mEl)    d.minutes = mEl.value;
  if (exEl)   d.expense = exEl.value;
  if (miscEl) d.misc    = miscEl.value;

  const hoursH = Number(d.hours) || c.minHours;
  const hoursM = Number(d.minutes) || 0;
  const expense = Number(d.expense)||0;
  const misc = Number(d.misc)||0;
  const taxAmt = Math.round((amount+misc)*0.1);
  const grandTotal = amount + misc + expense + taxAmt;
  const workHoursStr = `${hoursH} 時間 ${String(hoursM).padStart(2,'0')} 分`;

  const content = buildInvoiceDoc(
    window._docState.num, issueDate, dueDate, regNo,
    c.clientUpper, compName, compAddr, compBank,
    c.engineer, workMonth, amount, 0, c.overRate, 0, c.underRate,
    amount, expense, misc, taxAmt, grandTotal,
    `${c.start} 〜 ${c.end}`, c, workHoursStr
  );

  const win = window.open('', '_blank');
  if (!win) { alert('ポップアップがブロックされています。解除してください。'); return; }
  win.document.write(`<!DOCTYPE html>
<html lang="ja"><head><meta charset="UTF-8"><title>PDFプレビュー</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Noto Sans JP',sans-serif;background:#888;display:flex;flex-direction:column;align-items:center;min-height:100vh;padding:20px}
.topbar{width:780px;max-width:96vw;display:flex;justify-content:space-between;align-items:center;padding:10px 0;margin-bottom:16px}
.topbar-logo{font-weight:700;font-size:16px;color:#fff}
.btn-dl{background:#00c896;color:#fff;border:none;padding:10px 24px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit}
.btn-dl:hover{background:#00a67a}
.paper{background:#fff;width:780px;max-width:96vw;padding:24mm 18mm;box-shadow:0 4px 32px rgba(0,0,0,.3);border-radius:4px}
@media print{body{background:#fff;padding:0}
.topbar{display:none}
.paper{box-shadow:none;width:100%;padding:12mm 10mm;border-radius:0}
@page{margin:0;size:A4}}
</style></head>
<body>
<div class="topbar">
  <div class="topbar-logo">MIGI WORKS</div>
  <button class="btn-dl" onclick="window.print()">このPDFをダウンロード</button>
</div>
<div class="paper">${content}</div>
</body></html>`);
  win.document.close();
}

function openDocFromAtt(contractId, type, year, month) {
  const c = CONTRACTS.find(x => x.id === contractId);
  if (c) openDoc(type, contractId);
}

// ─── UPLOAD MODAL ────────────────────────────────────
function openUploadModal(contractId, engineerName, year, month) {
  // Inject modal if not present
  if (!document.getElementById('upload-modal')) {
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="modal-overlay hidden" id="upload-modal" onclick="if(event.target===this)closeModal('upload-modal')">
        <div class="upload-modal-card">
          <div class="upload-modal-header">
            <div class="upload-modal-title">稼働表アップロード</div>
            <button class="modal-close" onclick="closeModal('upload-modal')">✕</button>
          </div>
          <div class="upload-modal-scroll" id="upload-modal-body"></div>
          <div class="upload-footer" id="upload-modal-footer">
            <button class="upload-submit-btn" id="upload-submit-btn">稼働表をアップロードする</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(div.firstElementChild);
  }

  const d = getAttData(contractId, year, month);
  const files = d.uploadedFiles || [];
  const ymLabel = `${year}年${month}月分`;

  document.getElementById('upload-modal-body').innerHTML = buildUploadForm(contractId, engineerName, ymLabel, files);
  // Wire submit button (lives outside scrollable area)
  const btn = document.getElementById('upload-submit-btn');
  if (btn) btn.onclick = () => saveUpload(contractId);
  openModal('upload-modal');

  // Setup drag & drop zones
  ['timesheet','expense-client','expense-self','other'].forEach(type => {
    setupDropZone(`drop-${type}`, `file-${type}`, contractId, type);
  });
}

function buildUploadForm(contractId, engineerName, ymLabel, files) {
  const sections = [
    { type:'timesheet',      label:'稼働表', required:true,  hint:'' },
    { type:'expense-client', label:'交通費等の立替経費（お客様への請求用）', required:false, hint:'' },
    { type:'expense-self',   label:'交通費等の立替経費（自社への請求用）', required:false, hint:'' },
    { type:'other',          label:'その他', required:false, hint:'' },
  ];

  return `
<div class="upload-engineer-row">
  <span class="upload-field-lbl">氏名</span>
  <span class="upload-engineer-name">${engineerName}</span>
</div>

<div class="upload-month-title">${ymLabel}</div>

<div class="upload-notice">
  ※zipファイルにまとめると<br>ファイルを複数アップロードできます。
  <div class="upload-notice-warn">※請求書の添付はお控えください。<br>請求書アップロード専用のURLがございます。</div>
</div>

<div class="upload-sections">
  ${sections.map(s => {
    const existing = files.filter(f => f.type === s.type);
    return `
    <div class="upload-section">
      <div class="upload-section-label">
        ■${s.label}
        ${s.required ? '<span class="upload-required">必須</span>' : ''}
      </div>
      <div class="upload-dropzone ${existing.length?'has-file':''}" id="drop-${s.type}"
           onclick="document.getElementById('file-${s.type}').click()"
           ondragover="event.preventDefault();this.classList.add('drag-over')"
           ondragleave="this.classList.remove('drag-over')"
           ondrop="handleFileDrop(event,'${contractId}','${s.type}')">
        <input type="file" id="file-${s.type}" style="display:none" multiple
               accept=".xlsx,.xls,.pdf,.zip,.png,.jpg,.jpeg"
               onchange="handleFileSelect(this,'${contractId}','${s.type}')">
        ${existing.length > 0
          ? existing.map(f => `
              <div class="upload-file-item" id="ufi-${f.id}">
                <div class="upload-file-icon">${fileIcon(f.name)}</div>
                <div class="upload-file-info">
                  <div class="upload-file-name">${f.name}</div>
                  <div class="upload-file-size">${f.size}</div>
                </div>
                <button class="upload-file-remove" onclick="event.stopPropagation();removeUploadedFile('${contractId}','${f.id}')" title="削除">×</button>
              </div>`).join('')
          : `<div class="upload-dropzone-inner">
               <svg viewBox="0 0 20 20" width="24" height="24" style="color:var(--muted)"><path d="M10 3v10M6 7l4-4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><rect x="2" y="14" width="16" height="4" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
               <span class="upload-dropzone-label">ファイルを選択</span>
               <span class="upload-dropzone-sub">またはここにドロップ</span>
             </div>`}
      </div>
    </div>`;
  }).join('')}
</div>

<div class="form-row" style="margin-top:16px;padding-bottom:8px">
  <label style="font-size:12px;color:var(--ink2);font-weight:600">特記事項（相談したいことなど）</label>
  <textarea class="input" id="upload-note" rows="4"
    placeholder="ここに文章を入力"
    style="font-size:13px;margin-top:5px">${files[0]?.note || ''}</textarea>
</div>`;
}

function fileIcon(name) {
  const ext = name.split('.').pop().toLowerCase();
  if (['xlsx','xls'].includes(ext)) return '<svg viewBox="0 0 14 16" width="18" height="20"><rect x="1" y="1" width="12" height="14" rx="1.5" fill="#1d6f42" stroke="#1d6f42"/><text x="7" y="11" text-anchor="middle" fill="white" font-size="5" font-weight="700">XLS</text></svg>';
  if (ext === 'pdf') return '<svg viewBox="0 0 14 16" width="18" height="20"><rect x="1" y="1" width="12" height="14" rx="1.5" fill="#e53935" stroke="#e53935"/><text x="7" y="11" text-anchor="middle" fill="white" font-size="5" font-weight="700">PDF</text></svg>';
  if (ext === 'zip') return '<svg viewBox="0 0 14 16" width="18" height="20"><rect x="1" y="1" width="12" height="14" rx="1.5" fill="#f5a623" stroke="#f5a623"/><text x="7" y="11" text-anchor="middle" fill="white" font-size="5" font-weight="700">ZIP</text></svg>';
  return '<svg viewBox="0 0 14 16" width="18" height="20"><rect x="1" y="1" width="12" height="14" rx="1.5" fill="#6b7280" stroke="#6b7280"/><text x="7" y="11" text-anchor="middle" fill="white" font-size="5" font-weight="700">FILE</text></svg>';
}

function setupDropZone(dropId, inputId, contractId, type) {
  // already handled inline via ondrop/ondragover
}

function handleFileSelect(input, contractId, type) {
  const { year, month } = ATTENDANCE_VIEW_STATE;
  const d = getAttData(contractId, year, month);
  if (!d.uploadedFiles) d.uploadedFiles = [];
  Array.from(input.files).forEach(file => {
    d.uploadedFiles.push({
      id: 'f-' + Date.now() + Math.random().toString(36).slice(2,6),
      type, name: file.name,
      size: formatFileSize(file.size),
      note: ''
    });
  });
  // Re-render upload form to reflect new files
  const { contractId: cid, engineerName, ymLabel } = window._uploadCtx || {};
  refreshUploadForm(contractId, year, month);
}

function handleFileDrop(event, contractId, type) {
  event.preventDefault();
  event.currentTarget.classList.remove('drag-over');
  const { year, month } = ATTENDANCE_VIEW_STATE;
  const d = getAttData(contractId, year, month);
  if (!d.uploadedFiles) d.uploadedFiles = [];
  Array.from(event.dataTransfer.files).forEach(file => {
    d.uploadedFiles.push({
      id: 'f-' + Date.now() + Math.random().toString(36).slice(2,6),
      type, name: file.name,
      size: formatFileSize(file.size),
      note: ''
    });
  });
  refreshUploadForm(contractId, year, month);
}

function removeUploadedFile(contractId, fileId) {
  const { year, month } = ATTENDANCE_VIEW_STATE;
  const d = getAttData(contractId, year, month);
  d.uploadedFiles = (d.uploadedFiles || []).filter(f => f.id !== fileId);
  refreshUploadForm(contractId, year, month);
}

function refreshUploadForm(contractId, year, month) {
  const d = getAttData(contractId, year, month);
  const c = CONTRACTS.find(x => x.id === contractId);
  const ymLabel = `${year}年${month}月分`;
  const note = document.getElementById('upload-note')?.value || '';
  document.getElementById('upload-modal-body').innerHTML =
    buildUploadForm(contractId, c ? c.engineer : '', ymLabel, d.uploadedFiles || []);
  // Re-wire submit button
  const btn = document.getElementById('upload-submit-btn');
  if (btn) btn.onclick = () => saveUpload(contractId);
  // Restore note
  const noteEl = document.getElementById('upload-note');
  if (noteEl) noteEl.value = note;
  // Re-setup drop zones
  ['timesheet','expense-client','expense-self','other'].forEach(type => {
    setupDropZone(`drop-${type}`, `file-${type}`, contractId, type);
  });
}

function saveUpload(contractId) {
  const { year, month } = ATTENDANCE_VIEW_STATE;
  const d = getAttData(contractId, year, month);
  const note = document.getElementById('upload-note')?.value || '';
  if (d.uploadedFiles) d.uploadedFiles.forEach(f => f.note = note);

  const tsFiles = (d.uploadedFiles || []).filter(f => f.type === 'timesheet');
  if (tsFiles.length === 0) {
    if (!confirm('稼働表ファイルが添付されていません。このまま送信しますか？')) return;
  }

  // Mark as having files uploaded → update status
  if ((d.uploadedFiles || []).length > 0 && d.hours === '') {
    // Files uploaded but hours not entered yet → mark as inputted
  }

  closeModal('upload-modal');
  // Refresh the attendance card
  refreshAttCard(contractId);
  refreshAttSummary();

  const count = (d.uploadedFiles || []).length;
  alert(`${count}件のファイルをアップロードしました ✓\n稼働時間を入力して「確定」ボタンを押してください。`);
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024*1024) return Math.round(bytes/1024) + ' KB';
  return (bytes/1024/1024).toFixed(1) + ' MB';
}

// ─── 書類発行設定モーダル ──────────────────────────────
function openDocWithSettings(type, contractId) {
  const c = CONTRACTS.find(x => x.id === contractId);
  if (!c) return;

  const today = new Date();
  const yyyy  = today.getFullYear();
  const mm    = String(today.getMonth() + 1).padStart(2, '0');
  const dd    = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;
  const no = {'見積書':'QUO','注文書':'ORD'}[type] || 'DOC';
  const defaultNum = `${no}-${yyyy}-${String(Math.floor(Math.random()*900+100)).padStart(3,'0')}`;

  if (!document.getElementById('doc-settings-modal')) {
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="modal-overlay hidden" id="doc-settings-modal" onclick="if(event.target===this)closeModal('doc-settings-modal')">
        <div class="modal-card" style="width:440px">
          <div class="modal-header">
            <h3 id="doc-settings-title">書類発行設定</h3>
            <button class="modal-close" onclick="closeModal('doc-settings-modal')">✕</button>
          </div>
          <div class="modal-body" id="doc-settings-body"></div>
        </div>
      </div>`;
    document.body.appendChild(div.firstElementChild);
  }

  // 契約期間から開始・終了月を初期値として設定
  const contractStartYear  = c ? parseInt(c.start.slice(0,4)) : yyyy;
  const contractStartMonth = c ? parseInt(c.start.slice(5,7)) : today.getMonth()+1;
  const contractEndYear    = c ? parseInt(c.end.slice(0,4))   : yyyy;
  const contractEndMonth   = c ? parseInt(c.end.slice(5,7))   : today.getMonth()+1;

  document.getElementById('doc-settings-title').textContent = `${type}の発行設定`;
  document.getElementById('doc-settings-body').innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px">
      <div class="form-row">
        <label>発行日 <span style="color:var(--coral)">*</span></label>
        <input type="date" class="input" id="dss-issue-date" value="${todayStr}">
      </div>
      <div class="form-row">
        <label>書類番号</label>
        <input class="input" id="dss-doc-num" value="${defaultNum}" placeholder="${defaultNum}">
      </div>

      ${type === '注文書' || type === '見積書' ? `
      <div class="form-row">
        <label>対象期間 <span style="color:var(--coral)">*</span></label>
        <div style="background:var(--bg);border-radius:8px;padding:12px;display:flex;flex-direction:column;gap:10px">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:11px;color:var(--muted);min-width:40px">開始</span>
            <input type="number" class="input" id="dss-start-year" value="${contractStartYear}" min="2020" max="2099" style="width:80px">
            <span style="color:var(--muted)">年</span>
            <input type="number" class="input" id="dss-start-month" value="${contractStartMonth}" min="1" max="12" style="width:60px">
            <span style="color:var(--muted)">月</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:11px;color:var(--muted);min-width:40px">終了</span>
            <input type="number" class="input" id="dss-end-year" value="${contractEndYear}" min="2020" max="2099" style="width:80px">
            <span style="color:var(--muted)">年</span>
            <input type="number" class="input" id="dss-end-month" value="${contractEndMonth}" min="1" max="12" style="width:60px">
            <span style="color:var(--muted)">月</span>
          </div>
          <div id="dss-period-hint" style="font-size:11px;color:var(--acc);font-weight:600"></div>
        </div>
      </div>` : `
      <div class="form-row">
        <label>対象月</label>
        <div style="display:flex;gap:8px">
          <input type="number" class="input" id="dss-year" value="${yyyy}" min="2020" max="2099" style="width:80px">
          <span style="line-height:38px;color:var(--muted)">年</span>
          <input type="number" class="input" id="dss-month" value="${today.getMonth()+1}" min="1" max="12" style="width:60px">
          <span style="line-height:38px;color:var(--muted)">月分</span>
        </div>
      </div>`}

      ${type === '見積書' ? `
      <div class="form-row">
        <label>有効期限</label>
        <input type="date" class="input" id="dss-valid-until">
      </div>` : ''}
      <div class="form-row">
        <label>備考（帳票に反映）</label>
        <textarea class="input" id="dss-note" rows="2" placeholder="特記事項があれば入力"></textarea>
      </div>
    </div>
    <div class="modal-footer" style="margin-top:20px">
      <button class="btn-ghost" onclick="closeModal('doc-settings-modal')">キャンセル</button>
      <button class="btn-primary" onclick="applyDocSettings('${type}','${contractId}')">
        この設定で発行する →
      </button>
    </div>`;

  // 期間ヒント表示（注文書・見積書）
  if (type === '注文書' || type === '見積書') {
    const updateHint = () => {
      const sy = parseInt(document.getElementById('dss-start-year')?.value)||contractStartYear;
      const sm = parseInt(document.getElementById('dss-start-month')?.value)||contractStartMonth;
      const ey = parseInt(document.getElementById('dss-end-year')?.value)||contractEndYear;
      const em = parseInt(document.getElementById('dss-end-month')?.value)||contractEndMonth;
      const months = (ey - sy) * 12 + (em - sm) + 1;
      const hint = document.getElementById('dss-period-hint');
      if (hint) hint.textContent = months > 0 ? `→ ${months}ヶ月分の注文書` : '期間が正しくありません';
    };
    setTimeout(() => {
      ['dss-start-year','dss-start-month','dss-end-year','dss-end-month'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateHint);
      });
      updateHint();
    }, 50);
  }

  openModal('doc-settings-modal');
}

function applyDocSettings(type, contractId) {
  const issueDate  = document.getElementById('dss-issue-date')?.value || '';
  const docNum     = document.getElementById('dss-doc-num')?.value || '';
  const note       = document.getElementById('dss-note')?.value || '';
  const validUntil = document.getElementById('dss-valid-until')?.value || '';

  let targetYear, targetMonth, periodStart, periodEnd, periodMonths;

  if (type === '注文書' || type === '見積書') {
    // 期間指定
    const sy = parseInt(document.getElementById('dss-start-year')?.value)  || new Date().getFullYear();
    const sm = parseInt(document.getElementById('dss-start-month')?.value) || new Date().getMonth()+1;
    const ey = parseInt(document.getElementById('dss-end-year')?.value)    || sy;
    const em = parseInt(document.getElementById('dss-end-month')?.value)   || sm;
    targetYear   = sy;
    targetMonth  = sm;
    periodStart  = `${sy}-${String(sm).padStart(2,'0')}-01`;
    // 終了月の末日を計算
    const lastDay = new Date(ey, em, 0).getDate();
    periodEnd    = `${ey}-${String(em).padStart(2,'0')}-${lastDay}`;
    periodMonths = (ey - sy) * 12 + (em - sm) + 1;
  } else {
    targetYear  = parseInt(document.getElementById('dss-year')?.value)  || new Date().getFullYear();
    targetMonth = parseInt(document.getElementById('dss-month')?.value) || new Date().getMonth()+1;
    periodStart = null;
    periodEnd   = null;
    periodMonths= 1;
  }

  window._docIssueSettings = {
    issueDate, docNum, targetYear, targetMonth,
    periodStart, periodEnd, periodMonths,
    note, validUntil
  };

  closeModal('doc-settings-modal');
  openDoc(type, contractId);
}

// ─── CSV エクスポート ────────────────────────────────
const CSV_HEADERS = [
  'id','name','engineer','clientUpper','clientUpperDept','clientLower','clientLowerDept',
  'start','end','extendStatus','extendMonths',
  'monthly','clientLowerMonthly',
  'minHours','maxHours','overRate','underRate','settlementUnit',
  'paymentSite','note','selfNote','hasExpense'
];
const CSV_LABELS = [
  'ID','案件名','作業者名','案件元会社','案件元担当者','人材元会社','人材元担当者',
  '契約開始日','契約終了日','延長状況','継続期間',
  '案件元単価','人材元単価',
  '精算下限時間','精算上限時間','超過単価','控除単価','精算単位',
  '支払いサイト','備考','自分のメモ','立替経費あり'
];

function exportContractsCSV() {
  const rows = [CSV_LABELS.join(',')];
  CONTRACTS.forEach(c => {
    const row = CSV_HEADERS.map(key => {
      const v = c[key] !== undefined ? String(c[key]) : '';
      // CSVエスケープ：カンマ・改行・ダブルクォートを含む場合はダブルクォートで囲む
      return v.includes(',') || v.includes('\n') || v.includes('"')
        ? `"${v.replace(/"/g,'""')}"` : v;
    });
    rows.push(row.join(','));
  });
  const bom = '\uFEFF'; // Excel用BOM
  const blob = new Blob([bom + rows.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `migi_works_contracts_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── CSV インポート ────────────────────────────────
function importContractsCSV(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const text = e.target.result.replace(/^\uFEFF/, ''); // BOM除去
      const lines = parseCSVLines(text);
      if (lines.length < 2) { alert('データが見つかりません'); return; }

      const headers = lines[0];
      const imported = [];
      const errors   = [];

      for (let i = 1; i < lines.length; i++) {
        const vals = lines[i];
        if (vals.length < 2 || vals.every(v => !v)) continue; // 空行スキップ

        const obj = {};
        CSV_HEADERS.forEach((key, idx) => {
          const labelIdx = CSV_LABELS.indexOf(headers[idx] || '');
          const colIdx   = labelIdx >= 0 ? labelIdx : idx;
          const val      = vals[colIdx] !== undefined ? vals[colIdx] : '';
          // 数値変換
          if (['monthly','clientLowerMonthly','minHours','maxHours','overRate','underRate','settlementUnit','paymentSite'].includes(key)) {
            obj[key] = Number(val) || 0;
          } else if (key === 'hasExpense') {
            obj[key] = val === 'true' || val === '1';
          } else {
            obj[key] = val;
          }
        });

        // 必須チェック
        if (!obj.name || !obj.engineer || !obj.start || !obj.end) {
          errors.push(`行${i+1}: 案件名・作業者名・開始日・終了日は必須です`);
          continue;
        }
        // IDがなければ自動生成
        if (!obj.id) obj.id = 'C-' + Date.now() + '-' + i;
        // extendStatusのデフォルト
        if (!obj.extendStatus) obj.extendStatus = '未確認';

        // 既存IDと重複チェック → 上書き or 新規追加
        const existing = CONTRACTS.findIndex(c => c.id === obj.id);
        if (existing >= 0) {
          CONTRACTS[existing] = { ...CONTRACTS[existing], ...obj };
        } else {
          imported.push(obj);
        }
      }

      CONTRACTS.push(...imported);

      // 結果表示
      let msg = `✓ ${imported.length}件を新規追加しました。`;
      const updated = lines.length - 1 - imported.length - errors.length;
      if (updated > 0) msg += `\n${updated}件を更新しました。`;
      if (errors.length > 0) msg += `\n\n⚠ エラー ${errors.length}件:\n${errors.slice(0,5).join('\n')}`;
      alert(msg);

      // 画面を更新
      document.getElementById('content-area').innerHTML = renderContractsView();
    } catch(err) {
      alert('CSVの読み込みに失敗しました。\n' + err.message);
    }
    input.value = ''; // 同じファイルを再度選択できるようリセット
  };
  reader.readAsText(file, 'UTF-8');
}

function parseCSVLines(text) {
  // RFC4180準拠のCSVパーサー
  const result = [];
  const lines  = [];
  let cur = '', inQ = false;
  const cells = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"' && text[i+1] === '"') { cur += '"'; i++; }
      else if (ch === '"') { inQ = false; }
      else cur += ch;
    } else {
      if (ch === '"') { inQ = true; }
      else if (ch === ',') { cells.push(cur); cur = ''; }
      else if (ch === '\n' || (ch === '\r' && text[i+1] === '\n')) {
        if (ch === '\r') i++;
        cells.push(cur); cur = '';
        result.push([...cells]); cells.length = 0;
      } else cur += ch;
    }
  }
  if (cur || cells.length) { cells.push(cur); result.push([...cells]); }
  return result;
}

// ─── CSV インポート用テンプレートダウンロード ────────
function downloadCSVTemplate() {
  const sample = [
    CSV_LABELS.join(','),
    ['C-SAMPLE-001','財務システム開発','岡本 和真','株式会社テックコア','田中','株式会社ミギナナメウエ','','2026-04-01','2026-09-30','未確認','6ヶ月','500000','0','140','180','3125','3125','15','30','備考','','false'].join(',')
  ];
  const blob = new Blob(['\uFEFF' + sample.join('\n')], {type:'text/csv;charset=utf-8'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'migi_works_contracts_template.csv'; a.click();
}

// ─── CONTRACTS MONTHLY VIEW ──────────────────────────
function renderContractsView() {
  const { year, month } = CONTRACT_VIEW_STATE;
  const ymStr = `${year}-${String(month).padStart(2,'0')}`;
  const lastDay = new Date(year, month, 0).getDate();
  const monthEnd = `${ymStr}-${lastDay}`;

  // 当月に終了する契約（end が ymStr の月）
  const endingThisMonth = CONTRACTS.filter(c => c.end.startsWith(ymStr));
  // 当月中に稼働中（start <= monthEnd && end >= ymStr-01）
  const activeThisMonth = CONTRACTS.filter(c => c.start <= monthEnd && c.end >= `${ymStr}-01`);

  const confirmed = endingThisMonth.filter(c => c.extendStatus !== '未確認').length;
  const extended  = endingThisMonth.filter(c => c.extendStatus === '延長する').length;
  const ended     = endingThisMonth.filter(c => c.extendStatus === '延長しない').length;

  const prevYear  = month === 1 ? year - 1 : year;
  const prevMonth = month === 1 ? 12 : month - 1;
  const nextYear  = month === 12 ? year + 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;

  return `
<div class="contracts-toolbar">
  <div class="contracts-toolbar-left">
    <button class="btn-primary btn-sm" onclick="openContractModal()">＋ 新規登録</button>
    <button class="btn-outline btn-sm" onclick="alert('一括延長確認メールを送信しました ✓')">一括延長確認</button>
    <button class="btn-outline btn-sm" onclick="exportContractsCSV()">
      <svg viewBox="0 0 14 14" width="12" height="12" style="margin-right:2px"><path d="M7 1v8M4 6l3 4 3-4M2 11h10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
      CSV出力
    </button>
    <label class="btn-outline btn-sm" style="cursor:pointer;display:inline-flex;align-items:center;gap:4px" title="CSVファイルを選択して取り込み">
      <svg viewBox="0 0 14 14" width="12" height="12"><path d="M7 13V5M4 8l3-4 3 4M2 3h10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
      CSV取込
      <input type="file" accept=".csv" style="display:none" onchange="importContractsCSV(this)">
    </label>
    <button class="btn-outline btn-sm" onclick="alert('検索パネルを表示')">
      <svg viewBox="0 0 14 14" width="12" height="12" style="margin-right:2px"><circle cx="5.5" cy="5.5" r="3.5" stroke="currentColor" stroke-width="1.3" fill="none"/><line x1="8.5" y1="8.5" x2="13" y2="13" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
      検索
    </button>
  </div>
  <div class="month-nav">
    <button class="month-nav-btn" onclick="changeContractMonth(${prevYear},${prevMonth})">‹</button>
    <span class="month-nav-label">${year}年${month}月</span>
    <button class="month-nav-btn" onclick="changeContractMonth(${nextYear},${nextMonth})">›</button>
  </div>
  <div style="display:flex;gap:8px;align-items:center">
    <button class="btn-outline btn-sm" onclick="downloadCSVTemplate()" title="CSVのフォーマットテンプレートをダウンロード">
      <svg viewBox="0 0 14 14" width="12" height="12"><rect x="1" y="1" width="12" height="12" rx="1.5" stroke="currentColor" stroke-width="1.2" fill="none"/><line x1="4" y1="5" x2="10" y2="5" stroke="currentColor" stroke-width="1" stroke-linecap="round"/><line x1="4" y1="8" x2="7" y2="8" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>
      CSVテンプレート
    </button>
  </div>
</div>

<div class="contracts-summary-bar">
  <span>検索結果一覧 全 <strong>${activeThisMonth.length}</strong> 件</span>
  <div class="summary-stats">
    <span>当月に終了する契約数：<strong>${endingThisMonth.length}</strong>件</span>
    <span class="stat-sep">確認中：<strong>${confirmed}</strong> 件</span>
    <span class="stat-sep">延長した：<strong style="color:var(--acc)">${extended}</strong> 件</span>
    <span class="stat-sep">終了しなかった：<strong style="color:var(--coral)">${ended}</strong> 件</span>
  </div>
</div>

<div class="contract-cards" id="contract-cards">
  ${activeThisMonth.map(c => renderContractCard(c)).join('')}
  ${activeThisMonth.length === 0 ? '<div style="text-align:center;padding:60px;color:var(--muted)">この月の契約はありません</div>' : ''}
</div>`;
}

function renderContractCard(c) {
  const isEndingThisMonth = c.end.startsWith(`${CONTRACT_VIEW_STATE.year}-${String(CONTRACT_VIEW_STATE.month).padStart(2,'0')}`);

  const extendBtnExtend   = `<button class="extend-btn extend-yes ${c.extendStatus==='延長する'?'active':''}" onclick="openExtendModal('${c.id}')">延長する</button>`;
  const extendBtnNo       = `<button class="extend-btn extend-no ${c.extendStatus==='延長しない'?'active':''}" onclick="setExtendStatus('${c.id}','延長しない')">延長しない</button>`;
  const extendBtnReset    = `<button class="extend-btn extend-reset" onclick="setExtendStatus('${c.id}','未確認')">延長未確認に戻す</button>`;

  const statusClass = c.extendStatus === '延長する' ? 'card-status-extended'
                    : c.extendStatus === '延長しない' ? 'card-status-ended'
                    : isEndingThisMonth ? 'card-status-ending' : '';

  return `
<div class="contract-card ${statusClass}" id="cc-${c.id}">
  <div class="cc-header">
    <div class="cc-engineer">
      <span class="cc-name">${c.engineer}</span>
      ${c.extendStatus === '延長する' ? '<span class="extend-label ext-yes">延長する</span>' :
        c.extendStatus === '延長しない' ? '<span class="extend-label ext-no">延長しない</span>' :
        isEndingThisMonth ? '<span class="extend-label ext-pending">当月終了</span>' : ''}
    </div>
    <div class="cc-actions">
      <button class="btn-outline btn-sm" onclick="openDocWithSettings('見積書','${c.id}')">
        <svg viewBox="0 0 12 12" width="10" height="10"><rect x="1" y="1" width="10" height="10" rx="1.5" stroke="currentColor" stroke-width="1.2" fill="none"/><line x1="3" y1="4" x2="9" y2="4" stroke="currentColor" stroke-width="1" stroke-linecap="round"/><line x1="3" y1="7" x2="7" y2="7" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>
        見積書
      </button>
      <button class="btn-outline btn-sm" onclick="openDocWithSettings('注文書','${c.id}')">
        <svg viewBox="0 0 12 12" width="10" height="10"><rect x="1" y="1" width="10" height="10" rx="1.5" stroke="currentColor" stroke-width="1.2" fill="none"/><line x1="3" y1="4" x2="9" y2="4" stroke="currentColor" stroke-width="1" stroke-linecap="round"/><line x1="3" y1="7" x2="7" y2="7" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>
        注文書
      </button>
      ${extendBtnExtend}
      ${extendBtnNo}
      ${(c.extendStatus !== '未確認') ? extendBtnReset : ''}
    </div>
  </div>

  <div class="cc-job-name">${c.name}</div>

  <div style="display:flex;gap:12px;margin-bottom:14px;flex-wrap:wrap;align-items:center">
    <div style="display:inline-flex;align-items:center;gap:7px;background:#0d1b35;color:#fff;padding:6px 16px;border-radius:20px;font-size:14px;font-weight:700;letter-spacing:.3px">
      <svg viewBox="0 0 12 12" width="12" height="12"><rect x="1" y="1" width="10" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3" fill="none"/><line x1="4" y1="0.5" x2="4" y2="3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><line x1="8" y1="0.5" x2="8" y2="3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><line x1="1" y1="4.5" x2="11" y2="4.5" stroke="currentColor" stroke-width="1.3"/></svg>
      ${c.start} 〜 ${c.end}
    </div>
    <div style="font-size:12px;color:var(--muted)">継続期間：${c.extendMonths}</div>
    ${c.selfNote ? `<div style="font-size:12px;color:var(--muted)">メモ：${c.selfNote}</div>` : ''}
  </div>

  <div class="cc-parties">
    <div class="cc-party">
      <div class="cc-party-label">受案先（上位）</div>
      <div class="cc-party-grid">
        <div><span class="cc-field-lbl">会社名</span><span class="cc-field-val">${c.clientUpper}</span></div>
        <div><span class="cc-field-lbl">担当者(担当)</span><span class="cc-field-val">${c.clientUpperDept || '—'}</span></div>
        <div><span class="cc-field-lbl">担当者(作業)</span><span class="cc-field-val">${c.clientUpperJobType || '—'}</span></div>
        <div><span class="cc-field-lbl">全額</span><span class="cc-field-val cc-amount">¥${c.monthly.toLocaleString()}円</span></div>
      </div>
      ${c.note ? `<div class="cc-note">メモ<br>${c.note.replace(/\n/g,'<br>')}</div>` : ''}
    </div>
    <div class="cc-party-divider">
      <svg viewBox="0 0 16 16" width="18" height="18" style="color:var(--muted)"><path d="M4 8h8M9 5l3 3-3 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
    </div>
    <div class="cc-party">
      <div class="cc-party-label">所属先（下位）</div>
      <div class="cc-party-grid">
        <div><span class="cc-field-lbl">会社名</span><span class="cc-field-val">${c.clientLower}</span></div>
        <div><span class="cc-field-lbl">担当者(担当)</span><span class="cc-field-val">${c.clientLowerDept || '—'}</span></div>
        <div><span class="cc-field-lbl">担当者(作業)</span><span class="cc-field-val">${c.clientLowerJobType || '—'}</span></div>
        <div><span class="cc-field-lbl">全額</span><span class="cc-field-val ${c.clientLowerMonthly > 0 ? 'cc-amount' : 'cc-zero'}">¥${c.clientLowerMonthly.toLocaleString()}円</span></div>
      </div>
    </div>
  </div>
</div>`;
}

function changeContractMonth(year, month) {
  CONTRACT_VIEW_STATE.year = year;
  CONTRACT_VIEW_STATE.month = month;
  document.getElementById('content-area').innerHTML = renderContractsView();
  initViewBindings('contracts');
}

function setExtendStatus(contractId, status) {
  const c = CONTRACTS.find(x => x.id === contractId);
  if (!c) return;
  c.extendStatus = status;
  // Re-render just this card
  const el = document.getElementById(`cc-${contractId}`);
  if (el) {
    const tmp = document.createElement('div');
    tmp.innerHTML = renderContractCard(c);
    el.replaceWith(tmp.firstElementChild);
  }
  // Update summary bar
  const { year, month } = CONTRACT_VIEW_STATE;
  const ymStr = `${year}-${String(month).padStart(2,'0')}`;
  const endingThisMonth = CONTRACTS.filter(x => x.end.startsWith(ymStr));
  const confirmed = endingThisMonth.filter(x => x.extendStatus !== '未確認').length;
  const extended  = endingThisMonth.filter(x => x.extendStatus === '延長する').length;
  const ended     = endingThisMonth.filter(x => x.extendStatus === '延長しない').length;
  const bar = document.querySelector('.contracts-summary-bar .summary-stats');
  if (bar) bar.innerHTML = `
    <span>当月に終了する契約数：<strong>${endingThisMonth.length}</strong>件</span>
    <span class="stat-sep">確認中：<strong>${confirmed}</strong> 件</span>
    <span class="stat-sep">延長した：<strong style="color:var(--acc)">${extended}</strong> 件</span>
    <span class="stat-sep">終了しなかった：<strong style="color:var(--coral)">${ended}</strong> 件</span>`;
}
function initBillingCalc() {
  // already has event handlers in HTML
}

function calcBilling() {
  const sel = document.getElementById('billing-contract-sel');
  const contractId = sel.value;
  if (!contractId) return;

  const contract = CONTRACTS.find(c => c.id === contractId);
  if (!contract) return;

  const infoDiv = document.getElementById('billing-contract-info');
  infoDiv.classList.remove('hidden');

  // Show contract info
  document.getElementById('billing-info-grid').innerHTML = `
    <div class="stat-card" style="padding:12px">
      <div class="stat-label">基本月額</div>
      <div style="font-size:16px;font-weight:700">¥${contract.monthly.toLocaleString()}</div>
    </div>
    <div class="stat-card" style="padding:12px">
      <div class="stat-label">精算幅</div>
      <div style="font-size:16px;font-weight:700">${contract.minHours}〜${contract.maxHours}h</div>
    </div>
    <div class="stat-card" style="padding:12px">
      <div class="stat-label">超過/控除単価</div>
      <div style="font-size:16px;font-weight:700">¥${contract.overRate.toLocaleString()}/h</div>
    </div>`;

  updateBillingResult(contract);
}

function updateBillingResult(contract) {
  const actualHours = parseFloat(document.getElementById('billing-actual-hours').value) || 0;
  const expense = parseFloat(document.getElementById('billing-expense').value) || 0;
  const misc = parseFloat(document.getElementById('billing-misc').value) || 0;

  let adjustment = 0;
  let adjustLabel = '';
  let adjustClass = '';

  if (actualHours > contract.maxHours) {
    const overHours = actualHours - contract.maxHours;
    adjustment = overHours * contract.overRate;
    adjustLabel = `超過 +${overHours}h × ¥${contract.overRate.toLocaleString()} = +¥${adjustment.toLocaleString()}`;
    adjustClass = 'surplus';
  } else if (actualHours < contract.minHours) {
    const underHours = contract.minHours - actualHours;
    adjustment = -(underHours * contract.underRate);
    adjustLabel = `控除 -${underHours}h × ¥${contract.underRate.toLocaleString()} = -¥${Math.abs(adjustment).toLocaleString()}`;
    adjustClass = 'deduction';
  } else {
    adjustLabel = '精算幅内（調整なし）';
  }

  const subtotal = contract.monthly + adjustment + expense + misc;
  const tax = Math.round(subtotal * 0.10);
  const total = subtotal + tax;

  document.getElementById('billing-result-area').innerHTML = `
    <div class="billing-result">
      <div class="billing-result-title">計算結果</div>
      <div class="billing-result-amount">¥${total.toLocaleString()} <span style="font-size:14px;opacity:.6">（税込）</span></div>
      <div class="billing-breakdown">
        <div class="billing-item">
          <div class="billing-item-label">基本月額</div>
          <div class="billing-item-val">¥${contract.monthly.toLocaleString()}</div>
        </div>
        <div class="billing-item">
          <div class="billing-item-label">超過控除</div>
          <div class="billing-item-val ${adjustClass}">${adjustment >= 0 ? '+' : ''}¥${adjustment.toLocaleString()}</div>
        </div>
        <div class="billing-item">
          <div class="billing-item-label">立替経費</div>
          <div class="billing-item-val">¥${expense.toLocaleString()}</div>
        </div>
        <div class="billing-item">
          <div class="billing-item-label">雑費</div>
          <div class="billing-item-val">¥${misc.toLocaleString()}</div>
        </div>
        <div class="billing-item">
          <div class="billing-item-label">小計</div>
          <div class="billing-item-val">¥${subtotal.toLocaleString()}</div>
        </div>
        <div class="billing-item">
          <div class="billing-item-label">消費税 10%</div>
          <div class="billing-item-val">¥${tax.toLocaleString()}</div>
        </div>
      </div>
      <div style="margin-top:12px;font-size:11px;color:rgba(255,255,255,.5)">${adjustLabel}</div>
    </div>`;

  // Store for invoice generation
  window._lastBillingCalc = { contract, actualHours, expense, misc, subtotal, tax, total, adjustment, adjustLabel };
}

function generateBillingInvoice() {
  if (!window._lastBillingCalc) { alert('先に計算を実行してください'); return; }
  const { contract, subtotal, tax, total, adjustLabel } = window._lastBillingCalc;
  showDocModal('請求書', contract, subtotal, tax, total, `※ 実働時間調整: ${adjustLabel}`);
}

function openBillingForEngineer(engId) {
  showView('billing', document.querySelector('[data-view="billing"]'));
  setTimeout(() => {
    const contract = CONTRACTS.find(c => c.engineer === ENGINEERS.find(e=>e.id===engId)?.name);
    if (contract) {
      const sel = document.getElementById('billing-contract-sel');
      if (sel) { sel.value = contract.id; calcBilling(); }
    }
  }, 100);
}

// ─── DOCUMENT MODAL ──────────────────────────────────
function openDoc(type, contractId) {
  const contract = CONTRACTS.find(c => c.id === contractId);
  const invoice  = INVOICES.find(i => i.contractId === contractId);
  const amount   = invoice ? invoice.amount : (contract ? contract.monthly : 0);
  const tax      = Math.round(amount * 0.1);
  const total    = amount + tax;
  const note     = '';

  // Show employee picker first, then render doc
  showEmployeePicker(type, contract, amount, tax, total, note);
}

// ── 社員選択ピッカー ──────────────────────────────────
function showEmployeePicker(type, contract, amount, tax, total, note) {
  const typeColors = { '請求書':'#0d1b35', '見積書':'#1e3358', '注文書':'#2d1b6e' };
  const color = typeColors[type] || '#0d1b35';
  const contractId = contract ? contract.id : '';

  // 営業担当者リスト（自社情報設定から）
  const salesPersons = MY_COMPANY.salesPersons || [];
  const empOptions = salesPersons.length > 0
    ? salesPersons.map((name, i) => {
        const initials = name.replace(/\s/g,'').slice(-2) || name.slice(0,2);
        const colors = ['#3b7dd8','#00c896','#f5a623','#e85d4a','#6c63ff','#00a67a','#e91e8c','#ff6b35'];
        const bg = colors[i % colors.length];
        return `<button class="emp-pick-btn" onclick="selectEmployee('${escHtml(name)}','',this)"
           data-name="${escHtml(name)}">
          <div class="emp-pick-av" style="background:${bg}">${initials}</div>
          <div class="emp-pick-info">
            <div class="emp-pick-name">${escHtml(name)}</div>
            <div class="emp-pick-role">営業担当</div>
          </div>
        </button>`;
      }).join('')
    : `<div style="font-size:11px;color:#aaa;padding:8px;line-height:1.7">
        担当者が未登録です。<br>
        <a href="#" onclick="showView('company-settings',document.querySelector('[data-view=company-settings]'));closeModal('doc-modal');return false"
           style="color:#00c896">自社情報設定で登録 →</a>
       </div>`;

  const defaultClient = contract
    ? (type === '注文書' ? contract.clientLower : contract.clientUpper)
    : '';
  const no  = {'請求書':'INV','見積書':'QUO','注文書':'ORD'}[type] || 'DOC';
  const num = `${no}-2026-${String(Math.floor(Math.random()*900+100)).padStart(3,'0')}`;
  const item = contract ? `${contract.name}費（2026年3月分）` : '業務委託費';

  // Store state for preview refresh
  window._docState = { type, color, num, defaultClient, item, amount, tax, total, note, contract, contractId };

  document.getElementById('doc-paper').innerHTML = `
<style>
.doc-picker-wrap{display:flex;gap:20px;min-height:500px}
.doc-picker-left{width:220px;flex-shrink:0;border-right:1px solid #eee;padding-right:18px;overflow-y:auto}
.doc-picker-title{font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px}
.emp-pick-btn{width:100%;display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:8px;border:1.5px solid transparent;background:transparent;cursor:pointer;transition:all .12s;text-align:left;font-family:inherit;margin-bottom:5px}
.emp-pick-btn:hover{background:#f0fdf9;border-color:#a7f3d0}
.emp-pick-btn.selected{background:#e0f7f0;border-color:#00c896}
.emp-pick-av{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0}
.emp-pick-name{font-size:12px;font-weight:700;color:#1a1d23}
.emp-pick-role{font-size:10px;color:#6b7280}
.doc-picker-right{flex:1;min-width:0;overflow-y:auto}
.doc-preview-label{font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px}
.inv-sender-fields{display:flex;flex-direction:column;gap:6px;margin-bottom:12px;background:#f9fafb;border-radius:8px;padding:10px}
.inv-sender-row{display:flex;align-items:center;gap:8px;font-size:12px}
.inv-sender-lbl{color:#888;min-width:54px;flex-shrink:0;font-weight:600}
.inv-sender-input{flex:1;padding:4px 8px;border:1px solid #e5e7eb;border-radius:5px;font-size:12px;font-family:inherit;color:#1a1d23;background:#fff;outline:none}
.inv-sender-input:focus{border-color:#00c896}
.doc-preview-box{border:1px solid #e5e7eb;border-radius:8px;padding:16px;background:#fff;font-size:11px}
</style>

<div class="doc-picker-wrap">
  <div class="doc-picker-left">
    <div class="doc-picker-title">担当者を選択</div>
    ${empOptions}
    <div style="margin-top:12px;border-top:1px solid #eee;padding-top:10px">
      <div class="doc-picker-title">手動入力</div>
      <input class="inv-sender-input" style="width:100%;margin-bottom:6px" id="doc-manual-name" placeholder="氏名">
      <input class="inv-sender-input" style="width:100%" id="doc-manual-role" placeholder="役職">
    </div>
  </div>

  <div class="doc-picker-right">
    <div class="doc-preview-label">自社情報（編集可）</div>
    <div class="inv-sender-fields">
      <div class="inv-sender-row"><span class="inv-sender-lbl">会社名</span><input class="inv-sender-input" id="doc-from-company" value="${escHtml(MY_COMPANY.name || 'MIGI WORKS')}" oninput="refreshDocPreview()"></div>
      <div class="inv-sender-row"><span class="inv-sender-lbl">住所</span><input class="inv-sender-input" id="doc-from-addr" value="${escHtml(MY_COMPANY.address || '〒107-0052 東京都港区赤坂1-1-1')}" oninput="refreshDocPreview()"></div>
      <div class="inv-sender-row"><span class="inv-sender-lbl">TEL</span><input class="inv-sender-input" id="doc-from-tel" value="${escHtml(MY_COMPANY.tel || '03-1234-5678')}" oninput="refreshDocPreview()"></div>
      <div class="inv-sender-row"><span class="inv-sender-lbl">担当者</span><input class="inv-sender-input" id="doc-from-person" value="" placeholder="左から選択 or 入力" oninput="refreshDocPreview()"></div>
      ${type === '注文書' ? `
      <div style="margin-top:8px;padding:10px;background:#fff;border:1px solid #e0e0e0;border-radius:6px;font-size:11px">
        <div style="font-weight:700;color:#333;margin-bottom:6px">注文請書の発行</div>
        <div style="display:flex;gap:12px">
          <label style="cursor:pointer;display:flex;align-items:center;gap:4px"><input type="radio" name="ukesho-opt" value="" checked onchange="document.getElementById('ukesho-hint').style.display='none'">選択なし</label>
          <label style="cursor:pointer;display:flex;align-items:center;gap:4px"><input type="radio" name="ukesho-opt" value="yes" onchange="document.getElementById('ukesho-hint').style.display='block'">発行する</label>
          <label style="cursor:pointer;display:flex;align-items:center;gap:4px"><input type="radio" name="ukesho-opt" value="no" onchange="document.getElementById('ukesho-hint').style.display='none'">発行しない</label>
        </div>
        <div id="ukesho-hint" style="display:none;margin-top:6px;font-size:10px;color:#00a67a;font-weight:600">✓ 印刷・PDF保存時に2ページ目として注文請書が追加されます</div>
      </div>` : ''}
    </div>
    <div class="doc-preview-label" style="margin-top:6px">帳票プレビュー</div>
    <div class="doc-preview-box" id="doc-inner-preview">
      <!-- rendered after mount -->
    </div>
  </div>
</div>`;

  openModal('doc-modal');

  // setTimeout ensures DOM is fully rendered before calling refreshDocPreview
  setTimeout(() => {
    refreshDocPreview();
  }, 50);

  // Override modal actions
  document.querySelector('.doc-modal-actions').innerHTML = `
    <button class="btn-outline" onclick="finalizeDoc()">✓ この内容で発行</button>
    <button class="btn-outline" onclick="printDoc()">🖨 印刷 / PDF保存</button>
    <button class="btn-outline" onclick="openEmailSend()">📧 メール</button>
    <button class="btn-ghost" onclick="closeModal('doc-modal')">閉じる</button>`;
}

function refreshDocPreview() {
  const s = window._docState;
  if (!s) return;
  const el = document.getElementById('doc-inner-preview');
  if (!el) return;
  el.innerHTML = buildDocInner(s.type, s.color, s.num, s.defaultClient, s.item, s.amount, s.tax, s.total, s.note, s.contract);
}

function selectEmployee(name, role, btnEl) {
  document.querySelectorAll('.emp-pick-btn').forEach(b => b.classList.remove('selected'));
  btnEl.classList.add('selected');
  const inp = document.getElementById('doc-from-person');
  const mn  = document.getElementById('doc-manual-name');
  const mr  = document.getElementById('doc-manual-role');
  if (inp) inp.value = name;
  if (mn)  mn.value  = name;
  if (mr)  mr.value  = role;
  refreshDocPreview();
}

function syncDocPreview() { refreshDocPreview(); }

function printDoc() {
  const preview = document.getElementById('doc-inner-preview');
  if (!preview || !preview.innerHTML.trim()) {
    alert('帳票プレビューが表示されていません。\n担当者を選択するか、会社名を入力してください。');
    return;
  }
  const content = preview.innerHTML;
  const s = window._docState;
  const title = s ? `MIGI_WORKS_${s.type}_${s.num||''}` : 'MIGI_WORKS_帳票';

  // 注文請書の発行判定
  const ukeshoOpt = document.querySelector('input[name="ukesho-opt"]:checked')?.value || '';
  const showUkesho = ukeshoOpt === 'yes' && s?.type === '注文書';

  // 注文請書HTML生成
  let ukeshoHtml = '';
  if (showUkesho && s?.contract) {
    const c = s.contract;
    const senderName = document.getElementById('doc-from-company')?.value || MY_COMPANY.name || 'MIGI WORKS';
    const senderAddr = document.getElementById('doc-from-addr')?.value || MY_COMPANY.address || '';
    const personName = document.getElementById('doc-from-person')?.value || '';
    const issueDate  = window._docIssueSettings?.issueDate
      ? window._docIssueSettings.issueDate.replace(/-/g,'/').replace(/(\d{4})\/(\d{2})\/(\d{2})/,'$1年$2月$3日').replace(/年0/,'年').replace(/月0/,'月')
      : new Date().toLocaleDateString('ja-JP',{year:'numeric',month:'long',day:'numeric'});
    const period = window._docIssueSettings?.periodStart
      ? `${window._docIssueSettings.periodStart} 〜 ${window._docIssueSettings.periodEnd}`
      : `${c.start} 〜 ${c.end}`;
    const months = window._docIssueSettings?.periodMonths || 1;
    const totalAmt = c.monthly * months;

    ukeshoHtml = `
<div style="page-break-before:always;font-family:'Noto Sans JP',sans-serif;font-size:11px;color:#111;line-height:1.6;padding:4px">
  <div style="text-align:center;font-size:22px;font-weight:700;letter-spacing:10px;margin:30px 0 30px">注　文　請　書</div>
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px">
    <div>
      <div style="font-size:11px;color:#555">${escHtml(senderAddr)}</div>
      <div style="font-size:13px;font-weight:700;color:#111;margin-top:4px">${escHtml(senderName)}</div>
      <div style="font-size:10px;color:#555">担当: ${escHtml(personName)||'—'}</div>
    </div>
    <div style="min-width:200px">
      <div style="display:flex"><div style="background:#222;color:#fff;font-weight:700;font-size:10px;padding:5px 10px;width:60px;text-align:center">発行日</div><div style="border:1px solid #ccc;border-left:none;padding:5px 10px;font-size:10px;flex:1">${issueDate}</div></div>
    </div>
  </div>
  <div style="font-size:12px;margin-bottom:20px">
    この度は発注をいただきまして誠にありがとうございます。<br>
    下記の通り請書を申し上げます。
  </div>
  <table style="width:100%;border-collapse:collapse;font-size:10px">
    <tr><td style="background:#eee;font-weight:700;padding:8px 12px;border:1px solid #ccc;width:120px">作業内容</td><td style="border:1px solid #ccc;border-left:none;padding:8px 12px">${escHtml(c.name)}</td></tr>
    <tr><td style="background:#eee;font-weight:700;padding:8px 12px;border:1px solid #ccc;border-top:none">作業者</td><td style="border:1px solid #ccc;border-left:none;border-top:none;padding:8px 12px">${escHtml(c.engineer)} 様</td></tr>
    <tr><td style="background:#eee;font-weight:700;padding:8px 12px;border:1px solid #ccc;border-top:none">契約期間</td><td style="border:1px solid #ccc;border-left:none;border-top:none;padding:8px 12px">${escHtml(period)}</td></tr>
    <tr><td style="background:#eee;font-weight:700;padding:8px 12px;border:1px solid #ccc;border-top:none">契約金額</td><td style="border:1px solid #ccc;border-left:none;border-top:none;padding:8px 12px;font-weight:700;font-size:13px">¥${totalAmt.toLocaleString()}（税抜）${months>1?` / ${c.monthly.toLocaleString()}円×${months}ヶ月`:''}</td></tr>
    <tr><td style="background:#eee;font-weight:700;padding:8px 12px;border:1px solid #ccc;border-top:none">基準時間</td><td style="border:1px solid #ccc;border-left:none;border-top:none;padding:8px 12px">${c.minHours}時間 〜 ${c.maxHours}時間</td></tr>
    <tr><td style="background:#eee;font-weight:700;padding:8px 12px;border:1px solid #ccc;border-top:none">調整単価</td><td style="border:1px solid #ccc;border-left:none;border-top:none;padding:8px 12px">控除 ${c.underRate.toLocaleString()}円/時間　超過 ${c.overRate.toLocaleString()}円/時間</td></tr>
  </table>
  <div style="margin-top:40px;text-align:right;font-size:10px;color:#555">以上</div>
</div>`;
  }

  const win = window.open('', '_blank');
  if (!win) {
    alert('ポップアップがブロックされています。\nブラウザのポップアップブロックを解除してください。');
    return;
  }
  win.document.write(`<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Noto Sans JP',sans-serif;font-size:11px;color:#111;background:#fff;padding:20mm 15mm}
table{border-collapse:collapse}
@media print{
  body{padding:0;margin:0}
  @page{margin:12mm 10mm;size:A4 portrait}
  button{display:none!important}
  .no-print{display:none!important}
}
.print-actions{text-align:center;margin-top:20px;padding:16px;background:#f5f5f5;border-radius:8px}
.print-actions button{padding:10px 24px;margin:0 6px;border-radius:6px;border:none;cursor:pointer;font-size:13px;font-family:inherit}
.btn-pdf{background:#0d1b35;color:#fff}
.btn-close{background:#eee;color:#333}
</style>
</head>
<body>
<div class="no-print print-actions">
  <button class="btn-pdf" onclick="window.print()">🖨 印刷 / PDFとして保存</button>
  <button class="btn-close" onclick="window.close()">閉じる</button>
  ${showUkesho ? '<p style="font-size:10px;color:#888;margin-top:8px">※ 2ページ目に注文請書が印刷されます</p>' : ''}
</div>
${content}
${ukeshoHtml}
</body>
</html>`);
  win.document.close();
}

function finalizeDoc() {
  const s = window._docState;
  if (!s) { closeModal('doc-modal'); return; }
  const company = document.getElementById('doc-from-company')?.value || MY_COMPANY.name || 'MIGI WORKS';
  const person  = document.getElementById('doc-from-person')?.value || '';
  alert(`${s.type}を発行しました ✓\n発行者: ${company}${person ? ' / ' + person : ''}`);
  closeModal('doc-modal');
}

function buildDocInner(type, color, num, client, item, amount, tax, total, note, contract) {
  const today  = new Date();
  const s      = window._docIssueSettings || {};
  const yyyy   = s.targetYear  || today.getFullYear();
  const mm     = s.targetMonth || today.getMonth() + 1;
  const dd     = today.getDate();
  // 発行日：設定モーダルの値 or 今日
  const issueDate = s.issueDate
    ? s.issueDate.replace(/-/g, '/').replace(/(\d{4})\/(\d{2})\/(\d{2})/, '$1年$2月$3日').replace(/年0/, '年').replace(/月0/, '月')
    : `${yyyy}年${mm}月${dd}日`;
  // 書類番号：設定モーダルの値 or 自動採番
  const docNum = s.docNum || num;
  // 備考：設定モーダルの値 or 引数
  const finalNote = s.note || note || '';
  const co     = MY_COMPANY;
  const compName  = co.name    || 'MIGI WORKS';
  const compAddr  = co.address || '〒150-0011 東京都渋谷区東1丁目22番11号 THE FIRST SHIBUYA3F';
  const compBank  = co.bankAccount1 || '三菱UFJ銀行(0005) 池袋支店(359) 普通 0683436\n三井住友銀行(0009) 渋谷駅前支店(234) 普通 5679825　カ)ミギナナメウエ';
  const regNo     = co.registrationNo || 'T1234567890123';
  const overRate  = contract ? contract.overRate  : 0;
  const underRate = contract ? contract.underRate : 0;
  const minH      = contract ? contract.minHours  : 140;
  const maxH      = contract ? contract.maxHours  : 180;
  const engName   = contract ? contract.engineer  : '';
  const period    = contract ? `${contract.start} 〜 ${contract.end}` : '';
  const dueDate   = `${mm===12?yyyy+1:yyyy}年${mm===12?1:mm+1}月1日`;
  const workMonth = contract
    ? `${contract.name}（${yyyy}年${mm}月分:${contract.start.slice(5,7)}/01〜${contract.end.slice(5,7)}/${new Date(yyyy,mm,0).getDate()}）`
    : item;
  const misc    = window._lastBillingCalc?.contract?.id === contract?.id ? (window._lastBillingCalc.misc||0)    : 0;
  const expense = window._lastBillingCalc?.contract?.id === contract?.id ? (window._lastBillingCalc.expense||0) : 0;
  const overH   = window._lastBillingCalc?.contract?.id === contract?.id ? Math.max(0,(window._lastBillingCalc.actualHours||0)-maxH) : 0;
  const underH  = window._lastBillingCalc?.contract?.id === contract?.id ? Math.max(0,minH-(window._lastBillingCalc.actualHours||minH)) : 0;
  const taxableBase = amount + misc;
  const taxAmt   = Math.round(taxableBase * 0.1);
  const grandTotal = taxableBase + expense + taxAmt;

  // 注文書：期間指定がある場合はそちらを優先
  const s2 = window._docIssueSettings || {};
  const orderPeriod = (s2.periodStart && s2.periodEnd)
    ? `${s2.periodStart} 〜 ${s2.periodEnd}`
    : period;
  const orderMonths = s2.periodMonths || 1;
  const orderTotalAmt = amount * orderMonths;

  if (type === '注文書') return buildOrderDoc(docNum, issueDate, client, compName, compAddr, engName, amount, orderTotalAmt, overRate, underRate, minH, maxH, orderPeriod, contract, orderMonths);
  // 見積書：期間指定がある場合はそちらを優先
  const quotePeriod  = (s2.periodStart && s2.periodEnd) ? `${s2.periodStart} 〜 ${s2.periodEnd}` : period;
  const quoteMonths  = s2.periodMonths || 1;
  const quoteTotalAmt = amount * quoteMonths;
  const quoteTax     = Math.round(quoteTotalAmt * 0.1);
  const quoteTotal   = quoteTotalAmt + quoteTax;
  const quoteItem    = quoteMonths > 1
    ? `${contract ? contract.name : item}（${quotePeriod}）`
    : item;
  if (type === '見積書') return buildQuoteDoc(docNum, issueDate, client, compName, compAddr, compBank, engName, quoteItem, quoteTotalAmt, quoteTax, quoteTotal, contract, quoteMonths, quotePeriod);
  return buildInvoiceDoc(docNum, issueDate, dueDate, regNo, client, compName, compAddr, compBank, engName, workMonth, amount, overH, overRate, underH, underRate, amount, expense, misc, taxAmt, grandTotal, period, contract);
}

// ── 御請求書 ─────────────────────────────────────────
function buildInvoiceDoc(num, issueDate, dueDate, regNo, clientName, compName, compAddr, compBank, engName, workMonth, baseAmt, overH, overRate, underH, underRate, subtotal, expense, misc, taxAmt, grandTotal, period, contract, workHoursStr) {
  const personName = document.getElementById('doc-from-person')?.value || '';
  const senderName = document.getElementById('doc-from-company')?.value || compName;
  const senderAddr = document.getElementById('doc-from-addr')?.value || compAddr;
  const minH = contract ? contract.minHours : 140;
  const maxH = contract ? contract.maxHours : 180;
  return `<div style="font-family:'Noto Sans JP',sans-serif;font-size:11px;color:#111;line-height:1.6;padding:4px;background:#fff">
<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
  <div style="font-size:11px;color:#555;line-height:1.8">
    ${escHtml(senderAddr).replace(/\n/g,'<br>')}<br>
    <strong style="color:#111;font-size:12px">${escHtml(clientName)}</strong><br>
    担当者 様
  </div>
  <div style="min-width:200px">
    <div style="display:flex"><div style="background:#222;color:#fff;font-weight:700;font-size:10px;padding:5px 10px;width:60px;text-align:center">発行日</div><div style="border:1px solid #ccc;border-left:none;padding:5px 10px;font-size:10px;flex:1">${issueDate}</div></div>
    <div style="display:flex;margin-top:2px"><div style="background:#222;color:#fff;font-weight:700;font-size:10px;padding:5px 10px;width:60px;text-align:center">登録番号</div><div style="border:1px solid #ccc;border-left:none;padding:5px 10px;font-size:10px;flex:1">${escHtml(regNo)}</div></div>
  </div>
</div>

<div style="text-align:center;font-size:22px;font-weight:700;letter-spacing:10px;margin:18px 0 20px">御　請　求　書</div>

<div style="display:flex;justify-content:flex-end;margin-bottom:14px">
  <div style="border-left:3px solid #222;padding-left:12px;font-size:10px;color:#555;line-height:1.9;text-align:right">
    <div style="font-size:11px;color:#111">${escHtml(senderAddr).replace(/\n/g,'<br>')}</div>
    <div style="font-size:13px;font-weight:700;color:#111">${escHtml(senderName)}</div>
    <div>担当: ${escHtml(personName)||'—'}</div>
    <div style="margin-top:6px;font-size:9px">【お振込み先】<br>${escHtml(compBank).replace(/\n/g,'<br>')}</div>
  </div>
</div>

<div style="font-size:10px;color:#555;margin-bottom:10px">以下の通りご請求申し上げます。<br>不明な点がございましたら、御連絡頂けますと幸いです。</div>

<table style="width:100%;border-collapse:collapse;margin-bottom:12px">
  <tr><td style="background:#333;color:#fff;font-weight:700;font-size:10px;padding:7px 12px;width:100px">御請求金額</td><td style="border:1px solid #ccc;border-left:none;padding:7px 14px;font-size:14px;font-weight:700">¥ ${grandTotal.toLocaleString()}，000 - <span style="font-size:10px;font-weight:400;margin-left:6px">（税込）</span></td></tr>
  <tr><td style="background:#333;color:#fff;font-weight:700;font-size:10px;padding:7px 12px">支払い期限</td><td style="border:1px solid #ccc;border-top:none;border-left:none;padding:7px 14px;font-size:11px;font-weight:600">${dueDate}</td></tr>
</table>

<table style="width:100%;border-collapse:collapse;margin-bottom:12px">
  <tr><td style="background:#eee;font-weight:700;font-size:10px;padding:7px 10px;width:100px;border:1px solid #ccc">技術者名</td><td style="border:1px solid #ccc;border-left:none;padding:7px 10px;font-size:11px">${escHtml(engName)}&nbsp;様</td></tr>
  <tr><td style="background:#eee;font-weight:700;font-size:10px;padding:7px 10px;border:1px solid #ccc;border-top:none">作業内容<br>（取引年月日）</td><td style="border:1px solid #ccc;border-left:none;border-top:none;padding:7px 10px;font-size:10px">${escHtml(workMonth)}</td></tr>
</table>

<table style="width:100%;border-collapse:collapse;margin-bottom:12px;font-size:10px">
  <thead><tr style="background:#333;color:#fff"><th style="padding:6px 10px;text-align:left;border:1px solid #555">項目</th><th style="padding:6px 10px;border:1px solid #555">稼働時間</th><th style="padding:6px 10px;text-align:right;border:1px solid #555">金額（税抜）</th><th style="padding:6px 10px;text-align:left;border:1px solid #555">備考</th></tr></thead>
  <tbody>
    <tr><td style="padding:6px 10px;border:1px solid #ccc">作業時間</td><td style="padding:6px 10px;border:1px solid #ccc;text-align:center">${workHoursStr || minH+' 時間 00 分'}</td><td style="padding:6px 10px;border:1px solid #ccc;text-align:right">${baseAmt.toLocaleString()}円</td><td style="padding:6px 10px;border:1px solid #ccc;color:#555">${minH} 時間 〜 ${maxH} 時間</td></tr>
    <tr><td style="padding:6px 10px;border:1px solid #ccc">超過分</td><td style="padding:6px 10px;border:1px solid #ccc;text-align:center">${overH}</td><td style="padding:6px 10px;border:1px solid #ccc;text-align:right">${overH>0?(overH*overRate).toLocaleString():0}円</td><td style="padding:6px 10px;border:1px solid #ccc;color:#555">${overRate.toLocaleString()}円/時間（${contract?.settlementUnit||15}分単位）</td></tr>
    <tr><td style="padding:6px 10px;border:1px solid #ccc">控除分</td><td style="padding:6px 10px;border:1px solid #ccc;text-align:center">${underH}</td><td style="padding:6px 10px;border:1px solid #ccc;text-align:right">${underH>0?'▲'+(underH*underRate).toLocaleString():'▲0'}円</td><td style="padding:6px 10px;border:1px solid #ccc;color:#555">${underRate.toLocaleString()}円/時間（${contract?.settlementUnit||15}分単位）</td></tr>
    <tr><td colspan="4" style="padding:4px;border:1px solid #ccc;background:#fafafa;height:20px"></td></tr>
  </tbody>
</table>

<div style="display:flex;gap:14px;align-items:flex-start">
  <div style="flex:1"><div style="font-size:10px;font-weight:700;margin-bottom:4px">備考</div><div style="border:1px solid #ccc;min-height:56px;padding:6px;font-size:10px;color:#888"></div></div>
  <table style="border-collapse:collapse;font-size:10px;min-width:190px">
    <tr><td style="background:#333;color:#fff;padding:5px 10px;font-weight:700">雑費</td><td style="border:1px solid #ccc;border-left:none;padding:5px 10px;text-align:right">¥ ${misc.toLocaleString()}</td></tr>
    <tr><td style="background:#333;color:#fff;padding:5px 10px;font-weight:700">小計（10%対象）</td><td style="border:1px solid #ccc;border-left:none;border-top:none;padding:5px 10px;text-align:right">¥ ${subtotal.toLocaleString()}</td></tr>
    <tr><td style="background:#333;color:#fff;padding:5px 10px;font-weight:700">立替経費（交通費等）(税込)</td><td style="border:1px solid #ccc;border-left:none;border-top:none;padding:5px 10px;text-align:right">¥ ${expense.toLocaleString()}</td></tr>
    <tr><td style="background:#333;color:#fff;padding:5px 10px;font-weight:700">税抜金額（10%対象）</td><td style="border:1px solid #ccc;border-left:none;border-top:none;padding:5px 10px;text-align:right">¥ ${subtotal.toLocaleString()}</td></tr>
    <tr><td style="background:#333;color:#fff;padding:5px 10px;font-weight:700">消費税（10%対象）</td><td style="border:1px solid #ccc;border-left:none;border-top:none;padding:5px 10px;text-align:right">¥ ${taxAmt.toLocaleString()}</td></tr>
    <tr><td style="background:#111;color:#fff;padding:7px 10px;font-weight:700;font-size:12px">合計</td><td style="border:1px solid #ccc;border-left:none;border-top:none;padding:7px 10px;text-align:right;font-weight:700;font-size:12px">¥${grandTotal.toLocaleString()}</td></tr>
  </table>
</div>
<div style="margin-top:12px;font-size:9px;color:#888;border-top:1px solid #eee;padding-top:6px">備考<br>1.本請求書は法定消費税を含んだ額を計上しております。</div>
</div>`;
}

// ── 発注書 ───────────────────────────────────────────
function buildOrderDoc(num, issueDate, clientName, compName, compAddr, engName, baseAmt, grandTotal, overRate, underRate, minH, maxH, period, contract, periodMonths) {
  periodMonths = periodMonths || 1;
  const personName = document.getElementById('doc-from-person')?.value || '';
  const senderName = document.getElementById('doc-from-company')?.value || compName;
  const senderAddr = document.getElementById('doc-from-addr')?.value || compAddr;
  const payCondition = contract ? `月末締め ${contract.paymentSite||55}日サイト払い` : '月末締め 55日サイト払い';
  const workContent  = contract ? contract.name : '業務委託';
  // 複数月の場合は合計金額を表示
  const contractAmt = periodMonths > 1
    ? `${period} : ${baseAmt.toLocaleString()}円（税抜）/月 × ${periodMonths}ヶ月 = ${(baseAmt * periodMonths).toLocaleString()}円（税抜）`
    : period ? `${period} : ${baseAmt.toLocaleString()}円（税抜）/月` : `${baseAmt.toLocaleString()}円（税抜）/月`;
  const settlementUnit = contract?.settlementUnit || 15;

  // 注文請書 選択オプション → inv-sender-fields に追加するためここでは生成しない
  // （showEmployeePicker側のフォームに追加する）

  return `<div style="font-family:'Noto Sans JP',sans-serif;font-size:11px;color:#111;line-height:1.6;padding:4px;background:#fff">
<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
  <div style="font-size:11px;color:#555;line-height:1.8">
    ${escHtml(senderAddr).replace(/\n/g,'<br>')}<br>
    <strong style="color:#111;font-size:12px">${escHtml(clientName)}</strong><br>
    担当者 様
  </div>
  <div style="min-width:200px">
    <div style="display:flex"><div style="background:#222;color:#fff;font-weight:700;font-size:10px;padding:5px 10px;width:54px;text-align:center">発行日</div><div style="border:1px solid #ccc;border-left:none;padding:5px 10px;font-size:10px;flex:1">${issueDate}</div></div>
    <div style="display:flex;margin-top:2px"><div style="background:#222;color:#fff;font-weight:700;font-size:10px;padding:5px 10px;width:54px;text-align:center">No.</div><div style="border:1px solid #ccc;border-left:none;padding:5px 10px;font-size:10px;flex:1">${num}</div></div>
  </div>
</div>

<div style="text-align:center;font-size:22px;font-weight:700;letter-spacing:10px;margin:18px 0 20px">発　注　書</div>

<div style="display:flex;justify-content:flex-end;margin-bottom:12px">
  <div style="border-left:3px solid #222;padding-left:12px;font-size:10px;color:#555;line-height:1.9;text-align:right">
    <div style="font-size:11px;color:#111">${escHtml(senderAddr).replace(/\n/g,'<br>')}</div>
    <div style="font-size:13px;font-weight:700;color:#111">${escHtml(senderName)}</div>
    <div>担当: ${escHtml(personName)||'—'}</div>
  </div>
</div>

<div style="font-size:10px;color:#555;margin-bottom:10px">下記の通り発注致します。<br>本書受領後7日以内に貴社のご連絡をお願い致します。<br>尚、御連絡がない場合又は本作業着手した場合は承諾頂いたものと致します。</div>

<table style="width:100%;border-collapse:collapse;margin-bottom:12px">
  <tr><td style="background:#333;color:#fff;font-weight:700;font-size:10px;padding:7px 12px;width:90px">合計金額</td><td style="border:1px solid #ccc;border-left:none;padding:7px 14px;font-size:14px;font-weight:700">¥ ${grandTotal.toLocaleString()}，000 - <span style="font-size:10px;font-weight:400;margin-left:6px">（税抜）</span></td></tr>
  <tr><td style="background:#333;color:#fff;font-weight:700;font-size:10px;padding:7px 12px">作業者</td><td style="border:1px solid #ccc;border-top:none;border-left:none;padding:7px 14px;font-size:11px;font-weight:600">${escHtml(engName)}&nbsp;様</td></tr>
</table>

<table style="width:100%;border-collapse:collapse;font-size:10px">
  <thead><tr style="background:#333;color:#fff"><th colspan="2" style="padding:7px;text-align:center;font-size:11px">契約条件</th></tr></thead>
  <tbody>
    <tr><td style="background:#eee;font-weight:700;padding:7px 12px;border:1px solid #ccc;width:120px">作業内容</td><td style="border:1px solid #ccc;border-left:none;padding:7px 12px">${escHtml(workContent)}</td></tr>
    <tr><td style="background:#eee;font-weight:700;padding:7px 12px;border:1px solid #ccc;border-top:none">契約期間</td><td style="border:1px solid #ccc;border-left:none;border-top:none;padding:7px 12px">${escHtml(period)}</td></tr>
    <tr><td style="background:#eee;font-weight:700;padding:7px 12px;border:1px solid #ccc;border-top:none">契約金額</td><td style="border:1px solid #ccc;border-left:none;border-top:none;padding:7px 12px">${escHtml(contractAmt)}</td></tr>
    <tr><td style="background:#eee;font-weight:700;padding:7px 12px;border:1px solid #ccc;border-top:none">基準時間</td><td style="border:1px solid #ccc;border-left:none;border-top:none;padding:7px 12px">${minH} 時間 〜 ${maxH} 時間</td></tr>
    <tr><td style="background:#eee;font-weight:700;padding:7px 12px;border:1px solid #ccc;border-top:none">調整単価</td><td style="border:1px solid #ccc;border-left:none;border-top:none;padding:7px 12px"><span style="margin-right:20px">控除　${underRate.toLocaleString()}円/時間</span><span>超過　${overRate.toLocaleString()}円/時間</span></td></tr>
    <tr><td style="background:#eee;font-weight:700;padding:7px 12px;border:1px solid #ccc;border-top:none">調整時間単位</td><td style="border:1px solid #ccc;border-left:none;border-top:none;padding:7px 12px">${settlementUnit}分単位</td></tr>
    <tr><td style="background:#eee;font-weight:700;padding:7px 12px;border:1px solid #ccc;border-top:none">お支払条件</td><td style="border:1px solid #ccc;border-left:none;border-top:none;padding:7px 12px">${escHtml(payCondition)}</td></tr>
    <tr><td style="background:#eee;font-weight:700;padding:7px 12px;border:1px solid #ccc;border-top:none">備考</td><td style="border:1px solid #ccc;border-left:none;border-top:none;padding:14px 12px;min-height:28px"></td></tr>
  </tbody>
</table>

<div style="margin-top:12px;font-size:9px;color:#555;line-height:1.8">
  備考<br>
  受託期間中に作業従事者に起因する理由（正当な理由なく月間3日以上の遅刻・欠勤、勤不良、スキル不良、セクハラ行為等）により、顧客先からの注意・減額・契約解除等を受けた場合や経費誤申告においては<br>
  受託料・契約期間の相当分について注意・減額・契約解除等を行います。
</div>
</div>`;
}

// ── 見積書 ───────────────────────────────────────────
function buildQuoteDoc(num, issueDate, clientName, compName, compAddr, compBank, engName, item, amount, tax, total, contract, periodMonths, periodLabel) {
  periodMonths = periodMonths || 1;
  const baseAmt = periodMonths > 1 ? Math.round(amount / periodMonths) : amount;
  const personName = document.getElementById('doc-from-person')?.value || '';
  const senderName = document.getElementById('doc-from-company')?.value || compName;
  const senderAddr = document.getElementById('doc-from-addr')?.value || compAddr;
  return `<div style="font-family:'Noto Sans JP',sans-serif;font-size:11px;color:#111;line-height:1.6;padding:4px;background:#fff">
<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
  <div style="font-size:11px;color:#555;line-height:1.8">${escHtml(senderAddr).replace(/\n/g,'<br>')}<br><strong style="color:#111;font-size:12px">${escHtml(clientName)}</strong><br>担当者 様</div>
  <div style="min-width:200px">
    <div style="display:flex"><div style="background:#222;color:#fff;font-weight:700;font-size:10px;padding:5px 10px;width:54px;text-align:center">発行日</div><div style="border:1px solid #ccc;border-left:none;padding:5px 10px;font-size:10px;flex:1">${issueDate}</div></div>
    <div style="display:flex;margin-top:2px"><div style="background:#222;color:#fff;font-weight:700;font-size:10px;padding:5px 10px;width:54px;text-align:center">No.</div><div style="border:1px solid #ccc;border-left:none;padding:5px 10px;font-size:10px;flex:1">${num}</div></div>
  </div>
</div>
<div style="text-align:center;font-size:22px;font-weight:700;letter-spacing:10px;margin:18px 0 20px">御　見　積　書</div>
<div style="display:flex;justify-content:flex-end;margin-bottom:14px">
  <div style="border-left:3px solid #222;padding-left:12px;font-size:10px;color:#555;line-height:1.9;text-align:right">
    <div style="font-size:11px;color:#111">${escHtml(senderAddr).replace(/\n/g,'<br>')}</div>
    <div style="font-size:13px;font-weight:700;color:#111">${escHtml(senderName)}</div>
    <div>担当: ${escHtml(personName)||'—'}</div>
  </div>
</div>
<table style="width:100%;border-collapse:collapse;margin-bottom:12px">
  <tr><td style="background:#333;color:#fff;font-weight:700;font-size:10px;padding:7px 12px;width:100px">お見積金額</td><td style="border:1px solid #ccc;border-left:none;padding:7px 14px;font-size:14px;font-weight:700">¥ ${total.toLocaleString()} <span style="font-size:10px;font-weight:400">（税込）</span></td></tr>
  <tr><td style="background:#333;color:#fff;font-weight:700;font-size:10px;padding:7px 12px">有効期限</td><td style="border:1px solid #ccc;border-top:none;border-left:none;padding:7px 14px;font-size:11px">発行日より1ヶ月</td></tr>
</table>
<table style="width:100%;border-collapse:collapse;font-size:10px;margin-bottom:12px">
  <thead><tr style="background:#333;color:#fff"><th style="padding:6px 10px;text-align:left;border:1px solid #555">品目</th><th style="padding:6px 10px;text-align:right;border:1px solid #555">金額（税抜）</th></tr></thead>
  <tbody>
    <tr><td style="padding:7px 10px;border:1px solid #ccc">${escHtml(item)}</td><td style="padding:7px 10px;border:1px solid #ccc;text-align:right">¥${amount.toLocaleString()}</td></tr>
    ${periodMonths > 1 ? `<tr><td style="padding:5px 10px;border:1px solid #ccc;color:#555;font-size:10px">　¥${baseAmt.toLocaleString()}/月 × ${periodMonths}ヶ月（${periodLabel}）</td><td style="padding:5px 10px;border:1px solid #ccc"></td></tr>` : ''}
    ${contract?`<tr><td style="padding:5px 10px;border:1px solid #ccc;color:#aaa;font-size:10px">　担当: ${escHtml(contract.engineer)}</td><td style="padding:5px 10px;border:1px solid #ccc"></td></tr>`:''}
  </tbody>
</table>
<div style="display:flex;justify-content:flex-end">
  <table style="border-collapse:collapse;font-size:10px">
    <tr><td style="background:#333;color:#fff;padding:5px 12px;font-weight:700">小計</td><td style="border:1px solid #ccc;border-left:none;padding:5px 12px;text-align:right">¥${amount.toLocaleString()}</td></tr>
    <tr><td style="background:#333;color:#fff;padding:5px 12px;font-weight:700">消費税10%</td><td style="border:1px solid #ccc;border-left:none;border-top:none;padding:5px 12px;text-align:right">¥${tax.toLocaleString()}</td></tr>
    <tr><td style="background:#111;color:#fff;padding:7px 12px;font-weight:700;font-size:12px">合計</td><td style="border:1px solid #ccc;border-left:none;border-top:none;padding:7px 12px;text-align:right;font-weight:700;font-size:12px">¥${total.toLocaleString()}</td></tr>
  </table>
</div>
</div>`;
}

// Keep old showDocModal as fallback for generateBillingInvoice
function showDocModal(type, contract, amount, tax, total, note) {
  showEmployeePicker(type, contract, amount, tax, total, note);
}

// ─── EMAIL SEND MODAL ────────────────────────────────
function openEmailSend() {
  openEmailSendFor('invoice-send', '', '');
}

function openEmailSendFor(templateId, engineerName, clientName) {
  const tpl = EMAIL_TEMPLATES.find(t => t.id === templateId) || EMAIL_TEMPLATES[2];
  let subject = tpl.subject.replace('{{engineer_name}}', engineerName).replace('{{client_name}}', clientName).replace('{{month}}', '2024年10月').replace('{{invoice_no}}', 'INV-2024-089');
  let body = tpl.body.replace(/{{engineer_name}}/g, engineerName).replace(/{{client_name}}/g, clientName).replace(/{{month}}/g, '2024年10月').replace(/{{deadline}}/g, '2024年10月25日').replace(/{{upload_url}}/g, 'https://app.migiworks.co.jp/upload').replace(/{{contract_end}}/g, '2024年10月31日').replace(/{{reply_url}}/g, 'https://app.migiworks.co.jp/confirm').replace(/{{invoice_no}}/g, 'INV-2024-089').replace(/{{amount}}/g, '¥715,000').replace(/{{due_date}}/g, '2024年10月31日').replace(/{{bank_info}}/g, '三菱UFJ銀行 渋谷支店 普通 1234567').replace(/{{valid_until}}/g, '2024年11月30日').replace(/{{total_amount}}/g, '¥1,320,000').replace(/{{quote_no}}/g, 'QUO-2024-021');

  document.getElementById('email-modal-body').innerHTML = `
    <div class="form-group">
      <label>テンプレート</label>
      <select class="input" onchange="switchEmailTemplate(this.value)">
        ${EMAIL_TEMPLATES.map(t=>`<option value="${t.id}" ${t.id===templateId?'selected':''}>${t.name}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label>宛先</label>
      <input class="input" value="${clientName || engineerName}">
    </div>
    <div class="form-group">
      <label>件名</label>
      <input class="input" id="email-subject-input" value="${subject}">
    </div>
    <div class="form-group">
      <label>本文</label>
      <textarea class="input" id="email-body-input" rows="14" style="font-size:12px;line-height:1.7">${body}</textarea>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost" onclick="closeModal('email-modal')">キャンセル</button>
      <button class="btn-outline" onclick="alert('下書き保存しました')">下書き保存</button>
      <button class="btn-primary" onclick="alert('メールを送信しました ✓');closeModal('email-modal')">送信する</button>
    </div>`;
  openModal('email-modal');
}

function switchEmailTemplate(id) {
  const tpl = EMAIL_TEMPLATES.find(t=>t.id===id);
  if (!tpl) return;
  document.getElementById('email-subject-input').value = tpl.subject;
  document.getElementById('email-body-input').value = tpl.body;
}

// ─── TEMPLATE EDIT MODAL ─────────────────────────────
function openTemplateEdit(idx) {
  const isNew = idx === null;
  const tpl = isNew
    ? { id:'new-'+Date.now(), name:'新しいテンプレート', icon:'📨', iconBg:'#f3f4f6', desc:'', variables:[], subject:'', body:'' }
    : JSON.parse(JSON.stringify(EMAIL_TEMPLATES[idx]));

  document.getElementById('template-modal-title').textContent = isNew ? 'テンプレート新規作成' : `テンプレート編集 — ${tpl.name}`;
  document.getElementById('template-modal-body').innerHTML = `
    <div class="form-grid">
      <div class="form-row">
        <label>テンプレート名</label>
        <input class="input" id="tpl-name" value="${escHtml(tpl.name)}">
      </div>
      <div class="form-row">
        <label>説明</label>
        <input class="input" id="tpl-desc" value="${escHtml(tpl.desc)}">
      </div>
    </div>
    <div class="form-row">
      <label>件名</label>
      <input class="input" id="tpl-subject" value="${escHtml(tpl.subject)}">
    </div>
    <div class="form-row">
      <label>本文</label>
      <textarea class="input" id="tpl-body" rows="16" style="font-size:12px;line-height:1.7">${escHtml(tpl.body)}</textarea>
    </div>
    <div class="form-row">
      <label>変数一覧（読み取り専用）</label>
      <div style="display:flex;flex-wrap:wrap;gap:5px;padding:10px;background:var(--bg);border-radius:var(--r-sm);border:1px solid var(--border)">
        ${tpl.variables.map(v=>`<span class="var-tag" style="cursor:pointer" onclick="insertVar('${v}')" title="クリックで本文に挿入">${v}</span>`).join('')}
        ${tpl.variables.length===0?'<span class="text-muted">変数なし</span>':''}
      </div>
    </div>
    <div class="modal-footer">
      ${!isNew?`<button class="btn-danger btn-sm" onclick="deleteTemplate(${idx})">削除</button>`:''}
      <button class="btn-ghost" onclick="closeModal('template-modal')">キャンセル</button>
      <button class="btn-primary" onclick="saveTemplate(${isNew?'null':idx})">保存する</button>
    </div>`;
  openModal('template-modal');
}

function insertVar(v) {
  const ta = document.getElementById('tpl-body');
  const pos = ta.selectionStart;
  ta.value = ta.value.slice(0,pos) + v + ta.value.slice(pos);
  ta.focus();
  ta.selectionStart = ta.selectionEnd = pos + v.length;
}

function saveTemplate(idx) {
  const name    = document.getElementById('tpl-name').value.trim();
  const desc    = document.getElementById('tpl-desc').value.trim();
  const subject = document.getElementById('tpl-subject').value.trim();
  const body    = document.getElementById('tpl-body').value;
  if (!name) { alert('テンプレート名を入力してください'); return; }
  if (idx === null) {
    EMAIL_TEMPLATES.push({ id:'tpl-'+Date.now(), name, desc, icon:'📨', iconBg:'#f3f4f6', variables:[], subject, body });
  } else {
    EMAIL_TEMPLATES[idx] = { ...EMAIL_TEMPLATES[idx], name, desc, subject, body };
  }
  closeModal('template-modal');
  showView('email-templates', document.querySelector('[data-view="email-templates"]'));
  alert('テンプレートを保存しました ✓');
}

function deleteTemplate(idx) {
  if (!confirm(`「${EMAIL_TEMPLATES[idx].name}」を削除しますか？`)) return;
  EMAIL_TEMPLATES.splice(idx, 1);
  closeModal('template-modal');
  showView('email-templates', document.querySelector('[data-view="email-templates"]'));
}

function previewTemplate(idx) {
  const tpl = EMAIL_TEMPLATES[idx];
  alert(`【${tpl.name}】\n件名: ${tpl.subject}\n\n${tpl.body.slice(0,200)}...`);
}

// ─── COMPANY SETTINGS VIEW ───────────────────────────
function renderCompanySettings() {
  const c = MY_COMPANY;
  const chk = (val) => val ? 'checked' : '';
  return `
<style>
.cs-section{background:var(--card);border:1px solid var(--border);border-radius:var(--r-lg);margin-bottom:18px;overflow:hidden;box-shadow:var(--shadow)}
.cs-section-title{font-size:11px;font-weight:700;color:#fff;background:var(--navy3);padding:10px 18px;letter-spacing:.5px;text-transform:uppercase;display:flex;align-items:center;gap:7px}
.cs-section-body{padding:20px 22px}
.cs-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px 20px}
.cs-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px 20px}
.cs-grid-1{display:grid;grid-template-columns:1fr;gap:12px}
.cs-field{display:flex;flex-direction:column;gap:4px}
.cs-label{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.3px}
.cs-toggle-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)}
.cs-toggle-row:last-child{border-bottom:none}
.cs-toggle-label{font-size:13px;color:var(--ink);font-weight:500}
.cs-toggle-desc{font-size:11px;color:var(--muted);margin-top:2px}
.toggle-switch{position:relative;width:40px;height:22px;flex-shrink:0}
.toggle-switch input{opacity:0;width:0;height:0}
.toggle-slider{position:absolute;inset:0;background:var(--border2);border-radius:22px;cursor:pointer;transition:.2s}
.toggle-slider:before{content:'';position:absolute;height:16px;width:16px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.toggle-switch input:checked+.toggle-slider{background:var(--acc)}
.toggle-switch input:checked+.toggle-slider:before{transform:translateX(18px)}
.cs-save-bar{position:sticky;bottom:0;background:var(--card);border-top:1px solid var(--border);padding:14px 22px;display:flex;justify-content:flex-end;gap:10px;margin:0 -0px;box-shadow:0 -2px 8px rgba(0,0,0,.06)}
.cs-seal-area{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:80px;border:1.5px dashed var(--border2);border-radius:var(--r);background:var(--bg);cursor:pointer;transition:all .15s;gap:6px;font-size:12px;color:var(--muted)}
.cs-seal-area:hover{border-color:var(--acc);color:var(--acc);background:#e0f7f0}
</style>

<!-- ① 基本情報 -->
<div class="cs-section">
  <div class="cs-section-title">
    <svg viewBox="0 0 14 14" width="13" height="13"><rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.2" fill="none"/><line x1="4" y1="5" x2="10" y2="5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="4" y1="8" x2="8" y2="8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
    基本情報
  </div>
  <div class="cs-section-body">
    <div class="cs-grid" style="margin-bottom:14px">
      <div class="cs-field">
        <div class="cs-label">会社名</div>
        <input class="input" id="cs-name" value="${escHtml(c.name)}" placeholder="株式会社〇〇">
      </div>
      <div class="cs-field">
        <div class="cs-label">登録番号</div>
        <input class="input" id="cs-reg" value="${escHtml(c.registrationNo)}" placeholder="T1234567890123">
      </div>
    </div>
    <div class="cs-grid" style="margin-bottom:14px">
      <div class="cs-field">
        <div class="cs-label">電話番号</div>
        <input class="input" id="cs-tel" value="${escHtml(c.tel)}" placeholder="03-0000-0000">
      </div>
      <div class="cs-field">
        <div class="cs-label">FAX</div>
        <input class="input" id="cs-fax" value="${escHtml(c.fax)}" placeholder="03-0000-0001">
      </div>
    </div>
    <div class="cs-grid" style="margin-bottom:14px">
      <div class="cs-field">
        <div class="cs-label">営業の連絡先</div>
        <input class="input" id="cs-sales-contact" value="${escHtml(c.salesContact)}" placeholder="sales@example.co.jp">
      </div>
      <div class="cs-field">
        <div class="cs-label">本社所在地</div>
        <input class="input" id="cs-address" value="${escHtml(c.address)}" placeholder="東京都〇〇区…">
      </div>
    </div>
    <div class="cs-grid">
      <div class="cs-field">
        <div class="cs-label">資本金</div>
        <input class="input" id="cs-capital" value="${escHtml(c.capital)}" placeholder="1,000万円">
      </div>
      <div class="cs-field">
        <div class="cs-label">設立日</div>
        <input type="date" class="input" id="cs-founded" value="${c.foundedDate}">
      </div>
    </div>
  </div>
</div>

<!-- ② 認証・担当 -->
<div class="cs-section">
  <div class="cs-section-title">
    <svg viewBox="0 0 14 14" width="13" height="13"><path d="M7 1l1.5 3 3.5.5-2.5 2.5.5 3.5L7 9l-3 1.5.5-3.5L2 4.5l3.5-.5z" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>
    認証・担当者
  </div>
  <div class="cs-section-body">
    <div class="cs-grid" style="margin-bottom:14px">
      <div class="cs-field">
        <div class="cs-label" style="margin-bottom:8px">Pマーク</div>
        <label class="toggle-switch"><input type="checkbox" id="cs-pmark" ${chk(c.pmark)}><span class="toggle-slider"></span></label>
      </div>
      <div class="cs-field">
        <div class="cs-label" style="margin-bottom:8px">ISMS認証</div>
        <label class="toggle-switch"><input type="checkbox" id="cs-isms" ${chk(c.isms)}><span class="toggle-slider"></span></label>
      </div>
    </div>
    <div class="cs-field">
      <div class="cs-label">会計担当者名</div>
      <input class="input" id="cs-account-mgr" value="${escHtml(c.accountManager)}" placeholder="担当者の氏名">
    </div>
  </div>
</div>

<!-- ③ 銀行・精算 -->
<div class="cs-section">
  <div class="cs-section-title">
    <svg viewBox="0 0 14 14" width="13" height="13"><rect x="1" y="4" width="12" height="8" rx="1.5" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M1 7h12" stroke="currentColor" stroke-width="1.2"/><circle cx="4" cy="10" r="1" fill="currentColor"/></svg>
    銀行口座・精算情報
  </div>
  <div class="cs-section-body">
    <div class="cs-grid-1">
      <div class="cs-field">
        <div class="cs-label">銀行口座 1</div>
        <input class="input" id="cs-bank1" value="${escHtml(c.bankAccount1)}" placeholder="〇〇銀行 〇〇支店 普通 0000000">
      </div>
      <div class="cs-field">
        <div class="cs-label">銀行口座 2</div>
        <input class="input" id="cs-bank2" value="${escHtml(c.bankAccount2)}" placeholder="〇〇銀行 〇〇支店 普通 0000000">
      </div>
    </div>
    <div class="cs-grid" style="margin-top:14px">
      <div class="cs-field">
        <div class="cs-label">精算単位</div>
        <select class="input" id="cs-settlement">
          ${['月','週','日','時間'].map(u=>`<option ${c.settlementUnit===u?'selected':''}>${u}</option>`).join('')}
        </select>
      </div>
      <div class="cs-field">
        <div class="cs-label">締め日</div>
        <select class="input" id="cs-closing">
          ${['1日締め','5日締め','10日締め','15日締め','20日締め','25日締め','月末締め'].map(d=>`<option ${c.closingDay===d?'selected':''}>${d}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="cs-grid" style="margin-top:14px">
      <div class="cs-field">
        <div class="cs-label">支払いサイト（日）</div>
        <input type="number" class="input" id="cs-paysite" value="${c.paymentSite}" placeholder="30">
      </div>
    </div>
  </div>
</div>

<!-- ④ メール設定 -->
<div class="cs-section">
  <div class="cs-section-title">
    <svg viewBox="0 0 14 14" width="13" height="13"><rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" stroke-width="1.2" fill="none"/><polyline points="1,3 7,8 13,3" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>
    メール設定
  </div>
  <div class="cs-section-body">
    <div class="cs-grid-1">
      <div class="cs-field">
        <div class="cs-label">CCメーリングリスト</div>
        <input class="input" id="cs-cc" value="${escHtml(c.ccMailList)}" placeholder="cc@example.co.jp, cc2@example.co.jp">
        <div class="text-muted" style="font-size:10px;margin-top:3px">カンマ区切りで複数入力可</div>
      </div>
      <div class="cs-field">
        <div class="cs-label">BCCメーリングリスト</div>
        <input class="input" id="cs-bcc" value="${escHtml(c.bccMailList)}" placeholder="bcc@example.co.jp">
      </div>
    </div>
  </div>
</div>

<!-- ⑤ 契約・帳票設定 -->
<div class="cs-section">
  <div class="cs-section-title">
    <svg viewBox="0 0 14 14" width="13" height="13"><rect x="2" y="1" width="10" height="12" rx="1.5" stroke="currentColor" stroke-width="1.2" fill="none"/><line x1="4" y1="5" x2="10" y2="5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="4" y1="8" x2="8" y2="8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
    契約・帳票設定
  </div>
  <div class="cs-section-body">
    <div class="cs-field" style="margin-bottom:14px">
      <div class="cs-label">原本送付依頼のリンクの非表示設定</div>
      <input class="input" id="cs-orig-link" value="${escHtml(c.contractCloseInfo)}" placeholder="非表示にしたいURLまたはキーワード">
    </div>
    <div class="cs-field" style="margin-bottom:14px">
      <div class="cs-label">契約締結情報</div>
      <textarea class="input" id="cs-close-info" rows="2" placeholder="電子契約サービス名、締結方法など">${escHtml(c.contractCloseInfo)}</textarea>
    </div>
    <div class="cs-field" style="margin-bottom:14px">
      <div class="cs-label">稼働表のファイル拡張子（許可する形式）</div>
      <input class="input" id="cs-ext" value="${escHtml(c.timesheetExtensions)}" placeholder=".xlsx,.xls,.pdf,.zip">
    </div>
  </div>
</div>

<!-- ⑥ 印鑑 -->
<div class="cs-section">
  <div class="cs-section-title">
    <svg viewBox="0 0 14 14" width="13" height="13"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.2" fill="none"/><circle cx="7" cy="7" r="2" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>
    印鑑
  </div>
  <div class="cs-section-body">
    <div class="cs-grid">
      <div class="cs-field">
        <div class="cs-label">個人の押印枠</div>
        <div class="cs-seal-area" onclick="alert('印鑑画像をアップロードします')">
          <svg viewBox="0 0 20 20" width="20" height="20"><path d="M10 3v10M6 7l4-4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><rect x="2" y="14" width="16" height="4" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
          クリックしてアップロード
        </div>
      </div>
      <div class="cs-field">
        <div class="cs-label">会社の印影</div>
        <div class="cs-seal-area" onclick="alert('印影画像をアップロードします')">
          <svg viewBox="0 0 20 20" width="20" height="20"><path d="M10 3v10M6 7l4-4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><rect x="2" y="14" width="16" height="4" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
          クリックしてアップロード
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ⑦ 所属先への設定 -->
<div class="cs-section">
  <div class="cs-section-title">
    <svg viewBox="0 0 14 14" width="13" height="13"><path d="M7 1C4.24 1 2 3.24 2 6c0 3.31 5 7 5 7s5-3.69 5-7c0-2.76-2.24-5-5-5z" stroke="currentColor" stroke-width="1.2" fill="none"/><circle cx="7" cy="6" r="1.5" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>
    所属先への設定
  </div>
  <div class="cs-section-body">
    <div class="cs-toggle-row">
      <div>
        <div class="cs-toggle-label">所属先への契約延長確認メールの自動送信</div>
        <div class="cs-toggle-desc">契約終了の一定期間前に、所属先へ自動でメールを送信します</div>
      </div>
      <label class="toggle-switch"><input type="checkbox" id="cs-auto-extend" ${chk(c.autoExtendMail)}><span class="toggle-slider"></span></label>
    </div>
    <div class="cs-toggle-row">
      <div>
        <div class="cs-toggle-label">契約編集時に請求書を自動削除しないようにする</div>
        <div class="cs-toggle-desc">契約内容を変更しても既存の請求書を削除しません</div>
      </div>
      <label class="toggle-switch"><input type="checkbox" id="cs-keep-invoice" ${chk(c.keepInvoiceOnDelete)}><span class="toggle-slider"></span></label>
    </div>
    <div class="cs-toggle-row">
      <div>
        <div class="cs-toggle-label">承認の必要件数</div>
        <div class="cs-toggle-desc">稼働表や請求書の承認に必要な承認者数を設定します</div>
      </div>
      <label class="toggle-switch"><input type="checkbox" id="cs-approval" ${chk(c.approvalRequired)}><span class="toggle-slider"></span></label>
    </div>
    <div class="cs-toggle-row">
      <div>
        <div class="cs-toggle-label">二段階認証を必須にする</div>
        <div class="cs-toggle-desc">チーム全員に二段階認証を強制します</div>
      </div>
      <label class="toggle-switch"><input type="checkbox" id="cs-2fa" ${chk(c.twoFactorAuth)}><span class="toggle-slider"></span></label>
    </div>
  </div>
</div>

<!-- ⑧ 営業担当者リスト -->
<div class="cs-section">
  <div class="cs-section-title">
    <svg viewBox="0 0 14 14" width="13" height="13"><circle cx="7" cy="5" r="2.5" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M2 12c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" fill="none"/></svg>
    営業担当者リスト（契約登録時に選択できます）
  </div>
  <div class="cs-section-body">
    <div style="display:flex;gap:8px;margin-bottom:12px">
      <input class="input" id="cs-sp-input" placeholder="例: 原 辰徳" style="flex:1" onkeydown="if(event.key==='Enter'){addSalesPerson();event.preventDefault()}">
      <button class="btn-primary btn-sm" onclick="addSalesPerson()">＋ 追加</button>
    </div>
    <div id="cs-sp-list" style="display:flex;flex-direction:column;gap:6px">
      ${(c.salesPersons||[]).length === 0
        ? '<div style="font-size:12px;color:var(--muted);padding:8px">まだ登録されていません</div>'
        : (c.salesPersons||[]).map((p,i) => `
          <div class="cs-sp-item" id="cssp-${i}" style="display:flex;align-items:center;gap:10px;padding:9px 12px;background:var(--bg);border:1px solid var(--border);border-radius:var(--r-sm)">
            <svg viewBox="0 0 14 14" width="13" height="13" style="color:var(--muted)"><circle cx="7" cy="5" r="2.5" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M2 12c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" fill="none"/></svg>
            <span style="flex:1;font-size:13px;font-weight:500">${escHtml(p)}</span>
            <button onclick="removeSalesPerson(${i})" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;padding:0 4px;line-height:1" title="削除">×</button>
          </div>`).join('')}
    </div>
  </div>
</div>

<div class="cs-save-bar">
  <button class="btn-ghost" onclick="showView('dashboard',document.querySelector('[data-view=dashboard]'))">キャンセル</button>
  <button class="btn-primary" onclick="saveCompanySettings()">変更を保存する</button>
</div>`;
}

function saveCompanySettings() {
  MY_COMPANY = {
    ...MY_COMPANY,
    name:               document.getElementById('cs-name')?.value || '',
    registrationNo:     document.getElementById('cs-reg')?.value || '',
    tel:                document.getElementById('cs-tel')?.value || '',
    fax:                document.getElementById('cs-fax')?.value || '',
    salesContact:       document.getElementById('cs-sales-contact')?.value || '',
    address:            document.getElementById('cs-address')?.value || '',
    capital:            document.getElementById('cs-capital')?.value || '',
    foundedDate:        document.getElementById('cs-founded')?.value || '',
    pmark:              document.getElementById('cs-pmark')?.checked || false,
    isms:               document.getElementById('cs-isms')?.checked || false,
    accountManager:     document.getElementById('cs-account-mgr')?.value || '',
    bankAccount1:       document.getElementById('cs-bank1')?.value || '',
    bankAccount2:       document.getElementById('cs-bank2')?.value || '',
    settlementUnit:     document.getElementById('cs-settlement')?.value || '月',
    closingDay:         document.getElementById('cs-closing')?.value || '月末締め',
    paymentSite:        document.getElementById('cs-paysite')?.value || '30',
    ccMailList:         document.getElementById('cs-cc')?.value || '',
    bccMailList:        document.getElementById('cs-bcc')?.value || '',
    timesheetExtensions:document.getElementById('cs-ext')?.value || '.xlsx,.xls,.pdf',
    autoExtendMail:     document.getElementById('cs-auto-extend')?.checked || false,
    keepInvoiceOnDelete:document.getElementById('cs-keep-invoice')?.checked || false,
    approvalRequired:   document.getElementById('cs-approval')?.checked || false,
    twoFactorAuth:      document.getElementById('cs-2fa')?.checked || false,
    salesPersons:       MY_COMPANY.salesPersons || [],
  };
  // Show saved toast
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:var(--navy);color:#fff;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:600;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.2);animation:modalIn .2s ease';
  toast.textContent = '✓ 自社情報を保存しました';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

function addSalesPerson() {
  const inp = document.getElementById('cs-sp-input');
  const name = inp?.value.trim();
  if (!name) return;
  if (!MY_COMPANY.salesPersons) MY_COMPANY.salesPersons = [];
  if (MY_COMPANY.salesPersons.includes(name)) {
    inp.value = '';
    return;
  }
  MY_COMPANY.salesPersons.push(name);
  inp.value = '';
  // Re-render list
  const list = document.getElementById('cs-sp-list');
  if (list) {
    list.innerHTML = MY_COMPANY.salesPersons.map((p,i) => `
      <div class="cs-sp-item" id="cssp-${i}" style="display:flex;align-items:center;gap:10px;padding:9px 12px;background:var(--bg);border:1px solid var(--border);border-radius:var(--r-sm)">
        <svg viewBox="0 0 14 14" width="13" height="13" style="color:var(--muted)"><circle cx="7" cy="5" r="2.5" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M2 12c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" fill="none"/></svg>
        <span style="flex:1;font-size:13px;font-weight:500">${escHtml(p)}</span>
        <button onclick="removeSalesPerson(${i})" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;padding:0 4px;line-height:1" title="削除">×</button>
      </div>`).join('');
  }
}

function removeSalesPerson(idx) {
  if (!MY_COMPANY.salesPersons) return;
  MY_COMPANY.salesPersons.splice(idx, 1);
  // Re-render list
  const list = document.getElementById('cs-sp-list');
  if (list) {
    list.innerHTML = MY_COMPANY.salesPersons.length === 0
      ? '<div style="font-size:12px;color:var(--muted);padding:8px">まだ登録されていません</div>'
      : MY_COMPANY.salesPersons.map((p,i) => `
          <div class="cs-sp-item" id="cssp-${i}" style="display:flex;align-items:center;gap:10px;padding:9px 12px;background:var(--bg);border:1px solid var(--border);border-radius:var(--r-sm)">
            <svg viewBox="0 0 14 14" width="13" height="13" style="color:var(--muted)"><circle cx="7" cy="5" r="2.5" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M2 12c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" fill="none"/></svg>
            <span style="flex:1;font-size:13px;font-weight:500">${escHtml(p)}</span>
            <button onclick="removeSalesPerson(${i})" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;padding:0 4px;line-height:1" title="削除">×</button>
          </div>`).join('');
  }
}

// ─── CLIENTS VIEW & MODAL ────────────────────────────
function renderClientsView() {
  return `
<div class="card">
  <div class="card-header">
    <div class="card-title">取引先一覧</div>
    <div class="card-actions">
      <button class="btn-outline btn-sm" onclick="exportClientsCSV()">
        <svg viewBox="0 0 14 14" width="12" height="12" style="margin-right:2px"><path d="M7 1v8M4 6l3 4 3-4M2 11h10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
        CSV出力
      </button>
      <button class="btn-primary btn-sm" onclick="openClientModal(null)">＋ 取引先登録</button>
    </div>
  </div>
  <div class="table-wrap">
    <table>
      <thead><tr><th>ID</th><th>会社名</th><th>契約区分</th><th>電話番号</th><th>郵便番号</th><th>住所</th><th>営業担当者</th><th>請求書送付先</th><th></th></tr></thead>
      <tbody id="clients-tbody">
        ${CLIENTS.map((cl,i) => renderClientRow(cl,i)).join('')}
      </tbody>
    </table>
  </div>
</div>`;
}

function getClientContractRoles(clientName) {
  const asUpper = CONTRACTS.some(c => c.clientUpper === clientName);
  const asLower = CONTRACTS.some(c => c.clientLower === clientName);
  if (asUpper && asLower) return '<span class="client-role-badge both">案件元・人材元</span>';
  if (asUpper) return '<span class="client-role-badge upper">案件元</span>';
  if (asLower) return '<span class="client-role-badge lower">人材元</span>';
  return '<span class="client-role-badge none">—</span>';
}

function renderClientRow(cl, i) {
  const roles = getClientContractRoles(cl.name);
  return `<tr>
    <td style="font-weight:700;color:var(--blue);font-size:11px">${cl.id}</td>
    <td><strong>${cl.name}</strong></td>
    <td>${roles}</td>
    <td>${cl.tel}</td>
    <td>${cl.zip}</td>
    <td style="font-size:11px;max-width:180px">${cl.address}</td>
    <td>${cl.salesPerson}<br><span class="text-muted">${cl.salesEmail}</span></td>
    <td style="font-size:11px">${cl.invoiceEmail}</td>
    <td class="td-actions">
      <button class="btn-outline btn-sm" onclick="openClientModal(${i})">編集</button>
      <button class="btn-ghost btn-sm" style="color:var(--coral)" onclick="deleteClient(${i})">削除</button>
    </td>
  </tr>`;
}

function exportClientsCSV() {
  const headers = ['ID','会社名','契約区分','電話番号','郵便番号','住所','営業担当者名','営業担当者メール','請求書送付先メール'];
  const rows = [headers.join(',')];
  CLIENTS.forEach(cl => {
    const role = CONTRACTS.some(c=>c.clientUpper===cl.name) && CONTRACTS.some(c=>c.clientLower===cl.name)
      ? '案件元・人材元'
      : CONTRACTS.some(c=>c.clientUpper===cl.name) ? '案件元'
      : CONTRACTS.some(c=>c.clientLower===cl.name) ? '人材元' : '—';
    const vals = [cl.id, cl.name, role, cl.tel, cl.zip, cl.address, cl.salesPerson, cl.salesEmail, cl.invoiceEmail];
    rows.push(vals.map(v => {
      const s = String(v||'');
      return s.includes(',') || s.includes('\n') || s.includes('"') ? `"${s.replace(/"/g,'""')}"` : s;
    }).join(','));
  });
  const blob = new Blob(['\uFEFF' + rows.join('\n')], {type:'text/csv;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `migi_works_clients_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function openClientModal(idx) {
  const isNew = idx === null;
  const cl = isNew ? { id:'CL-'+(String(CLIENTS.length+1).padStart(3,'0')), name:'', tel:'', zip:'', address:'', salesPerson:'', salesEmail:'', invoiceEmail:'' } : {...CLIENTS[idx]};
  const title = isNew ? '取引先 新規登録' : `取引先編集 — ${cl.name}`;

  // Re-use contract-modal for client form
  document.getElementById('contract-modal').querySelector('.modal-header h3').textContent = title;
  document.getElementById('contract-form-body').innerHTML = `
    <div class="form-grid">
      <div class="form-row"><label>会社名 *</label><input class="input" id="cl-name" value="${escHtml(cl.name)}" placeholder="株式会社〇〇"></div>
      <div class="form-row"><label>電話番号</label><input class="input" id="cl-tel" value="${escHtml(cl.tel)}" placeholder="03-0000-0000"></div>
    </div>
    <div class="form-grid">
      <div class="form-row"><label>郵便番号</label><input class="input" id="cl-zip" value="${escHtml(cl.zip)}" placeholder="000-0000"></div>
      <div class="form-row"><label>住所（本社所在地）</label><input class="input" id="cl-address" value="${escHtml(cl.address)}" placeholder="東京都〇〇区…"></div>
    </div>
    <div class="form-grid">
      <div class="form-row"><label>営業担当者名</label><input class="input" id="cl-sperson" value="${escHtml(cl.salesPerson)}" placeholder="山田 太郎"></div>
      <div class="form-row"><label>営業担当者メールアドレス</label><input class="input" id="cl-semail" type="email" value="${escHtml(cl.salesEmail)}" placeholder="yamada@example.co.jp"></div>
    </div>
    <div class="form-row"><label>請求書送付先アドレス</label><input class="input" id="cl-invoice-email" type="email" value="${escHtml(cl.invoiceEmail)}" placeholder="billing@example.co.jp"></div>
    <div class="modal-footer">
      <button class="btn-ghost" onclick="closeModal('contract-modal')">キャンセル</button>
      <button class="btn-primary" onclick="saveClient(${isNew?'null':idx})">保存する</button>
    </div>`;
  openModal('contract-modal');
}

function saveClient(idx) {
  const name = document.getElementById('cl-name').value.trim();
  if (!name) { alert('会社名を入力してください'); return; }
  const cl = {
    id: idx === null ? 'CL-'+(String(CLIENTS.length+1).padStart(3,'0')) : CLIENTS[idx].id,
    name, tel: document.getElementById('cl-tel').value,
    zip: document.getElementById('cl-zip').value,
    address: document.getElementById('cl-address').value,
    salesPerson: document.getElementById('cl-sperson').value,
    salesEmail: document.getElementById('cl-semail').value,
    invoiceEmail: document.getElementById('cl-invoice-email').value,
  };
  if (idx === null) CLIENTS.push(cl); else CLIENTS[idx] = cl;
  closeModal('contract-modal');
  showView('clients', document.querySelector('[data-view="clients"]'));
  alert('取引先を保存しました ✓');
}

function deleteClient(idx) {
  if (!confirm(`「${CLIENTS[idx].name}」を削除しますか？`)) return;
  CLIENTS.splice(idx, 1);
  showView('clients', document.querySelector('[data-view="clients"]'));
}

// ─── CONTRACT FORM (FULL) ─────────────────────────────
function openContractModal(prefill) {
  const p = prefill || {};
  document.getElementById('contract-modal').querySelector('.modal-header h3').textContent = p._id ? '契約編集' : '新規契約作成';
  document.getElementById('contract-modal').style.maxWidth = '760px';
  document.getElementById('contract-form-body').innerHTML = buildContractForm(p);
  openModal('contract-modal');
  // Auto-calc rates on load if pre-filled
  calcContractRates('upper');
  calcContractRates('lower');
}

function buildContractForm(p) {
  const clientOptions = CLIENTS.map(cl => `<option value="${cl.id}">${cl.name}</option>`).join('');
  const engineerOptions = ENGINEERS.map(e => `<option value="${e.id}">${e.name}（${e.role}）</option>`).join('');
  const contractTypes = ['精算契約','固定契約','時給契約','日給契約','営業支援契約'];

  return `
<style>
.cf-section{margin-bottom:20px}
.cf-section-title{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;padding:8px 12px;background:var(--bg);border-radius:6px;margin-bottom:12px;display:flex;align-items:center;gap:6px}
.cf-two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.cf-conditions{display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid var(--border);border-radius:var(--r);overflow:hidden;margin-bottom:16px}
.cf-cond-col{padding:16px}
.cf-cond-col:first-child{border-right:1px solid var(--border)}
.cf-cond-header{display:flex;align-items:center;justify-content:center;padding:10px;font-size:12px;font-weight:700;color:#fff;margin:-16px -16px 14px;text-align:center}
.cf-cond-upper .cf-cond-header{background:var(--acc)}
.cf-cond-lower .cf-cond-header{background:var(--navy3)}
.calc-hint{font-size:10px;color:var(--acc);font-weight:600}
.dailydiv-toggle{background:var(--card);border:1.5px dashed var(--border2);border-radius:var(--r);padding:12px 16px;margin-top:8px;cursor:pointer;display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;color:var(--navy);transition:all .12s}
.dailydiv-toggle:hover{border-color:var(--acc);color:var(--acc)}
.dailydiv-panel{display:none;margin-top:12px;border:1px solid var(--border);border-radius:var(--r);overflow:hidden}
.dailydiv-panel.open{display:block}
.dailydiv-note{background:#fff8e1;border-bottom:1px solid #ffe082;padding:8px 14px;font-size:11px;color:#8a6400}
.dailydiv-grid{display:grid;grid-template-columns:1fr 1fr;gap:0}
.dailydiv-col{padding:14px 16px}
.dailydiv-col:first-child{border-right:1px solid var(--border)}
.dailydiv-col-title{font-size:11px;font-weight:700;color:#fff;padding:8px 12px;margin:-14px -16px 12px;text-align:center}
.dailydiv-col:first-child .dailydiv-col-title{background:var(--acc)}
.dailydiv-col:last-child .dailydiv-col-title{background:var(--navy3)}
.dd-check-row{display:flex;align-items:center;gap:7px;margin-bottom:10px;font-size:12px;color:var(--muted)}
.dd-check-row input[type=checkbox]{accent-color:var(--acc)}
.hint-opt{font-size:10px;color:var(--acc);margin-left:4px;background:#e0f7f0;padding:1px 5px;border-radius:3px}
</style>

<!-- ① 基本情報 -->
<div class="cf-section">
  <div class="cf-section-title">📋 基本情報</div>
  <div class="cf-two-col">
    <div class="form-row"><label>案件名 *</label><input class="input" id="cf-jobname" placeholder="例: SCRUMシステム開発支援"></div>
    <div class="form-row"><label>作業者名（エンジニア）*</label>
      <input class="input" id="cf-engineer" placeholder="例: 岡本 和真" list="cf-engineer-list">
      <datalist id="cf-engineer-list">${ENGINEERS.map(e=>`<option value="${e.name}">`).join('')}</datalist>
    </div>
  </div>
  <div class="cf-two-col">
    <div class="form-row"><label>契約種別</label>
      <select class="input" id="cf-contract-type">
        <option>準委任契約</option><option>派遣契約</option>
      </select>
    </div>
    <div class="form-row"><label>この契約の営業担当
      <button type="button" onclick="showView('company-settings',document.querySelector('[data-view=company-settings]'));closeModal('contract-modal')" style="margin-left:6px;font-size:10px;color:var(--blue);background:none;border:none;cursor:pointer;text-decoration:underline">担当者を登録 →</button>
    </label>
      <select class="input" id="cf-sales-person">
        <option value="">— 選択してください —</option>
        ${(MY_COMPANY.salesPersons||[]).length > 0
          ? (MY_COMPANY.salesPersons||[]).map(p=>`<option value="${escHtml(p)}">${escHtml(p)}</option>`).join('')
          : '<option disabled style="color:#aaa">自社情報設定で担当者を登録してください</option>'}
      </select>
    </div>
  </div>
</div>

<!-- ② 期間 -->
<div class="cf-section">
  <div class="cf-section-title">📅 契約期間</div>
  <div class="cf-two-col">
    <div class="form-row"><label>契約開始日 *</label><input type="date" class="input" id="cf-start" value="2026-04-01"></div>
    <div class="form-row"><label>契約終了日 *</label><input type="date" class="input" id="cf-end" value="2026-09-30"></div>
  </div>
  <div class="cf-two-col">
    <div class="form-row"><label>締日</label>
      <select class="input" id="cf-closing">
        <option value="1">1日締め</option>
        <option value="5">5日締め</option>
        <option value="10">10日締め</option>
        <option value="15">15日締め</option>
        <option value="20">20日締め</option>
        <option value="25">25日締め</option>
        <option value="末日" selected>月末締め</option>
      </select>
    </div>
    <div class="form-row"><label>書類発行日</label>
      <input type="date" class="input" id="cf-issue-day">
    </div>
  </div>
</div>

<!-- ③ 会社情報 -->
<div class="cf-section">
  <div class="cf-section-title">🏢 会社情報</div>
  <div class="cf-two-col">
    <div class="form-row"><label>案件元会社（上位）*
      <button type="button" onclick="showView('clients',document.querySelector('[data-view=clients]'));closeModal('contract-modal')" style="margin-left:6px;font-size:10px;color:var(--blue);background:none;border:none;cursor:pointer;text-decoration:underline">取引先一覧で登録 →</button>
    </label>
      <select class="input" id="cf-upper-client">${clientOptions}</select>
    </div>
    <div class="form-row"><label>人材元会社（下位）*</label>
      <select class="input" id="cf-lower-client">${clientOptions}</select>
    </div>
  </div>
</div>

<!-- ④ 契約条件 -->
<div class="cf-section">
  <div class="cf-section-title">💴 契約条件</div>
  <div class="cf-conditions">
    <!-- 案件元への条件 -->
    <div class="cf-cond-col cf-cond-upper">
      <div class="cf-cond-header">案件元への契約条件</div>
      <div class="form-row"><label>契約種別</label>
        <select class="input" id="cf-upper-type" onchange="calcContractRates('upper')">
          ${contractTypes.map(t=>`<option>${t}</option>`).join('')}
        </select>
      </div>
      <div class="form-row"><label>精算単位（分）</label>
        <select class="input" id="cf-upper-unit" onchange="calcContractRates('upper')">
          <option value="60">60分（1時間単位）</option><option value="30">30分</option><option value="15">15分</option><option value="10">10分</option><option value="1">1分</option>
        </select>
      </div>
      <div class="form-row"><label>契約単価（円）</label>
        <input type="number" class="input" id="cf-upper-rate" placeholder="650000" oninput="calcContractRates('upper')">
      </div>
      <div class="form-row"><label>精算時間 下限 / 上限（時間）</label>
        <div style="display:flex;align-items:center;gap:6px">
          <input type="number" class="input" id="cf-upper-min" placeholder="140" oninput="calcContractRates('upper')" style="flex:1">
          <span style="color:var(--muted);font-size:13px">/</span>
          <input type="number" class="input" id="cf-upper-max" placeholder="180" oninput="calcContractRates('upper')" style="flex:1">
          <span style="color:var(--muted);font-size:12px">時間</span>
        </div>
      </div>
      <div class="form-row"><label>超過単価（円）<span class="calc-hint" id="upper-over-hint"></span></label>
        <input type="number" class="input" id="cf-upper-over" placeholder="自動計算" oninput="calcContractRates('upper')">
      </div>
      <div class="form-row"><label>控除単価（円）<span class="calc-hint" id="upper-under-hint"></span></label>
        <input type="number" class="input" id="cf-upper-under" placeholder="自動計算">
      </div>
      <div class="form-row"><label>支払いサイト（日）</label>
        <input type="number" class="input" id="cf-upper-site" placeholder="30">
      </div>
      <div class="form-row"><label>備考</label>
        <textarea class="input" id="cf-upper-note" rows="2" placeholder="交通費・割増など特記事項"></textarea>
      </div>
    </div>

    <!-- 人材元への条件 -->
    <div class="cf-cond-col cf-cond-lower">
      <div class="cf-cond-header" style="background:var(--navy3)">人材元への契約条件</div>
      <div class="form-row"><label>契約種別</label>
        <select class="input" id="cf-lower-type" onchange="calcContractRates('lower')">
          ${contractTypes.map(t=>`<option>${t}</option>`).join('')}
        </select>
      </div>
      <div class="form-row"><label>精算単位（分）</label>
        <select class="input" id="cf-lower-unit" onchange="calcContractRates('lower')">
          <option value="60">60分（1時間単位）</option><option value="30">30分</option><option value="15">15分</option><option value="10">10分</option><option value="1">1分</option>
        </select>
      </div>
      <div class="form-row"><label>契約単価（円）</label>
        <input type="number" class="input" id="cf-lower-rate" placeholder="600000" oninput="calcContractRates('lower')">
      </div>
      <div class="form-row"><label>精算時間 下限 / 上限（時間）</label>
        <div style="display:flex;align-items:center;gap:6px">
          <input type="number" class="input" id="cf-lower-min" placeholder="140" oninput="calcContractRates('lower')" style="flex:1">
          <span style="color:var(--muted);font-size:13px">/</span>
          <input type="number" class="input" id="cf-lower-max" placeholder="180" oninput="calcContractRates('lower')" style="flex:1">
          <span style="color:var(--muted);font-size:12px">時間</span>
        </div>
      </div>
      <div class="form-row"><label>超過単価（円）<span class="calc-hint" id="lower-over-hint"></span></label>
        <input type="number" class="input" id="cf-lower-over" placeholder="自動計算" oninput="calcContractRates('lower')">
      </div>
      <div class="form-row"><label>控除単価（円）<span class="calc-hint" id="lower-under-hint"></span></label>
        <input type="number" class="input" id="cf-lower-under" placeholder="自動計算">
      </div>
      <div class="form-row"><label>支払いサイト（日）</label>
        <input type="number" class="input" id="cf-lower-site" placeholder="30">
      </div>
      <div class="form-row"><label>備考</label>
        <textarea class="input" id="cf-lower-note" rows="2" placeholder="特記事項"></textarea>
      </div>
    </div>
  </div>

  <!-- 日割り登録 -->
  <div class="dailydiv-toggle" onclick="toggleDailyDiv()">
    <svg viewBox="0 0 14 14" width="14" height="14"><rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.3" fill="none"/><line x1="7" y1="4" x2="7" y2="10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><line x1="4" y1="7" x2="10" y2="7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
    日割りの登録をする
    <span style="font-size:10px;color:var(--muted);font-weight:400;margin-left:4px">（契約期間が1ヶ月未満の場合など）</span>
  </div>
  <div class="dailydiv-panel" id="dailydiv-panel">
    <div class="dailydiv-note">※ 契約期間が1ヶ月未満の場合、下の日割り項目には入力せず上の項目にのみ入力してください</div>
    <div class="dailydiv-grid">
      <!-- 案件元 日割り -->
      <div class="dailydiv-col">
        <div class="dailydiv-col-title">案件元への契約条件</div>
        <div class="dd-check-row">
          <input type="checkbox" id="dd-upper-start-check" onchange="toggleDDInputs('upper','start')">
          開始月を日割り計算する
        </div>
        <p style="font-size:10px;color:var(--muted);margin-bottom:10px">※日割りが必要な場合に入力してください</p>
        <div class="form-row"><label>日割り契約単価（開始月）<span class="hint-opt">任意</span></label>
          <input type="number" class="input" id="dd-upper-start-rate" placeholder="280000" disabled>
        </div>
        <div class="form-row"><label>日割り下限/上限（開始月）<span class="hint-opt">任意</span></label>
          <div style="display:flex;align-items:center;gap:6px">
            <input type="number" class="input" id="dd-upper-start-min" placeholder="80" disabled style="flex:1">
            <span style="color:var(--muted)">時間</span><span style="color:var(--muted)">/</span>
            <input type="number" class="input" id="dd-upper-start-max" placeholder="120" disabled style="flex:1">
            <span style="color:var(--muted)">時間</span>
          </div>
        </div>
        <div class="dd-check-row" style="margin-top:10px">
          <input type="checkbox" id="dd-upper-end-check" onchange="toggleDDInputs('upper','end')">
          終了月を日割り計算する
        </div>
        <p style="font-size:10px;color:var(--muted);margin-bottom:10px">※日割りが必要な場合に入力してください</p>
        <div class="form-row"><label>日割り契約単価（終了月）<span class="hint-opt">任意</span></label>
          <input type="number" class="input" id="dd-upper-end-rate" placeholder="280000" disabled>
        </div>
        <div class="form-row"><label>日割り下限/上限（終了月）<span class="hint-opt">任意</span></label>
          <div style="display:flex;align-items:center;gap:6px">
            <input type="number" class="input" id="dd-upper-end-min" placeholder="80" disabled style="flex:1">
            <span style="color:var(--muted)">時間</span><span style="color:var(--muted)">/</span>
            <input type="number" class="input" id="dd-upper-end-max" placeholder="120" disabled style="flex:1">
            <span style="color:var(--muted)">時間</span>
          </div>
        </div>
      </div>
      <!-- 人材元 日割り -->
      <div class="dailydiv-col">
        <div class="dailydiv-col-title" style="background:var(--navy3)">人材元への契約条件</div>
        <div class="dd-check-row">
          <input type="checkbox" id="dd-lower-start-check" onchange="toggleDDInputs('lower','start')">
          開始月を日割り計算する
        </div>
        <p style="font-size:10px;color:var(--muted);margin-bottom:10px">※日割りが必要な場合に入力してください</p>
        <div class="form-row"><label>日割り契約単価（開始月）<span class="hint-opt">任意</span></label>
          <input type="number" class="input" id="dd-lower-start-rate" placeholder="0" disabled>
        </div>
        <div class="form-row"><label>日割り下限/上限（開始月）<span class="hint-opt">任意</span></label>
          <div style="display:flex;align-items:center;gap:6px">
            <input type="number" class="input" id="dd-lower-start-min" placeholder="80" disabled style="flex:1">
            <span style="color:var(--muted)">時間</span><span style="color:var(--muted)">/</span>
            <input type="number" class="input" id="dd-lower-start-max" placeholder="120" disabled style="flex:1">
            <span style="color:var(--muted)">時間</span>
          </div>
        </div>
        <div class="dd-check-row" style="margin-top:10px">
          <input type="checkbox" id="dd-lower-end-check" onchange="toggleDDInputs('lower','end')">
          終了月を日割り計算する
        </div>
        <p style="font-size:10px;color:var(--muted);margin-bottom:10px">※日割りが必要な場合に入力してください</p>
        <div class="form-row"><label>日割り契約単価（終了月）<span class="hint-opt">任意</span></label>
          <input type="number" class="input" id="dd-lower-end-rate" placeholder="0" disabled>
        </div>
        <div class="form-row"><label>日割り下限/上限（終了月）<span class="hint-opt">任意</span></label>
          <div style="display:flex;align-items:center;gap:6px">
            <input type="number" class="input" id="dd-lower-end-min" placeholder="80" disabled style="flex:1">
            <span style="color:var(--muted)">時間</span><span style="color:var(--muted)">/</span>
            <input type="number" class="input" id="dd-lower-end-max" placeholder="120" disabled style="flex:1">
            <span style="color:var(--muted)">時間</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="modal-footer">
  <button class="btn-ghost" onclick="closeModal('contract-modal')">キャンセル</button>
  <button class="btn-outline" onclick="alert('下書きとして保存しました')">下書き保存</button>
  <button class="btn-primary" onclick="saveContractForm()">契約を登録する</button>
</div>`;
}

function calcContractRates(side) {
  const rate = parseFloat(document.getElementById(`cf-${side}-rate`)?.value) || 0;
  const minH = parseFloat(document.getElementById(`cf-${side}-min`)?.value) || 140;
  const maxH = parseFloat(document.getElementById(`cf-${side}-max`)?.value) || 180;
  const hintEl = document.getElementById(`${side}-over-hint`);
  const overEl = document.getElementById(`cf-${side}-over`);
  const underEl = document.getElementById(`cf-${side}-under`);
  if (!hintEl || !overEl) return;
  if (rate && minH && maxH) {
    const mid = (minH + maxH) / 2;
    const auto = Math.round(rate / mid);
    hintEl.textContent = ` → 自動: ¥${auto.toLocaleString()}/h`;
    if (!overEl.value) overEl.placeholder = String(auto);
    if (underEl && !underEl.value) underEl.placeholder = String(auto);
  } else {
    hintEl.textContent = '';
  }
}

function toggleDailyDiv() {
  document.getElementById('dailydiv-panel').classList.toggle('open');
}

function toggleDDInputs(side, period) {
  const cb = document.getElementById(`dd-${side}-${period}-check`);
  const ids = [`dd-${side}-${period}-rate`, `dd-${side}-${period}-min`, `dd-${side}-${period}-max`];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = !cb.checked;
  });
}

function saveContractForm() {
  const name = document.getElementById('cf-jobname')?.value.trim();
  if (!name) { alert('案件名を入力してください'); return; }
  alert(`契約「${name}」を登録しました ✓`);
  closeModal('contract-modal');
}

function updateCFRates() { calcContractRates('upper'); calcContractRates('lower'); }

// ─── EXTEND MODAL ────────────────────────────────────
function openExtendModal(contractId) {
  const c = CONTRACTS.find(x => x.id === contractId);
  if (!c) return;

  // Inject extend modal if not present
  if (!document.getElementById('extend-modal')) {
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="modal-overlay hidden" id="extend-modal" onclick="if(event.target===this)closeModal('extend-modal')">
        <div class="modal-card" style="width:480px">
          <div class="modal-header"><h3>契約延長</h3><button class="modal-close" onclick="closeModal('extend-modal')">✕</button></div>
          <div class="modal-body" id="extend-modal-body"></div>
        </div>
      </div>`;
    document.body.appendChild(div.firstElementChild);
  }

  document.getElementById('extend-modal-body').innerHTML = buildExtendForm(c);
  openModal('extend-modal');
  updateExtendEndDate();
}

function buildExtendForm(c) {
  return `
    <div style="background:var(--bg);border-radius:var(--r);padding:12px 14px;margin-bottom:16px;font-size:12px">
      <div style="font-weight:700;font-size:13px;margin-bottom:4px">${c.name}</div>
      <div style="color:var(--muted)">現在の契約期間: ${c.start} 〜 <strong>${c.end}</strong></div>
    </div>
    <div class="form-row">
      <label>延長期間を選択</label>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px" id="extend-preset-btns">
        ${['1ヶ月','2ヶ月','3ヶ月','6ヶ月','9ヶ月','12ヶ月'].map(m=>`
          <button type="button" class="extend-preset-btn" onclick="selectExtendPreset('${m}','${c.end}')">${m}</button>
        `).join('')}
      </div>
    </div>
    <div class="form-row">
      <label>または延長後の終了日を直接入力</label>
      <input type="date" class="input" id="extend-new-end" value="${c.end}" oninput="onExtendDateInput('${c.end}')">
    </div>
    <div id="extend-result" style="margin:12px 0"></div>
    <div class="form-row">
      <label>延長理由・備考（任意）</label>
      <textarea class="input" id="extend-note" rows="2" placeholder="例: 先方希望により延長、単価は据え置き"></textarea>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost" onclick="closeModal('extend-modal')">キャンセル</button>
      <button class="btn-primary" onclick="confirmExtend('${c.id}')">延長を確定する</button>
    </div>`;
}

function selectExtendPreset(period, currentEnd) {
  // Highlight selected
  document.querySelectorAll('.extend-preset-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');

  const months = parseInt(period);
  const d = new Date(currentEnd);
  d.setMonth(d.getMonth() + months);
  // Adjust to last day of month
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  const newEnd = lastDay.toISOString().slice(0,10);
  document.getElementById('extend-new-end').value = newEnd;
  showExtendResult(currentEnd, newEnd);
}

function onExtendDateInput(currentEnd) {
  document.querySelectorAll('.extend-preset-btn').forEach(b => b.classList.remove('active'));
  const newEnd = document.getElementById('extend-new-end').value;
  showExtendResult(currentEnd, newEnd);
}

function showExtendResult(oldEnd, newEnd) {
  if (!newEnd || newEnd <= oldEnd) {
    document.getElementById('extend-result').innerHTML = `<div style="color:var(--coral);font-size:12px">⚠ 延長後の終了日は現在の終了日より後にしてください</div>`;
    return;
  }
  const d1 = new Date(oldEnd), d2 = new Date(newEnd);
  const diffMs = d2 - d1;
  const diffDays = Math.round(diffMs / 86400000);
  const diffMonths = Math.round(diffDays / 30.44);
  document.getElementById('extend-result').innerHTML = `
    <div style="background:#e0f7f0;border-radius:var(--r);padding:12px 14px;font-size:12px">
      <div style="font-weight:700;color:var(--acc2);margin-bottom:4px">延長後の契約期間</div>
      <div>${oldEnd.replace(/-/g,'/')} 〜 <strong>${newEnd.replace(/-/g,'/')}</strong></div>
      <div style="color:var(--muted);margin-top:4px">延長期間: 約 <strong>${diffMonths}ヶ月</strong>（${diffDays}日）</div>
    </div>`;
}

function updateExtendEndDate() {}

function confirmExtend(contractId) {
  const newEnd = document.getElementById('extend-new-end').value;
  const note   = document.getElementById('extend-note').value;
  if (!newEnd) { alert('終了日を選択してください'); return; }
  const c = CONTRACTS.find(x => x.id === contractId);
  if (c) {
    c.end = newEnd;
    c.extendStatus = '延長する';
  }
  closeModal('extend-modal');
  // Re-render contracts view if active
  if (STATE.currentView === 'contracts') {
    document.getElementById('content-area').innerHTML = renderContractsView();
  }
  alert(`契約を ${newEnd} まで延長しました ✓`);
}

// ─── TEAM ─────────────────────────────────────────────
function sendInvite() {
  const email = document.getElementById('invite-email').value;
  const role = document.getElementById('invite-role').value;
  if (!email) { alert('メールアドレスを入力してください'); return; }
  alert(`${email} に招待メールを送信しました（権限: ${role}）✓`);
  closeModal('invite-modal');
}

function confirmRemove(name) {
  if (confirm(`${name} をチームから削除しますか？`)) alert(`${name} をチームから削除しました`);
}

function copyShareURL() {
  alert('https://app.migiworks.co.jp/engineers/public/abc123 をコピーしました ✓');
}

// ─── HELPERS ──────────────────────────────────────────
function statusBadge(status) {
  const map = { '有効':'<span class="badge b-green">有効</span>', '保留':'<span class="badge b-amber">保留</span>', '期限切れ':'<span class="badge b-red">期限切れ</span>', '下書き':'<span class="badge b-blue">下書き</span>', '稼働中':'<span class="badge b-green">稼働中</span>', '営業中':'<span class="badge b-blue">営業中</span>' };
  return map[status] || `<span class="badge b-gray">${status}</span>`;
}

function invStatusBadge(status) {
  const map = { '入金済':'<span class="badge b-green">入金済</span>', '未入金':'<span class="badge b-amber">未入金</span>', '滞納':'<span class="badge b-red">滞納</span>' };
  return map[status] || `<span class="badge b-gray">${status}</span>`;
}

function roleClass(role) {
  const map = { '管理者':'b-green', '営業':'b-blue', '人事':'b-amber', '閲覧のみ':'b-gray' };
  return map[role] || 'b-gray';
}

function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function shadeColor(color, percent) {
  const num = parseInt(color.replace('#',''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num>>16) + amt));
  const G = Math.min(255, Math.max(0, (num>>8&0x00FF) + amt));
  const B = Math.min(255, Math.max(0, (num&0x0000FF) + amt));
  return '#' + (0x1000000+(R<<16)+(G<<8)+B).toString(16).slice(1);
}

// ─── KEYBOARD SHORTCUTS ──────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(m => m.classList.add('hidden'));
  }
  // login on Enter
  if (e.key === 'Enter' && !document.getElementById('login-screen').classList.contains('hidden')) {
    doLogin();
  }
});
