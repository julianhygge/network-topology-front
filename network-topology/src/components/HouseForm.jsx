import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button ,FormControlLabel,Checkbox} from '@mui/material';

const HouseForm = ({ open, onClose, house, onSave, handleChange }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit House Properties</DialogTitle>
            <DialogContent>
                <TextField
                    label="Load Profile"
                    name="load_profile"
                    type="number"
                    value={house.load_profile}
                    onChange={handleChange}
                    fullWidth
                />
              
                   <FormControlLabel
                    control={<Checkbox name="solar" checked={house.solar} onChange={handleChange} />}
                    label="solar"
                />
                {house.solar && (
                    <TextField
                        label="solar"
                        name="solar"
                        type="number"
                        value={house.solar}
                        onChange={handleChange}
                        fullWidth
                    />
                )}
                <TextField
                    label="House Type"
                    name="house_type"
                    value={house.house_type}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label="Connection Number"
                    name="connection_number"
                    value={house.connection_number}
                    onChange={handleChange}
                    fullWidth
                />
               
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default HouseForm;
