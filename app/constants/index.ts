// 1. 과목별 색상 설정
export const subjectsColors = {
  science: "#E5D0FF",
  maths: "#FFD0D0",
  history: "#D0FFE5",
};

// 2. 목소리 설정 (괄호 오타 수정)
export const voices = {
  male: { 
    casual: "2BJW5coyhAzSr8STdHbE", 
    formal: "c6SfcYrb2t09NH" 
  },
  female: { 
    casual: "ZIlrsGI4jZqobxRKprJz", 
    formal: "sarah" 
  },
};

// 3. 최근 세션 데이터 (가장 중요한 부분!)
export const recentSessions = [
  {
    id: "1",
    subject: "science",
    name: "Neura the Brainy Explorer",
    topic: "Neural Network of the Brain",
    duration: 45,
    color: "#E5D0FF",
    // 이전 코드와 맞추기 위해 아래 항목들을 임시로 넣었습니다.
    status: "Completed",
    method: "AI Voice",
    amount: "Free"
  },
  {
    id: "2",
    subject: "maths",
    name: "Countsy",
    topic: "Derivatives & Integrals",
    duration: 30,
    color: "#FFDA6E",
    status: "Completed",
    method: "AI Voice",
    amount: "Free"
  },
  {
    id: "3",
    subject: "language",
    name: "Verba the Vocabulary Builder",
    topic: "English Literature",
    duration: 30,
    color: "#BDE7FF",
    status: "Completed",
    method: "AI Voice",
    amount: "Free"
  },
  {
    id: "4",
    subject: "coding",
    name: "Codey the Logic Hacker",
    topic: "intro to if-Else statements",
    duration: 45,
    color: "#FFC8E4",
    status: "Completed",
    method: "AI Voice",
    amount: "Free"
  },
  {
    id: "5",
    subject: "history",
    name: "Meno, the Memory Keeper",
    topic: "World Wars: Causes and Consequences",
    duration: 15,
    color: "#FFECC8",
    status: "Completed",
    method: "AI Voice",
    amount: "Free"
  },
  {
    id: "6",
    subject: "economics",
    name: "The Market Maestro",
    topic: "The Basics of Supply and Demand",
    duration: 10,
    color: "#C8FFDF",
    status: "Completed",
    method: "AI Voice",
    amount: "Free"
  },
];