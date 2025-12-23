'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Global Error:', error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="text-center space-y-6">
                        <h2 className="text-3xl font-bold">Something went wrong!</h2>
                        <p className="text-muted-foreground">
                            {error.message || "An unexpected error occurred."}
                        </p>
                        <Button onClick={() => reset()}>Try again</Button>
                    </div>
                </div>
            </body>
        </html>
    );
}
