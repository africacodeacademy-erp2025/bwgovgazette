"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ShieldCheck } from 'lucide-react';

export default function Users() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Users</h2>
        <p className="text-sm text-muted-foreground">View and manage platform users</p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Search and manage user accounts</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search users..." className="pl-10 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Placeholder list */}
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <div className="font-medium text-sm">User {i}</div>
                <div className="text-xs text-muted-foreground">user{i}@example.com</div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">View</Button>
                <Button size="sm" className="gap-1"><ShieldCheck className="h-4 w-4" /> Promote</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

