import { Layout } from '@/components/Layout';
import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <Layout>
            <div className="h-[50vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        </Layout>
    );
}
