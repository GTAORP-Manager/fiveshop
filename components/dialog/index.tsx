import * as React from 'react'
import List from '@mui/material/List'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import { ListItem } from '@mui/material'

export interface SimpleDialogProps {
  open: boolean
  selectedValue?: string
  onClose?: (value: string) => void
  component: (data: any) => JSX.Element
  data: any[]
}

export default (props: SimpleDialogProps) => {

  const handleClose = () => {
    if (props.onClose && props.selectedValue) props.onClose(props.selectedValue)
  }

  return (
    <Dialog onClose={handleClose} open={props.open}>
      <DialogTitle>Konto wechseln</DialogTitle>
      <List sx={{ pt: 0 }}>
        {props.data.map((data) => (
          <props.component {...data}/>
        ))}
      </List>
    </Dialog>
  )
}
