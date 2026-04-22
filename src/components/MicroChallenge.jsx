import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Data for Question 1
const chartData = [
    { month: 'Jan', sales: 15400 }, { month: 'Feb', sales: 16100 },
    { month: 'Mar', sales: 15900 }, { month: 'Apr', sales: 17200 },
    { month: 'May', sales: 16800 }, { month: 'Jun', sales: 17500 },
    { month: 'Jul', sales: 15800 }, { month: 'Aug', sales: 16400 },
    { month: 'Sep', sales: 15200 }, { month: 'Oct', sales: 16900 },
    { month: 'Nov', sales: 16000 }, { month: 'Dec', sales: 16000 } // Anomaly
];

const quizQuestions = [
    {
        id: 1,
        hasChart: true,
        question: "What is the most concerning insight derived from this Q4 sales dashboard?",
        options: [
            "Overall volume is sustainable year-over-year.",
            "Missing the expected Q4 holiday retail seasonality.",
            "Marketing spend was likely unoptimized in Q3.",
            "Data collection methodology needs verification."
        ],
        correctIndex: 1
    },
    {
        id: 2,
        hasChart: false,
        question: "Your Customer Acquisition Cost (CAC) has increased by 40% YoY, but Customer Lifetime Value (CLV) remains flat. Which immediate action is most justified?",
        options: [
            "Double the marketing budget to maintain volume.",
            "Pause all top-of-funnel brand awareness campaigns.",
            "Audit campaign targeting and channel conversion efficiency.",
            "Increase product pricing by 40% immediately."
        ],
        correctIndex: 2
    },
    {
        id: 3,
        hasChart: false,
        question: "You need to calculate the total revenue from users who signed up in the last 30 days. Which SQL approach is correct?",
        options: [
            "GROUP BY signup_date HAVING days < 30",
            "WHERE signup_date >= CURRENT_DATE - INTERVAL '30 days'",
            "ORDER BY signup_date DESC LIMIT 30",
            "JOIN users ON revenue.date = users.date"
        ],
        correctIndex: 1
    },
    {
        id: 4,
        hasChart: false,
        question: "An A/B test shows a 5% higher conversion rate for Variant B, but the p-value is 0.15. What is the correct conclusion?",
        options: [
            "Deploy Variant B; it mathematically performs better.",
            "The results are not statistically significant; do not declare a winner.",
            "Variant A is actively harming sales metrics.",
            "The sample size is too large; stop the test."
        ],
        correctIndex: 1
    },
    {
        id: 5,
        hasChart: false,
        question: "In Python's Pandas library, which method is best used to handle missing (NaN) values in a dataset without deleting the entire row?",
        options: [
            ".dropna()",
            ".fillna()",
            ".drop_duplicates()",
            ".isnull()"
        ],
        correctIndex: 1
    }
];

const COURSE_LINK = "https://alagitech.getlearnworlds.com/course/firststepindataanalysis";

