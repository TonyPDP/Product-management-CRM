import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import { LogIn, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authAPI.login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials
  const demoAccounts = [
    { email: "admin@crm.com", password: "admin123", name: "Администратор" },
    { email: "user1@crm.com", password: "user123", name: "Пользователь 1" },
    { email: "user2@crm.com", password: "user456", name: "Пользователь 2" },
    { email: "manager@crm.com", password: "manager789", name: "Менеджер" },
    { email: "sales@crm.com", password: "sales2024", name: "Отдел продаж" },
  ];

  const fillDemo = (account: { email: string; password: string }) => {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Вход в CRM
              </CardTitle>
              <p className="text-gray-500 mt-2">Управление бизнесом</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Пароль
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                  required
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Вход...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Войти
                  </>
                )}
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="pt-6 border-t">
              <p className="text-sm font-medium text-gray-700 mb-3 text-center">
                Демо аккаунты
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {demoAccounts.map((account, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => fillDemo(account)}
                    disabled={loading}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {account.name}
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                          {account.email}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 font-mono">
                        {account.password}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          © 2024 CRM System. Все права защищены.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;