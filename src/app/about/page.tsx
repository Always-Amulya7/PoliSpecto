
'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useAppContext } from '@/context/app-context';

export default function AboutPage() {
  const { state } = useAppContext();
  const { teamMembers } = state;

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
                src="https://placehold.co/800x400.png"
                alt="Office"
                layout="fill"
                objectFit="cover"
                data-ai-hint="office team"
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
                    <AvatarImage src={`https://placehold.co/128x128.png`} data-ai-hint="professional portrait" />
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
