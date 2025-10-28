import { useState, useEffect, useCallback, useRef } from 'react'
import typescriptLogo from './assets/typescript.svg'
import reactLogo from './assets/react.svg'
import tailwindLogo from './assets/tailwind.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Card = {
  id: string
  name: string
  logo: string
  glow: string
}

const cards: Card[] = [
  { id: 'ts', name: 'TypeScript', logo: typescriptLogo, glow: '#3178c6' },
  { id: 'react', name: 'React', logo: reactLogo, glow: '#61dafb'  },
  { id: 'tailwind', name: 'Tailwind', logo: tailwindLogo, glow: '#38bdf8' },
  { id: 'vite', name: 'Vite', logo: viteLogo, glow: '#a855f7' },
]

function App() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [history, setHistory] = useState<string[]>([])
  const [input, setInput] = useState('')

  const consoleContainerRef = useRef<HTMLDivElement>(null);

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSelectAll = (select: boolean) => {
    const allChecked = cards.reduce((acc, card) => {
      acc[card.id] = select;
      return acc;
    }, {} as Record<string, boolean>);
    setChecked(allChecked);
  }

  const getResult = useCallback(() => {
    const ts = checked.ts
    const react = checked.react
    const tailwind = checked.tailwind
    const vite = checked.vite

    if (ts && react && tailwind && vite) return 'The project is ready and can be assembled and launched as a server.'
    if (ts && react && tailwind) return 'The website has full functionality.'
    if (ts && react) return 'Backend is ready.'
    return ''
  }, [checked])

  useEffect(() => {
    const result = getResult()
    if (result) setHistory((prev) => [...prev, `> ${result}`])
  }, [getResult, checked])

  useEffect(() => {
    if (consoleContainerRef.current) {
      const consoleElement = consoleContainerRef.current;
      consoleElement.scrollTop = consoleElement.scrollHeight;
    }
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (input.trim().toLowerCase() === 'clear') {
        setHistory([])
      } else if (input.trim().toLowerCase() === 'help') {
        setHistory((prev) => [
          ...prev,
          `> ${input}`,
          '  Available commands:',
          '  ',
          '  help     - Shows this list of commands.',
          '  clear    - Clears the console history.'
        ])
      } else if (input.trim() !== '') {
        setHistory((prev) => [...prev, `> ${input}`, `> Unknown command: ${input}`])
      }
      setInput('')
    }
  }

  const areAllSelected = cards.length > 0 && cards.every(card => checked[card.id]);

  return (
    <>
    <main className="dark bg-[#181a1b] text-white min-h-screen pt-30">
      <div className="w-full mx-auto p-4">
        <h1 className="text-3xl pb-2 mb-6 font-extrabold bg-linear-to-r from-cyan-500 via-purple-400 to-red-500 bg-clip-text text-transparent">Readiness and status of technologies</h1>

        <div className="flex justify-end mb-6">
          <Button
            onClick={() => handleSelectAll(!areAllSelected)}
            className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 active:scale-95 transition-all"
            >
            {areAllSelected ? 'Clear selected' : 'Select All'}
          </Button>
        </div>

        <div className="space-y-4 mb-12">
          {cards.map((card) => (
            <Card
              onClick={() => toggle(card.id)}
              key={card.id}
              className={cn(
                "p-4 cursor-pointer transition-all duration-200",
                "bg-transparent border-primary ring-primary",
                "active:scale-[0.98]",
                checked[card.id]
                  ? 'bg-cyan-900/60 border-cyan-400'
                  : 'hover:border-cyan-500 hover:shadow-md'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4" style={{ ['--glow' as string]: card.glow }}>
                  <img
                    src={card.logo}
                    alt={card.name}
                    className="ml-4 h-12 w-12 transition-transform duration-300 hover:scale-110 hover:drop-shadow-[0_0_10px_var(--glow)]"
                    style={{ ['--glow' as string]: card.glow }}
                  />
                  <span className="pl-4 text-2xl font-medium">{card.name}</span>
                </div>
                <Checkbox
                  checked={!!checked[card.id]}
                  className={cn(
                    "h-6 w-6 pointer-events-none rounded-md",
                    "border-2 border-gray-700 bg-gray-800",
                    "data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-700 data-[state=checked]:text-white"
                  )}
                />
              </div>
            </Card>
          ))}
        </div>

        <h2 className="font-semibold mb-2 text-green-400 text-left text-3xl">Console:</h2>
        <span className="block text-left text-sm text-gray-400">Type "help" to see available commands</span>
        <div ref={consoleContainerRef} className="mt-4 p-4 border border-green-400 rounded bg-black text-green-400 font-mono text-left h-64 overflow-y-auto w-full">
          {history.map((line, i) => (
            <div key={i} className="wrap-break-words">{line}</div>
          ))}

          <div className="flex items-start gap-2">
            <span className="flex-none">&gt; </span>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent outline-none text-green-400 w-full min-w-0 border-none ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
          </div>
        </div>
      </div>
    </main>
    </>
  )
}

export default App