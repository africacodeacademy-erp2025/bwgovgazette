"use client";

"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoreHorizontal } from "lucide-react";

const columns = ["Name", "Surname", "Email", "Subscription", "Subscribed Date", "Expiry Date", "Actions"];

const users = [
  {
    id: "1",
    name: "Tlhogi",
    surname: "Lethu",
    email: "tlhogi@example.com",
    subscription: "Premium",
    subscribedDate: "2023-01-15",
    expiryDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Kwame",
    surname: "Nkrumah",
    email: "kwame@example.com",
    subscription: "Free",
    subscribedDate: "2023-03-20",
    expiryDate: "N/A",
  },
  {
    id: "3",
    name: "Topo",
    surname: "Mokoena",
    email: "topo@example.com",
    subscription: "Premium",
    subscribedDate: "2023-05-10",
    expiryDate: "2024-05-10",
  },
  {
    id: "4",
    name: "Amogelang",
    surname: "Mogale",
    email: "amogelang@example.com",
    subscription: "Premium",
    subscribedDate: "2023-07-01",
    expiryDate: "2024-07-01",
  },
];

export default function ColumnCollaborationTable() {
  return (
    <div className="bg-background p-4 rounded-lg border">
      <ScrollArea className="max-h-[400px]">
        <Table className="w-full border-separate border-spacing-0">
          <TableHeader className="sticky top-0 bg-background/90 backdrop-blur-sm z-10">
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col} className="relative">
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.surname}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.subscription}</TableCell>
                <TableCell>{user.subscribedDate}</TableCell>
                <TableCell>{user.expiryDate}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}