import { useEffect, useState } from 'react';

interface ScoreGaugeProps {
  score: number;
  grade: string;
  gradeEmoji: string;
}

export function ScoreGauge({ score, grade, gradeEmoji }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(100);

  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();
    const startValue = 100;
    const endValue = score;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = startValue + (endValue - startValue) * eased;
      setAnimatedScore(Math.round(current));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  // 根据分数计算颜色
  const getScoreColor = (s: number) => {
    if (s >= 80) return { bg: 'from-green-400 to-emerald-500', text: 'text-green-600', ring: 'ring-green-400' };
    if (s >= 60) return { bg: 'from-yellow-400 to-orange-400', text: 'text-yellow-600', ring: 'ring-yellow-400' };
    if (s >= 40) return { bg: 'from-orange-400 to-red-400', text: 'text-orange-600', ring: 'ring-orange-400' };
    return { bg: 'from-red-500 to-red-700', text: 'text-red-600', ring: 'ring-red-500' };
  };

  const colors = getScoreColor(animatedScore);
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-52 h-52">
        {/* 背景圆环 */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="104"
            cy="104"
            r="90"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
          />
          <circle
            cx="104"
            cy="104"
            r="90"
            fill="none"
            className={`bg-gradient-to-r ${colors.bg}`}
            stroke="url(#scoreGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={animatedScore >= 60 ? '#4ade80' : '#ef4444'} />
              <stop offset="100%" stopColor={animatedScore >= 60 ? '#10b981' : '#dc2626'} />
            </linearGradient>
          </defs>
        </svg>

        {/* 中心内容 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl mb-1">{gradeEmoji}</span>
          <span className={`text-4xl font-bold ${colors.text}`}>{animatedScore}</span>
          <span className="text-gray-500 text-sm">/ 100 分</span>
        </div>
      </div>

      {/* 评级标签 */}
      <div className={`mt-4 px-6 py-2 rounded-full bg-gradient-to-r ${colors.bg} text-white font-bold text-xl shadow-lg`}>
        {grade} 级
      </div>
    </div>
  );
}
