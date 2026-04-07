
'use client';

import { useParams } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, HelpCircle, Sparkles, Calendar } from 'lucide-react';

export default function AnalysisDetailPage() {
  const params = useParams();
  const { id } = params;
  const { state } = useAppContext();

  const analysis = state.history.find((item) => item.id === id);

  if (!analysis) {
    return (
      <DashboardLayout>
        <div className="flex-1 p-4 lg:p-6 flex items-center justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Analysis Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p>The requested analysis could not be found. It might have expired or never existed.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 p-4 lg:p-6">
        <h1 className="text-2xl font-bold mb-4">Analysis Details</h1>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Document
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <a href={analysis.documentUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                        {analysis.documentUrl}
                    </a>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                       <HelpCircle className="h-5 w-5" />
                        Question Asked
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground whitespace-pre-line">{analysis.question}</p>
                </CardContent>
            </Card>

            <Alert>
                <Sparkles className="h-4 w-4" />
                <div className="pl-8">
                    <AlertTitle>AI Generated Answer</AlertTitle>
                    <AlertDescription className="whitespace-pre-line">
                        {analysis.answer}
                    </AlertDescription>
                </div>
            </Alert>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Analysis Timestamp
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{new Date(analysis.timestamp).toLocaleString()}</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
