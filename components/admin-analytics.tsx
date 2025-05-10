"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"

// Mock data for the charts
const dailyData = [
  { date: "May 1", obituaries: 5, eulogies: 2 },
  { date: "May 2", obituaries: 7, eulogies: 3 },
  { date: "May 3", obituaries: 4, eulogies: 1 },
  { date: "May 4", obituaries: 8, eulogies: 4 },
  { date: "May 5", obituaries: 10, eulogies: 5 },
  { date: "May 6", obituaries: 6, eulogies: 3 },
  { date: "May 7", obituaries: 9, eulogies: 4 },
]

const monthlyData = [
  { month: "Jan", obituaries: 45, eulogies: 20 },
  { month: "Feb", obituaries: 52, eulogies: 25 },
  { month: "Mar", obituaries: 48, eulogies: 22 },
  { month: "Apr", obituaries: 61, eulogies: 30 },
  { month: "May", obituaries: 55, eulogies: 28 },
]

const toneData = [
  { name: "Religious", value: 45 },
  { name: "Neutral", value: 35 },
  { name: "Personalized", value: 20 },
]

export default function AdminAnalytics() {
  const [timeframe, setTimeframe] = useState("daily")

  const data = timeframe === "daily" ? dailyData : monthlyData
  const xKey = timeframe === "daily" ? "date" : "month"

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Usage Statistics</h3>
        <Tabs value={timeframe} onValueChange={setTimeframe} className="w-[200px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Obituaries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">261</div>
            <p className="text-xs text-slate-500">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Eulogies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125</div>
            <p className="text-xs text-slate-500">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,890</div>
            <p className="text-xs text-slate-500">+15% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage Over Time</CardTitle>
          <CardDescription>Number of obituaries and eulogies generated</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="obituaries" stroke="#1e293b" fill="#1e293b" fillOpacity={0.1} />
                <Area type="monotone" dataKey="eulogies" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tone Preferences</CardTitle>
          <CardDescription>Distribution of tone selections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={toneData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1e293b" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
