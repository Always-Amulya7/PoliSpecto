
'use client';

import { QnAForm } from './qna-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Info, ThumbsDown, ThumbsUp } from 'lucide-react';
import { DashboardLayout } from './dashboard-layout';
import { useAppContext } from '@/context/app-context';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useState } from 'react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';

const AiSuggestion = () => {
  const { state } = useAppContext();
  return (
    <Card className="flex flex-col flex-grow">
      <CardHeader>
        <CardTitle>AI Suggestions</CardTitle>
        <CardDescription>Follow-up questions based on your queries.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {state.suggestions.length > 0 ? (
           <div className="space-y-4 max-h-80 overflow-y-auto no-scrollbar">
            {state.suggestions.map((suggestion) => {
               const historyItem = state.history.find(h => h.id === suggestion.id);
               const isReanalysis = historyItem?.isReanalysis;
              return (
              <Alert key={suggestion.id}>
                <Info className="h-4 w-4" />
                <div className="pl-8">
                  <div className="flex justify-between items-start">
                    <div>
                        <AlertTitle className="leading-snug">Suggestion For-</AlertTitle>
                        <p className="whitespace-pre-line text-sm text-muted-foreground mt-1">{suggestion.question}</p>
                    </div>
                    {isReanalysis && <Badge variant="outline" className="ml-2 shrink-0">Reanalyzed</Badge>}
                  </div>
                  <AlertDescription className="mt-2">
                    <p>{suggestion.suggestion}</p>
                    <Link href={`/analysis/${suggestion.id}`} className="text-xs text-primary hover:underline mt-2 inline-block">
                        View Original Analysis
                    </Link>
                  </AlertDescription>
                </div>
              </Alert>
            )})}
           </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p className="text-sm">
              No suggestions at the moment. Ask a question to get an AI suggestion.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const DocumentHistory = () => {
  const { state } = useAppContext();

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Analyzed History</CardTitle>
        <CardDescription>Recently analyzed documents.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-h-80 overflow-y-auto no-scrollbar">
        {state.history.length > 0 ? (
          <ul className="space-y-3">
            {state.history.map((item) => (
              <li key={item.id}>
                <Link href={`/analysis/${item.id}`}>
                  <div className="border rounded-lg p-3 hover:bg-muted transition-colors">
                    <div className="flex justify-between items-start">
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{item.question}</p>
                          <p className="text-sm text-muted-foreground truncate">{item.documentUrl}</p>
                        </div>
                        {item.isReanalysis && <Badge variant="outline">Reanalyzed</Badge>}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No recent history.
          </div>
        )}
      </CardContent>
    </Card>
  );
};


const DocumentApproval = () => {
  const { state, dispatch } = useAppContext();
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    id: string | null;
    action: 'Approved' | 'Rejected' | null;
    isOverride: boolean;
  }>({ isOpen: false, id: null, action: null, isOverride: false });

  const [reason, setReason] = useState('');

  const isAnalysisPositive = (answer: string) => {
    const negativeKeywords = ['cannot', 'not found', 'unable to answer', 'do not'];
    return !negativeKeywords.some(keyword => answer.toLowerCase().includes(keyword));
  };

  const handleOpenDialog = (id: string, action: 'Approved' | 'Rejected', analysisIsPositive: boolean) => {
    const isOverride = (action === 'Approved' && !analysisIsPositive) || (action === 'Rejected' && analysisIsPositive);
    setDialogState({ isOpen: true, id, action, isOverride });
  };

  const handleCloseDialog = () => {
    setDialogState({ isOpen: false, id: null, action: null, isOverride: false });
    setReason('');
  }

  const handleSubmitReason = () => {
    if (dialogState.id && dialogState.action) {
      dispatch({ type: 'UPDATE_APPROVAL_STATUS', payload: { id: dialogState.id, status: dialogState.action, reason } });
      handleCloseDialog();
    }
  }

  const getDialogTitle = () => {
    if (!dialogState.action) return '';
    return dialogState.isOverride ? 'Provide a reason' : 'Additional Information';
  };

  const getDialogDescription = () => {
    if (!dialogState.action) return '';
    if (dialogState.isOverride) {
      return `You are overriding the AI's suggestion. Please provide a reason for ${dialogState.action === 'Approved' ? 'approving' : 'rejecting'} this document.`;
    }
    return `Please provide any additional information for this ${dialogState.action === 'Approved' ? 'approval' : 'rejection'}. (Optional)`;
  };

  return (
     <>
      <Card className="flex flex-col flex-grow">
        <CardHeader>
          <CardTitle>Document Approval</CardTitle>
          <CardDescription>Review and approve documents based on analysis.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col max-h-96 overflow-y-auto no-scrollbar">
          {state.approvals.length > 0 ? (
            <ul className="space-y-3">
              {state.approvals.map((approval) => {
                const isPositive = isAnalysisPositive(approval.answer);
                const historyItem = state.history.find(h => h.id === approval.id);
                const isReanalysis = historyItem?.isReanalysis;
                return (
                  <li key={approval.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="font-semibold truncate">{approval.documentName}</p>
                            {isReanalysis && <Badge variant="outline">Reanalyzed</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">Based on: "{approval.question}"</p>
                      </div>
                      {approval.status === 'Pending' ? (
                         <div className="flex items-center gap-2 flex-shrink-0">
                          <Button 
                              variant={isPositive ? 'default' : 'outline'} 
                              size="icon" 
                              className={`h-8 w-8 ${isPositive ? 'bg-green-600 hover:bg-green-700 text-white' : 'text-green-500 hover:bg-green-50 hover:text-green-600'}`}
                              onClick={() => handleOpenDialog(approval.id, 'Approved', isPositive)}>
                              <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button 
                              variant={!isPositive ? 'destructive' : 'outline'} 
                              size="icon" 
                              className={`h-8 w-8 ${!isPositive ? '' : 'text-red-500 hover:bg-red-50 hover:text-red-600'}`}
                              onClick={() => handleOpenDialog(approval.id, 'Rejected', isPositive)}>
                              <ThumbsDown className="h-4 w-4" />
                          </Button>
                      </div>
                      ) : (
                         <span className={`text-sm font-semibold flex-shrink-0 ${approval.status === 'Approved' ? 'text-green-500' : 'text-red-500'}`}>{approval.status}</span>
                      )}
                    </div>
                     {approval.status !== 'Pending' && approval.reason && (
                      <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">Note: {approval.reason}</p>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
              No documents awaiting approval.
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={dialogState.isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>{getDialogDescription()}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reason">{dialogState.isOverride ? 'Reason' : 'Notes'}</Label>
            <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmitReason}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export function Dashboard() {
  return (
    <DashboardLayout>
      <div className="flex-1 p-4 lg:p-6 flex flex-col">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full flex-1">
          <div className="flex flex-col w-full lg:w-3/5 gap-4 lg:gap-6 min-w-0">
            <QnAForm />
            <AiSuggestion />
          </div>
          <div className="flex flex-col w-full lg:w-2/5 gap-4 lg:gap-6 min-w-0">
            <DocumentHistory />
            <DocumentApproval />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
