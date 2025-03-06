import React from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography} from "@mui/material"

const AlertDialog = ({dialog, setDialog}) => {

    return (
        <Dialog open={dialog.open} onClose={() => setDialog({...dialog, open: false} )}>
            <DialogTitle>{dialog.title}</DialogTitle>
            <DialogContent>
                <Typography>{dialog.content}</Typography>
                </DialogContent>
            <DialogActions>
                <Button onClick={() => setDialog({...dialog, open: false} )} color="background">Cancel</Button>
                <Button onClick={() => {dialog.onConfirm(); setDialog({...dialog, open: false} )}} color="error" >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AlertDialog