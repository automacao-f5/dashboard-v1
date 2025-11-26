"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DateRangePickerProps {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  className?: string;
}

export function DateRangePicker({ date, onDateChange, className }: DateRangePickerProps) {
  const [selectedPreset, setSelectedPreset] = React.useState<string>("last_7d");

  const presets = [
    {
      label: "Hoje",
      value: "today",
      getRange: () => ({
        from: new Date(),
        to: new Date(),
      }),
    },
    {
      label: "Últimos 7 dias",
      value: "last_7d",
      getRange: () => ({
        from: addDays(new Date(), -6),
        to: new Date(),
      }),
    },
    {
      label: "Últimos 14 dias",
      value: "last_14d",
      getRange: () => ({
        from: addDays(new Date(), -13),
        to: new Date(),
      }),
    },
    {
      label: "Últimos 30 dias",
      value: "last_30d",
      getRange: () => ({
        from: addDays(new Date(), -29),
        to: new Date(),
      }),
    },
    {
      label: "Este mês",
      value: "this_month",
      getRange: () => ({
        from: startOfMonth(new Date()),
        to: new Date(),
      }),
    },
    {
      label: "Mês passado",
      value: "last_month",
      getRange: () => {
        const lastMonth = subMonths(new Date(), 1);
        return {
          from: startOfMonth(lastMonth),
          to: endOfMonth(lastMonth),
        };
      },
    },
  ];

  const handlePresetChange = (value: string) => {
    setSelectedPreset(value);
    const preset = presets.find((p) => p.value === value);
    if (preset) {
      onDateChange(preset.getRange());
    }
  };

  return (
    <div className={cn("flex flex-col gap-2 sm:flex-row sm:items-center", className)}>
      <Select value={selectedPreset} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecione o período" />
        </SelectTrigger>
        <SelectContent>
          {presets.map((preset) => (
            <SelectItem key={preset.value} value={preset.value}>
              {preset.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd 'de' LLL, y", { locale: ptBR })} -{" "}
                  {format(date.to, "dd 'de' LLL, y", { locale: ptBR })}
                </>
              ) : (
                format(date.from, "dd 'de' LLL, y", { locale: ptBR })
              )
            ) : (
              <span>Selecione uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              onDateChange(newDate);
              setSelectedPreset("custom");
            }}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
