"use client";

import { useState } from "react";

const API_URL = "http://localhost:8000";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "请输入用户名";
    }

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "密码不一致";
      }
    }

    if (!formData.password) {
      newErrors.password = "请输入密码";
    } else if (formData.password.length < 6) {
      newErrors.password = "密码至少6位";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const url = `${API_URL}/api/user/${isLogin ? "login" : "register"}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "失败");

      localStorage.setItem("token", data.token);
      alert(data.message);

      if (!isLogin) {
        setIsLogin(true);
        setFormData({ username: "", password: "", confirmPassword: "" });
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const toggleMode = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setErrors({});
      setFormData({
        username: "",
        password: "",
        confirmPassword: "",
      });
      setIsAnimating(false);
    }, 200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f0] px-4 py-8">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#e8e4dc] rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#ddd8ce] rounded-full blur-3xl opacity-50" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* 主卡片 */}
        <div
          className={`bg-white rounded-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-500 ease-out ${
            isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          {/* 顶部色块 */}
          <div className="h-2 bg-gradient-to-r from-[#8b7355] via-[#a08060] to-[#8b7355]" />

          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#f5f3ef] rounded-2xl mb-4 shadow-inner">
              <svg
                className="w-7 h-7 text-[#8b7355]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isLogin ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                )}
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-[#2d2d2d] tracking-tight">
              {isLogin ? "欢迎回来" : "加入我们"}
            </h1>
            <p className="text-[#888] mt-2 text-sm">
              {isLogin ? "登录以继续访问" : "创建您的新账户"}
            </p>
          </div>

          {/* Form */}
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div className="relative">
                <label className="block text-sm font-medium text-[#555] mb-1.5">
                  用户名
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 bg-[#fafafa] border rounded-xl text-[#333] placeholder-[#aaa] transition-all duration-300 outline-none disabled:opacity-50 ${
                      errors.username
                        ? "border-red-300 bg-red-50/30"
                        : focusedField === "username"
                        ? "border-[#8b7355] bg-white shadow-[0_0_0_4px_rgba(139,115,85,0.08)]"
                        : "border-[#e5e5e5] hover:border-[#d0d0d0]"
                    }`}
                    placeholder="您的用户名"
                  />
                  {formData.username && !isLoading && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, username: "" }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bbb] hover:text-[#888] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-[#555] mb-1.5">
                  密码
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 bg-[#fafafa] border rounded-xl text-[#333] placeholder-[#aaa] transition-all duration-300 outline-none disabled:opacity-50 ${
                      errors.password
                        ? "border-red-300 bg-red-50/30"
                        : focusedField === "password"
                        ? "border-[#8b7355] bg-white shadow-[0_0_0_4px_rgba(139,115,85,0.08)]"
                        : "border-[#e5e5e5] hover:border-[#d0d0d0]"
                    }`}
                    placeholder="••••••"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password - Only for register */}
              {!isLogin && (
                <div className="relative animate-[slideDown_0.35s_ease-out]">
                  <label className="block text-sm font-medium text-[#555] mb-1.5">
                    确认密码
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("confirmPassword")}
                      onBlur={() => setFocusedField(null)}
                      disabled={isLoading}
                      className={`w-full px-4 py-3 bg-[#fafafa] border rounded-xl text-[#333] placeholder-[#aaa] transition-all duration-300 outline-none disabled:opacity-50 ${
                        errors.confirmPassword
                          ? "border-red-300 bg-red-50/30"
                          : focusedField === "confirmPassword"
                          ? "border-[#8b7355] bg-white shadow-[0_0_0_4px_rgba(139,115,85,0.08)]"
                          : "border-[#e5e5e5] hover:border-[#d0d0d0]"
                      }`}
                      placeholder="••••••"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2d2d2d] text-white py-3.5 rounded-xl font-medium mt-6 hover:bg-[#1a1a1a] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {isLogin ? "登录" : "创建账户"}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e5e5e5]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-[#999]">或</span>
                </div>
              </div>

              {/* Toggle */}
              <button
                type="button"
                onClick={toggleMode}
                disabled={isLoading}
                className="w-full py-3 border border-[#e0e0e0] rounded-xl text-[#555] font-medium hover:bg-[#fafafa] hover:border-[#d0d0d0] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
              >
                {isLogin ? "创建新账户" : "已有账户？登录"}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[#aaa] text-xs mt-6">
          继续使用即表示您同意我们的条款
        </p>
      </div>

      {/* 添加动画样式 */}
      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
