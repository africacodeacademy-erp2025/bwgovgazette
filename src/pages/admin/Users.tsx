"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const users = [
  {
    id: "1",
    name: "Tlhalefang",
    email: "tlhalefang@example.com",
    subscription: "Enterprise",
    price: "P1,500",
    startDate: "2024-01-15",
    endDate: "2025-01-15",
  },
  {
    id: "2",
    name: "Amogelang",
    email: "amogelang@example.com",
    subscription: "Subscriber",
    price: "P120",
    startDate: "2024-03-22",
    endDate: "2025-03-22",
  },
  {
    id: "3",
    name: "Kwame",
    email: "kwame@example.com",
    subscription: "Free",
    price: "P0",
    startDate: "2024-05-10",
    endDate: "N/A",
  },
  {
    id: "4",
    name: "Topo",
    email: "topo@example.com",
    subscription: "Pay-Per-Download",
    price: "P50",
    startDate: "2024-06-01",
    endDate: "N/A",
  },
  {
    id: "5",
    name: "Lesedi",
    email: "lesedi@example.com",
    subscription: "Subscriber",
    price: "P120",
    startDate: "2024-02-18",
    endDate: "2025-02-18",
  },
];

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
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.subscription}</TableCell>
                  <TableCell>{user.price}</TableCell>
                  <TableCell>{user.startDate}</TableCell>
                  <TableCell>{user.endDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
