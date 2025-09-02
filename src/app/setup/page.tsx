'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  const setupDatabase = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/setup-db', {
        method: 'POST'
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-0 bg-white shadow-sm rounded-2xl">
        <CardHeader className="text-center pb-6 pt-8">
          <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl">⚙️</span>
          </div>
          <CardTitle className="text-2xl font-light text-gray-900 mb-2">
            Setup de Base de Datos
          </CardTitle>
          <p className="text-sm text-gray-500 font-light">
            Configura los datos de demostración para DriveBy
          </p>
        </CardHeader>
        
        <CardContent className="pb-8">
          <Button 
            onClick={setupDatabase}
            disabled={isLoading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 text-sm mb-6"
          >
            {isLoading ? 'Configurando...' : 'Configurar Base de Datos'}
          </Button>

          {result && (
            <div className={`p-4 rounded-xl text-sm ${
              result.success 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <div className="font-medium mb-2">
                {result.success ? '✅ Éxito' : '❌ Error'}
              </div>
              <div className="text-xs">
                {result.message || result.error}
              </div>
            </div>
          )}

          <div className="mt-6 text-xs text-gray-500">
            <p className="mb-2 font-medium">Esto creará:</p>
            <ul className="space-y-1">
              <li>• Negocio DriveByApp Demo</li>
              <li>• Productos de ejemplo</li>
              <li>• Categorías y temas</li>
              <li>• Estacionamientos</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
