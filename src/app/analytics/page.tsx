
'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, CartesianGrid, Cell, Legend, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, PieChart, Label } from 'recharts';
import { FileText, Clock, AlertCircle, List } from 'lucide-react';
import { useAppContext } from '@/context/app-context';
import { useMemo } from 'react';
import type { ChartConfig } from '@/components/ui/chart';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';


const chartConfig = {
  processed: {
    label: 'Documents Processed',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;


export default function AnalyticsPage() {
    const { state } = useAppContext();
    const { analytics, history } = state;
    
    const documentsData = useMemo(() => {
        const months: {[key: string]: number} = {
            "Jan": 0, "Feb": 0, "Mar": 0, "Apr": 0, "May": 0, "Jun": 0,
            "Jul": 0, "Aug": 0, "Sep": 0, "Oct": 0, "Nov": 0, "Dec": 0
        };

        state.history.forEach(item => {
            const month = new Date(item.timestamp).toLocaleString('default', { month: 'short' });
            if(months[month] !== undefined) {
                months[month]++;
            }
        });
        
        return Object.keys(months).map(month => ({ name: month, processed: months[month]}));

    }, [state.history]);
    
    const categoryData = useMemo(() => {
        const categories: {[key: string]: number} = {};
        state.documents.forEach(doc => {
            const typeKey = doc.type || 'Uncategorized';
            if(!categories[typeKey]) {
                categories[typeKey] = 0;
            }
            categories[typeKey]++;
        });
        return Object.keys(categories).map(key => ({ name: key, value: categories[key], fill: `hsl(var(--chart-${Object.keys(categories).indexOf(key) + 1}))`}));
    }, [state.documents]);

  return (
    <DashboardLayout>
      <div className="flex h-full flex-1 flex-col p-4 lg:p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{state.documents.length}</div>
                    <p className="text-xs text-muted-foreground">{state.documents.length > 0 ? `+${analytics.documentsProcessed} from last analysis` : 'No data available'}</p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Processing Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{analytics.avgProcessingTime.toFixed(1)}s</div>
                     <p className="text-xs text-muted-foreground">Based on last analysis</p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Queries This Month</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{analytics.queriesThisMonth}</div>
                    <p className="text-xs text-muted-foreground">Total queries this month</p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">No alerts</p>
                </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:gap-6 flex-1 mt-6">
                <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Documents Processed</CardTitle>
                    <CardDescription>Number of documents processed per month.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2 flex-grow">
                  <ChartContainer config={chartConfig} className="w-full h-full min-h-[300px]">
                      <BarChart data={documentsData} accessibilityLayer>
                          <CartesianGrid vertical={false} />
                          <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                          <YAxis tickLine={false} axisLine={false} tickMargin={10} allowDecimals={false} />
                          <Tooltip cursor={false} content={<ChartTooltipContent />} />
                          <Bar dataKey="processed" radius={8} fill="hsl(var(--primary))" />
                      </BarChart>
                  </ChartContainer>
                </CardContent>
                </Card>
                <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Document Categories</CardTitle>
                    <CardDescription>Distribution of document types.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center">
                    <ChartContainer
                      config={{
                        ...Object.fromEntries(categoryData.map(d => [d.name, {label: d.name, color: d.fill}]))
                      }}
                      className="w-full h-[300px]"
                    >
                      <PieChart>
                        <Tooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                          data={categoryData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={60}
                          strokeWidth={5}
                        >
                           {categoryData.map((entry) => (
                              <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                            ))}
                        </Pie>
                         <ChartLegend
                            content={<ChartLegendContent nameKey="name" />}
                          />
                      </PieChart>
                    </ChartContainer>
                </CardContent>
                </Card>
            </div>
            <div className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <List className="h-5 w-5"/>
                            Recent Activity
                        </CardTitle>
                        <CardDescription>A log of the most recent document analyses.</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                                    history.slice(0, 5).map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium truncate max-w-xs">
                                                <Link href={`/analysis/${item.id}`} className="hover:underline">
                                                    {item.documentUrl}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="truncate max-w-xs">{item.question}</TableCell>
                                            <TableCell>{new Date(item.timestamp).toLocaleTimeString()}</TableCell>
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
                    </CardContent>
                </Card>
            </div>
      </div>
    </DashboardLayout>
  );
}
