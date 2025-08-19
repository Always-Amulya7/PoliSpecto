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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Archive, ArchiveRestore } from "lucide-react";
import { useAppContext } from "@/context/app-context";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ArchivedDocumentsPage() {
  const { state, dispatch } = useAppContext();
  const { toast } = useToast();

  const archivedDocuments = useMemo(() => {
    return state.documents.filter((doc) => doc.status === "Archived");
  }, [state.documents]);

  const handleUnarchive = (docId: string, docName: string) => {
    dispatch({
      type: "UPDATE_DOCUMENT_STATUS",
      payload: { id: docId, status: "Active" },
    });
    toast({
      title: "Document Restored",
      description: `"${docName}" has been moved back to active documents.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg md:text-2xl font-semibold flex items-center gap-2">
            <Archive className="h-5 w-5 md:h-6 md:w-6" />
            Archived Documents
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Archived Documents</CardTitle>
            <CardDescription>
              View all documents that have been archived. You can restore them
              from here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* DESKTOP TABLE VIEW */}
            <div className="hidden md:block">
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
                        <TableCell className="font-medium">
                          {doc.name}
                        </TableCell>
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
            </div>

            {/* MOBILE CARD VIEW */}
            <div className="grid gap-4 md:hidden">
              {archivedDocuments.length > 0 ? (
                archivedDocuments.map((doc) => (
                  <Card key={doc.id} className="p-4">
                    <div className="flex flex-col gap-2">
                      <p className="font-medium text-sm">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Type: {doc.type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Added: {doc.date}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {doc.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUnarchive(doc.id, doc.name)}
                          aria-label="Unarchive document"
                          className="h-8 w-8"
                        >
                          <ArchiveRestore className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  No archived documents found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
