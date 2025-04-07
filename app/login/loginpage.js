import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from "@/components/ui/separator";
import { LogIn, UserPlus, User, Chrome } from 'lucide-react';

const LoginPage = ({ onStart }) => {
  const [mode, setMode] = useState('initial');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (mode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
      console.log('Registro:', formData);
    } else if (mode === 'login') {
      console.log('Login:', formData);
    }
    
    onStart();
  };

  const handleGoogleAuth = () => {
    console.log('Autenticación con Google');
  };

  const AuthForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Button 
        type="button"
        className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md"
        onClick={handleGoogleAuth}
      >
        <div className="flex items-center justify-center py-1">
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="font-medium text-gray-900">Continuar con Google</span>
        </div>
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-4 text-gray-500 font-medium">
            O continúa con
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium text-gray-700">
            Nombre de usuario
          </Label>
          <Input
            id="username"
            name="username"
            type="text"
            required
            value={formData.username}
            onChange={handleInputChange}
            className="h-11 px-4 border-gray-200 focus:border-primary/50 focus:ring-primary/50"
            placeholder="Ingresa tu nombre de usuario"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Contraseña
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className="h-11 px-4 border-gray-200 focus:border-primary/50 focus:ring-primary/50"
            placeholder="Ingresa tu contraseña"
          />
        </div>
        {mode === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirmar Contraseña
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="h-11 px-4 border-gray-200 focus:border-primary/50 focus:ring-primary/50"
              placeholder="Confirma tu contraseña"
            />
          </div>
        )}
      </div>
      
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3 pt-2">
        <Button 
          type="submit" 
          className="w-full h-11 text-base font-medium shadow-sm hover:shadow-md transition-all duration-200"
        >
          {mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          className="w-full h-11 text-base font-medium hover:bg-gray-50"
          onClick={() => setMode('initial')}
        >
          Volver
        </Button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
      <Card className="w-full max-w-md border-gray-200 shadow-lg">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Ponte-A-Prueba
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 font-medium">
            {mode === 'initial' ? 'Elige cómo quieres comenzar' : 
             mode === 'login' ? 'Inicia sesión en tu cuenta' : 
             'Crea una nueva cuenta'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === 'initial' ? (
            <div className="space-y-4">
              <Button 
                className="w-full h-11 text-base font-medium shadow-sm hover:shadow-md transition-all duration-200" 
                onClick={() => setMode('login')}
              >
                <LogIn className="mr-3 h-5 w-5" />
                Iniciar Sesión
              </Button>
              <Button 
                className="w-full h-11 text-base font-medium border-gray-200 shadow-sm hover:shadow-md transition-all duration-200" 
                variant="outline"
                onClick={() => setMode('register')}
              >
                <UserPlus className="mr-3 h-5 w-5" />
                Crear Cuenta
              </Button>
              <Button 
                className="w-full h-11 text-base font-medium shadow-sm hover:shadow-md transition-all duration-200" 
                variant="secondary"
                onClick={onStart}
              >
                <User className="mr-3 h-5 w-5" />
                Continuar como Invitado
              </Button>
            </div>
          ) : (
            <AuthForm />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
