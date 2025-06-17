
"use client";

import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAppStore } from "@/lib/store";
import type { UserProfile } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const profileSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters").max(50, "Username too long"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(200, "Bio too long").optional(),
  avatarUrl: z.string().url("Invalid URL for avatar").optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { userProfile, setUserProfile } = useAppStore();
  const { toast } = useToast();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: userProfile.username || '',
      email: userProfile.email || '',
      bio: userProfile.bio || '',
      avatarUrl: userProfile.avatarUrl || '',
    },
  });

  React.useEffect(() => {
    form.reset({
      username: userProfile.username,
      email: userProfile.email,
      bio: userProfile.bio || '',
      avatarUrl: userProfile.avatarUrl || '',
    });
  }, [userProfile, form]);

  const onSubmit = (data: ProfileFormData) => {
    setUserProfile(data);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  };

  return (
    <AppLayout title="My Profile">
      <div className="w-full max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Edit Your Profile</CardTitle>
                <CardDescription>Update your personal information below.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-24 h-24 md:w-32 md:h-32 ring-2 ring-primary ring-offset-2 ring-offset-background">
                    <AvatarImage 
                      src={form.watch('avatarUrl') || userProfile.avatarUrl || "https://placehold.co/128x128.png"} 
                      alt={userProfile.username}
                      data-ai-hint="avatar profile"
                    />
                    <AvatarFallback>{userProfile.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Avatar URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/avatar.png" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us a little about yourself" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-6 mt-6 gap-3">
                <Button variant="outline" asChild className="w-full sm:w-auto">
                  <Link href="/settings">
                    <ArrowLeft /> Back to Settings
                  </Link>
                </Button>
                <Button type="submit" className="w-full sm:w-auto">Save Changes</Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </AppLayout>
  );
}
