import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useAuthContext } from "../../context/AuthContext";
import { AuthForm } from "./AuthForm";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import img from "../../assets/form.png";

interface AuthPageProps {
  isLoginMode: boolean;
}

export const AuthPage = ({ isLoginMode }: AuthPageProps) => {
  const [searchParams] = useSearchParams();
  const location = useLocation(); // Используем хук вместо глобального объекта
  const navigate = useNavigate();

  // Типизируем location.state, чтобы избежать ошибок TS
  const locationState = location.state as {
    from?: { pathname: string };
  } | null;

  // Приоритет: state из роутера -> параметр query -> главная
  const from = locationState?.from?.pathname || searchParams.get("from") || "/";
  const { loginUser, registerUser } = useAuthContext();

  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setError(null);

      if (!isLoginMode) {
        if (password.length < 8) {
          setError("Password must be at least 8 characters");
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        if (!userName.trim()) {
          setError("Name is required");
          return;
        }
      }

      if (email && password) {
        try {
          if (isLoginMode) {
            await loginUser({ email, password });
          } else {
            await registerUser({ userName, email, password });
          }

          navigate(from, { replace: true });
        } catch (err: any) {
          setError(err.message || "Connection error");
        }
      }
    },
    [
      isLoginMode,
      email,
      password,
      confirmPassword,
      userName,
      loginUser,
      registerUser,
      navigate,
      from,
    ]
  );
  console.log("Current error state:", error);
  const isMatching = useMemo(
    () => password === confirmPassword,
    [password, confirmPassword]
  );
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = spotlightRef.current;
    if (!container) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      container.style.setProperty("--x", `${x}px`);
      container.style.setProperty("--y", `${y}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  return (
    <div
      style={
        {
          "--x": "50%",
          "--y": "50%",
          backgroundImage: `radial-gradient(circle at var(--x) var(--y), rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0.95) 25%), url(${img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        } as React.CSSProperties
      }
      ref={spotlightRef}
      className="flex h-screen overflow-hidden"
    >
      <AuthForm
        isLoginMode={isLoginMode}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        userName={userName}
        setUserName={setUserName}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        error={error}
        setError={setError}
        showPass={showPass}
        setShowPass={setShowPass}
        handleSubmit={handleSubmit}
        isMatching={isMatching}
      />
      <div className="w-[40%] h-full"></div>
    </div>
  );
};
