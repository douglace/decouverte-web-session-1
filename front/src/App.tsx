'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Pen, Trash2, Plus } from 'lucide-react'

interface Todo {
  id: number
  text: string
  completed: boolean
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Task 1', completed: false },
    { id: 2, text: 'Task 2', completed: true },
    { id: 3, text: 'Task 3', completed: false }
  ])
  const [newTask, setNewTask] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)

  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length

  const handleAddTodo = () => {
    if (newTask.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTask, completed: false }])
      setNewTask('')
    }
  }

  const handleToggle = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const handleEdit = (id: number, newText: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: newText } : todo
    ))
    setEditingId(null)
  }

  const handleDelete = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

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
                  onClick={() => handleToggle(todo.id)}
                  className={`h-5 w-5 rounded-full border ${
                    todo.completed ? 'bg-green-500 border-green-500' : 'border-orange-500'
                  }`}
                />
                {editingId === todo.id ? (
                  <Input
                    autoFocus
                    defaultValue={todo.text}
                    onBlur={(e) => handleEdit(todo.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleEdit(todo.id, e.currentTarget.value)
                      }
                    }}
                    className="bg-neutral-700 border-none text-white"
                  />
                ) : (
                  <span className={`text-white ${todo.completed ? 'line-through text-neutral-500' : ''}`}>
                    {todo.text}
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
