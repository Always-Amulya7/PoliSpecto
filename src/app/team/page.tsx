"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
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
import { UserPlus, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/app-context";
import { useAuth } from "@/hooks/use-auth";
import type { TeamMember } from "@/context/app-context";

export default function TeamPage() {
  const { state, dispatch } = useAppContext();
  const { teamMembers } = state;
  const { user } = useAuth();
  const { toast } = useToast();

  const [isInviteOpen, setInviteOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);

  const handleInviteSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as "Admin" | "Editor" | "Viewer";

    if (name && email && role) {
      const newMember: TeamMember = {
        name,
        email,
        role,
        avatar: "",
        initials: name
          .split(" ")
          .map((n) => n[0])
          .join(""),
      };
      dispatch({ type: "ADD_TEAM_MEMBER", payload: newMember });
      toast({
        title: "Success",
        description: `${name} has been invited to the team.`,
      });
      setInviteOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill out all fields.",
      });
    }
  };

  const handleRemoveMember = () => {
    if (memberToRemove) {
      dispatch({
        type: "REMOVE_TEAM_MEMBER",
        payload: { email: memberToRemove.email },
      });
      toast({
        title: "Success",
        description: `${memberToRemove.name} has been removed from the team.`,
      });
      setMemberToRemove(null);
    }
  };

  const isAdmin =
    teamMembers.find((m) => m.email === user?.email)?.role === "Admin";

  const getGoogleProfileImage = (email: string) => {
    return `https://www.google.com/s2/photos/profile/${email}`;
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl">Team Members</h1>
          <Dialog open={isInviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button disabled={!isAdmin}>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite a new team member</DialogTitle>
                <DialogDescription>
                  Enter the details of the person you want to invite.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select name="role" defaultValue="Viewer">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Editor">Editor</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">Send Invitation</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* MANAGE TEAM */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Team</CardTitle>
            <CardDescription>
              Invite, remove, and manage roles for your team members.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.length > 0 ? (
                    teamMembers.map((member) => (
                      <TableRow key={member.email}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src={getGoogleProfileImage(member.email)}
                              />
                              <AvatarFallback>{member.initials}</AvatarFallback>
                            </Avatar>
                            <span>{member.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                          <Select
                            defaultValue={member.role}
                            disabled={!isAdmin || member.email === user?.email}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Admin">Admin</SelectItem>
                              <SelectItem value="Editor">Editor</SelectItem>
                              <SelectItem value="Viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={
                                  !isAdmin || member.email === user?.email
                                }
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>View Activity</DropdownMenuItem>
                              {isAdmin && member.email !== user?.email && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => setMemberToRemove(member)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove User
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No team members found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* MOBILE VIEW: Cards */}
            <div className="grid gap-4 md:hidden">
              {teamMembers.length > 0 ? (
                teamMembers.map((member) => (
                  <Card key={member.email} className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={getGoogleProfileImage(member.email)}
                        />
                        <AvatarFallback>{member.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <Select
                        defaultValue={member.role}
                        disabled={!isAdmin || member.email === user?.email}
                      >
                        <SelectTrigger className="w-[120px] h-8 text-xs">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Editor">Editor</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={!isAdmin || member.email === user?.email}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>View Activity</DropdownMenuItem>
                          {isAdmin && member.email !== user?.email && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setMemberToRemove(member)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove User
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  No team members found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* REMOVE MEMBER CONFIRMATION */}
      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={(isOpen) => !isOpen && setMemberToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {memberToRemove?.name} from the team.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveMember}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