export default function MicroChallenge() {
    const [step, setStep] = useState(1); // 1: Quiz, 2: Email, 3: Result
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const currentQ = quizQuestions[currentQIndex];
    const progress = ((currentQIndex) / quizQuestions.length) * 100;

    const handleOptionSelect = (selectedIndex) => {
        if (selectedIndex === currentQ.correctIndex) {
            setScore(prev => prev + 1);
        }

        if (currentQIndex < quizQuestions.length - 1) {
            setCurrentQIndex(prev => prev + 1);
        } else {
            setStep(2); // Move to email capture
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError("Please enter a valid email.");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/submit-assessment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, score, totalQuestions: quizQuestions.length })
            });

            const data = await response.json();

            if (data.success) {
                setStep(3);
            } else {
                setError(data.message || "Submission failed.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-4 font-sans">
            <div className="max-w-3xl w-full bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800">

                {/* Progress Bar (Only show during quiz) */}
                {step === 1 && (
                    <div className="h-1.5 w-full bg-slate-800">
                        <div
                            className="h-full bg-orange-500 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}

                {/* Header */}
                <div className="p-8 border-b border-slate-800">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
                        <span className="text-orange-500">Data & AI</span> Technical Assessment
                    </h1>
                    {step === 1 && <p className="text-slate-400 text-sm">Question {currentQIndex + 1} of {quizQuestions.length}</p>}
                </div>

                {/* Content Body */}
                <div className="p-6 md:p-8">

                    {/* STATE 1: The Quiz */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in duration-500">

                            {currentQ.hasChart && (
                                <div className="h-64 md:h-72 w-full bg-slate-950 rounded-xl p-4 border border-slate-800 shadow-inner">
                                    <h3 className="text-xs font-semibold text-slate-500 mb-4 uppercase tracking-wider">Total Retail Sales Month-over-Month</h3>
                                    <ResponsiveContainer width="100%" height="85%">
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                            <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                                            <Tooltip cursor={{ fill: '#0f172a' }} contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '8px' }} />
                                            <Bar dataKey="sales" fill="#f97316" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}

                            <div className="mt-4">
                                <h2 className="text-lg md:text-xl font-medium mb-6 text-slate-100 leading-relaxed">
                                    {currentQ.question}
                                </h2>
                                <div className="grid grid-cols-1 gap-3">
                                    {currentQ.options.map((optionText, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleOptionSelect(index)}
                                            className="text-left p-4 rounded-xl border border-slate-700 hover:border-orange-500 hover:bg-slate-800 transition-all text-slate-300 text-sm md:text-base font-medium group"
                                        >
                                            <span className="inline-block w-6 text-slate-500 group-hover:text-orange-500 transition-colors">
                                                {String.fromCharCode(65 + index)}.
                                            </span>
                                            {optionText}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STATE 2: Email Capture */}
                    {step === 2 && (
                        <div className="max-w-md mx-auto py-8 text-center animate-in fade-in zoom-in-95 duration-500">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 text-orange-500 mb-6 border border-orange-500/20">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Assessment Complete</h2>
                            <p className="text-slate-400 mb-8 text-sm md:text-base">Enter your email address to lock in your answers and receive your detailed performance report.</p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="email"
                                    required
                                    placeholder="professional@email.com"
                                    className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-slate-600"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {error && <p className="text-red-400 text-sm text-left px-1">{error}</p>}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3.5 px-4 rounded-xl transition-all flex justify-center items-center shadow-lg shadow-orange-900/20 disabled:opacity-70"
                                >
                                    {isLoading ? 'Processing Results...' : 'View My Score'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* STATE 3: The Result */}
                    {step === 3 && (
                        <div className="py-8 text-center animate-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-6">
                                <p className="text-slate-400 text-sm font-semibold tracking-widest uppercase">Final Score</p>
                                <div className="flex items-end justify-center gap-1">
                                    <span className={`text-6xl font-bold ${score >= 4 ? 'text-green-500' : 'text-orange-500'}`}>
                                        {score}
                                    </span>
                                    <span className="text-2xl text-slate-500 mb-1">/ 5</span>
                                </div>

                                <h2 className="text-2xl font-bold text-white mt-4">
                                    {score >= 4 ? 'Strong Foundational Knowledge' : 'Room for Optimization'}
                                </h2>

                                <p className="text-slate-400 max-w-md mx-auto text-sm md:text-base leading-relaxed">
                                    {score >= 4
                                        ? "Your results have been emailed to you. You demonstrated a solid grasp of data anomalies, business logic, and querying syntax."
                                        : "Your results have been emailed to you. There are clear opportunities to improve your technical logic and data interpretation skills."}
                                </p>
                            </div>

                            <div className="mt-10 border-t border-slate-800 pt-8">
                                <p className="text-slate-300 mb-6 font-medium">Ready to master enterprise-grade Data Analysis?</p>
                                <a
                                    href={COURSE_LINK}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-block bg-slate-100 hover:bg-white text-slate-900 font-bold py-3.5 px-8 rounded-xl shadow-lg transition-all"
                                >
                                    Explore the Full Curriculum
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}