"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"

import { Button } from "./ui/button"
import { useTheme } from "./theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  
  // マウント後にのみクライアントサイドのテーマを反映
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // サーバーサイドレンダリング時はデフォルトのアイコンだけ表示
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">テーマ切替</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      title={theme === "light" ? "ダークモードに切り替え" : "ライトモードに切り替え"}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">
        {theme === "light" ? "ダークモードに切り替え" : "ライトモードに切り替え"}
      </span>
    </Button>
  )
} 