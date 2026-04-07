
'use client';

import { useState, useTransition, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, CheckCircle2, XCircle, Loader2, ClipboardCheck, MessageSquare, Search } from 'lucide-react';
import { useAppContext } from '@/context/app-context';
import type { Document, VerifyDocumentResult } from '@/context/app-context';
import { useToast } from '@/hooks/use-toast';
import { getAnswerAction, verifyDocumentAction } from '@/app/actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from 'uuid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';


export default function TermsCheckPage() {
    const { state, dispatch } = useAppContext();
    const { documents, verificationResults } = state;
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [criteria, setCriteria] = useState('The document must comply with key Indian regulations. Check for clauses related to the Digital Personal Data Protection Act (DPDPA), 2023, specifying data fiduciary responsibilities, user consent requirements, and data breach notification protocols. Also, verify that the jurisdiction for dispute resolution is specified as India.');
    const [verifyingDocId, setVerifyingDocId] = useState<string | null>(null);
    const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [uploadFileName, setUploadFileName] = useState('');
    const [uploadFileUrl, setUploadFileUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const router = useRouter();

    const [isAiTalkOpen, setAiTalkOpen] = useState(false);
    const [aiTalkDoc, setAiTalkDoc] = useState<Document | null>(null);
    const [aiTalkQuestion, setAiTalkQuestion] = useState('');
    const [aiTalkAnswer, setAiTalkAnswer] = useState('');
    const [isAiTalkLoading, setAiTalkLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (documents.length === 0 && Object.keys(verificationResults).length > 0) {
            dispatch({ type: 'CLEAR_VERIFICATION_RESULTS' });
        }
    }, [documents, verificationResults, dispatch]);
    
    const filteredDocuments = useMemo(() => {
        return documents
            .filter(doc => doc.status !== 'Archived')
            .filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [documents, searchQuery]);

    const handleVerify = (docId: string) => {
        if (!criteria || criteria.length < 10) {
            toast({
                variant: 'destructive',
                title: 'Invalid Criteria',
                description: 'Please provide verification criteria of at least 10 characters.',
            });
            return;
        }

        setVerifyingDocId(docId);
        startTransition(async () => {
            const result = await verifyDocumentAction({ documentId: docId, criteria });
            if (result.success && result.data) {
                dispatch({
                    type: 'ADD_VERIFICATION_RESULT',
                    payload: {
                        documentId: docId,
                        ...result.data,
                    },
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Verification Failed',
                    description: result.error || 'An unexpected error occurred.',
                });
            }
            setVerifyingDocId(null);
        });
    };

    const openAiTalk = (doc: Document) => {
        setAiTalkDoc(doc);
        setAiTalkOpen(true);
        setAiTalkAnswer('');
        setAiTalkQuestion('');
    };

    const handleAiTalkSubmit = async () => {
        if (!aiTalkDoc || !aiTalkQuestion) return;

        setAiTalkLoading(true);
        setAiTalkAnswer('');
        const result = await getAnswerAction({ documentUrl: aiTalkDoc.url, question: aiTalkQuestion });
        setAiTalkLoading(false);

        if (result.success && result.data?.answer) {
            setAiTalkAnswer(result.data.answer);
        } else {
            setAiTalkAnswer('Sorry, I was unable to find an answer to that question.');
            toast({
                variant: 'destructive',
                title: 'An Error Occurred',
                description: result.error || 'Failed to get an answer. Please try again.',
            });
        }
    }

    const handleUrlUploadSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (uploadFileName && uploadFileUrl) {
            dispatch({
                type: 'ADD_DOCUMENT',
                payload: {
                    id: uuidv4(),
                    name: uploadFileName,
                    url: uploadFileUrl,
                    type: 'Terms', // default type for this page
                    date: new Date().toLocaleDateString(),
                    status: 'Active',
                }
            });
            toast({
                title: "Document Added",
                description: `"${uploadFileName}" has been added to your documents.`,
            });
            setUploadFileName('');
            setUploadFileUrl('');
            setUploadDialogOpen(false);
        } else {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please provide both a file name and a URL.'
            });
        }
    };
    
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFile(event.target.files[0]);
        }
    }

    const handleFileUploadSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (selectedFile) {
            dispatch({
                type: 'ADD_DOCUMENT',
                payload: {
                    id: uuidv4(),
                    name: selectedFile.name,
                    url: `file://${selectedFile.name}`,
                    type: 'Terms',
                    date: new Date().toLocaleDateString(),
                    status: 'Active',
                }
            });
            toast({
                title: "File Added",
                description: `"${selectedFile.name}" has been added.`,
            });
            setSelectedFile(null);
            setUploadDialogOpen(false);
        } else {
             toast({
                variant: 'destructive',
                title: 'No File Selected',
                description: 'Please select a PDF file to upload.'
            });
        }
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold flex items-center gap-2">
                        <ClipboardCheck className="h-6 w-6" />
                        Terms Check
                    </h1>
                     <Dialog open={isUploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Document
                            </Button>
                        </DialogTrigger>
                       <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Upload a new document</DialogTitle>
                                <DialogDescription>
                                    Add a document from a URL or upload a PDF from your computer.
                                </DialogDescription>
                            </DialogHeader>
                            <Tabs defaultValue="url">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="url">From URL</TabsTrigger>
                                    <TabsTrigger value="pdf">Upload PDF</TabsTrigger>
                                </TabsList>
                                <TabsContent value="url">
                                    <form onSubmit={handleUrlUploadSubmit} className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="fileName">File Name</Label>
                                            <Input id="fileName" value={uploadFileName} onChange={(e) => setUploadFileName(e.target.value)} placeholder="e.g., Service Agreement" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="fileUrl">Document URL</Label>
                                            <Input id="fileUrl" value={uploadFileUrl} onChange={(e) => setUploadFileUrl(e.target.value)} placeholder="https://example.com/terms.pdf" />
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
                                            <Button type="submit">Add Document</Button>
                                        </DialogFooter>
                                    </form>
                                </TabsContent>
                                <TabsContent value="pdf">
                                    <form onSubmit={handleFileUploadSubmit} className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="file">PDF Document</Label>
                                            <Input id="file" type="file" accept=".pdf" onChange={handleFileUpload} />
                                        </div>
                                        {selectedFile && <p className="text-sm text-muted-foreground">Selected: {selectedFile.name}</p>}
                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
                                            <Button type="submit">Upload File</Button>
                                        </DialogFooter>
                                    </form>
                                </TabsContent>
                            </Tabs>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Verification Criteria</CardTitle>
                            <CardDescription>Enter the terms or conditions you want to verify against the documents.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="criteria">Criteria</Label>
                                <Textarea
                                    id="criteria"
                                    placeholder="e.g., The document must contain a data privacy clause."
                                    value={criteria}
                                    onChange={(e) => setCriteria(e.target.value)}
                                    className="min-h-[150px]"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Verification Results</CardTitle>
                             <CardDescription>View the analysis reports for your documents.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 max-h-[240px] overflow-y-auto">
                            {Object.keys(verificationResults).length > 0 ? (
                                Object.entries(verificationResults).map(([docId, result]) => {
                                     const doc = documents.find(d => d.id === docId);
                                    return (
                                        <div key={docId} className="border rounded-lg p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="font-semibold">{doc?.name}</div>
                                                {result.isValid ? (
                                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <XCircle className="h-5 w-5 text-red-500" />
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">{result.reason}</p>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    No verification results yet.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Documents for Verification</CardTitle>
                        <CardDescription>Select a document to verify against the criteria.</CardDescription>
                         <div className="relative pt-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search documents..." 
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredDocuments.length > 0 ? (
                                    filteredDocuments.map((doc) => (
                                        <TableRow key={doc.id}>
                                            <TableCell className="font-medium">{doc.name}</TableCell>
                                            <TableCell>{doc.type}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openAiTalk(doc)}
                                                >
                                                   <MessageSquare className="mr-2 h-4 w-4" />
                                                   AI Talk
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleVerify(doc.id)}
                                                    disabled={isPending || !criteria}
                                                >
                                                    {isPending && verifyingDocId === doc.id ? (
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    ) : null}
                                                    Verify
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center">
                                            No active documents found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

             <Dialog open={isAiTalkOpen} onOpenChange={setAiTalkOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="leading-normal pr-10">{aiTalkDoc?.name}</DialogTitle>
                        <DialogDescription>
                            Ask a question about this document. This conversation will not be saved to your history.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="ai-talk-question">Your Question</Label>
                            <Textarea
                                id="ai-talk-question"
                                value={aiTalkQuestion}
                                onChange={(e) => setAiTalkQuestion(e.target.value)}
                                placeholder="e.g., What is the notice period for termination?"
                            />
                        </div>
                        {isAiTalkLoading && (
                            <div className="flex items-center space-x-2 text-muted-foreground">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Analyzing...</span>
                            </div>
                        )}
                        {aiTalkAnswer && (
                             <div className="space-y-2">
                                <Label>Answer</Label>
                                <Alert>
                                    <AlertDescription className="whitespace-pre-line">{aiTalkAnswer}</AlertDescription>
                                </Alert>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Close</Button>
                        </DialogClose>
                        <Button onClick={handleAiTalkSubmit} disabled={isAiTalkLoading || !aiTalkQuestion}>
                            {isAiTalkLoading ? 'Getting Answer...' : 'Ask'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
