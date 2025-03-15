import { Box, Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material';
import { Facility } from '../../../types/facility';
import { useNavigate } from 'react-router-dom';

interface FacilityListProps {
  facilities: Facility[];
  onFacilitySelect: (facility: Facility) => void;
  selectedFacilityId?: string;
}

export const FacilityList = ({ facilities, onFacilitySelect, selectedFacilityId }: FacilityListProps) => {
  const navigate = useNavigate();

  const handleViewDetails = (facilityId: string) => {
    navigate(`/dashboard/facilities/${facilityId}`);
  };

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', overflow: 'auto', pr: 2 }}>
      <Grid container spacing={2}>
        {facilities.map((facility) => (
          <Grid item xs={12} key={facility.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                border: selectedFacilityId === facility.id ? '2px solid #1976d2' : 'none',
              }}
              onClick={() => onFacilitySelect(facility)}
            >
              <CardContent>
                <Typography variant="h6" component="div">
                  {facility.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Type: {facility.type}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {facility.status}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(facility.id);
                  }}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
