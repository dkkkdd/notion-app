import { useNavigate } from "react-router-dom";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";
interface AuthFormProps {
  isLoginMode: boolean;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  userName: string;
  setUserName: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  error: string | null;
  setError: (val: string | null) => void;
  showPass: boolean;
  setShowPass: (val: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isMatching: boolean;
}
export const AuthForm = memo(
  ({
    isLoginMode,
    email,
    setEmail,
    password,
    setPassword,
    userName,
    setUserName,
    confirmPassword,
    setConfirmPassword,
    error,
    setError,
    showPass,
    setShowPass,
    handleSubmit,
    isMatching,
  }: AuthFormProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const isEmailErr = error?.includes(t("auth_error_invalid"));

    return (
      <div className="flex flex-1 max-w-[40em] flex-col items-center justify-center p-6  ">
        <form
          className="flex flex-col gap-[1.2em] p-[2em] rounded-[10px] shadow-[0_0_15px_rgb(27,27,27)] w-full max-w-[35em] bg-transparent backdrop-blur-md border border-white/10"
          onSubmit={handleSubmit}
        >
          <legend className="text-[2em] font-bold bg-gradient-to-r from-[#4270d1] via-[#9d174d] to-[#9d174d] bg-clip-text text-transparent mb-4">
            {isLoginMode ? t("login_title") : t("register_title")}
          </legend>

          {!isLoginMode && (
            <label className="relative block">
              <input
                minLength={3}
                maxLength={30}
                placeholder=" "
                required
                autoComplete="username"
                type="text"
                value={userName}
                // ДОБАВЛЕНО: text-white
                className="peer w-full p-[1em] rounded-[10px] bg-transparent text-white outline outline-1 outline-gray-500 focus:outline-2 focus:outline-[#4270d1] transition-all"
                onChange={(e) => setUserName(e.target.value)}
              />
              <span
                // ДОБАВЛЕНО: text-white/50 вместо text-gray-500
                className="absolute left-[1em] transition-all pointer-events-none bg-transparent top-[1em] text-white/50 peer-focus:-top-[1.5em] peer-focus:left-[0.2em] peer-focus:text-[0.8em] peer-focus:text-[#4270d1]
              peer-[:not(:placeholder-shown)]:-top-[1.4em] peer-[:not(:placeholder-shown)]:left-[0.2em] 
              peer-[:not(:placeholder-shown)]:text-[0.8em]"
              >
                {t("your_name")}
              </span>
            </label>
          )}

          <label className="relative block">
            <input
              minLength={8}
              maxLength={150}
              placeholder=" "
              required
              type="email"
              autoComplete="email"
              value={email}
              // ДОБАВЛЕНО: text-white
              className={`peer w-full p-[1em] rounded-[10px] bg-transparent text-white outline transition-all 
                ${
                  isEmailErr
                    ? "outline-2 outline-red-500 focus:outline-red-500"
                    : "outline-1 outline-gray-500 focus:outline-[#4270d1]"
                }`}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
            />
            <span
              // ДОБАВЛЕНО: text-white/50
              className={`absolute left-[1em] transition-all pointer-events-none bg-transparent top-[1em] peer-focus:-top-[1.5em] peer-focus:left-[0.2em] peer-focus:text-[0.8em] peer-focus:text-[#4270d1]
              peer-[:not(:placeholder-shown)]:-top-[1.4em] peer-[:not(:placeholder-shown)]:left-[0.2em] 
              peer-[:not(:placeholder-shown)]:text-[0.8em] ${
                isEmailErr
                  ? "!text-red-500"
                  : "text-white/50 peer-focus:text-[#4270d1]"
              }`}
            >
              {t("email_label")}
            </span>
            {isEmailErr && (
              <span className="text-[0.7em] text-red-500 mt-1 block">
                {error}
              </span>
            )}
          </label>

          <label className="relative block">
            <input
              placeholder=" "
              minLength={8}
              maxLength={30}
              required
              autoComplete={isLoginMode ? "current-password" : "new-password"}
              type={showPass ? "text" : "password"}
              value={password}
              // ДОБАВЛЕНО: text-white
              className={`peer w-full p-[1em] rounded-[10px] bg-transparent text-white outline transition-all focus:outline-2 
                ${
                  password.length > 0 && password.length < 8 && !isLoginMode
                    ? "outline-2 outline-red-500 focus:outline-red-500"
                    : "outline-1 outline-gray-500 focus:outline-[#4270d1]"
                }`}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              // ДОБАВЛЕНО: text-white/50
              className={`
    absolute left-[1em] transition-all pointer-events-none bg-transparent
    top-[1em] 
    peer-focus:-top-[1.5em] peer-focus:left-[0.2em] peer-focus:text-[0.8em] peer-focus:text-[#4270d1]
    peer-[:not(:placeholder-shown)]:-top-[1.5em] peer-[:not(:placeholder-shown)]:left-[0.2em] peer-[:not(:placeholder-shown)]:text-[0.8em]
   ${
     password.length > 0 && password.length < 8 && !isLoginMode
       ? "!text-red-500"
       : "text-white/50 peer-focus:text-[#4270d1]"
   }`}
            >
              {t("password_label")}
            </span>
            {password.length > 0 && password.length < 8 && !isLoginMode && (
              <span className="text-[0.7em] text-red-500 mt-1 block">
                {t("password_min_length")}
              </span>
            )}
            {!isLoginMode && (
              <button
                type="button"
                onClick={() => {
                  const pass = Math.random().toString(36).slice(-10);
                  setPassword(pass);
                  setConfirmPassword(pass);
                }}
                className="text-[#4270d1] pt-3 cursor-pointer text-sm flex items-center gap-2 hover:underline w-fit"
              >
                <span className="icon-key2"></span> {t("generate_password")}
              </button>
            )}
          </label>

          {!isLoginMode && (
            <label className="relative block">
              <input
                placeholder=" "
                required
                autoComplete={isLoginMode ? "current-password" : "new-password"}
                type={showPass ? "text" : "password"}
                value={confirmPassword}
                // ДОБАВЛЕНО: text-white
                className={`peer w-full p-[1em] rounded-[10px] bg-transparent text-white outline transition-all focus:outline-2 
                  ${
                    confirmPassword.length > 0 && !isMatching
                      ? "outline-2 outline-red-500 focus:outline-red-500"
                      : "outline-1 outline-gray-500 focus:outline-[#4270d1]"
                  }`}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <span
                // ДОБАВЛЕНО: text-white/50
                className={`
    absolute left-[1em] transition-all pointer-events-none bg-transparent
    top-[1em] 
    peer-focus:-top-[1.5em] peer-focus:left-[0.2em] peer-focus:text-[0.8em] peer-focus:text-[#4270d1]
    peer-[:not(:placeholder-shown)]:-top-[1.5em] peer-[:not(:placeholder-shown)]:left-[0.2em] peer-[:not(:placeholder-shown)]:text-[0.8em]
  ${
    confirmPassword.length > 0 && !isMatching
      ? "!text-red-500"
      : "text-white/50 peer-focus:text-[#4270d1]"
  }`}
              >
                {t("confirm_password_label")}
              </span>
              {!isMatching && confirmPassword.length > 0 && (
                <span className="text-[0.7em] text-red-500 mt-1 block">
                  {t("passwords_not_match")}
                </span>
              )}
            </label>
          )}

          <div className="flex items-center gap-2 text-white text-sm">
            <input
              type="checkbox"
              className="accent-[#4270d1]"
              checked={showPass}
              onChange={() => setShowPass(!showPass)}
            />
            <label
              className="cursor-pointer"
              onClick={() => setShowPass(!showPass)}
            >
              {t("show_password_label")}
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#4270d1] cursor-pointer text-white font-bold rounded-lg hover:bg-[#4270d9] transition-all shadow-lg active:scale-95"
          >
            {isLoginMode ? t("login_btn") : t("create_btn")}
          </button>

          <div className="text-center mt-2 border-t border-gray-700 pt-4">
            <button
              type="button"
              onClick={() => {
                navigate(isLoginMode ? "/register" : "/login");
                if (error) {
                  setError(null);
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                  setUserName("");
                }
              }}
              className="text-[#4270d1] cursor-pointer text-sm hover:underline"
            >
              {isLoginMode
                ? t("auth_switch_to_register")
                : t("auth_switch_to_login")}
            </button>
          </div>
        </form>
      </div>
    );
  }
);
