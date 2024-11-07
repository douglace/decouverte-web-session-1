'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Pen, Trash2, Plus } from 'lucide-react'

interface Todo {
  id: number
  label: string
  status: boolean
}

const API_URL = 'http://localhost/api.php'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTask, setNewTask] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      if (data.status) {
        setTodos(data.data)
      } else {
        console.error('Erreur lors de la récupération des tâches:', data.message)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error)
    }
  }

  const handleAddTodo = async () => {
    if (newTask.trim()) {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ label: newTask }),
        })
        const data = await response.json()
        if (data.status) {
          setNewTask('')
          fetchTodos() // Recharger la liste après l'ajout
        } else {
          console.error('Erreur lors de l\'ajout de la tâche:', data.message)
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la tâche:', error)
      }
    }
  }

  const handleToggle = async (id: number, currentStatus: boolean) => {
    try {
      const todo = todos.find(t => t.id === id)
      if (!todo) return

      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ label: todo.label, status: !currentStatus }),
      })
      const data = await response.json()
      if (data.status) {
        fetchTodos() // Recharger la liste après la mise à jour
      } else {
        console.error('Erreur lors de la mise à jour de la tâche:', data.message)
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error)
    }
  }

  const handleEdit = async (id: number, newText: string) => {
    try {
      const todo = todos.find(t => t.id === id)
      if (!todo) return

      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ label: newText, status: todo.status }),
      })
      const data = await response.json()
      if (data.status) {
        setEditingId(null)
        fetchTodos() // Recharger la liste après la mise à jour
      } else {
        console.error('Erreur lors de la mise à jour de la tâche:', data.message)
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.status) {
        fetchTodos() // Recharger la liste après la suppression
      } else {
        console.error('Erreur lors de la suppression de la tâche:', data.message)
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error)
    }
  }

  const completedCount = todos.filter(todo => todo.status).length
  const totalCount = todos.length

  return (
    <div className="min-h-screen w-screen bg-neutral-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-black rounded-3xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white font-bold text-xl">
            <span className="text-white">MY</span>
            <span className="text-orange-500">TODO</span>
          </h1>
        </div>

        <div className="bg-neutral-800 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <h2 className="text-white text-xl font-semibold">Todo Done</h2>
            <p className="text-neutral-400 text-sm">keep it up</p>
          </div>
          <div className="bg-orange-500 rounded-full h-16 w-16 flex items-center justify-center text-white text-xl font-bold">
            {completedCount}/{totalCount}
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="write your next task"
            className="bg-neutral-800 border-none text-white placeholder:text-neutral-500"
            onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
          />
          <Button 
            onClick={handleAddTodo}
            className="bg-orange-500 hover:bg-orange-600 rounded-full h-10 w-10 p-0"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-2">
          {todos.map(todo => (
            <div
              key={todo.id}
              className="flex items-center justify-between bg-neutral-800 rounded-xl p-3"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggle(todo.id, todo.status)}
                  className={`h-5 w-5 rounded-full border ${
                    todo.status ? 'bg-green-500 border-green-500' : 'border-orange-500'
                  }`}
                />
                {editingId === todo.id ? (
                  <Input
                    autoFocus
                    defaultValue={todo.label}
                    onBlur={(e) => handleEdit(todo.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleEdit(todo.id, e.currentTarget.value)
                      }
                    }}
                    className="bg-neutral-700 border-none text-white"
                  />
                ) : (
                  <span className={`text-white ${todo.status ? 'line-through text-neutral-500' : ''}`}>
                    {todo.label}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingId(todo.id)}
                  className="text-neutral-400 hover:text-black"
                >
                  <Pen className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(todo.id)}
                  className="text-neutral-400 hover:text-black"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
export default App
