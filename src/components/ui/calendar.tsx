"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "../../design-system/cn"
import { buttonVariants } from "./button"

import { addYears } from 'date-fns';

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    const today = new Date();
    const eighteenYearsAgo = addYears(today, -18);
    const hundredYearsAgo = addYears(today, -100);

    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            captionLayout="dropdown" // Enable built-in dropdowns for month and year
            fromYear={hundredYearsAgo.getFullYear()} // Allow selection up to 100 years ago
            toYear={eighteenYearsAgo.getFullYear()} // Restrict selection to users >= 18 years old
            defaultMonth={eighteenYearsAgo} // Default to 18 years ago for easier selection
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-between pt-1 relative items-center", // Adjusted for nav buttons and dropdowns
                caption_label: "text-sm font-medium", // Show default label (month/year text)
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                ),
                nav_button_previous: "absolute left-1", // Position nav buttons
                nav_button_next: "absolute right-1", // Position nav buttons
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell:
                    "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] text-center",
                row: "flex w-full mt-2",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
                ),
                day_range_end: "day-range-end",
                day_selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside:
                    "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle:
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
                dropdown: "rdp-dropdown relative appearance-none bg-background border border-border rounded-md px-2 py-1 text-sm cursor-pointer", // Basic styling for dropdowns
                dropdown_month: "rdp-dropdown_month mx-1", // Styling for month dropdown
                dropdown_year: "rdp-dropdown_year mx-1", // Styling for year dropdown
                button: "rdp-button", // Needed for dropdown focus styles to apply
                button_reset: "rdp-button_reset",
                ...classNames,
            }}
            {...props} // Removed components prop to let DayPicker handle navigation icons with dropdown caption
        />
    )
}
Calendar.displayName = "Calendar"

export { Calendar }
