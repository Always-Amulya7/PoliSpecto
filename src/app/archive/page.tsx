
'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Archive, ArchiveRestore } from 'lucide-react';
import { useAppContext } from '@/context/app-context';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function ArchivedDocumentsPage() {
    const { state, dispatch } = useAppContext();
    const { toast } = useToast();
    
    const archivedDocuments = useMemo(() => {
        return state.documents.filter(doc => doc.status === 'Archived');
    }, [state.documents]);

    const handleUnarchive = (docId: string, docName: string) => {
        dispatch({ type: 'UPDATE_DOCUMENT_STATUS', payload: { id: docId, status: 'Active' }});
        toast({
            title: "Document Restored",
            description: `"${docName}" has been moved back to active documents.`,
        });
    }

  return (
    <DashboardLayout>
       <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
                <Archive className="h-6 w-6" />
                Archived Documents
            </h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Archived Documents</CardTitle>
            <CardDescription>View all documents that have been archived. You can restore them from here.</CardDescription>
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
                {archivedDocuments.length > 0 ? (
                  archivedDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>{doc.date}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{doc.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleUnarchive(doc.id, doc.name)}
                            aria-label="Unarchive document"
                          >
                              <ArchiveRestore className="h-4 w-4" />
                          </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No archived documents found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
