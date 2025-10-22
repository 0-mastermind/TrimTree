"use client"
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import employees from './data'
import EmployeeCard from './EmployeeCard'
import { useRouter } from 'next/navigation'
import { MoveRight } from 'lucide-react'

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function getRandomEmployees<T>(array: T[], count: number, prevSet: Set<any> = new Set()): T[] {
  if (array.length <= count) return [...array]
  let attempt = 0
  let selection: T[] = []
  do {
    selection = shuffleArray(array).slice(0, count)
    attempt++
    const overlap = selection.filter((e) => prevSet.has(getEmployeeId(e))).length
    if (overlap < Math.floor(count / 2) || attempt > 5) break
  } while (true)
  return selection
}

function getEmployeeId(employee: any) {
  return employee.id || employee.email || employee.name
}

const Team = () => {
  const router = useRouter()
  const [randomEmployees, setRandomEmployees] = useState(
    () => employees.slice(0, 6) // SSR-safe, deterministic initial render
  )
  const [key, setKey] = useState(0)
  const prevEmployeeIds = useRef(new Set(randomEmployees.map(getEmployeeId)))

  useEffect(() => {
    // Randomize once after mount
    const initial = getRandomEmployees(employees, 6)
    setRandomEmployees(initial)
    prevEmployeeIds.current = new Set(initial.map(getEmployeeId))
    setKey((prev) => prev + 1)

    const interval = setInterval(() => {
      const next = getRandomEmployees(employees, 6, prevEmployeeIds.current)
      prevEmployeeIds.current = new Set(next.map(getEmployeeId))
      setRandomEmployees(next)
      setKey((prev) => prev + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='py-20 px-3'>
      <h6 className="text-center text-lg text-[var(--text-primary)] font-secondary capitalize">
        - Team
      </h6>
      <h1 className="my-10 text-4xl md:text-5xl max-w-[700px] text-center mx-auto text-[var(--text-primary)]">
        Meet the experts behind your perfect hairs
      </h1>
      <div className='grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3' style={{ perspective: '1500px' }}>
        <AnimatePresence mode="popLayout">
          {randomEmployees.map((employee, index) => (
            <motion.div
              key={`${key}-${getEmployeeId(employee)}`}
              initial={{ 
                rotateY: 180,
                opacity: 0,
                scale: 0.7,
                z: -100
              }}
              animate={{ 
                rotateY: 0,
                opacity: 1,
                scale: 1,
                z: 0
              }}
              exit={{ 
                rotateY: -180,
                opacity: 0,
                scale: 0.7,
                z: -100
              }}
              transition={{
                duration: 0.8,
                delay: index * 0.08,
                type: "spring",
                stiffness: 80,
                damping: 15
              }}
              style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden'
              }}
            >
              <EmployeeCard employee={employee} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex justify-center mt-8">
        <button
          className="flex gap-2 px-4 py-3 font-semibold justify-center items-center  font-secondary border-2 hover:bg-[#ffaa00] border-[#ffaa00] rounded-2xl  hover:text-white transition-colors duration-300 cursor-pointer text-[var(--text-primary)]"
          onClick={() => router.push('/team')}
        >
          See All <MoveRight className='h-5 w-5' />
        </button>
      </div>
    </div>
  )
}

export default Team