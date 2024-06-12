import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Checkbox, FormControlLabel } from '@mui/material';

const TransformerForm = ({ open, onClose, transformer, onSave, handleChange }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Transformer Properties</DialogTitle>

            <DialogContent>
                <TextField
                    label="Peak Value"
                    name="peak_value"
                    type="number"
                    value={transformer.peak_value}
                    onChange={handleChange}
                    fullWidth 
                />
                <FormControlLabel
                    control={<Checkbox name="reverse_allowed" checked={transformer.reverse_allowed} onChange={handleChange} />}
                    label="Reverse Allowed"
                />
                {transformer.reverse_allowed && (
                    <TextField
                        label="Reverse Efficiency"
                        name="reverse_efficiency"
                        type="number"
                        value={transformer.reverse_efficiency}
                        onChange={handleChange}
                        fullWidth
                    />
                )}
                <TextField
                    label="Max Houses"
                    name="max_houses"
                    type="number"
                    value={transformer.max_houses}
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

export default TransformerForm;
