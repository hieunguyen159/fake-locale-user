"use client"

import * as React from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  Area,
  AreaChart,
} from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

// Define the types for the chart components
type ChartComponent = typeof LineChart | typeof BarChart | typeof PieChart | typeof RadialBarChart | typeof AreaChart

type ChartElement = typeof Line | typeof Bar | typeof Pie | typeof RadialBar | typeof Area | typeof CartesianGrid

interface ChartProps extends React.ComponentProps<typeof ChartContainer> {
  children: React.ReactNode
  config: ChartConfig
  className?: string
}

const Chart = ({ children, config, className, ...props }: ChartProps) => {
  const chartComponents = {
    LineChart,
    BarChart,
    PieChart,
    RadialBarChart,
    AreaChart,
  } as Record<string, ChartComponent>

  const chartElements = {
    Line,
    Bar,
    Pie,
    RadialBar,
    Area,
    CartesianGrid,
  } as Record<string, ChartElement>

  const chartType = React.useMemo(() => {
    const flatChildren = React.Children.toArray(children).flat()
    for (const child of flatChildren) {
      if (React.isValidElement(child) && typeof child.type === "function") {
        const displayName = (child.type as any).displayName
        if (displayName && chartComponents[displayName]) {
          return displayName
        }
      }
    }
    return null
  }, [children, chartComponents])

  if (!chartType) {
    return (
      <div className={cn("flex h-[400px] w-full items-center justify-center text-muted-foreground", className)}>
        Failed to infer chart type from children.
      </div>
    )
  }

  return (
    <ChartContainer config={config} className={cn("min-h-[200px] w-full", className)} {...props}>
      {React.createElement(
        chartComponents[chartType],
        {
          // Default chart props, can be overridden by children
          data: [],
          margin: { top: 0, right: 0, left: 0, bottom: 0 },
        },
        React.Children.map(children, (child) => {
          if (React.isValidElement(child) && typeof child.type === "function") {
            const displayName = (child.type as any).displayName
            if (displayName && chartElements[displayName]) {
              return React.cloneElement(child, {
                // Default element props, can be overridden by children
              })
            }
          }
          return child
        }),
      )}
    </ChartContainer>
  )
}

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent }
