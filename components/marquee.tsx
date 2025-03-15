"use client"

import { useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import Image from "next/image"

export function Marquee() {
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const marqueeElement = marqueeRef.current
    if (!marqueeElement) return

    const scrollWidth = marqueeElement.scrollWidth
    const clientWidth = marqueeElement.clientWidth

    if (scrollWidth <= clientWidth) return

    let position = 0
    const speed = 0.5

    const scroll = () => {
      position -= speed
      if (position <= -scrollWidth / 2) {
        position = 0
      }
      if (marqueeElement) {
        marqueeElement.style.transform = `translateX(${position}px)`
      }
      requestAnimationFrame(scroll)
    }

    const animation = requestAnimationFrame(scroll)

    return () => {
      cancelAnimationFrame(animation)
    }
  }, [])

  const partners = [
    { name: "Coinbase", logo: "/logos/coinbase.svg", width: 120 },
    { name: "LogX", logo: "/logos/logx.svg", width: 80 },
    { name: "Zetachain", logo: "/logos/zetachain.svg", width: 100 },
    { name: "Base", logo: "/logos/base.svg", width: 80 },
    { name: "Coinbase", logo: "/logos/coinbase.svg", width: 120 },
    { name: "LogX", logo: "/logos/logx.svg", width: 80 },
    { name: "Zetachain", logo: "/logos/zetachain.svg", width: 100 },
    { name: "Base", logo: "/logos/base.svg", width: 80 },
  ]

  return (
    <div className="w-full overflow-hidden">
      <div className="flex" ref={marqueeRef}>
        {partners.map((partner, index) => (
          <Card key={index} className="flex-shrink-0 mx-4 p-4 border border-border/30 shadow-sm">
            <div className="flex items-center justify-center h-8">
              <Image src={partner.logo} alt={partner.name} width={partner.width} height={28} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

