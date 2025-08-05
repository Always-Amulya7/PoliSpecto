
'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useAppContext } from '@/context/app-context';
import { useState, useEffect } from 'react';
import { generateImageAction } from '@/app/actions';
import { Loader2, Package2 } from 'lucide-react';

export default function AboutPage() {
  const { state } = useAppContext();
  const { teamMembers } = state;
  const [aboutImage, setAboutImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
        setIsLoading(true);
        const result = await generateImageAction('modern office interior, professional, clean, bright, abstract art');
        if (result.success && result.data?.imageUrl) {
            setAboutImage(result.data.imageUrl);
        } else {
            // Fallback in case of error
            setAboutImage("https://placehold.co/800x400.png");
        }
        setIsLoading(false);
    }
    fetchImage();
  }, []);

  const getGoogleProfileImage = (email: string) => {
    return `https://www.google.com/s2/photos/profile/${email}`;
  }

  if (isLoading) {
      return (
          <DashboardLayout>
            <div className="flex h-full w-full flex-col items-center justify-center bg-background">
                <div className="relative flex h-20 w-20 items-center justify-center">
                    <Loader2 className="absolute h-20 w-20 animate-spin text-primary" />
                    <Package2 className="h-10 w-10 text-primary" />
                </div>
                <p className="mt-4 text-lg font-semibold text-primary">Loading Page...</p>
            </div>
         </DashboardLayout>
      );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">About PoliSpecto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              PoliSpecto is a revolutionary platform designed to bring clarity and insight to complex policy documents. Using cutting-edge AI, we empower organizations to quickly understand, analyze, and act on policy information, saving time and reducing risk. Our mission is to make policy accessible and manageable for everyone.
            </p>
            <div className="relative h-64 w-full overflow-hidden rounded-lg">
              <Image
                src={aboutImage}
                alt="Office"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To transform the way organizations interact with policy documents through intelligent automation and intuitive design, fostering a culture of clarity, compliance, and confidence.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Meet the Team</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <div key={member.email} className="flex flex-col items-center gap-4 rounded-lg border p-4 text-center">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={getGoogleProfileImage(member.email)} />
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground">
                No team members to display.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
