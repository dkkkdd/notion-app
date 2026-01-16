import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import "./form.css";
import img from "../../assets/form.png";
export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { loginUser, registerUser } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await loginUser({ email, password });
        window.location.href = "/";
      } else {
        await registerUser({ userName, email, password });
        window.location.href = "/";
      }
    } catch (err) {
      alert("error, Check your data or console.");
      console.error(err);
    }
  };

  return (
    <div className="flex">
      <div className="w-[40%] h-[100vh]">
        <img className="w-full h-full object-cover" src={img} alt="" />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] ">
        {/* <div className="w-full max-w-sm p-8  border border-gray-100 shadow-2xl rounded-lg"> */}
        {/* <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
          {isLogin ? "Welcome back!" : "Create an account"}
        </h2> */}
        <p className="text-gray-500 text-center mb-8 text-sm">
          {isLogin
            ? "Glad to see you again"
            : "Start planning your activities today"}
        </p>

        {/* <form onSubmit={handleSubmit} className="space-y-4 ">
            {!isLogin && (
              <input
                type="text"
                autoComplete={isLogin ? "current-text" : "new-text"}
                placeholder="Your name"
                className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            )}

            <input
              type="email"
              autoComplete={isLogin ? "current-email" : "new-email"}
              placeholder="Email"
              className="w-full px-4 py-3 bg-[#444] border-transparent rounded-lg focus:bg-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              placeholder="Password"
              className="w-full px-4 py-3 bg-[#444] border-transparent rounded-lg focus:bg-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transform active:scale-[0.98] transition-all shadow-lg hover:shadow-gray-200"
            >
              {isLogin ? "Login" : "Create"}
            </button>
          </form> */}

        <form className="form min-w-[60%]" onSubmit={handleSubmit}>
          <legend> {isLogin ? "Welcome back!" : "Create an account"}</legend>
          {!isLogin && (
            <label>
              <input
                required
                placeholder=""
                type="text"
                value={userName}
                autoComplete={isLogin ? "current-text" : "new-text"}
                className="input"
                onChange={(e) => setUserName(e.target.value)}
              />
              <span>Your name</span>
            </label>
          )}

          <label>
            <input
              required
              placeholder=""
              type="email"
              autoComplete={isLogin ? "current-email" : "new-email"}
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span>Email</span>
          </label>

          <label>
            <input
              required
              placeholder=""
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>Password</span>
          </label>
          <label>
            <input
              required
              placeholder=""
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              className="input"
            />
            <span>Confirm password</span>
          </label>
          {/* <button className="submit">Submit</button> */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-[rgb(64,78,201)] cursor-pointer text-white font-bold rounded-lg hover:bg-[rgb(64,78,221)] transition-color "
          >
            {isLogin ? "Login" : "Create"}
          </button>
          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-[rgb(64,78,201)] hover:text-[rgb(64,78,221)] cursor-pointer transition-colors"
            >
              {isLogin
                ? "Still not registered? Create account"
                : "Already have an account? Login"}
            </button>
          </div>
        </form>

        {/* <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            {isLogin
              ? "Still not registered? Create account"
              : "Already have an account? Login"}
          </button>
        </div> */}
      </div>
    </div>
    // </div>
  );
};
