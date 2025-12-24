"use client"

import { useEffect, useRef } from "react"
import type React from "react"
import { useInView } from "framer-motion"
import { annotate } from "rough-notation"
import { type RoughAnnotation } from "rough-notation/lib/model"

type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket"

interface HighlighterProps {
  children: React.ReactNode
  action?: AnnotationAction
  color?: string
  strokeWidth?: number
  animationDuration?: number
  iterations?: number
  padding?: number
  multiline?: boolean
  isView?: boolean
  repeat?: boolean
  repeatDelay?: number
  play?: boolean
}

export function Highlighter({
  children,
  action = "highlight",
  color = "#ffd1dc",
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false,
  repeat = false,
  repeatDelay = 2000,
  play = true,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null)
  const annotationRef = useRef<RoughAnnotation | null>(null)

  const isInView = useInView(elementRef, {
    once: false, // If repeating, we might want to reset when re-entering view too, but for looping while in view, this is fine.
    margin: "-10%",
  })

  // If isView is false, always show. If isView is true, wait for inView
  // AND wait for 'play' to be true.
  const shouldShow = play && (!isView || isInView)

  useEffect(() => {
    if (!shouldShow) return

    const element = elementRef.current
    if (!element) return

    const annotationConfig = {
      type: action,
      color,
      strokeWidth,
      animationDuration,
      iterations,
      padding,
      multiline,
    }

    const annotation = annotate(element, annotationConfig)

    annotationRef.current = annotation
    annotationRef.current.show()

    let intervalId: NodeJS.Timeout | null = null

    if (repeat) {
        intervalId = setInterval(() => {
            annotation.hide()
            // Small delay to ensure hide completes visually or just reset logic
            setTimeout(() => {
                annotation.show()
            }, 100)
        }, animationDuration + repeatDelay)
    }

    const resizeObserver = new ResizeObserver(() => {
      annotation.hide()
      annotation.show()
    })

    resizeObserver.observe(element)
    resizeObserver.observe(document.body)

    return () => {
      if (intervalId) clearInterval(intervalId)
      if (element) {
        annotate(element, { type: action }).remove()
        resizeObserver.disconnect()
      }
    }
  }, [
    shouldShow,
    action,
    color,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline,
    repeat,
    repeatDelay
  ])

  return (
    <span ref={elementRef} className="relative inline-block bg-transparent">
      {children}
    </span>
  )
}
