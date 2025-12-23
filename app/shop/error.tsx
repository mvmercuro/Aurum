'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Shop Page Error:', error);
    }, [error]);

    return (
        <Layout>
            <div className="container mx-auto py-16 px-4 text-center space-y-8">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight">Something went wrong!</h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        We encountered an error loading the shop. This might be due to a temporary connection issue.
                    </p>
                </div>
                <div className="flex justify-center gap-4">
                    <Button onClick={() => reset()} variant="default">
                        Try again
                    </Button>
                    <Button variant="outline" onClick={() => window.location.href = '/'}>
                        Return Home
                    </Button>
                </div>
            </div>
        </Layout>
    );
}
