import { useState, useEffect } from 'react'

export function useRibbons() {
  const [ribbons, setRibbons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRibbons()
  }, [])

  const fetchRibbons = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/ribbons')
      if (!response.ok) throw new Error('Failed to fetch ribbons')
      const data = await response.json()
      setRibbons(data)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return { ribbons, loading, error, refetch: fetchRibbons }
}

export function useBows() {
  const [bows, setBows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBows()
  }, [])

  const fetchBows = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/bows')
      if (!response.ok) throw new Error('Failed to fetch bows')
      const data = await response.json()
      setBows(data)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return { bows, loading, error, refetch: fetchBows }
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/recipes')
      if (!response.ok) throw new Error('Failed to fetch recipes')
      const data = await response.json()
      setRecipes(data)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return { recipes, loading, error, refetch: fetchRecipes }
} 