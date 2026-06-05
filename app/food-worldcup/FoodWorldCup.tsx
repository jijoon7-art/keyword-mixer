'use client';

import React, { useState, useEffect } from 'react';
import { trackEvent } from '@/lib/ga';

interface Food {
  n: string;
  e: string;
  t: string[];
  combo?: string;
  convo?: string;
  tip?: string;
  c?: string;
}

const FOODS: Food[] = [
  // ← 원본 food_worldcup_v3.html 파일에서 const FOODS = [ ... ] 전체를 복사해서 여기에 붙여넣으세요
  // (지금은 일부만 예시로 넣었습니다)
  {n:"김치찌개", e:"🍲", t:["점심","저예산","매콤함","든든함"]},
  {n:"제육볶음", e:"🥩", t:["점심","매콤함","든든함"]},
  {n:"비빔밥",   e:"🥗", t:["점심","가볍게","혼밥"]},
  // ... 나머지 모든 음식 데이터 붙여넣기
];

export default function FoodWorldCup() {
  const [screen, setScreen] = useState<'home' | 'setup' | 'ai' | 'tournament' | 'result'>('home');
  const [filters, setFilters] = useState({ time: 'any', mood: 'any', budget: 'any', place: 'any' });
  const [aiRecommended, setAiRecommended] = useState<Food | null>(null);

  useEffect(() => {
    trackEvent('food_worldcup_view', { screen });
  }, [screen]);

  const handleAiInstant = () => {
    trackEvent('food_worldcup_ai_start', filters);
    let pool = FOODS.filter(food => {
      if (filters.time !== 'any' && !food.t.includes(filters.time)) return false;
      return true;
    });
    if (pool.length === 0) pool = [...FOODS];
    
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setAiRecommended(picked);
    setScreen('ai');
    trackEvent('food_worldcup_ai_result', { menu: picked.n });
  };

  const startTournament = () => {
    trackEvent('food_worldcup_tournament_start', filters);
    let pool = FOODS.filter(food => {
      if (filters.time !== 'any' && !food.t.includes(filters.time)) return false;
      return true;
    });
    if (pool.length < 8) pool = [...FOODS];
    
    // 간단 토너먼트 시작 (추후 확장)
    setScreen('tournament');
  };

  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-[#F7F6F2] pb-12 font-sans">
      
      {/* 상단 AdSense 광고 (수익 핵심) */}
      <div className="p-4">
        <ins 
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-3578085366535592"
          data-ad-slot="9590985950"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      </div>

      {screen === 'home' && (
        <div className="px-5 pt-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-orange-600">🍽️ 오늘 뭐 먹지?</h1>
          <p className="text-gray-600 mb-10">AI 추천 · 재미있는 월드컵</p>

          <button 
            onClick={() => setScreen('setup')} 
            className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-lg font-bold mb-4"
          >
            🎯 상황에 맞춰 추천받기
          </button>
          <button 
            onClick={startTournament} 
            className="w-full py-4 bg-white border-2 border-orange-600 text-orange-600 rounded-2xl text-lg font-bold"
          >
            🏆 바로 월드컵 시작하기
          </button>
        </div>
      )}

      {screen === 'ai' && aiRecommended && (
        <div className="p-6 text-center">
          <div className="text-7xl mb-6">{aiRecommended.e}</div>
          <h2 className="text-3xl font-bold mb-8">{aiRecommended.n}</h2>
          <button 
            onClick={() => setScreen('home')} 
            className="w-full py-4 bg-gray-800 text-white rounded-2xl"
          >
            다시 선택하기
          </button>
        </div>
      )}
    </div>
  );
}