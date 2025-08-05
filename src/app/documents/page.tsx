
'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Upload, MoreHorizontal, Trash2, FileSearch, Archive, Eye, Search } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useAppContext } from '@/context/app-context';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DocumentsPage() {
    const { state, dispatch } = useAppContext();
    const { documents } = state;
    const router = useRouter();
    const { toast } = useToast();
    const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
    const [isAlertDialogOpen, setAlertDialogOpen] = useState(false);
    const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [uploadFileName, setUploadFileName] = useState('');
    const [uploadFileUrl, setUploadFileUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDocuments = useMemo(() => {
        return documents
            .filter(doc => doc.status !== 'Archived')
            .filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [documents, searchQuery]);

    const handleDeleteClick = (docId: string) => {
        setDocumentToDelete(docId);
        setAlertDialogOpen(true);
    };
    
    const handleDeleteConfirm = () => {
        if (documentToDelete) {
            dispatch({ type: 'DELETE_DOCUMENT', payload: { id: documentToDelete }});
            setDocumentToDelete(null);
        }
        setAlertDialogOpen(false);
    }
    
    const handleDialogCancel = () => {
        setDocumentToDelete(null);
        setAlertDialogOpen(false);
    }

    const handleViewDetails = (docId: string) => {
      // Find the first history item associated with this document URL to link to.
      const doc = state.documents.find(d => d.id === docId);
      if (!doc) return;
      const historyItem = state.history.find(h => h.documentUrl === doc.url);
      if (historyItem) {
        router.push(`/analysis/${historyItem.id}`);
      } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: "No analysis history found for this document.",
        });
      }
    };
    
    const handleAnalyze = (docId: string) => {
        const doc = state.documents.find(d => d.id === docId);
        if (doc) {
            const isFileUpload = doc.url.startsWith('file://');
            dispatch({ 
                type: 'SET_DOCUMENT_TO_ANALYZE', 
                payload: { 
                    url: doc.url,
                    name: doc.name, 
                    type: isFileUpload ? 'file' : 'url' 
                } 
            });
            router.push('/');
        } else {
             toast({
                variant: "destructive",
                title: "Error",
                description: "Could not find the original URL for this document.",
            });
        }
    };
    
    const handleArchive = (docId: string) => {
        dispatch({ type: 'UPDATE_DOCUMENT_STATUS', payload: { id: docId, status: 'Archived' } });
        toast({
            title: "Document Archived",
            description: "The document has been moved to the archive.",
        });
    };

    const handleUrlUploadSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (uploadFileName && uploadFileUrl) {
            dispatch({
                type: 'ADD_DOCUMENT',
                payload: {
                    id: uuidv4(),
                    name: uploadFileName,
                    url: uploadFileUrl,
                    type: 'Policy', // default type
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
            // NOTE: This is where you would typically handle the file upload to a backend service.
            // For this demo, we will simulate it by adding it to our state with a placeholder URL.
            dispatch({
                type: 'ADD_DOCUMENT',
                payload: {
                    id: uuidv4(),
                    name: selectedFile.name,
                    url: `file://${selectedFile.name}`, // Placeholder URL
                    type: 'Policy',
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
            <h1 className="text-2xl font-semibold">Documents</h1>
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
                                    <Input id="fileName" value={uploadFileName} onChange={(e) => setUploadFileName(e.target.value)} placeholder="e.g., Company Privacy Policy" />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="fileUrl">Document URL</Label>
                                    <Input id="fileUrl" value={uploadFileUrl} onChange={(e) => setUploadFileUrl(e.target.value)} placeholder="https://example.com/document.pdf" />
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
        <Card>
          <CardHeader>
            <CardTitle>All Documents</CardTitle>
            <CardDescription>Manage your company's documents.</CardDescription>
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
                  <TableHead>Date Added</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>{doc.date}</TableCell>
                      <TableCell>
                        <Badge variant={
                            doc.status === 'Active' ? 'default' :
                            doc.status === 'Approved' ? 'default' :
                            doc.status === 'Archived' ? 'secondary' : 
                            doc.status === 'Rejected' ? 'destructive' :
                            'outline'
                          }
                          className={doc.status === 'Approved' ? 'bg-green-600' : ''}
                          >{doc.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleViewDetails(doc.id)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAnalyze(doc.id)}>
                                    <FileSearch className="mr-2 h-4 w-4" />
                                    {['In Review', 'Approved', 'Rejected'].includes(doc.status) ? 'Reanalyze' : 'Analyze'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleArchive(doc.id)}>
                                    <Archive className="mr-2 h-4 w-4" />
                                    Archive
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                    className="text-destructive" 
                                    onClick={() => handleDeleteClick(doc.id)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No documents found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setAlertDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    document and all associated analysis history and approvals.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={handleDialogCancel}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </DashboardLayout>
  );
}

    