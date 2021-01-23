import React,{useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  makeStyles
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  fileInput:{
    padding:"10px 10px",
    marginTop:"10px"
  }
}));

const Toolbar = ({handleDrawer, className,sendBulk, ...rest }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [csv, setCsv] = useState('')
  const [loading, setLoading] = useState(false)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCsv('')
  };

  const handleSave=()=>{
    setLoading(true)
    let formData = new FormData()
    formData.append('file',csv)
    axios.post('/product/bulk',formData)
    .then(res=>{
      setLoading(false)
      sendBulk(res.data.documents)
      handleClose()
    })
    .catch(err=>{
      setLoading(false)
      err && err.response && alert(err.response.data.error)
    })
  }

  return (
    <>
     <div>
     
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Upload Bulk product</DialogTitle>
        <DialogContent>
        <label>Accepted file format is (.csv)</label><br></br>
          <input onChange={(e)=>setCsv(e.target.files[0])} className={classes.fileInput} type='file' accept='.csv'></input>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={()=>handleSave()} color="primary" autoFocus>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box
        display="flex"
        justifyContent="flex-end"
      >
        <Button onClick={()=>handleClickOpen()} className={classes.importButton}>
          Import
        </Button>
        <Button className={classes.exportButton}>
          Export
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={handleDrawer}
        >
          Add product
        </Button>
      </Box>
      <Box mt={3}>
        <Card>
          <CardContent>
            <Box maxWidth={500}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        fontSize="small"
                        color="action"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="Search product"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
    <Backdrop style={{zIndex:"999999"}} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
