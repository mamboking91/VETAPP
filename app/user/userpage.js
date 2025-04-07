"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Lock, Edit2, Save, Award, ChevronDown, ChevronUp } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export default function UserPage({ 
  initialUserData = { 
    name: "John Doe", 
    email: "john@example.com",
    examResults: [
      { id: 1, score: 75, totalQuestions: 80, date: "2023-11-17" },
      { id: 2, score: 68, totalQuestions: 80, date: "2023-10-15" },
      { id: 3, score: 72, totalQuestions: 80, date: "2023-09-20" },
    ]
  },
  onUpdateProfile
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState(initialUserData)
  const [isResultsExpanded, setIsResultsExpanded] = useState(false)

  // Add useEffect to update userData when initialUserData changes
  useEffect(() => {
    setUserData(initialUserData)
  }, [initialUserData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdateProfile?.(userData)
    setIsEditing(false)
  }

  const lastResult = userData.examResults[0]

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg" alt={userData.name} />
              <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl font-bold">{userData.name}</CardTitle>
          <CardDescription>{userData.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <div className="relative">
                  <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="Tu nombre"
                    value={userData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={userData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-8"
                  />
                </div>
              </div>
              {isEditing && (
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      onChange={handleInputChange}
                      className="pl-8"
                    />
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Exam Results Section */}
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Award className="mr-2 h-5 w-5 text-primary" />
              Resultados de Exámenes
            </h3>
            <div className="bg-secondary p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Último resultado: {lastResult.score}/{lastResult.totalQuestions}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(lastResult.date).toLocaleDateString()}
                </span>
              </div>
              <Progress 
                value={(lastResult.score / lastResult.totalQuestions) * 100} 
                className="h-2"
              />
              <p className="text-sm mt-2">
                {((lastResult.score / lastResult.totalQuestions) * 100).toFixed(1)}% de respuestas correctas
              </p>
            </div>
            
            <Collapsible
              open={isResultsExpanded}
              onOpenChange={setIsResultsExpanded}
              className="w-full space-y-2"
            >
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full">
                  {isResultsExpanded ? "Ocultar historial" : "Ver historial completo"}
                  {isResultsExpanded ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                {userData.examResults.slice(1).map((result) => (
                  <div key={result.id} className="bg-secondary p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Puntuación: {result.score}/{result.totalQuestions}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(result.date).toLocaleDateString()}
                      </span>
                    </div>
                    <Progress 
                      value={(result.score / result.totalQuestions) * 100} 
                      className="h-2"
                    />
                    <p className="text-sm mt-2">
                      {((result.score / result.totalQuestions) * 100).toFixed(1)}% de respuestas correctas
                    </p>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
              <Button onClick={handleSubmit}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="w-full">
              <Edit2 className="mr-2 h-4 w-4" />
              Editar Perfil
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
