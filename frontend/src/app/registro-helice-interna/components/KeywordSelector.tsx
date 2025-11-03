"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Search } from "lucide-react";

interface Keyword {
  id: number;
  keyword: string;
  category: string;
  description: string;
}

interface KeywordSelectorProps {
  selectedKeywords: number[]; // Cambiar a IDs numéricos
  onSelectionChange: (keywords: number[]) => void;
}

export default function KeywordSelector({
  selectedKeywords,
  onSelectionChange
}: KeywordSelectorProps) {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [filteredKeywords, setFilteredKeywords] = useState<Keyword[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchKeywords();
  }, []);

  useEffect(() => {
    // Cerrar sugerencias al hacer clic fuera
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = keywords.filter(kw =>
        kw.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kw.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredKeywords(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredKeywords([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, keywords]);

  const fetchKeywords = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/keywords`);
      if (!response.ok) throw new Error('Error al cargar palabras clave');
      
      const data = await response.json();
      setKeywords(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching keywords:', error);
      setLoading(false);
    }
  };

  const handleSelectKeyword = (keywordId: number) => {
    if (!selectedKeywords.includes(keywordId)) {
      onSelectionChange([...selectedKeywords, keywordId]);
    }
    setSearchTerm("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleRemoveKeyword = (keywordId: number) => {
    onSelectionChange(selectedKeywords.filter(k => k !== keywordId));
  };
  
  // Función helper para obtener el objeto keyword por ID
  const getKeywordById = (id: number) => {
    return keywords.find(kw => kw.id === id);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'tecnologia_digital': 'bg-blue-100 text-blue-800',
      'medio_ambiente': 'bg-green-100 text-green-800',
      'salud': 'bg-red-100 text-red-800',
      'ingenieria': 'bg-yellow-100 text-yellow-800',
      'industria': 'bg-purple-100 text-purple-800',
      'agroindustria': 'bg-orange-100 text-orange-800',
      'gestion': 'bg-pink-100 text-pink-800',
      'educacion': 'bg-indigo-100 text-indigo-800',
      'materiales': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'tecnologia_digital': 'Tecnología Digital',
      'medio_ambiente': 'Medio Ambiente',
      'salud': 'Salud',
      'ingenieria': 'Ingeniería',
      'industria': 'Industria',
      'agroindustria': 'Agroindustria',
      'gestion': 'Gestión',
      'educacion': 'Educación',
      'materiales': 'Materiales',
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Label htmlFor="keyword-search">Buscar palabras clave *</Label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            id="keyword-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm && setShowSuggestions(true)}
            placeholder="Ej: inteligencia artificial, nanomateriales, dislexia..."
            className="pl-10"
          />
        </div>

        {showSuggestions && filteredKeywords.length > 0 && (
          <Card
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 max-h-80 overflow-y-auto shadow-lg"
          >
            <CardContent className="p-2">
              {filteredKeywords.map((kw) => (
                <button
                  key={kw.id}
                  type="button"
                  onClick={() => handleSelectKeyword(kw.id)}
                  disabled={selectedKeywords.includes(kw.id)}
                  className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors ${
                    selectedKeywords.includes(kw.id) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{kw.keyword}</div>
                      <div className="text-xs text-gray-500 mt-1">{kw.description}</div>
                    </div>
                    <Badge className={`text-xs ${getCategoryColor(kw.category)}`}>
                      {getCategoryLabel(kw.category)}
                    </Badge>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {selectedKeywords.length > 0 && (
        <div>
          <Label className="mb-2 block">Palabras clave seleccionadas ({selectedKeywords.length})</Label>
          <div className="flex flex-wrap gap-2">
            {selectedKeywords.map((keywordId) => {
              const keywordData = getKeywordById(keywordId);
              if (!keywordData) return null;
              return (
                <Badge
                  key={keywordId}
                  className={`${getCategoryColor(keywordData.category)} px-3 py-1.5 text-sm`}
                >
                  {keywordData.keyword}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keywordId)}
                    className="ml-2 hover:text-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {selectedKeywords.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          Debe seleccionar al menos una palabra clave de la lista
        </p>
      )}

      <p className="text-xs text-gray-500">
        Escriba para buscar y seleccionar palabras clave del catálogo. No puede personalizar las palabras clave.
      </p>
    </div>
  );
}
