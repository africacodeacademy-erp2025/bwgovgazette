"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UploadDocumentDialog from '@/components/admin/UploadDocumentDialog';
import { Upload } from 'lucide-react';

export default function UploadDocument() {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Upload Document</h2>
        <p className="text-sm text-muted-foreground">Add new gazette files to the system</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload</CardTitle>
          <CardDescription>Select a PDF to upload and process</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Button className="flex items-center gap-2" onClick={() => setOpen(true)}>
            <Upload className="h-4 w-4" /> Choose File
          </Button>
          <span className="text-xs text-muted-foreground">Supported: PDF</span>
        </CardContent>
      </Card>
      <UploadDocumentDialog open={open} onOpenChange={setOpen} onDocumentUploaded={() => setOpen(false)} />
    </div>
  );
}

