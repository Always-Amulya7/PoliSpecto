"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  CartesianGrid,
  Cell,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  PieChart,
  ResponsiveContainer,
} from "recharts";
import { FileText, Clock, AlertCircle, List } from "lucide-react";
import { useAppContext } from "@/context/app-context";
import { useMemo } from "react";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const barChartConfig = {
  processed: {
    label: "Documents Processed",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function AnalyticsPage() {
  const { state } = useAppContext();
  const { analytics, history } = state;

  // Bar chart data
  const documentsData = useMemo(() => {
    const months: Record<string, number> = {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
    };

    state.history.forEach((item) => {
      const month = new Date(item.timestamp).toLocaleString("default", {
        month: "short",
      });
      if (months[month] !== undefined) months[month]++;
    });

    return Object.keys(months).map((m) => ({ name: m, processed: months[m] }));
  }, [state.history]);

  // Pie chart data
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    state.documents.forEach((doc) => {
      const key = doc.type || "Uncategorized";
      categories[key] = (categories[key] || 0) + 1;
    });
    return Object.keys(categories).map((key, idx) => ({
      name: key,
      value: categories[key],
      fill: `hsl(var(--chart-${idx + 1}))`,
    }));
  }, [state.documents]);

  // Legend config for PieChart
  const pieChartConfig = useMemo(() => {
    const entries = categoryData.map((d) => [
      d.name,
      { label: d.name, color: d.fill },
    ]);
    return Object.fromEntries(entries) as ChartConfig;
  }, [categoryData]);

  return (
    <DashboardLayout>
      <div className="flex flex-col flex-1 p-4 sm:p-6 lg:p-8">
        {/* Stats cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Documents
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {state.documents.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {state.documents.length > 0
                  ? `+${analytics?.documentsProcessed ?? 0} from last analysis`
                  : "No data available"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Processing Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {(analytics?.avgProcessingTime ?? 0).toFixed(1)}s
              </div>
              <p className="text-xs text-muted-foreground">
                Based on last analysis
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Queries This Month
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {analytics?.queriesThisMonth ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Total queries this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Critical Alerts
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No alerts</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          {/* Bar chart */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Documents Processed
              </CardTitle>
              <CardDescription>
                Number of documents processed per month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={barChartConfig}
                className="w-full h-[180px] sm:h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={documentsData} barCategoryGap="20%">
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                      tick={{ fontSize: 10 }}
                      width={30}
                    />
                    <Tooltip cursor={false} content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="processed"
                      radius={6}
                      fill="hsl(var(--primary))"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Pie chart */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Document Categories
              </CardTitle>
              <CardDescription>Distribution of document types.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={pieChartConfig}
                className="w-full h-[220px] sm:h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius="80%"
                      strokeWidth={4}
                    >
                      {categoryData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartLegend
                      content={<ChartLegendContent nameKey="name" />}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent activity */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <List className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                A log of the most recent document analyses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Mobile: stacked list */}
              <div className="space-y-4 sm:hidden">
                {history.length > 0 ? (
                  history.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-3 text-sm space-y-2"
                    >
                      <p className="font-medium truncate">
                        <Link
                          href={`/analysis/${item.id}`}
                          className="hover:underline"
                        >
                          {item.documentUrl}
                        </Link>
                      </p>
                      <p className="text-muted-foreground truncate">
                        {item.question}
                      </p>
                      <div className="flex justify-between items-center text-xs">
                        <span>
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                        <Badge variant="default">Completed</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    No recent activity.
                  </p>
                )}
              </div>

              {/* Desktop: table */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Question</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.length > 0 ? (
                      history.slice(0, 5).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="max-w-xs truncate">
                            <Link
                              href={`/analysis/${item.id}`}
                              className="hover:underline"
                            >
                              {item.documentUrl}
                            </Link>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {item.question}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {new Date(item.timestamp).toLocaleTimeString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="default">Completed</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No recent activity.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
