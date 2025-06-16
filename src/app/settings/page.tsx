"use client";

import React from 'react';
import AppLayout from "@/components/layout/AppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, MapPin, History, Info, HelpCircle, MessageSquare, LogOut } from "lucide-react";
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/lib/store';

interface SettingsItemProps {
  icon: React.ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
  isExternal?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon: Icon, label, href, onClick, isExternal }) => {
  const content = (
    <div className="flex items-center space-x-3 p-3 hover:bg-muted/50 rounded-md transition-colors cursor-pointer">
      <Icon className="h-5 w-5 text-primary" />
      <span>{label}</span>
    </div>
  );

  if (href) {
    if (isExternal) {
      return <a href={href} target="_blank" rel="noopener noreferrer">{content}</a>;
    }
    return <Link href={href}>{content}</Link>;
  }
  return <div onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onClick?.()}>{content}</div>;
};

export default function SettingsPage() {
  const { toast } = useToast();
  const { userProfile } = useAppStore();

  const handlePlaceholderClick = (featureName: string) => {
    toast({
      title: "Feature Not Implemented",
      description: `${featureName} will be available in a future update.`,
    });
  };


  return (
    <AppLayout title="Settings / More">
      <div className="max-w-2xl mx-auto space-y-8">
        <Card className="shadow-lg">
          <CardHeader className="items-center text-center">
            <Avatar className="w-24 h-24 mb-4 ring-2 ring-primary ring-offset-2 ring-offset-background">
              <AvatarImage src={userProfile.avatarUrl || "https://placehold.co/100x100.png"} alt={userProfile.username} data-ai-hint="avatar profile" />
              <AvatarFallback>{userProfile.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{userProfile.username || 'Username'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <SettingsItem icon={User} label="My Profile" href="/profile" />
            <SettingsItem icon={MapPin} label="Region Settings" onClick={() => handlePlaceholderClick("Region Settings")} />
            <Separator />
            <SettingsItem icon={History} label="History Records" href="/history" />
            <Separator />
            <SettingsItem icon={Info} label="About Us" onClick={() => handlePlaceholderClick("About Us")} />
            <SettingsItem icon={HelpCircle} label="Help Center" onClick={() => handlePlaceholderClick("Help Center")} />
            <SettingsItem icon={MessageSquare} label="Feedback & Suggestions" onClick={() => handlePlaceholderClick("Feedback & Suggestions")} />
            <Separator />
            <SettingsItem icon={LogOut} label="Logout" onClick={() => handlePlaceholderClick("Logout")} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
