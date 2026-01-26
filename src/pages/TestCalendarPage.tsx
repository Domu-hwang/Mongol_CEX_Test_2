import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/Card';

const TestCalendarPage: React.FC = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-10">
            <h1 className="text-2xl font-bold mb-6 text-foreground">Calendar UI QA</h1>
            <Card className="p-6 bg-card border-border">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    captionLayout="dropdown"
                />
            </Card>
            <div className="mt-6 text-muted-foreground">
                Selected Date: {date?.toDateString()}
            </div>
        </div>
    );
};

export default TestCalendarPage;
