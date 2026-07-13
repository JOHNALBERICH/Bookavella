import { useState } from "react";
import { format, isAfter } from "date-fns";
import { CalendarIcon, Minus, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "../../@/components/ui/card";
import { Button } from "../../@/components/ui/button";
import { Calendar } from "../../@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../@/components/ui/form";

const searchSchema = z
  .object({
    checkIn: z.date({
      message : "Check-in date is required",
    }),
    checkOut: z.date({
      message : "Check-out date is required",
    }),
    guests: z.number().min(1).max(10),
  })
  .refine(
    ({ checkIn, checkOut }) => checkOut > checkIn,
    {
        message: "Check-out must be after check-in",
        path: ["checkOut"],
    }
);

type SearchFormValues = z.infer<typeof searchSchema>;

interface BookingSearchPanelProps {
  maxGuests?: number;
  onSearch: (data: {
    checkIn: string;
    checkOut: string;
    guests: number;
  }) => void;
}

export function BookingSearchPanel({
  maxGuests = 10,
  onSearch,
}: BookingSearchPanelProps) {
  const [openCheckIn, setOpenCheckIn] = useState(false);
  const [openCheckOut, setOpenCheckOut] = useState(false);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      guests: 2,
    },
    mode: "onChange",
  });

  const checkInValue = form.watch("checkIn");
  const checkOutValue = form.watch("checkOut");

  const handleDecreaseGuests = () => {
    const currentValue = form.getValues("guests");
    if (currentValue > 1) {
      form.setValue("guests", currentValue - 1, { shouldValidate: true });
    }
  };

  const handleIncreaseGuests = () => {
    const currentValue = form.getValues("guests");
    if (currentValue < maxGuests) {
      form.setValue("guests", currentValue + 1, { shouldValidate: true });
    }
  };

  const handleSubmit = (values: SearchFormValues) => {
    onSearch({
      checkIn: format(values.checkIn, "yyyy-MM-dd"),
      checkOut: format(values.checkOut, "yyyy-MM-dd"),
      guests: values.guests,
    });
  };

  const {
    formState: { isValid }
} = form;

  return (
    <Card className="w-full shadow-sm border rounded-xl overflow-hidden">
      <CardHeader className="pb-4 px-5 pt-5">
        <CardTitle className="text-xl font-semibold tracking-tight">
          Reserve Your Stay
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="checkIn"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Check In
                    </FormLabel>
                    <Popover open={openCheckIn} onOpenChange={setOpenCheckIn}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal h-11 ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "MMM dd, yyyy")
                            ) : (
                              <span>Select date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if(!date) return;
                            field.onChange(date);
                            setOpenCheckIn(false);
                            if (date && checkOutValue && isAfter(checkOutValue, date)) {
                              form.trigger("checkOut");
                            }
                          }}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="checkOut"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Check Out
                    </FormLabel>
                    <Popover open={openCheckOut} onOpenChange={setOpenCheckOut}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal h-11 ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "MMM dd, yyyy")
                            ) : (
                              <span>Select date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if(!date) return;
                            field.onChange(date);
                            setOpenCheckOut(false);
                            if (date && checkInValue) {
                              form.trigger("checkOut");
                            }
                          }}
                          disabled={(date) => {
                            if (!checkInValue) return date < new Date();
                            return date <= checkInValue || date < new Date();
                          }}
                            
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guests"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Guests
                    </FormLabel>
                    <div className="flex items-center justify-between h-11 px-3 border rounded-md bg-background">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-muted"
                        onClick={handleDecreaseGuests}
                        disabled={field.value <= 1}
                        aria-label="Decrease guests"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">
                        {field.value}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-muted"
                        onClick={handleIncreaseGuests}
                        disabled={field.value >= maxGuests}
                        aria-label="Increase guests"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors mt-2"
              disabled={!isValid}
            >
              Search Rooms
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}