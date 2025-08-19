"use client";

import { useParams } from "next/navigation";
import { useAppContext } from "@/context/app-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, HelpCircle, Sparkles, Calendar } from "lucide-react";

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
              <CardTitle className="text-base md:text-lg">
                Analysis Not Found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm md:text-base">
                The requested analysis could not be found. It might have expired
                or never existed.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 p-4 lg:p-6">
        <h1 className="text-lg md:text-2xl font-bold mb-4">Analysis Details</h1>

        <div className="space-y-6">
          {/* Document Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                <FileText className="h-4 w-4 md:h-5 md:w-5" />
                Document
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={analysis.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all text-sm md:text-base"
              >
                {analysis.documentUrl}
              </a>
            </CardContent>
          </Card>

          {/* Question Asked */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                <HelpCircle className="h-4 w-4 md:h-5 md:w-5" />
                Question Asked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line text-sm md:text-base">
                {analysis.question}
              </p>
            </CardContent>
          </Card>

          {/* AI Generated Answer */}
          <Alert className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
            <Sparkles className="h-4 w-4 shrink-0" />
            <div className="flex-1">
              <AlertTitle className="text-sm md:text-base">
                AI Generated Answer
              </AlertTitle>
              <AlertDescription className="whitespace-pre-line text-sm md:text-base">
                {analysis.answer}
              </AlertDescription>
            </div>
          </Alert>

          {/* Timestamp */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                Analysis Timestamp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm md:text-base">
                {new Date(analysis.timestamp).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
