import { Box, TextField } from "@mui/material";

interface DateRangePickerProps {
  startDate: string;
  endDate: string | null;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string | null) => void;
}

export const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangePickerProps) => {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
      <TextField
        label="Start Date"
        type="datetime-local"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
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
      />
    </Box>
  );
};
