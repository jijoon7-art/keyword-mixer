'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// ══════ 1. DATA (원본과 100% 동일한 데이터) ══════
const FOODS = [
  {n:"김치찌개",  e:"🍲",hard:{budget:["저예산","중예산"],place:["집","회사근처","배달"]}, t:["점심","회사근처","저예산","매콤함","든든함","배달","혼밥"],combo:"공기밥 + 계란말이 + 콩나물무침",convo:"냉장고 속 남은 재료로 만든 최고의 음식은?",tip:"라면사리 추가는 국룰! 계란말이와 함께라면 완벽해요.",c:"한식"},
  {n:"제육볶음",  e:"🥩",hard:{budget:["저예산","중예산"],place:["회사근처","외식","배달"]}, t:["점심","회사근처","저예산","매콤함","든든함"],combo:"쌈 채소 + 된장찌개 + 공기밥",convo:"오늘 하루 중 가장 매운 순간은?",tip:"쌈 채소가 신선한 집이 진짜 맛집이에요.",c:"한식"},
  {n:"비빔밥",    e:"🥗",hard:{budget:["저예산","중예산"],place:["회사근처","외식","집"]}, t:["점심","가볍게","저예산","건강","혼밥"],combo:"미역국 + 김 + 깍두기",convo:"어릴 때 엄마가 자주 해주던 음식은?",tip:"고추장은 조금씩 넣으며 간을 맞추세요.",c:"한식"},
  {n:"돼지국밥",  e:"🍜",hard:{budget:["저예산","중예산"],place:["외식","회사근처"]}, t:["아침","점심","든든함","숙취해소","저예산"],combo:"깍두기 + 부추 + 새우젓",convo:"숙취 해소에 뭐가 제일 효과적이었어?",tip:"부추를 듬뿍 넣어야 진짜 보약입니다.",c:"한식"},
  {n:"순두부찌개",e:"🍲",hard:{budget:["저예산","중예산"],place:["회사근처","외식","배달"]}, t:["점심","가볍게","저예산","건강"],combo:"공기밥 + 김치 + 멸치볶음",convo:"요즘 스트레스 받는 일이 있어?",tip:"해물 vs 차돌, 당신의 선택은?",c:"한식"},
  {n:"삼겹살",    e:"🥓",hard:{budget:["중예산","고예산"],place:["외식"]}, t:["저녁","외식","고예산","든든함","회식"],combo:"공기밥 + 된장찌개 + 냉면",convo:"지금까지 먹어본 삼겹살 집 중 최고는?",tip:"첫 점은 소금만! 고기 본연의 맛을 즐기세요.",c:"한식"},
  {n:"닭볶음탕",  e:"🍗",hard:{budget:["중예산"],place:["외식","배달"]}, t:["저녁","매콤함","든든함","배달"],combo:"공기밥 + 깻잎무침 + 볶음밥",convo:"치킨 vs 삼겹살, 딱 하나만 선택한다면?",tip:"남은 양념에 볶음밥은 필수! 당면 추가도 강추.",c:"한식"},
  {n:"된장찌개",  e:"🍲",hard:{budget:["저예산","중예산"],place:["집","회사근처"]}, t:["점심","가볍게","저예산","집","건강"],combo:"공기밥 + 두부구이 + 나물반찬",convo:"집밥과 외식, 솔직히 어느 쪽이 더 좋아?",tip:"두부와 감자를 넉넉히 넣으세요.",c:"한식"},
  {n:"냉면",      e:"🍜",hard:{budget:["저예산","중예산"],place:["외식","회사근처"]}, t:["점심","가볍게","저예산"],combo:"만두 + 수육 + 깍두기",convo:"면 요리 중 최애는?",tip:"육수는 조금 남겨서 마지막에 마무리하세요.",c:"한식"},
  {n:"갈비탕",    e:"🍖",hard:{budget:["중예산"],place:["외식","회사근처"]}, t:["점심","든든함","숙취해소","중예산"],combo:"깍두기 + 밥 말기",convo:"특별한 날 가족이랑 주로 뭘 먹어?",tip:"깍두기와 함께 먹으면 진국이에요.",c:"한식"},
  {n:"부대찌개",  e:"🍲",hard:{budget:["중예산"],place:["외식","배달"]}, t:["저녁","든든함","매콤함","중예산","회식"],combo:"공기밥 + 볶음밥(마무리)",convo:"한국 퓨전 음식 중 가장 좋아하는 건?",tip:"라면사리와 치즈를 꼭 추가하세요.",c:"한식"},
  {n:"삼계탕",    e:"🍗",hard:{budget:["중예산"],place:["외식"]}, t:["점심","든든함","건강","중예산"],combo:"깍두기 + 인삼주",convo:"여름에 보양식 먹으러 일부러 가본 적 있어?",tip:"인삼 향이 좋은 집을 찾아보세요.",c:"한식"},
  {n:"찜닭",      e:"🍗",hard:{budget:["중예산"],place:["외식","배달"]}, t:["저녁","든든함","중예산","배달","매콤함"],combo:"공기밥 + 당면 추가 + 깻잎",convo:"당면이 들어간 음식 중 가장 좋아하는 건?",tip:"당면이 양념을 흡수해서 제일 맛있어요.",c:"한식"},
  {n:"보쌈",      e:"🥬",hard:{budget:["중예산"],place:["배달","외식"]}, t:["저녁","야식","중예산","배달","든든함"],combo:"막국수 + 새우젓 + 겉절이",convo:"밤에 갑자기 땡기는 음식이 있어?",tip:"새우젓과 겉절이를 꼭 곁들이세요.",c:"한식"},
  {n:"감자탕",    e:"🍲",hard:{budget:["저예산","중예산"],place:["외식"]}, t:["저녁","야식","든든함","저예산"],combo:"공기밥 + 들깨죽(마무리)",convo:"술 한잔 하면서 먹기 좋은 음식은?",tip:"들깨가루를 넣으면 더 진해집니다.",c:"한식"},
  {n:"해장국",    e:"🍲",hard:{budget:["저예산","중예산"],place:["외식","회사근처"]}, t:["아침","숙취해소","저예산","든든함"],combo:"공기밥 + 깍두기",convo:"숙취에 가장 효과적인 음식이 뭔지 알아?",tip:"콩나물 vs 뼈해장국, 어느 쪽이 더 땡겨요?",c:"한식"},
  {n:"닭갈비",    e:"🍗",hard:{budget:["중예산"],place:["외식"]}, t:["저녁","매콤함","중예산","외식","회식"],combo:"사리 추가 + 쌈 채소 + 치즈",convo:"춘천 vs 서울 닭갈비, 차이 느낀 적 있어?",tip:"치즈 추가하면 완전 다른 요리가 돼요.",c:"한식"},
  {n:"곱창",      e:"🥩",hard:{budget:["고예산"],place:["외식"]}, t:["저녁","야식","고예산","외식","매콤함","회식"],combo:"볶음밥(마무리) + 소주 + 콩나물국밥",convo:"처음 곱창 먹었을 때 반응이 어땠어?",tip:"콩나물 국밥으로 마무리하면 완벽!",c:"한식"},
  {n:"갈비구이",  e:"🍖",hard:{budget:["고예산"],place:["외식"]}, t:["저녁","데이트","고예산","외식","든든함"],combo:"냉면 + 된장찌개 + 쌈 채소",convo:"데이트에서 가장 인상 깊었던 식사는?",tip:"불맛이 제대로 밴 집을 찾아보세요.",c:"한식"},
  {n:"쭈꾸미볶음",e:"🦑",hard:{budget:["중예산"],place:["외식","회사근처"]}, t:["점심","저녁","매콤함","중예산"],combo:"공기밥 + 계란후라이 + 깻잎",convo:"매운 음식 vs 단 음식, 하나만 선택한다면?",tip:"계란후라이 올리면 완성이에요!",c:"한식"},
  {n:"순대국밥",  e:"🍲",hard:{budget:["저예산"],place:["외식","회사근처"]}, t:["아침","점심","든든함","저예산","숙취해소"],combo:"깍두기 + 새우젓 + 부추",convo:"국밥 종류 중에서 가장 자주 먹는 건?",tip:"새우젓과 깍두기는 필수!",c:"한식"},
  {n:"만두",      e:"🥟",hard:{budget:["저예산"],place:["외식","회사근처","배달","집"]}, t:["간식","점심","저예산","빠름","혼밥"],combo:"만둣국 + 김치",convo:"군만두랑 찐만두 중 어느 걸 더 좋아해?",tip:"군만두는 바삭하게, 찐만두는 촉촉하게!",c:"한식"},
  {n:"볶음밥",    e:"🍚",hard:{budget:["저예산","중예산"],place:["집","배달","회사근처"]}, t:["점심","빠름","저예산","든든함","배달","혼밥"],combo:"계란국 + 단무지",convo:"냉장고 털이 요리로 뭘 자주 만들어?",tip:"파 듬뿍 + 센 불 + 계란 마지막 투하!",c:"중식"},
  {n:"국수",      e:"🍜",hard:{budget:["저예산"],place:["집","회사근처"]}, t:["점심","가볍게","저예산","빠름","혼밥"],combo:"김치 + 부침개",convo:"잔치 vs 비빔 vs 열무 국수, 최애는?",tip:"파와 달걀을 올리면 더 맛있어요.",c:"한식"},
  {n:"해물파전",  e:"🥞",hard:{budget:["중예산"],place:["외식"]}, t:["저녁","야식","매콤함","외식"],combo:"막걸리 + 오이무침",convo:"비 오는 날 제일 먹고 싶은 음식은?",tip:"막걸리와 함께라면 더욱 맛있어요.",c:"한식"},
  {n:"초밥",      e:"🍣",hard:{budget:["중예산","고예산"],place:["외식"]}, t:["점심","저녁","데이트","중예산","가볍게"],combo:"된장국 + 차완무시",convo:"가장 좋아하는 초밥 재료는?",tip:"흰살 생선부터 붉은 살 순서로 드세요.",c:"일식"},
  {n:"돈카츠",    e:"🍱",hard:{budget:["중예산"],place:["외식","회사근처"]}, t:["점심","혼밥","중예산","든든함","회사근처"],combo:"된장국 + 양배추샐러드",convo:"돈카츠 소스 vs 소금+와사비?",tip:"와사비나 소금을 살짝 얹어 드셔보세요.",c:"일식"},
  {n:"라멘",      e:"🍜",hard:{budget:["중예산"],place:["외식","회사근처"]}, t:["점심","야식","든든함","중예산"],combo:"교자 + 계란 추가",convo:"쇼유 vs 시오 vs 미소 라멘?",tip:"차슈나 아지타마고 추가 추천!",c:"일식"},
  {n:"우동",      e:"🍜",hard:{budget:["저예산","중예산"],place:["외식","회사근처"]}, t:["점심","가볍게","저예산","아침","혼밥"],combo:"튀김 + 오니기리",convo:"우동 국물이 진한 집 vs 맑은 집?",tip:"따뜻한 국물이 그리울 때 최고!",c:"일식"},
  {n:"연어덮밥",  e:"🍣",hard:{budget:["중예산"],place:["외식","회사근처"]}, t:["점심","데이트","중예산","가볍게"],combo:"된장국 + 절임채소",convo:"날것으로 먹는 음식 중 가장 좋아하는 건?",tip:"와사비를 조금 섞어 먹으면 맛있어요.",c:"일식"},
  {n:"샤브샤브",  e:"🥘",hard:{budget:["고예산"],place:["외식"]}, t:["저녁","데이트","고예산","외식","가볍게"],combo:"죽(마무리) + 폰즈소스",convo:"식사 중에 대화를 가장 많이 하는 때는?",tip:"채소를 충분히 먹어야 진정한 샤브샤브!",c:"일식"},
  {n:"규동",      e:"🍚",hard:{budget:["저예산","중예산"],place:["외식","회사근처"]}, t:["점심","빠름","저예산","든든함","혼밥"],combo:"된장국 + 생강 초절임",convo:"빠르게 때워야 할 때 제일 먼저 생각나는 음식은?",tip:"생강 초절임을 곁들이면 환상이에요.",c:"일식"},
  {n:"마라탕",    e:"🥘",hard:{budget:["중예산"],place:["외식"]}, t:["점심","저녁","매콤함","중예산"],combo:"탕후루 + 과일주스",convo:"마라 향 처음 맡았을 때 어떤 반응이었어?",tip:"옥수수면과 푸주는 필수!",c:"중식"},
  {n:"짜장면",    e:"🍝",hard:{budget:["저예산","중예산"],place:["배달","외식"]}, t:["점심","저예산","빠름","배달"],combo:"탕수육 + 단무지",convo:"중국집 단골집이 있어?",tip:"탕수육은 부먹 vs 찍먹, 당신의 답은?",c:"중식"},
  {n:"짬뽕",      e:"🍜",hard:{budget:["저예산","중예산"],place:["배달","외식"]}, t:["점심","매콤함","저예산","배달","숙취해소"],combo:"공기밥 + 단무지",convo:"짬뽕이냐 짜장이냐 결정할 때 기준이 뭐야?",tip:"불맛이 강한 집이 진짜 맛있어요.",c:"중식"},
  {n:"탕수육",    e:"🍖",hard:{budget:["중예산"],place:["배달","외식"]}, t:["저녁","든든함","중예산","배달"],combo:"짜장 or 짬뽕 + 단무지",convo:"부먹파야 찍먹파야?",tip:"소스 따로 받아서 자기 취향대로!",c:"중식"},
  {n:"양꼬치",    e:"🍢",hard:{budget:["중예산"],place:["외식"]}, t:["저녁","야식","매콤함","중예산","외식","회식"],combo:"볶음밥 + 양꼬치 소스",convo:"중국 요리 중 아직 못 먹어본 것이 있어?",tip:"쿠민 향이 풍부한 집이 진짜예요.",c:"중식"},
  {n:"치즈버거",  e:"🍔",hard:{budget:["저예산","중예산"],place:["외식","배달"]}, t:["점심","야식","빠름","저예산","혼밥"],combo:"감자튀김 + 콜라",convo:"패스트푸드 중에서 가장 자주 먹는 건?",tip:"감자튀김 대신 어니언링 어떠세요?",c:"양식"},
  {n:"파스타",    e:"🍝",hard:{budget:["중예산","고예산"],place:["외식"]}, t:["저녁","데이트","분위기","중예산"],combo:"샐러드 + 와인",convo:"이탈리아 요리 중 가장 좋아하는 게 뭐야?",tip:"와인 한 잔 곁들이면 분위기가 살아요.",c:"양식"},
  {n:"스테이크",  e:"🥩",hard:{budget:["고예산"],place:["외식"]}, t:["저녁","데이트","고예산","분위기"],combo:"감자퓨레 + 레드와인",convo:"완벽한 저녁 식사를 상상한다면?",tip:"미디엄 레어 정도를 추천해요.",c:"양식"},
  {n:"피자",      e:"🍕",hard:{budget:["중예산"],place:["배달","외식"]}, t:["저녁","야식","배달","중예산"],combo:"콜라 + 갈릭디핑",convo:"피자 토핑 중 절대 안 되는 건 뭐야?",tip:"갈릭 디핑 소스 듬뿍 준비하세요.",c:"양식"},
  {n:"샌드위치",  e:"🥪",hard:{budget:["저예산","중예산"],place:["외식","회사근처","집"]}, t:["아침","점심","빠름","가볍게","저예산","혼밥"],combo:"아메리카노 + 과일",convo:"아침을 항상 먹는 편이야?",tip:"빵은 구운 것이 훨씬 맛있어요.",c:"양식"},
  {n:"오므라이스",e:"🍳",hard:{budget:["중예산"],place:["외식","회사근처"]}, t:["점심","혼밥","중예산","가볍게"],combo:"콘수프 + 샐러드",convo:"달걀 요리 중에서 가장 자주 해 먹는 건?",tip:"계란은 반숙이 베스트!",c:"양식"},
  {n:"카레라이스",e:"🍛",hard:{budget:["저예산","중예산"],place:["집","배달","회사근처"]}, t:["점심","저예산","빠름","든든함","혼밥","배달"],combo:"나무 피클 + 복숭아주스",convo:"집에서 카레 끓일 때 꼭 넣는 재료가 있어?",tip:"다음날이 더 맛있는 음식!",c:"양식"},
  {n:"치킨",      e:"🍗",hard:{budget:["중예산"],place:["배달","외식"]}, t:["야식","저녁","배달","중예산","든든함"],combo:"맥주 or 콜라 + 치킨무",convo:"치킨 주문할 때 가장 먼저 결정하는 건 뭐야?",tip:"후라이드 vs 양념, 오늘의 선택은?",c:"치킨"},
  {n:"떡볶이",    e:"🌶️",hard:{budget:["저예산"],place:["외식","회사근처"]}, t:["간식","저예산","매콤함","빠름"],combo:"순대 + 튀김 + 어묵국물",convo:"분식집에서 꼭 같이 먹는 조합이 있어?",tip:"튀김은 꼭 국물에 찍먹하세요!",c:"분식"},
  {n:"족발",      e:"🦵",hard:{budget:["중예산"],place:["배달","외식"]}, t:["야식","든든함","중예산","외식","배달"],combo:"막국수 + 새우젓 + 겉절이",convo:"야식으로 주문할 때 제일 고민되는 건?",tip:"막국수와 함께 싸 먹으면 환상이에요.",c:"분식"},
  {n:"쌀국수",    e:"🍜",hard:{budget:["저예산","중예산"],place:["외식","회사근처"]}, t:["점심","가볍게","저예산","숙취해소","혼밥"],combo:"스프링롤 + 베트남커피",convo:"베트남 음식 중 가장 좋아하는 게 뭐야?",tip:"고수 한번 도전해 보셨나요?",c:"아시안"},
  {n:"팟타이",    e:"🍜",hard:{budget:["중예산"],place:["외식"]}, t:["점심","저녁","중예산","가볍게"],combo:"똠양꿍 + 망고스무디",convo:"태국 여행 가면 꼭 먹고 싶은 음식이 있어?",tip:"라임즙을 뿌리면 풍미가 올라가요.",c:"아시안"}
];

