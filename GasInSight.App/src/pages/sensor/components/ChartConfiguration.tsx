import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useMemo } from "react";

interface DateRangePickerProps {
  startDate: string;
  endDate: string | null;
  frequency: string | undefined;
  aggregation: "min" | "max" | "mean";
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string | null) => void;
  onFrequencyChange: (freq: string) => void;
  onAggregationChange: (aggregation: "min" | "max" | "mean") => void;
  expectedFreq?: string;
}

const FREQUENCIES = [
  {
    value: "15S",
    label: "15 Seconds",
  },
  {
    value: "30S",
    label: "30 Seconds",
  },
  {
    value: "45S",
    label: "45 Seconds",
  },
  {
    value: "1T",
    label: "1 Minute",
  },
  {
    value: "5T",
    label: "5 Minutes",
  },
  {
    value: "15T",
    label: "15 Minutes",
  },
  {
    value: "30T",
    label: "30 Minutes",
  },
  {
    value: "1H",
    label: "1 Hour",
  },
  {
    value: "3H",
    label: "3 Hours",
  },
  {
    value: "6H",
    label: "6 Hours",
  },
  {
    value: "12H",
    label: "12 Hours",
  },
  {
    value: "1D",
    label: "1 Day",
  },
];

const AGGREGATION_TYPES = [
  {
    value: "mean",
    label: "Average",
  },
  {
    value: "min",
    label: "Minimum",
  },
  {
    value: "max",
    label: "Maximum",
  },
];

export const ChartConfiguration = ({
  startDate,
  endDate,
  frequency,
  aggregation,
  onStartDateChange,
  onEndDateChange,
  onFrequencyChange,
  onAggregationChange,
  expectedFreq,
}: DateRangePickerProps) => {
  const availableFrequencies = useMemo(() => {
    if (!expectedFreq) return [];
    const firstAvailableFrequencyIndex = FREQUENCIES.findIndex(
      (f) => f.value === expectedFreq
    );
    return FREQUENCIES.slice(firstAvailableFrequencyIndex);
  }, [expectedFreq]);

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
      <TextField
        label="Start Date"
        type="datetime-local"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        sx={{ flexBasis: { xs: "100%", md: "calc(30% - 16px)" } }}
      />
      <TextField
        label="End Date (leave empty for current)"
        type="datetime-local"
        value={endDate || ""}
        onChange={(e) => onEndDateChange(e.target.value || null)}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        sx={{ flexBasis: { xs: "100%", md: "calc(30% - 16px)" } }}
      />
      <FormControl
        fullWidth
        sx={{ flexBasis: { xs: "100%", md: "calc(20% - 16px)" } }}
      >
        <InputLabel id="frequency-select-label">Data Interval</InputLabel>
        <Select
          labelId="frequency-select-label"
          id="frequency-select"
          value={frequency}
          label="Data Interval"
          onChange={(e) => onFrequencyChange(e.target.value)}
        >
          {availableFrequencies.map((f) => (
            <MenuItem key={f.value} value={f.value}>
              {f.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl
        fullWidth
        sx={{ flexBasis: { xs: "100%", md: "calc(20% - 16px)" } }}
      >
        <InputLabel id="aggregation-select-label">Aggregation</InputLabel>
        <Select
          labelId="aggregation-select-label"
          id="aggregation-select"
          value={aggregation}
          label="Aggregation"
          onChange={(e) =>
            onAggregationChange(e.target.value as "min" | "max" | "mean")
          }
        >
          {AGGREGATION_TYPES.map((a) => (
            <MenuItem key={a.value} value={a.value}>
              {a.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
