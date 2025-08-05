
'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, FileText, HelpCircle, Sparkles, X, Upload } from 'lucide-react';
import { getAnswerAction } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAppContext } from '@/context/app-context';
import {v4 as uuidv4} from 'uuid';

const formSchema = z.object({
  documentUrl: z.string().optional(),
  question: z.string().min(10, { message: "Your question must be at least 10 characters long." }).max(500, { message: "Your question must be 500 characters or less." }),
  file: z.instanceof(File).optional(),
});


export function QnAForm() {
  const { state, dispatch } = useAppContext();
  const [isPending, startTransition] = useTransition();
  const [answer, setAnswer] = useState<string | null>(null);
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileNameForAnalysis, setFileNameForAnalysis] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentUrl: "",
      question: "",
      file: undefined,
    },
  });

  useEffect(() => {
    if (state.documentToAnalyze) {
        if (state.documentToAnalyze.type === 'url') {
            form.setValue('documentUrl', state.documentToAnalyze.url);
            setSelectedFile(null);
            setFileNameForAnalysis(null);
            form.setValue('file', undefined);
        } else if (state.documentToAnalyze.type === 'file') {
            form.setValue('documentUrl', state.documentToAnalyze.url);
            setFileNameForAnalysis(state.documentToAnalyze.name);
            setSelectedFile(null);
            form.setValue('file', undefined);
        }
        dispatch({ type: 'SET_DOCUMENT_TO_ANALYZE', payload: null });
    }
  }, [state.documentToAnalyze, form, dispatch]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setValue('file', file);
      form.setValue('documentUrl', '');
      setFileNameForAnalysis(null);
      form.clearErrors('documentUrl');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  }
  
  const handleClearFile = () => {
    setSelectedFile(null);
    setFileNameForAnalysis(null);
    form.setValue('file', undefined);
    form.setValue('documentUrl', '');
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setAnswer(null);

    const isFileAnalysis = !!fileNameForAnalysis || !!values.file;
    // Prioritize the documentUrl from the form if it exists (e.g., from re-analysis), otherwise construct it.
    const url = isFileAnalysis 
      ? (values.documentUrl || `file://${values.file?.name}`)
      : values.documentUrl;


    if (!url) {
        form.setError('documentUrl', {type: 'manual', message: 'Please provide a document URL or upload a file.'});
        return;
    }
    
    // Check for valid http/https url if it's not a file analysis
    if (!isFileAnalysis && !/^(http|https):\/\/[^ "]+$/.test(url)) {
        form.setError('documentUrl', { type: 'manual', message: 'Please provide a valid document URL.' });
        return;
    }

    const finalValues = { ...values, documentUrl: url };

    startTransition(async () => {
      const result = await getAnswerAction({ question: finalValues.question, documentUrl: finalValues.documentUrl });
      if (result.success && result.data?.answer) {
        const newAnswer = result.data.answer;
        setAnswer(newAnswer);
        const analysisId = uuidv4();
        
        const documentName = finalValues.file?.name || fileNameForAnalysis || finalValues.documentUrl.split('/').pop()?.split('?')[0] || 'Untitled Document';
        const decodedName = decodeURIComponent(documentName);
        
        const isReanalysis = state.history.some(h => h.documentUrl === finalValues.documentUrl);

        const newHistoryItem = {
          id: analysisId,
          documentUrl: finalValues.documentUrl,
          question: finalValues.question,
          answer: newAnswer,
          timestamp: new Date().toISOString(),
          isReanalysis: isReanalysis,
        };

        dispatch({ type: 'ADD_HISTORY', payload: newHistoryItem });
        
        const existingDoc = state.documents.find(doc => doc.url === finalValues.documentUrl);

        if (!existingDoc) {
             dispatch({ 
                type: 'ADD_DOCUMENT', 
                payload: { 
                    id: uuidv4(),
                    name: decodedName,
                    type: 'Policy', 
                    date: new Date().toLocaleDateString(),
                    status: 'In Review',
                    url: finalValues.documentUrl
                }
            });
        }
        
        dispatch({
          type: 'ADD_ANALYTICS_DATA',
          payload: {
            queriesThisMonth: 1,
            avgProcessingTime: 2.5, // Mock processing time
            documentsProcessed: 1,
          }
        });

        dispatch({
          type: 'ADD_APPROVAL',
          payload: {
            id: analysisId,
            documentName: decodedName,
            question: values.question,
            answer: newAnswer,
            status: 'Pending',
          }
        });
        
        dispatch({
            type: 'ADD_SUGGESTION',
            payload: {
                id: analysisId,
                documentUrl: finalValues.documentUrl,
                question: values.question,
                suggestion: `Based on your question, you might also want to review the section on compliance and auditing.`,
            }
        });

      } else {
        toast({
          variant: "destructive",
          title: "An Error Occurred",
          description: result.error || "Failed to get an answer. Please try again.",
        });
        setAnswer(null);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 lg:gap-6 flex-grow">
      <Card className="w-full flex flex-col flex-grow">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Ask a Question</CardTitle>
              <CardDescription>
                Provide a document and ask a question about its content.
              </CardDescription>
            </div>
             <Button type="button" variant="outline" onClick={handleUploadClick}>
                <Upload className="mr-2 h-4 w-4"/>
                Upload PDF
            </Button>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col flex-grow">
                <div className="space-y-4">
                     {selectedFile || fileNameForAnalysis ? (
                        <div className="space-y-2">
                           <FormLabel className="flex items-center gap-2">
                             <FileText className="h-4 w-4" />
                             PDF Upload
                           </FormLabel>
                           <div className="flex items-center justify-between rounded-md border border-input bg-background p-2">
                               <div className="flex items-center gap-2 truncate">
                                 <span className="text-sm text-foreground truncate">{selectedFile?.name || fileNameForAnalysis}</span>
                               </div>
                               <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleClearFile}>
                                   <X className="h-4 w-4" />
                               </Button>
                           </div>
                        </div>
                     ) : (
                        <FormField
                            control={form.control}
                            name="documentUrl"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Document URL
                                </FormLabel>
                                <FormControl>
                                <Input placeholder="https://example.com/document.pdf" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                     )}
                    
                    {/* Hidden file input */}
                    <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                            <FormItem className="hidden">
                                <FormControl>
                                    <Input 
                                        type="file" 
                                        accept=".pdf"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-grow">
                    <FormLabel className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      Your Question
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., What is the policy on remote work?"
                        className="resize-y no-scrollbar flex-grow"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mt-auto" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Get Answer'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {(isPending || answer) && (
        <Alert className="mt-4">
            <Sparkles className="h-4 w-4" />
            <div className="pl-8">
                <AlertTitle>
                {isPending ? 'Generating Answer...' : 'Answer'}
                </AlertTitle>
                <AlertDescription className="space-y-4">
                {isPending ? (
                    <>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-3/4" />
                    </>
                ) : (
                    <div className="overflow-hidden">
                    <p className="text-sm text-muted-foreground break-words whitespace-pre-line">{answer}</p>
                    </div>
                )}
                </AlertDescription>
            </div>
        </Alert>
      )}
    </div>
  );
}
