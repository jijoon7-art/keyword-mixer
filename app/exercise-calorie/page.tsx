import type { Metadata } from 'next'
import ExerciseCalorie from '@/components/ExerciseCalorie'
export const metadata: Metadata = {
  title: '운동 칼로리 소모 계산기 — 달리기·헬스 칼로리 | Exercise Calorie',
  description: '무료 운동 칼로리 계산기. 30가지 운동별 칼로리 소모량 계산. MET 기반 정확한 계산. Free exercise calorie burn calculator with 30+ activities.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/exercise-calorie' },
}
export default function Page() { return <ExerciseCalorie /> }