const W = {mood:5, budget:4, time:3, place:2};

export default function FoodWorldCupPage() {
  const [screen, setScreen] = useState('home');
  const [toast, setToast] = useState<string | null>(null);
  
  // Storage & History States
  const [history, setHistory] = useState<any[]>([]);
  const [prefs, setPrefs] = useState({ tags: {}, wins: {}, dislikes: {} } as any);
  
  // Setup States
  const [setup, setSetup] = useState({ budget: '', place: '', time: '', mood: '' } as any);
  
  // Tournament States
  const [matches, setMatches] = useState<any[]>([]);
  const [nextRound, setNextRound] = useState<any[]>([]);
  const [currentMatchIdx, setCurrentMatchIdx] = useState(0);
  const [roundLabel, setRoundLabel] = useState('16강');
  const [top4, setTop4] = useState<any[]>([]);
  
  // Result States
  const [winner, setWinner] = useState<any>(null);
  const [aiList, setAiList] = useState<any[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    // Load local storage data on mount
    const savedPrefs = JSON.parse(localStorage.getItem('fwc_prefs_v3') || '{"tags":{},"wins":{},"dislikes":{}}');
    const savedHist = JSON.parse(localStorage.getItem('fwc_hist_v3') || '[]');
    setPrefs(savedPrefs);
    setHistory(savedHist);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // ══════ CORE LOGIC ══════
  const shuffle = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

  const filterAndScore = () => {
    // Hard filter
    let list = FOODS.filter(f => {
      if (setup.budget && setup.budget !== 'any' && !f.hard.budget.includes(setup.budget)) return false;
      if (setup.place && setup.place !== 'any' && !f.hard.place.includes(setup.place)) return false;
      return true;
    });

    if (list.length < 16) {
      const extra = shuffle(FOODS.filter(f => !list.includes(f))).slice(0, 16 - list.length);
      list = [...list, ...extra];
    }

    // Score
    list = list.map(f => {
      let score = 0;
      if (setup.time && f.t.includes(setup.time)) score += W.time;
      if (setup.mood && f.t.includes(setup.mood)) score += W.mood;
      if (setup.budget && f.t.includes(setup.budget) && setup.budget !== 'any') score += W.budget;
      if (setup.place && f.hard.place.includes(setup.place) && setup.place !== 'any') score += W.place;
      
      // Personal preference bonus
      if (prefs.tags[setup.time] && f.t.includes(setup.time)) score += 1;
      if (prefs.tags[setup.mood] && f.t.includes(setup.mood)) score += 1;
      
      return { ...f, _score: score };
    });

    list.sort((a, b) => b._score - a._score);
    return list;
  };

  // ══════ ACTIONS ══════
  const startQuick = () => {
    const shuffled = shuffle(FOODS).slice(0, 16);
    initTournament(shuffled);
  };

  const startSetup = () => {
    const list = filterAndScore().slice(0, 16);
    initTournament(shuffle(list));
  };

  const initTournament = (list: any[]) => {
    setMatches(list);
    setNextRound([]);
    setCurrentMatchIdx(0);
    setRoundLabel('16강');
    setTop4([]);
    setIsConfirmed(false);
    setScreen('tour');
  };

  const aiInstant = () => {
    const list = filterAndScore();
    setAiList(list.slice(0, 3));
    setScreen('ai');
  };

  const selectFood = (food: any) => {
    const newNextRound = [...nextRound, food];
    
    // Check if round is over
    if (currentMatchIdx + 2 >= matches.length) {
      if (newNextRound.length === 1) {
        // Winner determined
        setWinner(newNextRound[0]);
        setScreen('result');
      } else {
        // Next round setup
        if (newNextRound.length === 2) setTop4([...top4, ...newNextRound]);
        setMatches(newNextRound);
        setNextRound([]);
        setCurrentMatchIdx(0);
        setRoundLabel(newNextRound.length === 8 ? '8강' : newNextRound.length === 4 ? '4강' : '결승');
      }
    } else {
      setNextRound(newNextRound);
      setCurrentMatchIdx(currentMatchIdx + 2);
    }
  };

  const skipMatch = () => {
    // Randomly pick one
    const randomPick = matches[currentMatchIdx + (Math.random() < 0.5 ? 0 : 1)];
    selectFood(randomPick);
  };

  const confirmDecision = (foodToConfirm: any = winner) => {
    setIsConfirmed(true);
    
    // Save Wins
    const newWins = { ...prefs.wins, [foodToConfirm.n]: (prefs.wins[foodToConfirm.n] || 0) + 1 };
    
    // Save Tags
    const newTags = { ...prefs.tags };
    ['time', 'mood', 'budget', 'place'].forEach(k => {
      const v = setup[k];
      if (v && v !== 'any') newTags[v] = (newTags[v] || 0) + 1;
    });
    
    const newPrefs = { ...prefs, wins: newWins, tags: newTags };
    setPrefs(newPrefs);
    localStorage.setItem('fwc_prefs_v3', JSON.stringify(newPrefs));

    // Save History
    const today = new Date().toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    if (!history.find(x => x.w === foodToConfirm.n && x.d === today)) {
      const newHist = [...history, { w: foodToConfirm.n, e: foodToConfirm.e, d: today }].slice(-20);
      setHistory(newHist);
      localStorage.setItem('fwc_hist_v3', JSON.stringify(newHist));
    }
    
    showToast('메뉴가 저장되었어요!');
  };

  const handleShare = () => {
    const text = `오늘 뭐 먹지? AI의 추천!\n결과: ${winner.e} ${winner.n}\n\n도전해보세요: https://keyword-mixer.vercel.app/food-worldcup`;
    if (navigator.share) {
      navigator.share({ title: '음식 월드컵', text }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => showToast('📋 결과가 복사됐어요!'));
    }
  };

  // ══════ RENDERERS ══════
  const renderHome = () => (
    <div className="bg-[#F7F6F2] min-h-[calc(100vh-80px)] text-[#1C1C1A]">
      <div className="bg-white p-7 border-b border-gray-200 text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 bg-[#FFF1EB] text-[#E85D2F] border border-[#E85D2F]/30 rounded-full px-3 py-1 text-xs font-bold mb-3">
          🍽️ 음식 결정기 v3
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-2">오늘 <span className="text-[#E85D2F]">뭐먹지?</span></h1>
        <p className="text-sm text-gray-500">AI 즉시 추천 · 맞춤 월드컵 · 취향 분석</p>
      </div>

      <div className="mx-5 mt-5">
        <div onClick={aiInstant} className="bg-[#1C1C1A] rounded-2xl p-6 cursor-pointer relative overflow-hidden hover:-translate-y-1 transition shadow-lg group">
          <div className="absolute -top-5 -right-5 w-28 h-28 bg-[#E85D2F]/30 rounded-full blur-xl group-hover:bg-[#E85D2F]/50 transition"></div>
          <div className="text-[11px] font-medium tracking-wide text-white/50 uppercase mb-2">AI 즉시 추천</div>
          <div className="text-2xl font-black text-white leading-tight">지금 바로<br/>결정해줘 ⚡</div>
          <div className="text-xs text-white/55 mt-1">조건 없이 · 1초 완성</div>
          <div className="mt-4 inline-flex items-center gap-1.5 bg-[#E85D2F] text-white rounded-lg px-4 py-2 text-sm font-bold shadow-md">
            지금 추천받기 →
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mx-5 mt-4">
        <div onClick={startQuick} className="bg-white border-2 border-gray-100 rounded-2xl p-5 text-center cursor-pointer hover:border-[#E85D2F] hover:shadow-md transition">
          <div className="text-3xl mb-2">🎲</div>
          <div className="text-sm font-bold">빠른 월드컵</div>
          <div className="text-[11px] text-gray-500 mt-1">16강 랜덤 매치</div>
        </div>
        <div onClick={() => setScreen('setup')} className="bg-white border-2 border-gray-100 rounded-2xl p-5 text-center cursor-pointer hover:border-[#E85D2F] hover:shadow-md transition">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-sm font-bold">상황 설정</div>
          <div className="text-[11px] text-gray-500 mt-1">조건 맞춤 추천</div>
        </div>
      </div>

      {history.length > 0 && (
        <div className="mx-5 mt-6 mb-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">최근 결정 히스토리</h3>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {history.map((h, i) => (
              <div key={i} className="flex justify-between items-center p-3 border-b border-gray-100 last:border-0 text-sm">
                <span className="font-medium">{h.e} {h.w}</span>
                <span className="text-xs text-gray-400">{h.d}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSetup = () => {
    const OptionBtn = ({ g, v, label, hard = false }: any) => {
      const isSel = setup[g] === v;
      return (
        <button
          onClick={() => setSetup({ ...setup, [g]: isSel ? '' : v })}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2
            ${isSel ? 'bg-[#E85D2F] border-[#E85D2F] text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-[#E85D2F]'}`}
        >
          {label}
        </button>
      );
    };

    return (
      <div className="bg-[#F7F6F2] min-h-[calc(100vh-80px)] text-[#1C1C1A]">
        <div className="bg-white p-4 border-b border-gray-200 flex items-center gap-3 sticky top-0 z-10">
          <button onClick={() => setScreen('home')} className="text-gray-500 border border-gray-200 rounded-md px-3 py-1 text-xs font-medium">← 뒤로</button>
          <span className="font-bold text-lg">상황 설정</span>
        </div>
        
        <div className="p-5 space-y-6">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">예산 <span className="text-[#E85D2F] ml-1">(필수)</span></div>
            <div className="flex flex-wrap gap-2">
              <OptionBtn g="budget" v="저예산" label="1만원 이하" hard />
              <OptionBtn g="budget" v="중예산" label="1~2만원" hard />
              <OptionBtn g="budget" v="고예산" label="2만원+" hard />
              <OptionBtn g="budget" v="any" label="상관없음" hard />
            </div>
          </div>
          
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">장소 <span className="text-[#E85D2F] ml-1">(필수)</span></div>
            <div className="flex flex-wrap gap-2">
              <OptionBtn g="place" v="배달" label="배달" hard />
              <OptionBtn g="place" v="회사근처" label="회사 근처" hard />
              <OptionBtn g="place" v="외식" label="외식" hard />
              <OptionBtn g="place" v="집" label="집" hard />
              <OptionBtn g="place" v="any" label="상관없음" hard />
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">지금 몇 시?</div>
            <div className="flex flex-wrap gap-2">
              <OptionBtn g="time" v="아침" label="아침" />
              <OptionBtn g="time" v="점심" label="점심" />
              <OptionBtn g="time" v="저녁" label="저녁" />
              <OptionBtn g="time" v="야식" label="야식" />
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">컨디션 / 무드</div>
            <div className="flex flex-wrap gap-2">
              <OptionBtn g="mood" v="매콤함" label="매운 거 땡겨" />
              <OptionBtn g="mood" v="든든함" label="든든하게" />
              <OptionBtn g="mood" v="가볍게" label="가볍게" />
              <OptionBtn g="mood" v="숙취해소" label="숙취 해소" />
              <OptionBtn g="mood" v="혼밥" label="혼밥" />
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <button onClick={startSetup} className="w-full bg-[#E85D2F] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-orange-600 transition">
              이 조건으로 월드컵 시작 →
            </button>
            <button onClick={aiInstant} className="w-full bg-white text-gray-800 font-bold py-4 rounded-xl border-2 border-gray-200 hover:border-[#E85D2F] hover:text-[#E85D2F] transition">
              AI가 바로 추천해줘 ⚡
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTour = () => {
    const f1 = matches[currentMatchIdx];
    const f2 = matches[currentMatchIdx + 1];
    const progress = (currentMatchIdx / matches.length) * 100;

    return (
      <div className="bg-[#F7F6F2] min-h-[calc(100vh-80px)] text-[#1C1C1A]">
        <div className="bg-white p-4 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div className="bg-[#E85D2F] text-white px-4 py-1 rounded-full text-xs font-bold">{roundLabel}</div>
            <button onClick={() => { if(confirm('종료할까요?')) setScreen('home') }} className="text-gray-500 border border-gray-200 rounded-md px-3 py-1 text-xs font-medium hover:bg-gray-50">종료</button>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#E85D2F] transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="text-right text-[10px] text-gray-400 mt-1">{currentMatchIdx / 2 + 1} / {matches.length / 2}</div>
        </div>

        <div className="p-5">
          <div className="text-center text-sm text-gray-500 mb-4">더 먹고 싶은 메뉴를 선택하세요</div>
          <div className="grid grid-cols-2 gap-4">
            {[f1, f2].map((food, idx) => food && (
              <div key={idx} onClick={() => selectFood(food)} className="bg-white border-2 border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#E85D2F] hover:-translate-y-1 hover:shadow-xl transition select-none active:scale-95 min-h-[180px]">
                <div className="text-5xl drop-shadow-sm">{food.e}</div>
                <div className="font-bold text-lg text-[#1C1C1A] tracking-tight">{food.n}</div>
                <div className="flex flex-wrap justify-center gap-1 mt-1">
                  {food.t.slice(0, 2).map((tag: string, i: number) => (
                    <span key={i} className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-[10px]">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <button onClick={skipMatch} className="text-gray-400 border border-gray-200 rounded-full px-5 py-2 text-xs font-medium hover:text-gray-600 hover:border-gray-300 transition">
              둘 다 별로 — 건너뛰기
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderResult = () => (
    <div className="bg-[#F7F6F2] min-h-[calc(100vh-80px)] text-[#1C1C1A] pb-10">
      {isConfirmed && <div className="bg-[#2E7D5A] text-white py-3 text-center text-sm font-medium sticky top-0 z-20">✅ 오늘 메뉴 확정됨!</div>}
      
      <div className="bg-white p-8 border-b border-gray-200 text-center relative">
        <div className="inline-flex items-center gap-1.5 bg-[#FFF8E6] text-[#B8860B] border border-[#B8860B]/20 rounded-full px-4 py-1 text-xs font-bold mb-4">
          🏆 오늘의 우승 메뉴
        </div>
        <div className="text-7xl mb-3 drop-shadow-md">{winner.e}</div>
        <h2 className="text-4xl font-black tracking-tight mb-3">{winner.n}</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {winner.t.map((tag: string, i: number) => (
            <span key={i} className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-medium">{tag}</span>
          ))}
        </div>
      </div>

      <div className="mx-5 mt-5 space-y-3">
        <div className="bg-[#FFF1EB] border border-[#E85D2F]/20 rounded-xl p-4">
          <div className="text-[11px] font-bold text-[#E85D2F] uppercase tracking-wide mb-1">먹는 팁</div>
          <div className="text-sm font-medium leading-relaxed">{winner.tip}</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">🤝 찰떡궁합 조합</div>
          <div className="text-sm text-gray-800">{winner.combo}</div>
        </div>

        <div className="bg-[#EBF3FD] border border-[#1A5FA8]/20 rounded-xl p-4">
          <div className="text-[11px] font-bold text-[#1A5FA8] uppercase tracking-wide mb-1">💬 먹으면서 꺼내기 좋은 질문</div>
          <div className="text-sm text-gray-800">{winner.convo}</div>
        </div>
      </div>

      <div className="mx-5 mt-6">
        {!isConfirmed ? (
          <button onClick={() => confirmDecision()} className="w-full bg-[#2E7D5A] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-emerald-700 transition flex justify-center items-center gap-2">
            ✅ 이걸로 결정하기
          </button>
        ) : (
          <div className="bg-[#EDF7F2] border border-[#2E7D5A]/20 rounded-xl p-4 text-center">
            <div className="font-bold text-[#2E7D5A] mb-1">오늘 메뉴 확정! 🎉</div>
            <div className="text-xs text-gray-500">결정 기록에 저장됐어요</div>
          </div>
        )}
      </div>

      <div className="mx-5 mt-6 grid grid-cols-2 gap-3">
        <button onClick={startQuick} className="bg-white border border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:border-[#E85D2F] hover:text-[#E85D2F] transition text-sm">
          다시 하기
        </button>
        <button onClick={handleShare} className="bg-[#E85D2F] text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-orange-600 transition text-sm">
          공유하기 📤
        </button>
      </div>
    </div>
  );

  const renderAi = () => (
    <div className="bg-[#F7F6F2] min-h-[calc(100vh-80px)] text-[#1C1C1A]">
      <div className="bg-white p-4 border-b border-gray-200 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => setScreen('home')} className="text-gray-500 border border-gray-200 rounded-md px-3 py-1 text-xs font-medium">← 홈</button>
        <span className="font-bold text-lg">AI 추천 결과</span>
      </div>
      <div className="p-5 space-y-4">
        {aiList.map((food, i) => (
          <div key={i} onClick={() => { setWinner(food); setScreen('result'); }} className="bg-white border-2 border-gray-100 rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:border-[#E85D2F] shadow-sm transition">
            <div className="text-5xl">{food.e}</div>
            <div className="flex-1">
              <div className="text-[10px] font-bold text-[#E85D2F] mb-1">AI Pick {i+1}위</div>
              <div className="text-xl font-bold mb-1">{food.n}</div>
              <div className="text-xs text-gray-500 truncate">{food.tip}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-[#1c1c1c]">
      <div className="max-w-[480px] mx-auto bg-white min-h-[calc(100vh-80px)] shadow-2xl overflow-hidden relative">
        {screen === 'home' && renderHome()}
        {screen === 'setup' && renderSetup()}
        {screen === 'tour' && renderTour()}
        {screen === 'result' && renderResult()}
        {screen === 'ai' && renderAi()}

        {/* TOAST MESSAGE */}
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-full text-sm font-bold shadow-2xl transition-all duration-300 z-50 ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
          {toast}
        </div>
      </div>
    </div>
  );
}